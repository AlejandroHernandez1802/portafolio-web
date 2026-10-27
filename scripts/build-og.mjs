// `pnpm media:og` (R-09): renders the Open Graph images of docs/08 §3 into public/og/, 1200 × 630
// PNG, ≤ 300 KB each: og-<lang>.png for the home and case-<id>-<lang>.png for each case. The
// page and case metadata pick them up only once the file exists (publicFileExists). Local only,
// like the other media scripts: headless Chrome draws scripts/og/template.html with the site's
// fonts, the tokens of globals.css and the captures, at 2× for clean edges, and sharp scales it
// down and encodes it to a palette PNG. Re-run it when the headline, a case title or a figure
// changes. Flags: --only=og-en,case-mrb-es · --profile-root=<dir> for Chrome's temp profile.

import { createServer } from 'node:http'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { launchChrome } from './lib/cdp.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public/og')
const WIDTH = 1200
const HEIGHT = 630
const SCALE = 2
const BUDGET_KB = 300

// The copy comes straight from the typed sources: Node 24 strips the types, and these files
// only have type-only imports, so nothing is duplicated or compiled first.
const { en } = await import('../src/content/en.ts')
const { es } = await import('../src/content/es.ts')
const { site } = await import('../src/content/site.ts')
const { cases, featuredCases } = await import('../src/content/cases.ts')
const { resolveMetrics } = await import('../src/lib/cases.ts')
const CONTENT = { en, es }

// The case card shows other captures than the home one, so a shared link to each looks
// different: the quote form (the outcome in its title) with the home on a phone. A case not
// listed here uses its hero capture and the showcase phone.
const CASE_FRAMES = { mrb: { browser: 'mrb/quote-desktop', phone: 'mrb/home-mobile' } }
// The case card's one figure: the first of these with a value (a null figure is passed over,
// so the quote count takes the place of the languages once it is published)
const CASE_FIGURES = ['quotes', 'languages']

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)
const only = args.only?.split(',')

const exists = (file) =>
  stat(file).then(
    () => true,
    () => false,
  )

/** The raw capture in media-raw/, or else the widest WebP that build-images committed. */
async function mediaFile(key) {
  const raw = path.join(ROOT, 'media-raw', `${key}.png`)
  if (await exists(raw)) return raw
  const dir = path.join(ROOT, 'src/media', path.dirname(key))
  const pattern = new RegExp(`^${path.basename(key)}-(\\d+)\\.webp$`)
  const widest = (await readdir(dir).catch(() => []))
    .map((f) => [f, Number(f.match(pattern)?.[1])])
    .filter(([, w]) => w)
    .sort((a, b) => b[1] - a[1])[0]
  if (!widest) throw new Error(`No capture for ${key} in media-raw/ or src/media/`)
  return path.join(dir, widest[0])
}

/** The custom properties of globals.css (:root and @theme static), so the cards use its values. */
async function tokensCss() {
  const css = await readFile(path.join(ROOT, 'src/app/globals.css'), 'utf8')
  const blocks = [...css.matchAll(/^(?::root|@theme static) \{\n([\s\S]*?)\n\}/gm)].map((m) => m[1])
  const declarations = blocks.flatMap((b) => b.match(/^\s*--[\w-]+:[^;]+;/gm) ?? [])
  for (const token of ['--paper-1', '--deep', '--sun-400', '--grid-line', '--shadow-2']) {
    if (!declarations.some((d) => d.trim().startsWith(`${token}:`))) {
      throw new Error(`globals.css: ${token} not found`)
    }
  }
  return `:root {\n${declarations.join('\n')}\n}\n`
}

/** Frames for the captures of a named case (screenshots identify the client, ADR-020). */
async function frames(study, { browser, phone }, routes) {
  if (study.disclosure !== 'named') return {}
  const serve = async (key) => {
    const file = await mediaFile(key)
    const url = `/media/${key}${path.extname(file)}`
    routes.set(url, file)
    return url
  }
  return {
    browser: browser && { src: await serve(browser), url: study.client.domain },
    phone: phone && { src: await serve(phone) },
  }
}

