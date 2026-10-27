// What `pnpm media:images` encodes (R-04): each source in media-raw/ becomes AVIF + WebP at
// the widths it is shown at (CSS width × 1 and × 2), written to src/media/<group>/ and listed
// in src/media/manifest.generated.ts. Budgets are for the AVIF at `budget.width` (docs/11).

export const ENCODE = {
  avif: { quality: 50, effort: 6 },
  webp: { quality: 72, effort: 6, smartSubsample: true },
}

// Desktop viewport captures (2880 × 1800, 16:10): hero frame ≈ 640 CSS px, case shots up to
// ≈ 800 CSS px. Phone captures (780 × 1688): frames of 150–390 CSS px.
const DESKTOP = [640, 960, 1280, 1600]
const PHONE = [300, 600, 780]

/**
 * A demo's sources: its viewport captures at the case widths, plus the full home page and its
 * top square for the work card, as for MRB above. The hero (`home-desktop`) keeps MRB's budget.
 */
function demoSources(id, { desktop, phone }) {
  return [
    ...desktop.map((name) => ({
      key: `${id}/${name}`,
      src: `${id}/${name}.png`,
      widths: DESKTOP,
      budget: name === 'home-desktop' ? { width: 1280, kb: 80 } : { width: 1600, kb: 120 },
    })),
    {
      key: `${id}/home-full-desktop`,
      src: `${id}/home-full-desktop.png`,
      widths: [960, 1440],
      budget: { width: 1440, kb: 160 },
    },
    {
      key: `${id}/home-full-top`,
      src: `${id}/home-full-desktop.png`,
      widths: [480, 720, 1100, 1440],
      crop: [1, 1],
      position: 'top',
      budget: { width: 720, kb: 40 },
    },
    ...phone.map((name) => ({
      key: `${id}/${name}`,
      src: `${id}/${name}.png`,
      widths: PHONE,
      budget: { width: 600, kb: 45 },
    })),
  ]
}

/**
 * key: `<group>/<name>` (files: src/media/<group>/<name>-<width>.<ext>) · src: path under
 * media-raw/ · widths · crop: [w, h] aspect to cover-crop to · position: sharp crop gravity ·
 * optional: skipped cleanly when the source is missing · budget: max AVIF KB at that width.
 */
export const SOURCES = [
  {
    key: 'mrb/home-desktop',
    src: 'mrb/home-desktop.png',
    widths: DESKTOP,
    budget: { width: 1280, kb: 80 },
  },
  {
    key: 'mrb/home-full-desktop',
    src: 'mrb/home-full-desktop.png',
    widths: [960, 1440],
    budget: { width: 1440, kb: 160 },
  },
  // Its top square: the case card's screen on touch screens, where the capture never scrolls,
  // so phones skip the tall file (CaseCard.tsx)
  {
    key: 'mrb/home-full-top',
    src: 'mrb/home-full-desktop.png',
    widths: [480, 720, 1100, 1440], // 1100: a 390 px phone at 3 × (324 CSS px)
    crop: [1, 1],
    position: 'top',
    budget: { width: 720, kb: 40 },
  },
  {
    key: 'mrb/search-desktop',
    src: 'mrb/search-desktop.png',
    widths: DESKTOP,
    budget: { width: 1600, kb: 120 },
  },
  {
    key: 'mrb/product-desktop',
    src: 'mrb/product-desktop.png',
    widths: DESKTOP,
    budget: { width: 1600, kb: 120 },
  },
  {
    key: 'mrb/quote-desktop',
    src: 'mrb/quote-desktop.png',
    widths: DESKTOP,
    budget: { width: 1600, kb: 120 },
  },
  {
    key: 'mrb/home-pt-desktop',
    src: 'mrb/home-pt-desktop.png',
    widths: DESKTOP,
    budget: { width: 1600, kb: 120 },
  },
  {
    key: 'mrb/home-mobile',
    src: 'mrb/home-mobile.png',
    widths: PHONE,
    budget: { width: 600, kb: 45 },
  },
  {
    key: 'mrb/product-mobile',
    src: 'mrb/product-mobile.png',
    widths: PHONE,
    budget: { width: 600, kb: 45 },
  },
  {
    key: 'mrb/quote-mobile',
    src: 'mrb/quote-mobile.png',
    widths: PHONE,
    budget: { width: 600, kb: 45 },
  },
  { key: 'mrb/logo', src: 'mrb/logo.svg', svg: true },
  // Brochure: the cover (396 × 612 pt, portrait) and the 8–9 spread
  {
    key: 'mrb/brochure',
    src: 'mrb/brochure.png',
    widths: [480, 800, 1200],
    budget: { width: 800, kb: 120 },
  },
  {
    key: 'mrb/brochure-spread',
    src: 'mrb/brochure-spread.png',
    widths: [800, 1200, 1600],
    budget: { width: 1600, kb: 120 },
  },
  // My demo stores (ADR-026), captured like MRB: the same widths and budgets per kind of shot
  ...demoSources('landscape', {
    desktop: ['home-desktop', 'product-desktop', 'checkout-desktop', 'pavers-desktop'],
    phone: ['home-mobile', 'zip-mobile', 'product-mobile'],
  }),
  ...demoSources('industrial', {
    desktop: ['home-desktop', 'search-desktop', 'product-desktop', 'quote-desktop'],
    phone: ['home-mobile', 'search-mobile', 'product-mobile', 'miss-mobile'],
  }),
  // Portrait (R-09): any of media-raw/portrait/portrait.{jpg,jpeg,png,heic}. About: 4:5 in a
  // 240 px column; the 1:1 for OG and JSON-LD; the 48 px avatar on the hero's trust line.
  {
    key: 'portrait/about',
    src: 'portrait/portrait.*',
    widths: [480, 960],
    crop: [4, 5],
    position: 'attention',
    optional: true,
    budget: { width: 480, kb: 45 },
  },
  {
    key: 'portrait/square',
    src: 'portrait/portrait.*',
    widths: [400, 800],
    crop: [1, 1],
    position: 'attention',
    optional: true,
  },
  {
    key: 'portrait/avatar',
    src: 'portrait/portrait.*',
    widths: [96, 192],
    crop: [1, 1],
    position: 'attention',
    optional: true,
    budget: { width: 96, kb: 6 },
  },
]
