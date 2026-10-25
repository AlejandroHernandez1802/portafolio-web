// `pnpm media:images` (R-04): encodes media-raw/ sources (scripts/media.config.mjs) to AVIF and
// WebP in src/media/<group>/ and writes src/media/manifest.generated.ts, which imports every
// file statically so Next hashes it under /_next/static/media/ (immutable cache, public/_headers).
// The encoded files are versioned; media-raw/ is not. A key whose source is missing keeps its
// committed files, so a fresh clone can regenerate the manifest without the raw captures.
// Flags: --only=<key>,<key> to re-encode some keys (the manifest always lists all of them).

import { execFile } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { ENCODE, SOURCES } from './media.config.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const RAW = path.join(ROOT, 'media-raw')
const OUT = path.join(ROOT, 'src/media')
const MANIFEST = path.join(OUT, 'manifest.generated.ts')
const FORMATS = ['avif', 'webp']

const only = process.argv
  .find((a) => a.startsWith('--only='))
  ?.slice(7)
  .split(',')

const exists = (file) =>
  stat(file).then(
    () => true,
    () => false,
  )
const kb = (bytes) => Math.round(bytes / 102.4) / 10

/** Resolves a source path; `name.*` matches the first raster file with that basename. */
async function findSource(src) {
  if (!src.endsWith('.*')) return (await exists(path.join(RAW, src))) ? path.join(RAW, src) : null
  const dir = path.join(RAW, path.dirname(src))
  const base = path.basename(src, '.*')
  const files = await readdir(dir).catch(() => [])
  const match = files.find((f) => new RegExp(`^${base}\\.(jpe?g|png|heic)$`, 'i').test(f))
  return match ? path.join(dir, match) : null
}

/** sharp's prebuilt libvips reads AVIF but not HEVC, so iPhone HEIC goes through sips first. */
async function readable(file) {
  if (!/\.heic$/i.test(file)) return { file, cleanup: async () => {} }
  const dir = await mkdtemp(path.join(tmpdir(), 'media-heic-'))
  const png = path.join(dir, 'source.png')
  await promisify(execFile)('sips', ['-s', 'format', 'png', file, '--out', png])
  return { file: png, cleanup: () => rm(dir, { recursive: true, force: true }) }
}

const fileName = (key, width, ext) => `${path.basename(key)}-${width}.${ext}`

/** Removes the encoded files of one key, so a dropped width doesn't linger. */
async function clearKey(key) {
  const dir = path.join(OUT, path.dirname(key))
  const pattern = new RegExp(
    `^${path.basename(key)}-\\d+\\.(avif|webp)$|^${path.basename(key)}\\.svg$`,
  )
  for (const f of await readdir(dir).catch(() => [])) {
    if (pattern.test(f)) await rm(path.join(dir, f))
  }
}

async function encode(source, file) {
  const dir = path.join(OUT, path.dirname(source.key))
  await mkdir(dir, { recursive: true })
  await clearKey(source.key)

  if (source.svg) {
    await copyFile(file, path.join(dir, `${path.basename(source.key)}.svg`))
    console.log(`✓ ${source.key}.svg (copied)`)
    return
  }

  const input = await readable(file)
  try {
    const meta = await sharp(input.file).rotate().metadata() // rotate(): honor EXIF orientation
    const sizes = []
    for (const width of source.widths) {
      if (width > meta.width) {
        console.warn(`  ${source.key}: source is ${meta.width} px wide, skipping ${width}`)
        continue
      }
      const height = source.crop
        ? Math.round((width * source.crop[1]) / source.crop[0])
        : Math.round((width * meta.height) / meta.width)
      for (const ext of FORMATS) {
        const out = path.join(dir, fileName(source.key, width, ext))
        const { size } = await sharp(input.file)
          .rotate()
          .resize(width, height, { fit: 'cover', position: source.position ?? 'centre' })
          .toColourspace('srgb')
          [ext](ENCODE[ext])
          .toFile(out)
        sizes.push(`${width}w ${ext} ${kb(size)} KB`)
        const budget = source.budget
        if (ext === 'avif' && budget?.width === width && size > budget.kb * 1024) {
          console.warn(`  ✗ ${source.key} ${width}w AVIF is ${kb(size)} KB, budget ${budget.kb} KB`)
        }
      }
    }
    console.log(`✓ ${source.key}: ${sizes.join(' · ')}`)
  } finally {
    await input.cleanup()
  }
}

