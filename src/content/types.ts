// Content model (docs/04 §4). Every visible text lives in content/en.ts and content/es.ts,
// both checked with `satisfies SiteContent`: a missing key is a compile error.

export type Locale = 'en' | 'es'
export type HeadlineVariant = 'a' | 'b' | 'c'
export type TrackLocation = 'header' | 'hero' | 'stage' | 'pricing' | 'closing' | 'faq' | 'demo'
export type Disclosure = 'named' | 'anonymized'

export type ImageRef = { src: string; width: number; height: number; alt: string } // alt is required

export type PriceSpec =
  | { kind: 'from'; amount: number; period?: 'month' } // "From US$3,000"
  | { kind: 'range'; min: number; max: number; period?: 'month' } // "US$350–500"
export type PriceByMarket = { us: PriceSpec; co: PriceSpec } // USD and COP

export type SiteContent = {
  meta: { title: string; description: string; ogImageAlt: string }
  nav: { bookCall: string; switchLanguage: string; skipToContent: string }
  hero: {
    headlines: Record<HeadlineVariant, string>
    subtitle: string
    primaryCta: string // "Book a 15-minute call"
    secondaryCta: { caseNamed: string; caseAnonymized: string; demo: string }
    trustLine: Record<Disclosure, string>
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
  solves: {
    title: string
    items: Array<{ icon: 'search' | 'star' | 'cart'; title: string; body: string }>
  }
  caseMrb: {
    title: Record<Disclosure, string>
    summary: Record<Disclosure, string>
    before: { label: string; points: string[]; images: Record<Disclosure, ImageRef[]> }
    after: { label: string; points: string[]; images: Record<Disclosure, ImageRef[]> }
    built: string[] // catalog, OEM part-number search, three languages, quote system
    result?: { metric: string; note: string } // only with permission
    testimonial?: { quote: string; author: string; role: string } // only with permission
    link?: { label: string; href: string } // only in named mode
  }
  demo: { title: string; body: string; cta: string; posterAlt: string } // v2
  process: {
    title: string
    steps: Array<{ title: string; body: string }>
    weeklyUpdate: string
  }
  pricing: {
    title: string
    note: string // "Starting prices; final quote depends on scope"
    currencyToggle: { label: string; usd: string; cop: string }
    plans: Array<{ name: string; description: string; price: PriceByMarket; features: string[] }>
  }
  faq: { title: string; items: Array<{ q: string; a: string }> } // 8 at most
  about: { title: string; lines: [string, string, string]; photo: ImageRef }
  closing: {
    title: string
    body: string
    bookCall: string
    whatsapp: { label: string; prefilledMessage: string }
    email: { label: string; subject: string }
  }
  contactForm: Record<string, never> // v1.1: labels, consent and states (sending, success, error)
  footer: { addressLabel: string; privacy: string; rights: string }
  notFound: { title: string; body: string; backHome: string }
}
