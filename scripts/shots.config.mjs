// What `pnpm media:capture` takes from each live site (R-04, ADR-026): the MRB client site plus
// its logo and brochure from the MRB project folder, and my two demo stores. Outputs land in
// media-raw/<site>/ (gitignored); `pnpm media:images` turns them into the AVIF/WebP files in
// src/media/. MRB facts verified on its live site on 2026-10-24, the demos on 2026-10-25.

import path from 'node:path'
import { IPHONE_UA } from './lib/cdp.mjs'

export const ROOT = path.resolve(import.meta.dirname, '..')
export const RAW_DIR = path.join(ROOT, 'media-raw')

/** Read-only source of the brand files; override with MRB_PROJECT_DIR. */
export const MRB_PROJECT_DIR =
  process.env.MRB_PROJECT_DIR || path.resolve(ROOT, '../../MRB project')

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true, userAgent: IPHONE_UA },
}

// The quote form is the real one on malonebelt.com: these obviously fictitious values only
// go into the DOM for the screenshot. The script never submits it, blocks /api/quote and
// cancels any submit event on that site, so nothing reaches MRB's inbox.
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
const MRB_SEARCH = '/en/products?q=MB-8830-IC&mode=part'
// The quote page preselects one product and the urgency from the query string.
const MRB_QUOTE = '/en/contact?product=bulldog-cleat&urgency=down-now'

// Demo steps run in order before the capture, on a fresh cookie jar per shot (the demos keep
// the cart and the quote list in cookies):
// - { type: [selector, text] }: types into a field
// - { click: label, within? }: clicks the first button, link, radio or tab whose text or
//   aria-label starts with `label` (inside `within`, default the whole page)
// - { goto: path } · { wait: ms } · { waitText: text }: waits until the page shows `text`
// They never press a send, pay or submit button: the demos charge and ship nothing, but a sent
// quote would still email the demo's inbox.
const LANDSCAPE_ZIP = [
  { type: ['input[name="postalCode"]', '30301'] },
  { click: 'Check' },
  { waitText: 'Zone A' },
]
// 300 ft² at 3 in = 2.78 yd³ → 3 yd³ ($126) clears Zone A's $100 minimum: $75 delivery, $201
const LANDSCAPE_CHECKOUT = [
  { click: 'Use ' },
  { click: 'Add to cart' },
  { wait: 1500 },
  { goto: '/cart' },
  { type: ['main input[autocomplete="postal-code"]', '30301'] },
  { click: 'Check', within: 'main' },
  { waitText: 'Zone A' },
  { click: 'Home delivery', within: 'main' },
  { wait: 800 },
  { click: 'Checkout', within: 'main' },
  { waitText: 'Secure checkout' },
]
const INDUSTRIAL_ADD_PUMP = [
  { click: 'Counter-clockwise' },
  { click: 'Increase quantity' },
  { click: 'Increase quantity' },
  { click: 'Add to quote' },
  { waitText: 'Added to your quote list' },
]

/**
 * Per site: baseUrl · noSubmit: cancel every submit event and block `blockUrls` (MRB's real
 * quote form) · shots. A shot: name (media-raw/<site>/<name>.png) · path on baseUrl ·
 * viewport (a key of VIEWPORTS) · steps (demos, above) · scrollY: CSS px to scroll before a
 * viewport capture · scrollToText: scroll so that text sits `offset` px under the top ·
 * fullPage + maxHeight: a full-page capture capped in CSS px · fillQuote: MRB's QUOTE_VALUES.
 */
