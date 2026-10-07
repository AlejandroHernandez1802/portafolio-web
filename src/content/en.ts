import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2, plus F0-10 drafts. Lines marked
// REVIEW(F0-10) are facts to confirm before launch.
export const en = {
  meta: {
    title: 'Online stores & quote systems | Alejandro Hernández',
    description:
      'I build online stores and quote systems for businesses that sell products. See a working prototype in 5 days before committing.',
    ogImageAlt: 'From “call for pricing” to “add to cart” · Alejandro Hernández',
  },
  nav: {
    tagline: 'Online stores & quote systems',
    bookCall: 'Book a call',
    switchLanguage: 'Español',
    skipToContent: 'Skip to content',
  },
  hero: {
    headlines: {
      a: 'From “call for pricing” to “add to cart”.',
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
      customerMessage: 'Hi, how much for 20 V-belts?',
      businessReply: 'Call for pricing',
      product: {
        // REVIEW(F0-12): verify the fictitious brand doesn't exist (Google, USPTO, SIC)
        brand: 'Norvale Supply',
        name: 'V-belt B48',
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
    // REVIEW(F0-10): confirm the before/after facts with the real project
    summary: {
      named:
        'Malone Road Belt sells industrial belts in the U.S. Buyers had to call or email to get a price. Now they find the part and request a quote online.',
      anonymized:
        'A U.S. industrial supplier whose buyers had to call or email to get a price. Now they find the part and request a quote online.',
    },
    before: {
      label: 'Before',
      points: [
        'Buyers had to call or email to learn the price and availability of a part.',
        'There was no way to search by the part number buyers already had.',
        'The site was in one language only.',
      ],
      images: { named: [], anonymized: [] },
    },
    after: {
      label: 'After',
      points: [
        'Buyers find the part by its OEM number in seconds.',
        'They request a quote online, at any time, with the exact parts listed.',
        'The catalog is available in three languages.',
      ],
      images: { named: [], anonymized: [] },
    },
    builtLabel: 'What we built',
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
        body: 'A clickable version of your site, free and with no commitment.',
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
    priceLabels: { from: 'From', perMonth: '/ month', free: 'Free' },
    plans: [
      {
        name: 'Clickable prototype in 5 business days',
        description: 'See your site working before you commit. No cost, no obligation.',
        price: { us: { kind: 'free' }, co: { kind: 'free' } },
        features: [
          'Home page and one catalog or product page',
          'Your real products, logo and colors',
          'Works on phone and desktop',
          'A walkthrough call to review it together',
        ],
      },
      {
        name: 'Online store or catalog with quote system',
        description: 'For businesses that sell products and still quote by phone or email.',
        price: { us: { kind: 'from', amount: 3_000 }, co: { kind: 'from', amount: 3_000_000 } },
        features: [
          'Catalog with search and filters, including by part number',
          'Cart or quote request, delivered to your email',
          'Fast pages that Google understands',
          'Domain, hosting and accounts in your name',
        ],
      },
      {
        name: 'Monthly care and visibility plan',
        description: 'For stores that want to keep improving after launch.',
        price: {
          us: { kind: 'range', min: 150, max: 300, period: 'month' },
          co: { kind: 'range', min: 250_000, max: 500_000, period: 'month' },
        },
        features: [
          'Updates, backups and security fixes',
          'Small content changes every month',
          'Monthly report on visits, quotes and orders',
          'Google Business Profile and review requests',
        ],
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Will the domain and hosting be in my name?',
        a: 'Yes. The domain, hosting and every account are created in your name, and I work with the access you give me. If we stop working together, you keep everything.',
      },
      {
        // REVIEW(F0-10): confirm the 3–6 week range
        q: 'How long does the project take?',
        a: 'The prototype takes 5 business days. A typical store or catalog takes 3 to 6 weeks after you approve the prototype, depending on the number of products and features.',
      },
      {
        q: 'How do payments work?',
        a: '40% to start the build, 40% when you approve the first milestone and 20% at launch. The prototype is free.',
      },
      {
        q: 'How many rounds of changes are included?',
        a: 'Three rounds of changes per phase. Anything beyond that, or a new feature, is quoted before I do it.',
      },
      {
        q: 'What happens if we don’t continue after the prototype?',
        a: 'Nothing. The prototype is free and there is no commitment: if it isn’t a fit, you don’t owe anything.',
      },
      {
        q: 'Do you work with my current platform (Shopify, WooCommerce, Wix)?',
        a: 'I build your new site on my own stack, which is fast and cheap to run. If you are on Shopify, WooCommerce or Wix, I move your catalog and content to the new site.',
      },
      {
        q: 'How do we communicate, and during which hours?',
        a: 'By WhatsApp or email, plus a short video call when it helps. I’m in Colombia (UTC−5) and I reply within one business day.',
      },
      {
        q: 'What do I need to have ready (catalog, photos, prices)?',
        a: 'Your product list (a spreadsheet is fine), photos if you have them, and your prices or how you quote. If something is missing, we start with what you have.',
      },
    ],
  },
  about: {
    title: 'About me',
    lines: [
      'Software engineer and project lead with more than 4 years of experience.',
      'I design and build online stores, catalogs and quote systems for businesses that sell products.',
      'I work from Colombia with clients in the U.S. and Latin America, in English and Spanish.',
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
  // REVIEW(F0-14): draft based on docs/09 §6; confirm before launch
  privacy: {
    meta: {
      title: 'Privacy policy | Alejandro Hernández',
      description: 'How this website collects, uses and protects personal data.',
    },
    title: 'Privacy policy',
    effectiveLabel: 'Effective date',
    sections: [
      {
        heading: 'Who is responsible',
        paragraphs: [
          '{name} is responsible for the personal data collected through this website. Mailing address: {address}. Email: {email}. WhatsApp: {whatsapp}.',
        ],
      },
      {
        heading: 'What data is collected',
        paragraphs: [
          'Booking a call: your name, email, company website, notes and consent, through Cal.com.',
          'WhatsApp and email: your number or address and the messages you send.',
          'Analytics: pages visited, clicks on buttons, country, browser and campaign tags, through Umami. Umami does not use cookies or store personal data.',
          'Hosting: Cloudflare processes technical data of each request, such as the IP address and browser, to serve and protect the site.',
        ],
      },
      {
        heading: 'Why it is used',
        paragraphs: [
          'To schedule and prepare calls, answer your messages, send the proposals you ask for and measure how the site is used. Your data is not sold or used for advertising.',
        ],
      },
      {
        heading: 'Your consent',
        paragraphs: [
          'When you book a call you authorize the processing of your data by checking a box that is not checked in advance. You can withdraw your consent at any time by writing to {email}.',
        ],
      },
      {
        heading: 'Service providers and international transfers',
        paragraphs: [
          'Cloudflare (hosting), Umami (analytics), Cal.com (scheduling), Google (calendar, video calls and email) and Meta (WhatsApp) process data on my behalf, mainly in the United States. Your consent covers this transfer.',
        ],
      },
      {
        heading: 'How long it is kept',
        paragraphs: [
          'Booking and contact data: up to 24 months, or until you ask for its deletion. Analytics data: 6 months.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can know, update, correct and delete your data, ask for proof of your consent, learn how it is used and withdraw your consent, free of charge, by writing to {email}.',
          'Questions are answered within 10 business days and complaints within 15 business days. In Colombia you can also file a complaint with the Superintendencia de Industria y Comercio (SIC).',
        ],
      },
      {
        heading: 'Cookies, local storage and Do Not Track',
        paragraphs: [
          'This site does not use cookies. It saves your currency choice in your browser’s local storage and the campaign tags of your visit in session storage. Neither leaves your browser, except the campaign tag in analytics events.',
          'The site does not track you across other websites, so every visit is treated the same way whether or not your browser sends a Do Not Track signal.',
        ],
      },
      {
        heading: 'Security',
        paragraphs: [
          'The site is served only over HTTPS, and the accounts that hold your data are protected with two-step verification.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          'This site is not directed to minors and does not knowingly collect their data.',
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If this policy changes, the new version and its effective date are published on this page.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: ['For any question about this policy, write to {email}.'],
      },
    ],
    backHome: 'Back to the home page',
  },
} satisfies SiteContent
