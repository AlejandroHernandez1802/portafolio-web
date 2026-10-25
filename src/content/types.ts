// Content model (docs/04 §4). Every visible text lives in content/en.ts and content/es.ts,
// both checked with `satisfies SiteContent`: a missing key is a compile error. Language-free
// case data (slugs, figures, dates, media) lives in content/cases.ts.

import type { KnownMediaKey } from '@/media'

export type Locale = 'en' | 'es'
export type HeadlineVariant = 'a' | 'b' | 'c'
export type TrackLocation =
  | 'header'
  | 'nav'
  | 'hero'
  | 'stage'
  | 'work'
  | 'services' // the services page (docs/14 ADR-024)
  | 'about' // the About summary on the home and the About page
  | 'case'
  | 'pricing'
  | 'closing'
  | 'faq'
  | 'demo'
  | 'footer'
export type Disclosure = 'named' | 'anonymized'

// Image keys of the media pipeline (R-04, scripts/media.config.mjs): every key the config
// knows, including optional ones not produced yet (the portrait). Type-only, so client islands
// that import these types never pull the manifest. Components look keys up with getMedia()
// from '@/media' and skip a missing one.
export type { KnownMediaKey }
export type MrbMediaKey = Extract<KnownMediaKey, `mrb/${string}`>

export type PriceSpec =
  | { kind: 'from'; amount: number; period?: 'month' } // "From US$3,000"
  | { kind: 'range'; min: number; max: number; period?: 'month' } // "US$350–500"
  | { kind: 'free' } // "Free"
export type PriceByMarket = { us: PriceSpec; co: PriceSpec } // USD and COP

// ---------------------------------------------------------------------------------------------
// Case studies (docs/14 ADR-020): typed data in cases.ts, copy per language in cases.<id> below.

export type CaseId = 'mrb'
export type CaseFigureId =
  | 'quotes' // quote requests since launch; null until the owner provides it
  | 'products'
  | 'categories'
  | 'oemBrands'
  | 'machines'
  | 'languages'
  | 'weeks' // phase 1 duration
export type CaseFeatureId = 'search' | 'quote' | 'languages' | 'catalog' | 'analytics' | 'brand'
export type DeviceKind = 'browser' | 'phone'
/** How a capture is shown: in a device, or as print material (the brochure) under the logo */
export type CaptureFrame = DeviceKind | 'plain'

/** What a project was, for the work summary on the home (ADR-025): its copy is work.categories */
export type WorkCategory = 'catalog' | 'quote' | 'store' | 'languages' | 'design'

/** Client work, or one of my own demo stores: a demo never shows client figures (ADR-024) */
export type CaseKind = 'client' | 'demo'

export type CaseStudy = {
  id: CaseId
  kind: CaseKind
  slug: Record<Locale, string>
  disclosure: Disclosure
  client: { name: string; url: string; domain: string }
  published: string // ISO date of this case page
  updated: string // ISO date, dateModified in JSON-LD
  launched: string // ISO date the client's site went live ({launched} in copy)
  featured: boolean // a card on the work page, an item of the "Work" menu and an example in /services
  /** Shown as chips in the home's work summary, merged across cases in work.categories order */
  categories: WorkCategory[]
  /** Verified numbers only; null hides every metric, cell or line that uses it */
  figures: Record<CaseFigureId, number | null>
  languages: string[] // codes shown in mono, e.g. EN · PT · ES
  stack: string[] // product names, never translated
  media: {
    hero: KnownMediaKey // case page hero, browser frame (LCP of the case page)
    card: KnownMediaKey // tall full-page capture, scrolls on hover in the work card
    cardTop?: KnownMediaKey // its top square, the card on touch screens (no hover, no scroll)
    showcase: { browser: KnownMediaKey; phone: KnownMediaKey } // home hero
    after: KnownMediaKey[] // "after" side of the before/after panels
    services: Partial<Record<ServiceTileId, KnownMediaKey>> // proof media on the bento tiles
  }
  /** Its capture on each block of the services page; the caption is in cases.<id>.examples */
  examples: Partial<Record<ServiceTileId, { media: KnownMediaKey; frame: CaptureFrame }>>
  /** Rows of "What I built", in order, with the capture shown beside each */
  features: Array<{ id: CaseFeatureId; media: KnownMediaKey | null; frame: CaptureFrame }>
}

/** A big number with its label. The value comes from CaseStudy.figures; null → not rendered. */
export type Metric = { figure: CaseFigureId; label: string }
/** A label/value row. Values may hold {figure} or {launched} placeholders (lib/cases.ts). */
export type Fact = { label: string; value: string }