export const SITES = {
  mrb: {
    baseUrl: 'https://www.malonebelt.com',
    noSubmit: true,
    blockUrls: ['*/api/quote*'],
    shots: [
      { name: 'home-desktop', path: '/en', viewport: 'desktop' },
      {
        name: 'home-full-desktop',
        path: '/en',
        viewport: 'desktop',
        fullPage: true,
        maxHeight: 3600,
      },
      { name: 'search-desktop', path: MRB_SEARCH, viewport: 'desktop', scrollY: 210 },
      { name: 'product-desktop', path: '/en/products/bulldog-cleat', viewport: 'desktop' },
      { name: 'quote-desktop', path: MRB_QUOTE, viewport: 'desktop', fillQuote: true },
      { name: 'home-pt-desktop', path: '/pt', viewport: 'desktop' },
      { name: 'home-mobile', path: '/en', viewport: 'mobile' },
      {
        name: 'product-mobile',
        path: '/en/products/bulldog-cleat',
        viewport: 'mobile',
        scrollY: 420,
      },
      { name: 'quote-mobile', path: MRB_QUOTE, viewport: 'mobile', fillQuote: true, scrollY: 240 },
    ],
  },
  // Landscape Supply: bulk mulch, stone and soil, sold by the yard or quoted (pavers)
  landscape: {
    baseUrl: 'https://ecommerce-demo-landscape.netlify.app',
    shots: [
      // The hero with the delivery check answered: "Zone A · delivery $75, minimum order $100"
      { name: 'home-desktop', path: '/', viewport: 'desktop', steps: LANDSCAPE_ZIP },
      // Photo-heavy: 2,000 px (the hero and the materials) keeps the AVIF in budget
      {
        name: 'home-full-desktop',
        path: '/',
        viewport: 'desktop',
        fullPage: true,
        maxHeight: 2000,
      },
      { name: 'home-mobile', path: '/', viewport: 'mobile' },
      // On a phone the answer sits below the hero: scrolled to the checker
      {
        name: 'zip-mobile',
        path: '/',
        viewport: 'mobile',
        steps: LANDSCAPE_ZIP,
        scrollToText: { text: 'Do we deliver to you?', offset: 330 },
      },
      // The calculator: 200 ft² at 3 in → 2 yd³, filled into the quantity
      {
        name: 'product-desktop',
        path: '/p/hardwood-mulch?area=200',
        viewport: 'desktop',
        steps: [{ click: 'Use ' }],
        scrollToText: { text: 'How much do I need?', offset: 140 },
      },
      {
        name: 'product-mobile',
        path: '/p/hardwood-mulch?area=200',
        viewport: 'mobile',
        steps: [{ click: 'Use ' }],
        scrollToText: { text: 'How much do I need?', offset: 150 },
      },
      // Test-mode checkout with home delivery to Zone A; nothing is typed and Pay is never pressed
      {
        name: 'checkout-desktop',
        path: '/p/hardwood-mulch?area=300',
        viewport: 'desktop',
        steps: LANDSCAPE_CHECKOUT,
      },
      // Quote-only pavers: no price, the calculator counts units with 5 % for cuts
      {
        name: 'pavers-desktop',
        path: '/p/clay-brick-pavers?area=200',
        viewport: 'desktop',
        scrollToText: { text: 'Clay brick pavers', offset: 130 }, // the breadcrumb, then the H1
      },
    ],
  },
  // Industrial Parts: hydraulic parts found by any part number, sold by quote only
  industrial: {
    baseUrl: 'https://ecommerce-demo-industrial.netlify.app',
    shots: [
      { name: 'home-desktop', path: '/', viewport: 'desktop' },
      {
        name: 'home-full-desktop',
        path: '/',
        viewport: 'desktop',
        fullPage: true,
        maxHeight: 3600,
      },
      { name: 'home-mobile', path: '/', viewport: 'mobile' },
      // Typed however: "ab 1234-x" → AB1234X, exact match plus the number that starts with it
      { name: 'search-desktop', path: '/search?q=ab%201234-x', viewport: 'desktop' },
      { name: 'search-mobile', path: '/search?q=ab%201234-x', viewport: 'mobile' },
      // OEM, manufacturer and cross-reference numbers of one pump, its rotation and the toast
      {
        name: 'product-desktop',
        path: '/p/gear-pump-16cc',
        viewport: 'desktop',
        steps: INDUSTRIAL_ADD_PUMP,
      },
      {
        name: 'product-mobile',
        path: '/p/gear-pump-16cc',
        viewport: 'mobile',
        scrollToText: { text: 'Price on request', offset: 150 },
      },
      // The quote list: a pump, a hose cut to 3 m and a number that is not in the catalog
      {
        name: 'quote-desktop',
        path: '/p/gear-pump-16cc',
        viewport: 'desktop',
        steps: [
          ...INDUSTRIAL_ADD_PUMP,
          { goto: '/p/hose-assembly-half' },
          { click: '3 m' },
          { click: 'Add to quote' },
          { waitText: 'Added to your quote list' },
          { goto: '/quote' },
          { type: ['input[placeholder="Type a part number or a product name"]', 'XR-5521-Q'] },
          { click: 'Add line' },
          { waitText: 'Not in the catalog' },
        ],
        scrollToText: { text: 'Request a quote', offset: 120 },
      },
      // A miss is not a dead end: it offers to quote the number as free text
      { name: 'miss-mobile', path: '/search?q=zzz999', viewport: 'mobile' },
    ],
  },
}

// Injected after load: no text caret or focus ring in the frame, no smooth scrolling
export const CAPTURE_CSS = `
  *, *::before, *::after { caret-color: transparent !important; }
  html { scroll-behavior: auto !important; }
  :focus, :focus-visible { outline: none !important; }
`

const BRAND = path.join(MRB_PROJECT_DIR, 'Code/mrb-project/public/brand')

export const MRB_ASSETS = {
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
