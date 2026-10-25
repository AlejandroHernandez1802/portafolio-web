import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2, plus F0-10 drafts. Lines marked
// REVIEW(F0-10) are facts to confirm before launch; REVIEW(R-08) marks the copy of the
// restructure (docs/14 ADR-020) that the owner confirms, mostly claims about the MRB case.
// Case figures are placeholders like {products}, filled from content/cases.ts (lib/cases.ts).
export const en = {
  meta: {
    title: 'Online stores & quote systems | Alejandro Hernández',
    description:
      'I design and build online stores and quote systems for businesses that sell products. See a working prototype in 5 days before committing.',
    ogImageAlt:
      'No website, or an outdated one? Go from “call for pricing” to “add to cart” · Alejandro Hernández',
  },
  nav: {
    tagline: 'Online stores & quote systems',
    bookCall: 'Book a call',
    bookCallFull: 'Book a call',
    switchLanguage: 'Español',
    skipToContent: 'Skip to content',
    label: 'Main',
    links: { work: 'Work', services: 'Services', about: 'About' },
    // The dropdowns of the bar (docs/14 ADR-024)
    groups: {
      work: { all: 'All work' },
      services: { all: 'All services, with examples' },
      about: {
        intro: { title: 'About me', body: 'Who you work with, from the first call to launch.' },
        process: {
          title: 'How I work',
          body: 'Free prototype, build in phases, launch and monthly plan.',
        },
        pricing: { title: 'Pricing', body: 'Starting prices in USD or COP.' },
        // In the place of pricing while the prices are hidden (ADR-025)
        linkedin: { title: 'LinkedIn', body: 'My background and experience, on my profile.' },
      },
    },
    menu: { open: 'Menu', close: 'Close', label: 'Site menu' },
  },
  hero: {
    headlines: {
      // Text before the first quote ending in “?” is the audience line, set above (HeroHeadline)
      a: 'No website, or an outdated one? Go from “call for pricing” to “add to cart”.',
      b: 'Your website should take orders, not just look nice.',
      c: 'See your new store working in 5 days.',
    },
    subtitle:
      'I design and build online stores and quote systems for businesses that sell products. You see a working prototype in 5 days, before you commit to the full build.',
    primaryCta: 'Book a 15-minute call',
    secondaryCta: {
      case: 'See the Malone Road Belt case',
      demo: 'Try the demo store',
    },
    trustLine: 'You work directly with me · Colombia, UTC−5',
    figures: {
      label: 'At a glance',
      items: [
        // REVIEW(R-08): the OEM brand count stands in until cases.ts has the quote count
        {
          kind: 'fact',
          value: '{quotes}',
          label: 'quote requests on Malone Road Belt since Aug 27',
          // REVIEW(R-08): 29 brand names on the malonebelt.com home strip; the plan said 30
          fallback: { value: '{oemBrands}', label: 'OEM brands covered on malonebelt.com' },
        },
        {
          kind: 'fact',
          value: '{languages} languages',
          label: '{products} products on malonebelt.com',
        },
        { kind: 'fact', value: '5 business days', label: 'to see your free, clickable prototype' },
        {
          kind: 'price',
          label: 'for a store or catalog with quote system',
          // Shown while the prices are hidden (ADR-025)
          fallback: { value: '100%', label: 'of the domain, hosting and accounts in your name' },
        },
      ],
    },
    showcase: { label: 'Live work · malonebelt.com' },
  },
  // The home summary of the work page (ADR-025)
  work: {
    title: 'Recent work',
    lead: 'I design and build product catalogs, quote systems and online stores for businesses that sell products, from the brand and the interface to the site live on your domain. Every project has its full case.',
    categoriesLabel: 'What I’ve built',
    categories: {
      catalog: 'Product catalogs',
      quote: 'Online quote systems',
      store: 'Stores with cart and checkout',
      languages: 'Multilingual sites',
      design: 'Web and brand design',
    },
    industriesLabel: 'Industries',
    projectsLabel: 'Projects',
    allWork: 'See all my work',
    card: {
      viewCase: 'See the full case',
      builtLabel: 'What I built',
      demoBadge: 'Demo · my own project',
      nextCase: 'Next case',
    },
  },
  services: {
    title: 'What your store includes',
    // Design joins the services (ADR-025)
    lead: 'What your business needs to be found, chosen and asked for an order or a quote, designed and built around your catalog.',
    tiles: {
      // For any catalog, not only industrial parts
      catalog: {
        outcome: 'Get chosen',
        title: 'Catalog with search and filters',
        body: 'Buyers find the exact product by name, reference or category, and see specs and photos before they reach out.',
        proof: '{products} products on Malone Road Belt',
      },
      quote: {
        outcome: 'Get orders and quotes',
        title: 'Quote request or cart',
        body: 'A quote form, a cart or WhatsApp: buyers act without waiting for a callback, and every request reaches your inbox.',
      },
      design: {
        outcome: 'Be remembered',
        title: 'Design for your site and your brand',
        body: 'A design made for your business, not a template: your store’s interface and, if you need them, your logo and sales material, so everything looks like one company.',
        proof: 'Site, logo and brochure for Malone Road Belt',
      },
      languages: {
        outcome: 'Reach more buyers', // REVIEW(R-08): new label
        title: 'Multiple languages',
        body: 'English, Spanish or Portuguese, each with its own pages, so every buyer reads you in their language.',
        proof: '{languages} languages on Malone Road Belt',
      },
      seo: {
        outcome: 'Get found',
        title: 'Google and AI answers',
        body: 'Fast pages that say clearly what you sell, with the structured data that search engines and AI assistants read.',
        list: [
          'Product pages',
          'Structured data',
          'Sitemap and hreflang',
          'Google Business Profile',
        ],
      },
      analytics: {
        outcome: 'Know what sells', // REVIEW(R-08): new label
        title: 'Quote analytics',
        body: 'See how many quotes and orders the site brings in, and which products buyers ask about.',
        // REVIEW(R-08): new list, restates the body
        list: [
          'Quote requests per week',
          'Orders, if you sell online',
          'Products buyers ask about',
        ],
      },
      care: {
        outcome: 'Keep improving', // REVIEW(R-08): new label
        title: 'Monthly care plan',
        body: 'Updates, backups, small changes and a monthly report, so the store keeps working while you sell.',
      },
    },
    ownership: 'Domain, hosting and accounts in your name.',
    pricingLink: 'See pricing',
    processLink: 'See how I work',
    allServices: 'See every service, with examples',
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
  // The work page (ADR-025)
  workPage: {
    meta: {
      title: 'Work: online store and catalog case studies | Alejandro Hernández',
      description:
        'The projects I have designed and built, each with its full case: the problem, what I built and the results.',
    },
    breadcrumb: { label: 'Breadcrumb', home: 'Home' },
    title: 'Work, case by case',
    // REVIEW(R-08)
    lead: {
      one: 'One project, shown in full: the catalog and quote system I built for a U.S. industrial belt supplier, live since August 2026.',
      // Shown once a demo store joins cases.ts
      many: 'Client work and demo stores I build to show what’s possible, each one with its full case.',
    },
  },
  // The services page, with design and the global catalog (ADR-024, ADR-025)
  servicesPage: {
    meta: {
      title: 'Services: design and development of stores and catalogs | Alejandro Hernández',
      description:
        'Catalog with search and filters, quote form or cart, design for your site and brand, multiple languages, Google and AI search, analytics and a monthly care plan, with real examples.',
    },
    breadcrumb: { label: 'Breadcrumb', home: 'Home' },
    title: 'Services, with real examples',
    lead: 'Seven parts that turn your catalog into a site buyers find, understand and order from, designed for your brand. Each one with what’s included and, where it’s live, a real example.',
    indexLabel: 'Services on this page',
    includedLabel: 'What’s included',
    exampleLabel: { client: 'Real example · {name}', demo: 'Demo · {name}' },
    viewCase: 'See the full case',
    items: {
      catalog: {
        intro:
          'Buyers arrive knowing what they need, even if they don’t know what your catalog calls it. They search by name, reference or category, and filters and product pages with photos take them to the right product without a call.',
        included: [
          'Search by name, reference or category',
          'Filters by category and features',
          'A page per product, with its specs and photos',
          'Catalog loaded from your spreadsheet',
        ],
      },
      quote: {
        intro:
          'Some products have a fixed price and go to a cart; others need a quote. You choose per product: a quote form that asks for what you need to reply, a cart with online payment, or a WhatsApp button with the product already in the message.',
        included: [
          'Quote form with the fields you ask for today',
          'Cart and online payment, if you sell at fixed prices',
          'WhatsApp with the product in the message',
          'Every request in your inbox, with the product and the buyer’s details',
        ],
      },
      design: {
        intro:
          'Before building, I design how your site looks and works: colors, type, product pages and forms, made for your buyers instead of taken from a template. If your brand needs a refresh, I also design the logo and the sales material, so the site and what you hand out tell the same story.',
        included: [
          'Custom interface design, no templates',
          'Designed for phones first, and for desktop too',
          'Logo and brand identity, if you need them',
          'Brochures and sales material in the same look',
        ],
      },
      languages: {
        intro:
          'Each language gets its own pages and address (/en, /es, /pt), not a translation widget, so buyers read you in their language and search engines show the right version in each country.',
        included: [
          'English, Spanish or Portuguese',
          'Its own address per language, with hreflang',
          'Every page, product and form translated',
          'A language switch on every page',
        ],
      },
      seo: {
        intro:
          'Each product gets its own page, with a clear title, description and specs, so a buyer searching for a part number lands on it. It is built in from the first page, not added later, and it is also what AI assistants read when they answer about a product.',
        included: [
          'A page per product, with its own title and description',
          'Structured data for your products and your business',
          'Sitemap, hreflang and Search Console',
          'Google Business Profile set up',
        ],
      },
      analytics: {
        intro:
          'You see how many quote requests and orders the site brings in each week, and which products buyers ask about, with privacy-friendly analytics that need no cookie banner.',
        included: [
          'Each quote or order counted as a conversion',
          'Requests per week and per product',
          'Where your visitors come from',
          'A monthly summary, with the care plan',
        ],
      },
      care: {
        intro:
          'After launch the store keeps working and improving: updates, backups, security patches and small content changes every month, plus a report of visits, quotes and orders.',
        included: [
          'Updates, backups and security patches',
          'Small content changes every month',
          'Monthly report of visits, quotes and orders',
          'Google Business Profile and review requests',
        ],
      },
    },
    care: { planLabel: 'Monthly plan' },
  },
  cases: {
    // REVIEW(R-08): the whole case copy, against the MRB permission and the live site
    mrb: {
      visitSite: 'Visit malonebelt.com',
      alts: {
        'mrb/home-desktop':
          'Malone Road Belt home page on a desktop browser, with the belt finder by machine or OEM part number',
        'mrb/home-full-desktop':
          'The full Malone Road Belt home page, from the belt finder to the footer',
        'mrb/home-full-top': 'The top of the Malone Road Belt home page, with the belt finder',
        'mrb/search-desktop': 'Belt search results by OEM part number on malonebelt.com',
        'mrb/product-desktop': 'A Malone Road Belt product page with its spec table',
        'mrb/quote-desktop':
          'Quote request form with the urgency choice: machine down now or planned purchase',
        'mrb/home-pt-desktop': 'The Malone Road Belt home page in Portuguese',
        'mrb/home-mobile': 'The Malone Road Belt home page on a phone',
        'mrb/product-mobile': 'A Malone Road Belt product page on a phone',
        'mrb/quote-mobile': 'The Malone Road Belt quote request form on a phone',
        'mrb/logo': 'Malone Road Belt logo',
        'mrb/brochure': 'Cover of the Malone Road Belt brochure',
        'mrb/brochure-spread': 'An inside spread of the Malone Road Belt brochure',
      },
      card: {
        meta: 'Malone Road Belt · Industrial belts · U.S.',
        industry: 'Industrial conveyor belts',
        outcome: 'From phone quotes to online quote requests, in 3 languages',
        metrics: [
          { figure: 'quotes', label: 'quote requests since Aug 27' },
          { figure: 'languages', label: 'languages: EN, PT, ES' },
          { figure: 'products', label: 'products, searchable by machine or OEM part number' },
          { figure: 'oemBrands', label: 'OEM brands covered' },
        ],
        built: ['Product catalog', 'OEM part-number search', '3 languages', 'Quote requests'],
      },
      // Captions of the MRB examples on the services page
      examples: {
        catalog:
          'Search by OEM part number on malonebelt.com: the buyer types the number on the old belt and gets the belt that fits.',
        quote:
          'The quote form on a phone: product, belt size and urgency, “Machine down now” or “Planned purchase”.',
        design:
          'The Malone Road Belt logo and brochure, designed alongside the site so the store and the sales material look like one company.',
        languages:
          'The Malone Road Belt home in Portuguese, one of its {languages} languages, each with its own address.',
        seo: 'Each product has its own page with its spec table: construction, strength, profile and lead time.',
        analytics:
          'Each quote sent from this form counts as a conversion, so the client sees week by week how many requests the site brings in.',
      },
      page: {
        meta: {
          title: 'Malone Road Belt case: catalog and quote system | Alejandro Hernández',
          description:
            'How I built the catalog, the OEM part-number search and the quote requests of Malone Road Belt, a U.S. industrial belt supplier, in English, Portuguese and Spanish.',
          ogImageAlt: 'Malone Road Belt case · Alejandro Hernández',
        },
        breadcrumb: { label: 'Breadcrumb', home: 'Home', work: 'Work' },
        hero: {
          title: 'From phone quotes to online quote requests',
          summary:
            'Malone Road Belt sells conveyor belts for mobile material processing equipment in the U.S. I designed and built its catalog, its search by machine or OEM part number and its quote request form, in 3 languages.',
          facts: [
            { label: 'Client', value: 'Malone Road Belt' },
            { label: 'Industry', value: 'Industrial conveyor belts' },
            { label: 'Market', value: 'U.S.' },
            { label: 'Scope', value: 'Phase 1: catalog, search and quote requests' },
            { label: 'Timeline', value: '{weeks} weeks' },
            { label: 'Live since', value: '{launched}' },
          ],
        },
        results: {
          title: 'Results',
          items: [
            { figure: 'quotes', label: 'quote requests since Aug 27, 2026' },
            { figure: 'products', label: 'products in {categories} ranges' },
            { figure: 'oemBrands', label: 'OEM brands and {machines} machines in the search' },
            { figure: 'languages', label: 'languages: English, Portuguese and Spanish' },
          ],
          source: {
            catalog: 'Catalog figures from malonebelt.com, October 2026.',
            quotes: 'Quote requests from the site’s analytics.',
          },
        },
        overview: {
          title: 'Overview',
          client: {
            label: 'Client',
            value:
              'Malone Road Belt supplies OEM-spec conveyor belts for mobile crushers, screens and recycling equipment, shipped from stock in the U.S.',
          },
          problem: {
            label: 'Problem',
            value:
              'Buyers usually have a machine model or an OEM part number, not a belt spec. Without a catalog they could search, getting a price meant a call or an email.',
          },
          role: {
            label: 'My role',
            value:
              'Design and development of the site, plus the brand: logo, brochure and product video.',
          },
          stackLabel: 'Stack',
        },
        beforeAfter: {
          title: 'Before and after',
          lead: 'How a buyer got a price, before and after the new site.',
          // REVIEW(R-08): process before the site (no archive.org snapshot of an older site)
          before: {
            label: 'Before',
            points: [
              'To learn the price and availability of a belt, buyers had to call or email.',
              'They couldn’t search by the machine model or OEM part number they already had.',
              'Nothing was available in Portuguese or Spanish.',
            ],
          },
          after: {
            label: 'After',
            points: [
              'Buyers find the belt by machine model or OEM part number in seconds.',
              'They request a quote online, at any time, for the product they need and how urgent it is.',
              'The catalog is available in English, Portuguese and Spanish.',
            ],
          },
        },
        features: {
          title: 'What I built',
          items: {
            // Internally "BeltMatch"; on the site it reads “Find my belt”
            search: {
              title: 'Belt finder by machine or OEM part number',
              body: 'Buyers enter the machine model or the OEM part number they already have, and the finder takes them to the belt that fits.',
            },
            quote: {
              title: 'Quote request with urgency',
              body: 'One form for the product, the belt size and how urgent it is: “Machine is down now” or “Planned purchase”. Each request reaches the sales inbox by email.',
            },
            languages: {
              title: 'English, Portuguese and Spanish',
              body: 'Every page, product and form exists in 3 languages, each with its own URL, so buyers and search engines land on the right one.',
            },
            catalog: {
              title: 'Catalog and spec sheets',
              body: '{products} belts in {categories} ranges, each with its spec table: construction, tensile rating, profile and lead time.',
            },
            analytics: {
              title: 'Quote analytics',
              body: 'Every quote sent counts as a conversion, so the client sees how many requests the site brings in, week by week.',
            },
            brand: {
              title: 'Brand: logo and brochure',
              body: 'I also designed the logo, the printed brochure and a short product video, so the site and the sales material look like one company.',
            },
          },
        },
        closing: {
          title: 'Still quoting by phone?',
          body: 'In a 15-minute call we look at how your buyers ask for prices today and whether a prototype makes sense.',
          cta: 'Book a 15-minute call',
        },
        next: {
          label: 'Next',
          title: 'Services',
          body: 'What your store includes, shown on real work.',
        },
      },
    },
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
        title: 'Free prototype',
        body: 'A clickable version of your site with your real products, with no commitment.',
        duration: '5 business days',
      },
      {
        title: 'Build in phases',
        body: 'Short phases you approve one at a time.',
        duration: '3–6 weeks · 40/40/20', // REVIEW(F0-10): confirm the 3–6 week range
      },
      {
        title: 'Launch',
        body: 'Your store goes live on your own domain and hosting.',
        duration: 'On your domain',
      },
      {
        title: 'Monthly plan',
        body: 'Care and visibility after launch, if you want it.',
        duration: 'Optional',
      },
    ],
    weeklyUpdate: 'Every Friday you get an update.',
    changes: '3 rounds of changes per phase.',
  },
  pricing: {
    title: 'Starting prices',
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
    cta: 'Get your free prototype',
    faqLink: 'Questions about payments and timing',
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
    title: 'You work directly with me',
    lead: 'I’m Alejandro, a software engineer and project lead. I design and build online stores, catalogs and quote systems for businesses that sell products, and I’m the person you talk to from the first call to launch.',
    facts: [
      { label: 'Based in', value: 'Colombia · UTC−5' },
      { label: 'Languages', value: 'English and Spanish' },
      { label: 'Replies', value: 'Within 1 business day' },
      { label: 'Experience', value: '4+ years building software' },
      // REVIEW(R-08): confirm "brand" means the logo, and that the video is the 49 s teaser
      {
        label: 'Design',
        value: 'I also designed Malone Road Belt’s logo, brochure and product video',
      },
    ],
    photo: { alt: 'Alejandro Hernández' },
  },
  // The home summary and the About page
  aboutTeaser: {
    lead: 'I’m Alejandro, a software engineer and project lead in Colombia. I design and build your store myself, and I’m the person you talk to from the first call to launch.',
    stepsLabel: 'How I work',
    pricesLabel: 'Starting prices',
    cta: 'More about me and how I work',
    pricingLink: 'See all prices',
  },
  // In the place of the prices while they are hidden (ADR-025)
  linkedin: {
    title: 'Get to know me',
    body: 'My background as a software engineer and project lead is on LinkedIn, so you know who you’ll work with before the first call.',
    cta: 'See my LinkedIn profile',
    newTab: '(opens in a new tab)',
  },
  aboutPage: {
    // Without the prices; mention them again when site.features.pricing returns
    meta: {
      title: 'About me and how I work | Alejandro Hernández',
      description:
        'Who builds your store, and how a project runs from the free prototype to launch.',
    },
    breadcrumb: { label: 'Breadcrumb', home: 'Home' },
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
    navLabel: 'Footer',
    caseLink: '{name} case',
    linkedin: 'LinkedIn',
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
