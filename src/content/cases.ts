import type { CaseId, CaseStudy, Locale } from './types'

// Case studies as typed data, no copy (docs/14 ADR-020, ADR-011: TSX, no MDX). The texts of
// each case live in content/{en,es}.ts → cases.<id>. Figures are verified facts only: the
// source of each one is noted next to it, and null hides every place that uses it.
// Order = order of the cards on the work page, the "Work" menu and the examples. A demo store
// joins as one more entry with kind 'demo' once it has its URL and captures (ADR-024): until
// then it is left out. Its categories and industry join the home's work summary (ADR-025).
export const cases: CaseStudy[] = [
  {
    id: 'mrb',
    kind: 'client',
    slug: { en: 'malone-road-belt', es: 'malone-road-belt' },
    disclosure: 'named', // REVIEW(R-08): written permission from MRB (name, logo, captures, figures) — R-01
    client: {
      name: 'Malone Road Belt',
      url: 'https://www.malonebelt.com',
      domain: 'malonebelt.com',
    },
    published: '2026-11-06', // REVIEW(R-08): launch day of this page (F1-10)
    updated: '2026-11-06', // REVIEW(R-08): bump when the case changes
    launched: '2026-08-25', // full site live (MRB repo, src/data/launch.ts)
    featured: true,
    categories: ['catalog', 'quote', 'languages', 'design'],
    figures: {
      quotes: null, // REVIEW(R-08): quote requests since 27 Aug (Vercel Analytics) + OK to publish
      // Verified on malonebelt.com/en/products on 24 Oct 2026: 3 Standard + 2 Heavy-Duty + 10 CleatMax
      products: 15, // REVIEW(R-08): the plan says 16
      categories: 4, // REVIEW(R-08): Standard, Heavy-Duty, CleatMax, Custom / Special; the plan says 5
      oemBrands: 29, // REVIEW(R-08): MRB repo src/data/oems.ts (Astec counts as 3); the plan says 30
      machines: 6, // REVIEW(R-08): MRB repo src/data/machines.ts, fits are placeholders; the plan says 7
      languages: 3, // EN, PT, ES: /en, /pt and /es all live on 24 Oct 2026
      weeks: null, // REVIEW(R-08): phase 1 duration (repo 8 Jul → coming soon 26 Jul → full site 25 Aug)
    },
    languages: ['EN', 'PT', 'ES'],
    stack: ['Next.js', 'Vercel', 'Resend'], // MRB repo package.json and api/quote (no payments)
    media: {
      hero: 'mrb/home-desktop',
      card: 'mrb/home-full-desktop',
      cardTop: 'mrb/home-full-top',
      showcase: { browser: 'mrb/home-desktop', phone: 'mrb/quote-mobile' },
      after: ['mrb/home-desktop', 'mrb/home-mobile'],
      services: {
        catalog: 'mrb/search-desktop',
        design: 'mrb/brochure-spread',
        languages: 'mrb/home-pt-desktop',
      },
    },
    examples: {
      catalog: { media: 'mrb/search-desktop', frame: 'browser' },
      quote: { media: 'mrb/quote-mobile', frame: 'phone' },
      design: { media: 'mrb/brochure', frame: 'plain' }, // with its logo and inside spread
      languages: { media: 'mrb/home-pt-desktop', frame: 'browser' },
      seo: { media: 'mrb/product-desktop', frame: 'browser' },
      analytics: { media: 'mrb/quote-desktop', frame: 'browser' },
    },
    features: [
      { id: 'search', media: 'mrb/search-desktop', frame: 'browser' },
      { id: 'quote', media: 'mrb/quote-mobile', frame: 'phone' },
      { id: 'languages', media: 'mrb/home-pt-desktop', frame: 'browser' },
      { id: 'catalog', media: 'mrb/product-desktop', frame: 'browser' },
      { id: 'analytics', media: null, frame: 'plain' }, // text only: no client data on screen
      { id: 'brand', media: 'mrb/brochure', frame: 'plain' },
    ],
  },
]

export function getCase(id: CaseId): CaseStudy {
  const found = cases.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown case: ${id}`)
  return found
}

/** The case published at /{lang}/{segment}/{slug}, if any. */
export function caseBySlug(lang: Locale, slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug[lang] === slug)
}

export const featuredCases = cases.filter((c) => c.featured)