async function cards(routes) {
  const domain = new URL(site.url).host
  const list = []
  for (const lang of ['en', 'es']) {
    const content = CONTENT[lang]
    const base = { lang, name: site.name, tagline: content.nav.tagline, domain }

    const lead = featuredCases[0]
    // The offer's own figure ("5 business days" to the prototype): the first fact of the hero
    // strip that holds no case figure; the case figures go on the case card
    const offer = content.hero.figures.items.find(
      (cell) => cell.kind === 'fact' && !/\{\w+\}/.test(cell.value + cell.label),
    )
    // A leading question names the audience (HeroHeadline): on the card it is the kicker over
    // the H1, so the two phrases keep their two lines
    const active = content.hero.headlines[site.hero.activeHeadline]
    const audience = active.match(/^([^“]*\?)\s+/)
    list.push({
      file: `og-${lang}.png`,
      data: {
        ...base,
        card: 'home',
        ...(audience && { kicker: audience[1] }),
        headline: audience ? active.slice(audience[0].length) : active,
        figure: offer && { value: offer.value, label: offer.label },
        ...(lead && (await frames(lead, lead.media.showcase, routes))),
      },
    })

    for (const study of cases) {
      const copy = content.cases[study.id]
      // A demo has no results (ADR-026): its card shows no figure
      const results = study.kind === 'demo' ? undefined : copy.page.results
      const metrics = results ? resolveMetrics(results.items, study, lang) : []
      const figure = CASE_FIGURES.map((id) => metrics.find((m) => m.id === id)).find(Boolean)
      const shots = CASE_FRAMES[study.id] ?? {
        browser: study.media.hero,
        phone: study.media.showcase.phone,
      }
      list.push({
        file: `case-${study.id}-${lang}.png`,
        data: {
          ...base,
          card: 'case',
          kicker: copy.card.meta,
          headline: copy.page.hero.title,
          figure: figure && { value: figure.value, label: figure.label },
          ...(await frames(study, shots, routes)),
        },
      })
    }
  }
  return list.filter((c) => !only || only.includes(path.basename(c.file, '.png')))
}

/** Serves the template, its fonts and tokens, and the captures it asks for, on 127.0.0.1. */
async function serve(routes) {
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.webp': 'image/webp',
  }
  const tokens = await tokensCss()
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost').pathname
    try {
      if (url === '/tokens.css') {
        res.writeHead(200, { 'content-type': types['.css'] }).end(tokens)
        return
      }
      const file = routes.get(url)
      if (!file) throw new Error('not found')
      res.writeHead(200, {
        'content-type': types[path.extname(file)] ?? 'application/octet-stream',
      })
      res.end(await readFile(file))
    } catch {
      res.writeHead(404).end()
    }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return { server, origin: `http://127.0.0.1:${server.address().port}` }
}

/** Palette PNG at 1200 × 630, with fewer colors only if it would go over the budget. */
async function encode(screenshot) {
  const image = sharp(screenshot).resize(WIDTH, HEIGHT, { kernel: 'lanczos3' })
  for (const colors of [256, 192, 128]) {
    const png = await image
      .clone()
      .png({ palette: true, colors, dither: 0.8, effort: 10, compressionLevel: 9 })
      .toBuffer()
    if (png.length <= BUDGET_KB * 1024) return { png, colors }
  }
  throw new Error(`Over ${BUDGET_KB} KB even at 128 colors`)
}

const routes = new Map([
  ['/', path.join(ROOT, 'scripts/og/template.html')],
  ['/fonts/archivo.woff2', path.join(ROOT, 'src/fonts/archivo-latin-wdth62-100-wght400-800.woff2')],
  ['/fonts/plex-mono.woff2', path.join(ROOT, 'scripts/og/fonts/IBMPlexMono-500-latin.woff2')],
])
const todo = await cards(routes)
if (!todo.length) throw new Error(`Nothing matches --only=${args.only}`)
const { server, origin } = await serve(routes)
const browser = await launchChrome({ profileRoot: args['profile-root'] })
try {
  await mkdir(OUT, { recursive: true })
  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE })
  for (const { file, data } of todo) {
    await page.goto(`${origin}/`)
    const { size } = await page.evaluate((d) => window.renderOg(d), data)
    const { png, colors } = await encode(await page.screenshot())
    await writeFile(path.join(OUT, file), png)
    const kb = Math.round(png.length / 102.4) / 10
    console.log(`public/og/${file}  ${kb} KB  (${colors} colors, H1 ${size} px)`)
  }
} finally {
  await browser.close()
  server.close()
}
