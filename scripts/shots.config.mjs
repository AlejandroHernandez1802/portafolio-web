// What `pnpm media:capture` takes from the live MRB site and the MRB project folder (R-04).
// Outputs land in media-raw/mrb/ (gitignored); `pnpm media:images` turns them into the
// AVIF/WebP files in src/media/. Facts verified on the live site on 2026-10-24.

import path from 'node:path'
import { IPHONE_UA } from './lib/cdp.mjs'

export const ROOT = path.resolve(import.meta.dirname, '..')
export const OUT_DIR = path.join(ROOT, 'media-raw/mrb')

/** Read-only source of the brand files; override with MRB_PROJECT_DIR. */
export const MRB_PROJECT_DIR =
  process.env.MRB_PROJECT_DIR || path.resolve(ROOT, '../../MRB project')

export const BASE_URL = 'https://www.malonebelt.com'

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, userAgent: IPHONE_UA },
}

// The quote form is the real one on malonebelt.com: these obviously fictitious values only
// go into the DOM for the screenshot. The script never submits it, blocks /api/quote and
// cancels any submit event, so nothing reaches MRB's inbox.
export const QUOTE_VALUES = {
  name: 'Jane Doe',
  company: 'ACME Quarry',
  email: 'jane.doe@example.com',
  phone: '(555) 010-0199',
  beltWidth: '1000 mm',
  beltLength: '7150 mm',
  message: 'Main conveyor belt tore this morning. Need a replacement this week.',
}

// The BeltMatch search: MRB's own part code shown in the site's "Popular" hint row, which
// returns 1 match (Bulldog Cleat). URL format: /en/products?q=<query>&mode=part|machine.
const SEARCH = '/en/products?q=MB-8830-IC&mode=part'
// The quote page preselects one product and the urgency from the query string.
const QUOTE = '/en/contact?product=bulldog-cleat&urgency=down-now'

/**
 * name: output file (media-raw/mrb/<name>.png) · path: URL on BASE_URL · viewport: a key of
 * VIEWPORTS · scrollY: CSS px to scroll before a viewport capture · fullPage + maxHeight: a
 * full-page capture capped in CSS px · fillQuote: type QUOTE_VALUES into the form.
 */
export const SHOTS = [
  { name: 'home-desktop', path: '/en', viewport: 'desktop' },
  { name: 'home-full-desktop', path: '/en', viewport: 'desktop', fullPage: true, maxHeight: 3600 },
  { name: 'search-desktop', path: SEARCH, viewport: 'desktop', scrollY: 210 },
  { name: 'product-desktop', path: '/en/products/bulldog-cleat', viewport: 'desktop' },
  { name: 'quote-desktop', path: QUOTE, viewport: 'desktop', fillQuote: true },
  { name: 'home-pt-desktop', path: '/pt', viewport: 'desktop' },
  { name: 'home-mobile', path: '/en', viewport: 'mobile' },
  { name: 'product-mobile', path: '/en/products/bulldog-cleat', viewport: 'mobile', scrollY: 420 },
  { name: 'quote-mobile', path: QUOTE, viewport: 'mobile', fillQuote: true, scrollY: 240 },
]

// Injected after load: no text caret or focus ring in the frame, no smooth scrolling
export const CAPTURE_CSS = `
  *, *::before, *::after { caret-color: transparent !important; }
  html { scroll-behavior: auto !important; }
  :focus, :focus-visible { outline: none !important; }
`

const BRAND = path.join(MRB_PROJECT_DIR, 'Code/mrb-project/public/brand')

export const ASSETS = {
  // Horizontal lockup without tagline: clean SVG (paths only, no fonts or bitmaps), copied as is
  logo: { from: path.join(BRAND, 'Final-logo-sin-tagline.svg'), to: 'logo.svg' },
  brochure: {
    pdf: path.join(MRB_PROJECT_DIR, 'Deliverables/Phase 01/MRB-Maximizing-Uptime-Brochure-v1.pdf'),
    scale: 4, // the pages are 396 × 612 pt (5.5 × 8.5 in) → 1584 × 2448 px
    cover: { page: 1, to: 'brochure.png' },
    // Facing pages 8–9: "Pick your ply" (Standard range) and Bulldog Cleat
    spread: { pages: [8, 9], to: 'brochure-spread.png' },
  },
}
