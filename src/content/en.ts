import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2. Everything else is a draft to review in
// F0-10; answers and lines marked TODO(F0-10) need your input before launch.
export const en = {
  meta: {
    title: 'Alejandro Hernández · Online stores and catalogs with quote systems',
    description:
      'I build online stores and quote systems for businesses that sell products. You see a working prototype in 5 days, before you commit to the full build.',
    ogImageAlt: 'From "call for pricing" to "add to cart" · Alejandro Hernández',
  },
  nav: { bookCall: 'Book a call', switchLanguage: 'Español', skipToContent: 'Skip to content' },
  hero: {
    headlines: {
      a: 'From "call for pricing" to "add to cart".',
      b: 'Your website should take orders, not just look nice.',
      c: 'See your new store working in 5 days.',
    },
    subtitle:
      'I build online stores and quote systems for businesses that sell products. You see a working prototype in 5 days, before you commit to the full build.',
    primaryCta: 'Book a 15-minute call',
    secondaryCta: {
      caseNamed: 'See the Malone Road Belt case',
      caseAnonymized: 'See the industrial supplier case',
      demo: 'Try the demo store',
    },
    trustLine: {
      named: 'Built the catalog and quote system for Malone Road Belt, Kentucky.',
      anonymized: 'Built the catalog and quote system for a U.S. industrial supplier.',
    },
    stage: {
      linkTitle: 'See the case',
      customerMessage: 'Hi, how much for…?',
      businessReply: 'Call for pricing',
      product: {
        brand: 'TODO(F0-12)',
        name: 'TODO(F0-12)',
        price: { us: '$14.90', co: 'COP 62,000' },
        unit: '/ unit',
        qtyLabel: 'Qty',
      },
      addToCart: 'Add to cart',
      orderReceived: 'Order received · Delivery Thursday',
    },
  },
  solves: {
    title: 'What I solve',
    items: [
      {
        icon: 'search',
        title: 'Get found',
        body: 'On Google and in AI answers, with pages that say clearly what you sell.',
      },
      {
        icon: 'star',
        title: 'Get chosen',
        body: 'A clear catalog and real reviews, so buyers trust you before they call.',
      },
      {
        icon: 'cart',
        title: 'Get orders and quotes',
        body: 'A cart, a quote request or WhatsApp: buyers act without waiting for a callback.',
      },
    ],
  },
  caseMrb: {
    title: {
      named: 'Malone Road Belt: from phone quotes to online requests',
      anonymized: 'An industrial supplier: from phone quotes to online requests',
    },
    summary: {
      named: 'TODO(F0-10): one or two lines about the Malone Road Belt project.',
      anonymized:
        'TODO(F0-10): one or two lines about the project, without identifying the client.',
    },
    before: {
      label: 'Before',
      points: ['TODO(F0-10): what buyers ran into before the new site.'],
      images: { named: [], anonymized: [] },
    },
    after: {
      label: 'After',
      points: ['TODO(F0-10): what buyers can do now.'],
      images: { named: [], anonymized: [] },
    },
    built: [
      'Product catalog',
      'Search by OEM part number',
      'Three languages',
      'Quote request system',
    ],
    link: { label: 'Visit malonebelt.com', href: 'https://malonebelt.com' },
  },
  demo: {
    title: 'Try it: this is not a screenshot',
    body: 'Add something to the cart and pay in test mode.',
    cta: 'Try the demo store',
    posterAlt: 'Demo store for a fictitious distributor',
  },
  process: {
    title: 'How I work',
    steps: [
      {
        title: 'Prototype in 5 business days',
        body: 'A clickable version of your site, credited toward the project.',
      },
      { title: 'Build in phases', body: 'Short phases you approve one at a time.' },
      { title: 'Launch', body: 'Your store goes live on your own domain and hosting.' },
      { title: 'Monthly plan', body: 'Care and visibility after launch, if you want it.' },
    ],
    weeklyUpdate: 'Every Friday you get an update.',
  },
  pricing: {
    title: 'Services and starting prices',
    note: 'Starting prices; final quote depends on scope.',
    currencyToggle: { label: 'Currency', usd: 'USD', cop: 'COP' },
    plans: [
      {
        name: 'Clickable prototype in 5 business days',
        description: 'See your site working before you commit. Credited toward the project.',
        price: {
          us: { kind: 'range', min: 350, max: 500 },
          co: { kind: 'range', min: 800_000, max: 1_200_000 },
        },
        features: ['TODO(F0-10): what the prototype includes'],
      },
      {
        name: 'Online store or catalog with quote system',
        description: 'TODO(F0-10): who it is for.',
        price: { us: { kind: 'from', amount: 3_000 }, co: { kind: 'from', amount: 3_000_000 } },
        features: ['TODO(F0-10): what the build includes'],
      },
      {
        name: 'Monthly care and visibility plan',
        description: 'TODO(F0-10): who it is for.',
        price: {
          us: { kind: 'range', min: 150, max: 300, period: 'month' },
          co: { kind: 'range', min: 250_000, max: 500_000, period: 'month' },
        },
        features: ['TODO(F0-10): what the plan includes'],
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      { q: 'Will the domain and hosting be in my name?', a: 'TODO(F0-10)' },
      { q: 'How long does the project take?', a: 'TODO(F0-10)' },
      { q: 'How do payments work?', a: 'TODO(F0-10)' },
      { q: 'How many rounds of changes are included?', a: 'TODO(F0-10)' },
      { q: 'What happens if we don’t continue after the prototype?', a: 'TODO(F0-10)' },
      { q: 'Do you work with my current platform (Shopify, WooCommerce, Wix)?', a: 'TODO(F0-10)' },
      { q: 'How do we communicate, and during which hours?', a: 'TODO(F0-10)' },
      { q: 'What do I need to have ready (catalog, photos, prices)?', a: 'TODO(F0-10)' },
    ],
  },
  about: {
    title: 'About me',
    lines: [
      'Software engineer and project lead with more than 4 years of experience.',
      'TODO(F0-10): second line.',
      'TODO(F0-10): third line.',
    ],
    photo: {
      src: '/images/about/portrait.webp',
      width: 800,
      height: 800,
      alt: 'Alejandro Hernández',
    },
  },
  closing: {
    title: 'Let’s talk about your store',
    body: 'A 15-minute call to see whether a prototype makes sense for your business.',
    bookCall: 'Book a 15-minute call',
    whatsapp: {
      label: 'WhatsApp',
      prefilledMessage:
        "Hi Alejandro, I saw your website and I'd like to talk about my store/catalog.",
    },
    email: { label: 'Email', subject: 'Online store or catalog' },
  },
  contactForm: {},
  footer: {
    addressLabel: 'Mailing address',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or was moved.',
    backHome: 'Go to the English site',
  },
} satisfies SiteContent
