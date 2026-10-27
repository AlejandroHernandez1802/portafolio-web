// `pnpm media:capture` (R-04, ADR-026): screenshots of the live sites in shots.config.mjs (the
// MRB client site and my demo stores), plus the MRB logo and brochure pages, into
// media-raw/<site>/. Local only (macOS: Chrome, and Swift for the PDF).
// Flags: --site=mrb,landscape (default: all) · --only=name,name (shots or "logo"/"brochure") ·
// --profile-root=<dir> for Chrome's temp profile (default: CDP_PROFILE_ROOT or the OS temp dir).

import { execFile } from 'node:child_process'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { launchChrome } from './lib/cdp.mjs'
import {
  CAPTURE_CSS,
  MRB_ASSETS,
  QUOTE_VALUES,
  RAW_DIR,
  ROOT,
  SITES,
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
const sites = args.site?.split(',') ?? Object.keys(SITES)

// Defense in depth for MRB's quote form (scripts/shots.config.mjs): no submit, no fetch to the
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

/** Clicks the first control whose text or aria-label starts with `label`. */
async function clickLabel(page, label, within = 'body') {
  const found = await page.evaluate(
    (scope, text) => {
      const controls = document.querySelectorAll(
        `${scope} :is(button, a, [role="radio"], [role="tab"], label)`,
      )
      const el = [...controls].find((c) =>
        [c.innerText, c.getAttribute('aria-label')].some((t) => t?.trim().startsWith(text)),
      )
      if (!el) return false
      el.scrollIntoView({ block: 'center' })
      el.click()
      return true
    },
    within,
    label,
  )
  if (!found) throw new Error(`Nothing to click: "${label}" in ${within}`)
}

async function waitForText(page, text, timeout = 15_000) {
  const started = Date.now()
  while (!(await page.evaluate((t) => document.body.innerText.includes(t), text))) {
    if (Date.now() - started > timeout) throw new Error(`Text never showed: "${text}"`)
    await new Promise((r) => setTimeout(r, 250))
  }
}

async function runSteps(page, site, steps) {
  for (const step of steps) {
    if (step.type) await page.type(...step.type)
    else if (step.click) await clickLabel(page, step.click, step.within)
    else if (step.goto) await page.goto(site.baseUrl + step.goto)
    else if (step.wait) await new Promise((r) => setTimeout(r, step.wait))
    else if (step.waitText) await waitForText(page, step.waitText)
    else throw new Error(`Unknown step ${JSON.stringify(step)}`)
  }
  await page.evaluate(() => document.activeElement?.blur())
}

/** The scroll offset that puts `text` `offset` px under the top of the viewport. */
function offsetOf(page, { text, offset }) {
  return page.evaluate(
    (t, o) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim() === t) {
          const top = walker.currentNode.parentElement.getBoundingClientRect().top + scrollY
          return Math.max(0, Math.round(top - o))
        }
      }
      throw new Error(`No text "${t}" to scroll to`)
    },
    text,
    offset,
  )
}

async function captureShots(browser, id, site, outDir) {
  for (const shot of site.shots.filter((s) => wanted(s.name))) {
    const page = await browser.newPage()
    try {
      // A fresh cookie jar: carts and quote lists from an earlier shot don't carry over
      await page.send('Network.clearBrowserCookies')
      await page.setViewport(VIEWPORTS[shot.viewport])
      // Card image rotators and the OEM strip hold still; the page looks the same otherwise
      await page.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'prefers-reduced-motion', value: 'reduce' },
          { name: 'prefers-color-scheme', value: 'light' },
        ],
      })
      if (site.blockUrls) await page.send('Network.setBlockedURLs', { urls: site.blockUrls })
      if (site.noSubmit) await page.addInitScript(NO_SUBMIT)
      const started = Date.now()
      await page.goto(site.baseUrl + shot.path)
      await page.injectCSS(CAPTURE_CSS)
      if (shot.steps) {
        await runSteps(page, site, shot.steps)
        await page.injectCSS(CAPTURE_CSS) // a step may have opened another page
      }
      // Lazy images and in-view videos below the fold load before any capture
      await page.scrollThrough({ maxHeight: shot.maxHeight ?? 4000 })
      if (shot.fillQuote) await fillQuote(page)
      await freezeVideos(page)
      // Typing scrolls fields into view; every viewport shot starts from its own offset
      const scrollY = shot.scrollToText ? await offsetOf(page, shot.scrollToText) : shot.scrollY
      await page.scrollTo(scrollY ?? 0)
      await page.settle()
      const png = await page.screenshot({ fullPage: shot.fullPage, maxHeight: shot.maxHeight })
      await writeFile(path.join(outDir, `${shot.name}.png`), png)
      const { width, height } = await sharp(png).metadata()
      console.log(`✓ ${id}/${shot.name} ${width}×${height} (${Date.now() - started} ms)`)
    } finally {
      await page.close()
    }
  }
}

async function renderBrochure(outDir) {
  const { pdf, scale, cover, spread } = MRB_ASSETS.brochure
  const tmp = path.join(outDir, '.pdf-pages')
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
  await copyFile(pageFile(cover.page), path.join(outDir, cover.to))
  // Facing pages side by side, as printed
  const [left, right] = spread.pages.map(pageFile)
  const { width, height } = await sharp(left).metadata()
  await sharp({ create: { width: width * 2, height, channels: 3, background: '#ffffff' } })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: width, top: 0 },
    ])
    .png()
    .toFile(path.join(outDir, spread.to))
  await rm(tmp, { recursive: true, force: true })
  console.log(`✓ mrb/brochure: page ${cover.page} and spread ${spread.pages.join('–')}`)
}

let browser
try {
  for (const id of sites) {
    const site = SITES[id]
    if (!site) throw new Error(`Unknown site "${id}": ${Object.keys(SITES).join(', ')}`)
    const outDir = path.join(RAW_DIR, id)
    await mkdir(outDir, { recursive: true })
    if (id === 'mrb' && wanted('logo')) {
      await copyFile(MRB_ASSETS.logo.from, path.join(outDir, MRB_ASSETS.logo.to))
      console.log('✓ mrb/logo')
    }
    if (id === 'mrb' && wanted('brochure')) {
      await renderBrochure(outDir).catch((e) => console.warn(`✗ brochure skipped: ${e.message}`))
    }
    if (site.shots.some((s) => wanted(s.name))) {
      browser ??= await launchChrome({ profileRoot: args['profile-root'] })
      await captureShots(browser, id, site, outDir)
    }
  }
} finally {
  await browser?.close()
}
console.log(`Done → ${path.relative(ROOT, RAW_DIR)}/. Next: pnpm media:images`)
