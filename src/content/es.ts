import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2. Everything else is a draft to review in
// F0-10; answers and lines marked TODO(F0-10) need your input before launch.
export const es = {
  meta: {
    title: 'Alejandro Hernández · Tiendas y catálogos en línea con cotizador',
    description:
      'Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ves un prototipo funcionando en 5 días, antes de comprometerte con el proyecto completo.',
    ogImageAlt: 'De "precio por interno" a "agregar al carrito" · Alejandro Hernández',
  },
  nav: { bookCall: 'Agenda', switchLanguage: 'English', skipToContent: 'Saltar al contenido' },
  hero: {
    headlines: {
      a: 'De "precio por interno" a "agregar al carrito".',
      b: 'Tu sitio debería recibir pedidos, no solo verse bien.',
      c: 'Ve tu nueva tienda funcionando en 5 días.',
    },
    subtitle:
      'Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ves un prototipo funcionando en 5 días, antes de comprometerte con el proyecto completo.',
    primaryCta: 'Agenda una llamada de 15 minutos',
    secondaryCta: {
      caseNamed: 'Ver el caso de Malone Road Belt',
      caseAnonymized: 'Ver el caso del proveedor industrial',
      demo: 'Prueba la tienda demo',
    },
    trustLine: {
      named: 'Construí el catálogo y el cotizador de Malone Road Belt, en Kentucky.',
      anonymized: 'Construí el catálogo y el cotizador de un proveedor industrial de EE. UU.',
    },
    stage: {
      linkTitle: 'Ver el caso',
      customerMessage: 'Hola, ¿precio del bulto de…?',
      businessReply: 'Precio por interno',
      product: {
        brand: 'TODO(F0-12)',
        name: 'TODO(F0-12)',
        price: { us: 'US$ 14,90', co: 'COP 62.000' },
        unit: '/ unidad',
        qtyLabel: 'Cant.',
      },
      addToCart: 'Agregar al carrito',
      orderReceived: 'Pedido recibido · Entrega el jueves',
    },
  },
  solves: {
    title: 'Qué resuelvo',
    items: [
      {
        icon: 'search',
        title: 'Que te encuentren',
        body: 'En Google y en las respuestas de IA, con páginas que dicen claramente qué vendes.',
      },
      {
        icon: 'star',
        title: 'Que te elijan',
        body: 'Un catálogo claro y reseñas reales, para que confíen antes de llamar.',
      },
      {
        icon: 'cart',
        title: 'Que te compren o coticen',
        body: 'Carrito, cotizador o WhatsApp: el cliente actúa sin esperar a que lo llamen.',
      },
    ],
  },
  caseMrb: {
    title: {
      named: 'Malone Road Belt: de cotizar por teléfono a recibir solicitudes en línea',
      anonymized: 'Un proveedor industrial: de cotizar por teléfono a recibir solicitudes en línea',
    },
    summary: {
      named: 'TODO(F0-10): una o dos líneas sobre el proyecto de Malone Road Belt.',
      anonymized: 'TODO(F0-10): una o dos líneas sobre el proyecto, sin identificar al cliente.',
    },
    before: {
      label: 'Antes',
      points: ['TODO(F0-10): con qué se encontraban los compradores antes del sitio nuevo.'],
      images: { named: [], anonymized: [] },
    },
    after: {
      label: 'Después',
      points: ['TODO(F0-10): qué pueden hacer ahora.'],
      images: { named: [], anonymized: [] },
    },
    built: ['Catálogo de productos', 'Buscador por referencia OEM', 'Tres idiomas', 'Cotizador'],
    link: { label: 'Visitar malonebelt.com', href: 'https://malonebelt.com' },
  },
  demo: {
    title: 'Pruébala: no es una captura',
    body: 'Agrega algo al carrito y paga en modo prueba.',
    cta: 'Prueba la tienda demo',
    posterAlt: 'Tienda demo de un distribuidor ficticio',
  },
  process: {
    title: 'Cómo trabajo',
    steps: [
      {
        title: 'Prototipo en 5 días hábiles',
        body: 'Una versión navegable de tu sitio, descontable del proyecto.',
      },
      { title: 'Construcción por fases', body: 'Fases cortas que apruebas una por una.' },
      { title: 'Lanzamiento', body: 'Tu tienda sale al aire con tu propio dominio y hosting.' },
      {
        title: 'Plan mensual',
        body: 'Cuidado y visibilidad después del lanzamiento, si lo quieres.',
      },
    ],
    weeklyUpdate: 'Cada viernes recibes una actualización.',
  },
  pricing: {
    title: 'Servicios y precios de referencia',
    note: 'Precios de referencia; el valor final depende del alcance.',
    currencyToggle: { label: 'Moneda', usd: 'USD', cop: 'COP' },
    plans: [
      {
        name: 'Prototipo navegable en 5 días hábiles',
        description:
          'Ves tu sitio funcionando antes de comprometerte. Es descontable del proyecto.',
        price: {
          us: { kind: 'range', min: 350, max: 500 },
          co: { kind: 'range', min: 800_000, max: 1_200_000 },
        },
        features: ['TODO(F0-10): qué incluye el prototipo'],
      },
      {
        name: 'Tienda o catálogo con cotizador',
        description: 'TODO(F0-10): para quién es.',
        price: { us: { kind: 'from', amount: 3_000 }, co: { kind: 'from', amount: 3_000_000 } },
        features: ['TODO(F0-10): qué incluye la construcción'],
      },
      {
        name: 'Plan mensual de cuidado y visibilidad',
        description: 'TODO(F0-10): para quién es.',
        price: {
          us: { kind: 'range', min: 150, max: 300, period: 'month' },
          co: { kind: 'range', min: 250_000, max: 500_000, period: 'month' },
        },
        features: ['TODO(F0-10): qué incluye el plan'],
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿El dominio y el hosting quedan a mi nombre?', a: 'TODO(F0-10)' },
      { q: '¿Cuánto tarda el proyecto?', a: 'TODO(F0-10)' },
      { q: '¿Cómo son los pagos?', a: 'TODO(F0-10)' },
      { q: '¿Cuántas rondas de cambios incluye?', a: 'TODO(F0-10)' },
      { q: '¿Qué pasa si después del prototipo no seguimos?', a: 'TODO(F0-10)' },
      { q: '¿Trabajas con mi plataforma actual (Shopify, WooCommerce, Wix)?', a: 'TODO(F0-10)' },
      { q: '¿Cómo nos comunicamos y en qué horario?', a: 'TODO(F0-10)' },
      { q: '¿Qué necesito tener listo (catálogo, fotos, precios)?', a: 'TODO(F0-10)' },
    ],
  },
  about: {
    title: 'Sobre mí',
    lines: [
      'Ingeniero de software y líder de proyectos con más de 4 años de experiencia.',
      'TODO(F0-10): segunda línea.',
      'TODO(F0-10): tercera línea.',
    ],
    photo: {
      src: '/images/about/portrait.webp',
      width: 800,
      height: 800,
      alt: 'Alejandro Hernández',
    },
  },
  closing: {
    title: 'Hablemos de tu tienda',
    body: 'Una llamada de 15 minutos para ver si un prototipo tiene sentido para tu negocio.',
    bookCall: 'Agenda una llamada de 15 minutos',
    whatsapp: {
      label: 'WhatsApp',
      prefilledMessage: 'Hola Alejandro, vi tu sitio y quiero hablar de mi tienda o catálogo.',
    },
    email: { label: 'Correo', subject: 'Tienda o catálogo en línea' },
  },
  contactForm: {},
  footer: {
    addressLabel: 'Dirección postal',
    privacy: 'Política de privacidad',
    rights: 'Todos los derechos reservados.',
  },
  notFound: {
    title: 'Página no encontrada',
    body: 'La página que buscas no existe o cambió de dirección.',
    backHome: 'Ir al sitio en español',
  },
} satisfies SiteContent
