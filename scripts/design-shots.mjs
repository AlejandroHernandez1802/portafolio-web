// `pnpm design:shots [base]` (docs/15 H16, D-02): full-page screenshots of the main pages in
// both languages at 390, 768 and 1440 px, plus one pass at 390 px with reduced motion, so every
// UI change is checked by looking. Writes to shots/ (gitignored) and fails when a page scrolls
// sideways. Local only, with the same CDP client as the media scripts: no new dependencies.
// base: default http://localhost:8787 (`pnpm preview`); e.g. https://alejandrodeveloper.com
// Flags: --pages=home,case (keys of PAGES) · --widths=390,1440 · --lang=es · --out=<dir>
// --axe: also runs axe-core (WCAG 2.2 AA tags) on every shot and fails on any violation. It is
// injected from cdnjs through CDP, so it needs no npm package and no ChromeDriver
// (`npx @axe-core/cli` breaks whenever its driver lags behind the installed Chrome).
// --profile-root=<dir> for Chrome's temp profile (default: CDP_PROFILE_ROOT or the OS temp dir).
// Phones are emulated with Emulation.setDeviceMetricsOverride (setViewport): a headless window
// never gets narrower than ~500 px, so `--window-size=390,…` captures a cropped desktop layout.

import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { IPHONE_UA, launchChrome } from './lib/cdp.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')

const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v = 'true'] = a.slice(2).split('=')
      return [k, v]
    }),
)
const base = (positional[0] ?? 'http://localhost:8787').replace(/\/$/, '')
const outDir = path.resolve(ROOT, args.out ?? 'shots')

// One client case and one demo case cover both case layouts (ADR-020, ADR-026)
const PAGES = {
  home: { en: '/en', es: '/es' },
  work: { en: '/en/work', es: '/es/trabajos' },
  services: { en: '/en/services', es: '/es/servicios' },
  about: { en: '/en/about', es: '/es/sobre-mi' },
  case: { en: '/en/work/malone-road-belt', es: '/es/trabajos/malone-road-belt' },
  demo: { en: '/en/work/landscape-supply', es: '/es/trabajos/landscape-supply' },
}

const VIEWPORTS = {
  390: { width: 390, height: 844, mobile: true, userAgent: IPHONE_UA },
  768: { width: 768, height: 1024, mobile: true },
  1440: { width: 1440, height: 900, mobile: false },
}

// Pinned: a new axe release can add rules, and the result should only change when we bump it
const AXE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const pages = args.pages?.split(',') ?? Object.keys(PAGES)
const widths = args.widths?.split(',') ?? Object.keys(VIEWPORTS)
const langs = args.lang?.split(',') ?? ['en', 'es']
for (const key of pages) if (!PAGES[key]) throw new Error(`Unknown page "${key}"`)
for (const w of widths) if (!VIEWPORTS[w]) throw new Error(`Unknown width "${w}"`)

// Every combination, then the reduced-motion pass at the phone width
const runs = []
for (const key of pages) {
  for (const lang of langs) {
    for (const w of widths) runs.push({ key, lang, w, reduced: false })
    if (widths.includes('390')) runs.push({ key, lang, w: '390', reduced: true })
  }
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const axeSource = args.axe ? await (await fetch(AXE_URL)).text() : null
const overflows = []
const violations = []
const browser = await launchChrome({ profileRoot: args['profile-root'] })
try {
  for (const { key, lang, w, reduced } of runs) {
    const name = `${key}-${lang}-${w}${reduced ? '-reduced' : ''}`
    const page = await browser.newPage()
    try {
      await page.setViewport(VIEWPORTS[w])
      await page.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' },
          { name: 'prefers-color-scheme', value: 'light' },
        ],
      })
      await page.goto(base + PAGES[key][lang])
      // Lazy images and scroll-driven reveals reach their final state before the capture
      await page.scrollThrough()
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      const png = await page.screenshot({ fullPage: true, maxHeight: 16_000 })
      await writeFile(path.join(outDir, `${name}.png`), png)
      const overflow = scrollWidth > clientWidth
      if (overflow) overflows.push(`${name}: scrollWidth ${scrollWidth} > ${clientWidth}`)
      const found = axeSource ? await runAxe(page) : []
      for (const v of found) violations.push(`${name}: ${v}`)
      const notes = [overflow && 'scrolls sideways', found.length && `${found.length} axe`]
      console.log(
        `${overflow || found.length ? '✗' : '✓'} ${name} ${notes.filter(Boolean).join(', ')}`,
      )
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}

/** axe-core on the current page: one line per violated rule, with its first offending node. */
async function runAxe(page) {
  await page.evaluate(axeSource)
  return page.evaluate(async (tags) => {
    const { violations } = await window.axe.run(document, {
      runOnly: { type: 'tag', values: tags },
    })
    return violations.map(
      (v) => `${v.id} (${v.impact}, ${v.nodes.length}×) ${v.nodes[0]?.target.join(' ') ?? ''}`,
    )
  }, AXE_TAGS)
}

console.log(`\n${runs.length} shots → ${path.relative(ROOT, outDir)}/ (from ${base})`)
if (overflows.length) {
  console.error(`Horizontal overflow:\n  ${overflows.join('\n  ')}`)
  process.exitCode = 1
}
if (violations.length) {
  console.error(`axe (${AXE_TAGS.join(', ')}):\n  ${violations.join('\n  ')}`)
  process.exitCode = 1
} else if (!axeSource) {
  console.log('Accessibility: add --axe to run axe-core on every shot (0 violations expected)')
}