export type CaseContent = {
  visitSite: string // "Visit malonebelt.com"
  /** Alt text of every capture of this case, per media key (one place per language) */
  alts: Record<MrbMediaKey, string>
  card: {
    meta: string // "Malone Road Belt · Industrial belts · U.S."
    industry: string // a chip of the home's work summary; cases sharing one show it once
    outcome: string // H3 of the card
    metrics: Metric[] // the first 3 that resolve are shown
    built: string[] // chips
  }
  /** Caption of its example on each block of the services page (CaseStudy.examples) */
  examples: Partial<Record<ServiceTileId, string>>
  page: {
    meta: { title: string; description: string; ogImageAlt: string }
    breadcrumb: { label: string; home: string; work: string } // the current page is the client name
    hero: { title: string; summary: string; facts: Fact[] } // title is the H1 (the outcome)
    results: { title: string; items: Metric[]; source: { catalog: string; quotes: string } }
    overview: {
      title: string
      client: Fact
      problem: Fact
      role: Fact
      stackLabel: string // the items come from CaseStudy.stack
    }
    beforeAfter: {
      title: string
      lead: string
      before: { label: string; points: string[] }
      after: { label: string; points: string[] } // screenshots: CaseStudy.media.after
    }
    features: { title: string; items: Record<CaseFeatureId, { title: string; body: string }> }
    closing: { title: string; body: string; cta: string }
    // The "next" card when this is the last case: it links to the services page instead
    next: { label: string; title: string; body: string }
  }
}

// ---------------------------------------------------------------------------------------------

export type ServiceTileId =
  'catalog' | 'quote' | 'design' | 'languages' | 'seo' | 'analytics' | 'care'
export type NavGroup = 'work' | 'services' | 'about'
// 'pricing' with site.features.pricing, 'linkedin' while the prices are hidden (ADR-025)
export type AboutNavItem = 'intro' | 'process' | 'pricing' | 'linkedin'
export type ServiceTile = {
  outcome: string // label above the title ("Get found", "Get chosen"…)
  title: string
  body: string
  proof?: string // may use {figure} placeholders, filled from the featured case
  list?: string[] // tiles D and E: a mono list
}

/** A cell of the hero figures strip. `fact` values may use {figure} placeholders. */
export type FigureCell =
  | {
      kind: 'fact'
      value: string // "{languages} languages": the leading number is set big, the rest as its unit
      label: string
      /** Shown in its place while a placeholder is null (the quote count); without it, skipped */
      fallback?: { value: string; label: string }
    }
  | {
      kind: 'price' // the store plan's starting price, per market
      label: string
      /** Shown in its place while site.features.pricing is off (ADR-025) */
      fallback: { value: string; label: string }
    }