/** Every configured key whose files are all present, with their real dimensions. */
async function collect() {
  const entries = []
  for (const source of SOURCES) {
    const dir = path.join(OUT, path.dirname(source.key))
    if (source.svg) {
      const file = path.join(dir, `${path.basename(source.key)}.svg`)
      if (!(await exists(file))) continue
      const { width, height } = await sharp(file).metadata()
      entries.push({ key: source.key, svg: file, width, height })
      continue
    }
    const variants = []
    for (const width of source.widths) {
      const files = FORMATS.map((ext) => path.join(dir, fileName(source.key, width, ext)))
      if ((await Promise.all(files.map(exists))).every(Boolean)) variants.push({ width, files })
    }
    if (!variants.length) continue
    const largest = variants.at(-1)
    const { width, height } = await sharp(largest.files[0]).metadata()
    entries.push({ key: source.key, variants, width, height })
  }
  return entries
}

function manifestSource(entries) {
  const ident = (file) =>
    'm_' +
    path
      .relative(OUT, file)
      .replace(/\.[a-z]+$/, (e) => `_${e.slice(1)}`)
      .replace(/[^a-zA-Z0-9]+/g, '_')
  const rel = (file) => './' + path.relative(OUT, file).split(path.sep).join('/')
  const imports = []
  const body = []
  for (const e of entries) {
    if (e.svg) {
      imports.push(`import ${ident(e.svg)} from '${rel(e.svg)}'`)
      body.push(
        `  '${e.key}': { width: ${e.width}, height: ${e.height}, avif: [], webp: [], svg: src(${ident(e.svg)}) },`,
      )
      continue
    }
    const lists = FORMATS.map((ext, i) => {
      const items = e.variants.map(({ width, files }) => {
        imports.push(`import ${ident(files[i])} from '${rel(files[i])}'`)
        return `{ src: src(${ident(files[i])}), width: ${width} }`
      })
      return `${ext}: [${items.join(', ')}]`
    })
    body.push(`  '${e.key}': { width: ${e.width}, height: ${e.height}, ${lists.join(', ')} },`)
  }
  const produced = entries.map((e) => `'${e.key}'`)
  const known = SOURCES.map((s) => `'${s.key}'`)
  return `// Generated by scripts/build-images.mjs (pnpm media:images). Do not edit.
// Static imports: Next hashes each file into /_next/static/media/ with the immutable cache.
// Only Server Components should import this module (see src/media/index.ts).

import type { MediaEntry } from './types'

${imports.join('\n')}

/**
 * Only the hashed URL is taken from each import. Sizes come from sharp: Turbopack in Next 16.3
 * reports AVIF imports as 100 × 100, so never pass these imports to next/image.
 */
const src = (file: { src: string }) => file.src

/** Keys with encoded files in this build. */
export type MediaKey = ${produced.join(' | ') || 'never'}

/** Every key the media config knows, including optional sources not produced yet. */
export type KnownMediaKey = ${known.join(' | ')}

export const media: Record<MediaKey, MediaEntry> = {
${body.join('\n')}
}
`
}

const selected = SOURCES.filter((s) => !only || only.includes(s.key))
const missing = []
for (const source of selected) {
  const file = await findSource(source.src)
  if (file) await encode(source, file)
  else if (source.optional)
    console.log(`- ${source.key}: no source in media-raw/${source.src}, skipped`)
  else missing.push(source)
}

const entries = await collect()
await writeFile(MANIFEST, manifestSource(entries))
console.log(`✓ ${path.relative(ROOT, MANIFEST)}: ${entries.length} keys`)

for (const source of missing) {
  const kept = entries.some((e) => e.key === source.key)
  console.warn(
    `${kept ? '!' : '✗'} ${source.key}: media-raw/${source.src} is missing (run pnpm media:capture)${kept ? '; kept the committed files' : ''}`,
  )
}
if (missing.some((s) => !entries.some((e) => e.key === s.key))) process.exitCode = 1
