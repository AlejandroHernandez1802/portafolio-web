// `pnpm media:capture` (R-04): screenshots of the live malonebelt.com, plus the MRB logo and
// brochure pages, into media-raw/mrb/. Local only (macOS: Chrome, and Swift for the PDF).
// Flags: --only=name,name (shots or "logo"/"brochure") · --profile-root=<dir> for Chrome's
// temp profile (default: CDP_PROFILE_ROOT or the OS temp dir).

import { execFile } from 'node:child_process'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { launchChrome } from './lib/cdp.mjs'
import {
  ASSETS,
  BASE_URL,
  CAPTURE_CSS,
  OUT_DIR,
  QUOTE_VALUES,
  ROOT,
  SHOTS,
  VIEWPORTS,
} from './shots.config.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=')
    return [k, v]
  }),
)
const only = args.only?.split(',')
const wanted = (name) => !only || only.includes(name)

// Defense in depth for the quote form (scripts/shots.config.mjs): no submit, no fetch to the
// quote endpoint, even if a key press or click slipped through.
const NO_SUBMIT = `
  document.addEventListener('submit', (e) => { e.preventDefault(); e.stopImmediatePropagation() }, true)
  const realFetch = window.fetch
  window.fetch = (input, init) =>
    String(input?.url ?? input).includes('/api/quote')
      ? Promise.reject(new Error('blocked by capture script'))
      : realFetch(input, init)
`

/** Pauses every <video> on one frame so captures are repeatable. */
function freezeVideos(page, at = 1) {
  return page.evaluate(async (t) => {
    await Promise.all(
      [...document.querySelectorAll('video')].map(async (v) => {
        v.pause()
        if (v.readyState < 1) return // not loaded: its poster shows
        v.currentTime = Math.min(t, v.duration || t)
        await new Promise((r) => {
          v.addEventListener('seeked', r, { once: true })
          setTimeout(r, 3000)
        })
      }),
    )
  }, at)
}

async function fillQuote(page) {
  await page.waitFor('[name="name"]')
  for (const [field, value] of Object.entries(QUOTE_VALUES)) {
    await page.type(`[name="${field}"]`, value)
  }
  // Blur so no field shows focus, then check the preselected urgency and product took
  const state = await page.evaluate(() => {
    document.activeElement?.blur()
    return {
      urgency: document.querySelector('[role="radio"][aria-checked="true"]')?.getAttribute('value'),
      product: document.querySelector('select')?.value,
    }
  })
  if (state.urgency !== 'down-now' || !state.product) {
    throw new Error(`Quote form not preselected: ${JSON.stringify(state)}`)
  }
}

async function captureShots(browser) {
  const shots = SHOTS.filter((s) => wanted(s.name))
  for (const shot of shots) {
    const page = await browser.newPage()
    try {
      await page.setViewport(VIEWPORTS[shot.viewport])
      // Card image rotators and the OEM strip hold still; the page looks the same otherwise
      await page.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-reduced-motion', value: 'reduce' },
          { name: 'prefers-color-scheme', value: 'light' },
        ],
      })
      await page.send('Network.setBlockedURLs', { urls: ['*/api/quote*'] })
      await page.addInitScript(NO_SUBMIT)
      const started = Date.now()
      await page.goto(BASE_URL + shot.path)
      await page.injectCSS(CAPTURE_CSS)
      // Lazy images and in-view videos below the fold load before any capture
      await page.scrollThrough({ maxHeight: shot.maxHeight ?? 4000 })
      if (shot.fillQuote) await fillQuote(page)
      await freezeVideos(page)
      // Typing scrolls fields into view; every viewport shot starts from its own offset
      await page.scrollTo(shot.scrollY ?? 0)
      await page.settle()
      const png = await page.screenshot({ fullPage: shot.fullPage, maxHeight: shot.maxHeight })
      const file = path.join(OUT_DIR, `${shot.name}.png`)
      await writeFile(file, png)
      const { width, height } = await sharp(png).metadata()
      console.log(`✓ ${shot.name} ${width}×${height} (${Date.now() - started} ms)`)
    } finally {
      await page.close()
    }
  }
}

async function renderBrochure() {
  const { pdf, scale, cover, spread } = ASSETS.brochure
  const tmp = path.join(OUT_DIR, '.pdf-pages')
  await mkdir(tmp, { recursive: true })
  const pages = [cover.page, ...spread.pages]
  await promisify(execFile)('swift', [
    path.join(ROOT, 'scripts/lib/render-pdf.swift'),
    pdf,
    path.join(tmp, 'page'),
    String(scale),
    ...pages.map(String),
  ])
  const pageFile = (n) => path.join(tmp, `page-${n}.png`)
  await copyFile(pageFile(cover.page), path.join(OUT_DIR, cover.to))
  // Facing pages side by side, as printed
  const [left, right] = spread.pages.map(pageFile)
  const { width, height } = await sharp(left).metadata()
  await sharp({ create: { width: width * 2, height, channels: 3, background: '#ffffff' } })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: width, top: 0 },
    ])
    .png()
    .toFile(path.join(OUT_DIR, spread.to))
  await rm(tmp, { recursive: true, force: true })
  console.log(`✓ brochure: page ${cover.page} and spread ${spread.pages.join('–')}`)
}

await mkdir(OUT_DIR, { recursive: true })

if (wanted('logo')) {
  await copyFile(ASSETS.logo.from, path.join(OUT_DIR, ASSETS.logo.to))
  console.log('✓ logo')
}
if (wanted('brochure')) {
  await renderBrochure().catch((e) => console.warn(`✗ brochure skipped: ${e.message}`))
}
if (SHOTS.some((s) => wanted(s.name))) {
  const browser = await launchChrome({ profileRoot: args['profile-root'] })
  try {
    await captureShots(browser)
  } finally {
    await browser.close()
  }
}
console.log(`Done → ${path.relative(ROOT, OUT_DIR)}/. Next: pnpm media:images`)