export type SiteContent = {
  meta: { title: string; description: string; ogImageAlt: string }
  nav: {
    tagline: string
    bookCall: string // compact header CTA (< 1024 px)
    bookCallFull: string // header CTA from 1024 px and the menu's CTA
    switchLanguage: string
    skipToContent: string
    label: string // landmark name of the main <nav>
    links: Record<NavGroup, string> // the 3 dropdowns of the bar (docs/14 ADR-024)
    groups: {
      work: { all: string } // last link of the panel: the work page
      services: { all: string } // last link of the panel: the services page
      about: Record<AboutNavItem, { title: string; body: string }>
    }
    menu: { open: string; close: string; label: string } // mobile popover (< 1024 px)
  }
  hero: {
    headlines: Record<HeadlineVariant, string>
    subtitle: string
    primaryCta: string // "Book a 15-minute call"
    secondaryCta: { case: string; demo: string } // case page (v1) → demo store (v2)
    trustLine: string // "You work directly with me · Colombia, UTC−5"
    figures: { label: string; items: FigureCell[] }
    showcase: { label: string } // caption of the device frames; alts come from cases.<id>.alts
  }
  /** Section 01 of the home, the summary of the work page (ADR-025) */
  work: {
    title: string
    lead: string // what I do
    categoriesLabel: string
    categories: Record<WorkCategory, string> // the order of the chips
    industriesLabel: string
    projectsLabel: string // the list of cases, each linking to its page
    allWork: string // the button to the work page
    card: {
      viewCase: string
      builtLabel: string
      demoBadge: string // chip on a demo's card, menu item and examples ("Demo · my own project")
      nextCase: string // label of the "next" card when it leads to another case
    }
  }
  services: {
    title: string
    lead: string
    tiles: Record<ServiceTileId, ServiceTile>
    ownership: string // "Domain, hosting and accounts in your name."
    pricingLink: string // closing link of the bento, to the About page #precios
    processLink: string // the same link to #proceso while the prices are hidden (ADR-025)
    allServices: string // link to the services page, beside the lead
    // Animated scene of tile B (docs/05): decorative, aria-hidden
    stage: {
      linkTitle: string // tooltip for the clickable stage; the stage is aria-hidden (docs/05 §7)
      customerMessage: string // "Hi, how much for…?"
      businessReply: string // "Call for pricing"
      // price per market, rendered with data-only-market (docs/05 §12)
      product: {
        brand: string
        name: string
        price: { us: string; co: string }
        unit: string
        qtyLabel: string
      }
      addToCart: string
      orderReceived: string // "Order received · Delivery Thursday"
    }
  }
  /** The work page, /en/work · /es/trabajos: every case as a card (ADR-025) */
  workPage: {
    meta: { title: string; description: string }
    breadcrumb: { label: string; home: string } // the current page is the "Work" label of the bar
    title: string // H1
    lead: { one: string; many: string } // with a single featured case, or several
  }
  /** The services page, /en/services · /es/servicios: one block per service (ADR-024) */
  servicesPage: {
    meta: { title: string; description: string }
    breadcrumb: { label: string; home: string } // the current page is the title
    title: string // H1
    lead: string
    indexLabel: string // landmark name of the list of blocks under the H1
    includedLabel: string // "What's included"
    exampleLabel: { client: string; demo: string } // over each capture: "Real example · {name}"
    viewCase: string
    // The block's intro, after the bento body, and what it includes
    items: Record<ServiceTileId, { intro: string; included: string[] }>
    care: { planLabel: string } // the care block shows the plan instead of a capture
  }
  cases: Record<CaseId, CaseContent>
  demo: { title: string; body: string; cta: string; posterAlt: string } // v2
  process: {
    title: string
    steps: Array<{ title: string; body: string; duration: string }>
    weeklyUpdate: string
    changes: string // "3 rounds of changes per phase."
  }
  pricing: {
    title: string // on the About page since ADR-024
    note: string // "Starting prices; final quote depends on scope"
    currencyToggle: { label: string; usd: string; cop: string }
    priceLabels: { from: string; perMonth: string; free: string } // "From", "/ month", "Free"
    plans: Array<{ name: string; description: string; price: PriceByMarket; features: string[] }>
    cta: string // "Get your free prototype" (books the call)
    faqLink: string // link to home #preguntas
  }
  faq: { title: string; items: Array<{ q: string; a: string }> } // 8 at most
  about: {
    title: string // H1 of the About page, H2 of its summary on the home
    lead: string
    facts: Fact[]
    photo: { alt: string } // 'portrait/about' from the media manifest; skipped while missing
  }
  /** Home summary of the About page: the lead, the 4 steps on one line and the prices */
  aboutTeaser: {
    lead: string
    stepsLabel: string
    pricesLabel: string
    cta: string // to the About page
    pricingLink: string // to the About page #precios
  }
  /** LinkedIn, in the place of the prices while they are hidden (ADR-025) */
  linkedin: {
    title: string // H2 of the About page section
    body: string
    cta: string // "See my LinkedIn profile", on the section and the home summary
    newTab: string // for screen readers: the link opens a new tab
  }
  /** The About page, /en/about · /es/sobre-mi: who I am, process and pricing (ADR-024) */
  aboutPage: {
    meta: { title: string; description: string }
    breadcrumb: { label: string; home: string }
  }
  closing: {
    title: string
    body: string
    bookCall: string
    whatsapp: { label: string; prefilledMessage: string }
    email: { label: string; subject: string }
  }
  contactForm: Record<string, never> // v1.1: labels, consent and states (sending, success, error)
  footer: {
    addressLabel: string
    privacy: string
    rights: string
    navLabel: string // landmark name of the footer <nav>
    caseLink: string // "{name} case", one link per featured case
    linkedin: string // "LinkedIn"
  }
  notFound: { title: string; body: string; backHome: string }
  privacy: {
    meta: { title: string; description: string }
    title: string
    effectiveLabel: string // "Effective date"
    // Paragraphs may use {name}, {email}, {address} and {whatsapp}, filled from site.ts at render
    sections: Array<{ heading: string; paragraphs: string[] }>
    backHome: string
  }
}
