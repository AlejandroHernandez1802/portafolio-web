import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2, plus F0-10 drafts. Lines marked
// REVIEW(F0-10) are facts to confirm before launch.
export const es = {
  meta: {
    title: 'Tiendas y catálogos con cotizador | Alejandro Hernández',
    description:
      'Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ve un prototipo funcionando en 5 días.',
    ogImageAlt: 'De “precio por interno” a “agregar al carrito” · Alejandro Hernández',
  },
  nav: {
    tagline: 'Tiendas y catálogos en línea',
    bookCall: 'Agenda',
    switchLanguage: 'English',
    skipToContent: 'Saltar al contenido',
  },
  hero: {
    headlines: {
      a: 'De “precio por interno” a “agregar al carrito”.',
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
      customerMessage: 'Hola, ¿precio de 20 correas B48?',
      businessReply: 'Precio por interno',
      product: {
        // REVIEW(F0-12): verify the fictitious brand doesn't exist (Google, USPTO, SIC)
        brand: 'Norvale Supply',
        name: 'Correa en V B48',
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
    // REVIEW(F0-10): confirm the before/after facts with the real project
    summary: {
      named:
        'Malone Road Belt vende correas industriales en EE. UU. Sus compradores tenían que llamar o escribir para conocer un precio. Ahora encuentran la pieza y piden la cotización en línea.',
      anonymized:
        'Un proveedor industrial de EE. UU. cuyos compradores tenían que llamar o escribir para conocer un precio. Ahora encuentran la pieza y piden la cotización en línea.',
    },
    before: {
      label: 'Antes',
      points: [
        'Para saber el precio y la disponibilidad de una pieza había que llamar o escribir.',
        'No se podía buscar por la referencia que el comprador ya tenía.',
        'El sitio estaba en un solo idioma.',
      ],
      images: { named: [], anonymized: [] },
    },
    after: {
      label: 'Después',
      points: [
        'El comprador encuentra la pieza por su referencia OEM en segundos.',
        'Pide la cotización en línea, a cualquier hora, con las piezas exactas.',
        'El catálogo está disponible en tres idiomas.',
      ],
      images: { named: [], anonymized: [] },
    },
    builtLabel: 'Qué se construyó',
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
        body: 'Una versión navegable de tu sitio, gratis y sin compromiso.',
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
    priceLabels: { from: 'Desde', perMonth: '/ mes', free: 'Gratis' },
    plans: [
      {
        name: 'Prototipo navegable en 5 días hábiles',
        description: 'Ves tu sitio funcionando antes de comprometerte. Sin costo ni compromiso.',
        price: { us: { kind: 'free' }, co: { kind: 'free' } },
        features: [
          'Página de inicio y una página de catálogo o producto',
          'Tus productos reales, tu logo y tus colores',
          'Funciona en celular y computador',
          'Una llamada para revisarlo juntos',
        ],
      },
      {
        name: 'Tienda o catálogo con cotizador',
        description: 'Para negocios que venden productos y todavía cotizan por teléfono o correo.',
        price: { us: { kind: 'from', amount: 3_000 }, co: { kind: 'from', amount: 3_000_000 } },
        features: [
          'Catálogo con buscador y filtros, también por referencia',
          'Carrito o cotizador, con las solicitudes en tu correo',
          'Páginas rápidas que Google entiende',
          'Dominio, hosting y cuentas a tu nombre',
        ],
      },
      {
        name: 'Plan mensual de cuidado y visibilidad',
        description: 'Para tiendas que quieren seguir mejorando después del lanzamiento.',
        price: {
          us: { kind: 'range', min: 150, max: 300, period: 'month' },
          co: { kind: 'range', min: 250_000, max: 500_000, period: 'month' },
        },
        features: [
          'Actualizaciones, copias de seguridad y parches de seguridad',
          'Cambios pequeños de contenido cada mes',
          'Informe mensual de visitas, cotizaciones y pedidos',
          'Perfil de Google Business y solicitud de reseñas',
        ],
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿El dominio y el hosting quedan a mi nombre?',
        a: 'Sí. El dominio, el hosting y todas las cuentas se crean a tu nombre, y yo trabajo con los accesos que me des. Si dejamos de trabajar juntos, todo sigue siendo tuyo.',
      },
      {
        // REVIEW(F0-10): confirm the 3–6 week range
        q: '¿Cuánto tarda el proyecto?',
        a: 'El prototipo toma 5 días hábiles. Una tienda o catálogo típico toma de 3 a 6 semanas después de que apruebas el prototipo, según la cantidad de productos y funciones.',
      },
      {
        q: '¿Cómo son los pagos?',
        a: '40 % al iniciar la construcción, 40 % cuando apruebas el primer avance y 20 % al publicar. El prototipo es gratis.',
      },
      {
        q: '¿Cuántas rondas de cambios incluye?',
        a: 'Tres rondas de cambios por fase. Lo que pase de ahí, o una función nueva, se cotiza antes de hacerlo.',
      },
      {
        q: '¿Qué pasa si después del prototipo no seguimos?',
        a: 'Nada. El prototipo es gratis y no te compromete: si no es lo que buscas, no me debes nada.',
      },
      {
        q: '¿Trabajas con mi plataforma actual (Shopify, WooCommerce, Wix)?',
        a: 'Construyo tu sitio nuevo con mis propias herramientas, que son rápidas y baratas de mantener. Si hoy usas Shopify, WooCommerce o Wix, paso tu catálogo y tu contenido al sitio nuevo.',
      },
      {
        q: '¿Cómo nos comunicamos y en qué horario?',
        a: 'Por WhatsApp o correo, y con una videollamada corta cuando sirve. Estoy en Colombia y respondo en máximo un día hábil.',
      },
      {
        q: '¿Qué necesito tener listo (catálogo, fotos, precios)?',
        a: 'La lista de productos (una hoja de cálculo sirve), fotos si las tienes y tus precios o la forma en que cotizas. Si falta algo, empezamos con lo que haya.',
      },
    ],
  },
  about: {
    title: 'Sobre mí',
    lines: [
      'Ingeniero de software y líder de proyectos con más de 4 años de experiencia.',
      'Diseño y construyo tiendas, catálogos y cotizadores para negocios que venden productos.',
      'Trabajo desde Colombia con clientes en EE. UU. y Latinoamérica, en inglés y en español.',
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
  // REVIEW(F0-14): draft based on docs/09 §6; confirm before launch
  privacy: {
    meta: {
      title: 'Política de privacidad | Alejandro Hernández',
      description: 'Cómo este sitio recoge, usa y protege los datos personales.',
    },
    title: 'Política de privacidad',
    effectiveLabel: 'Fecha de vigencia',
    sections: [
      {
        heading: 'Responsable del tratamiento',
        paragraphs: [
          '{name} es el responsable de los datos personales que se recogen en este sitio. Dirección postal: {address}. Correo: {email}. WhatsApp: {whatsapp}.',
        ],
      },
      {
        heading: 'Datos que se recogen',
        paragraphs: [
          'Al agendar una llamada: tu nombre, correo, sitio web de la empresa, notas y autorización, a través de Cal.com.',
          'Por WhatsApp y correo: tu número o dirección y los mensajes que envías.',
          'Analítica: páginas visitadas, clics en botones, país, navegador y etiquetas de campaña, a través de Umami. Umami no usa cookies ni guarda datos personales.',
          'Hosting: Cloudflare procesa datos técnicos de cada solicitud, como la dirección IP y el navegador, para servir y proteger el sitio.',
        ],
      },
      {
        heading: 'Finalidades',
        paragraphs: [
          'Agendar y preparar llamadas, responder tus mensajes, enviarte las propuestas que pidas y medir cómo se usa el sitio. Tus datos no se venden ni se usan para publicidad.',
        ],
      },
      {
        heading: 'Autorización',
        paragraphs: [
          'Al agendar una llamada autorizas el tratamiento de tus datos marcando una casilla que no viene marcada. Puedes revocar la autorización en cualquier momento escribiendo a {email}.',
        ],
      },
      {
        heading: 'Encargados y transmisión internacional',
        paragraphs: [
          'Cloudflare (hosting), Umami (analítica), Cal.com (agenda), Google (calendario, videollamadas y correo) y Meta (WhatsApp) tratan datos por cuenta mía, principalmente en Estados Unidos. Tu autorización cubre esta transmisión.',
        ],
      },
      {
        heading: 'Conservación',
        paragraphs: [
          'Datos de reservas y contacto: hasta 24 meses, o hasta que pidas su supresión. Datos de analítica: 6 meses.',
        ],
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          'Puedes conocer, actualizar, rectificar y suprimir tus datos, pedir prueba de la autorización, saber cómo se usan y revocar la autorización, de forma gratuita, escribiendo a {email}.',
          'Las consultas se responden en 10 días hábiles y los reclamos en 15 días hábiles. También puedes presentar una queja ante la Superintendencia de Industria y Comercio (SIC).',
        ],
      },
      {
        heading: 'Cookies, almacenamiento local y "Do Not Track"',
        paragraphs: [
          'Este sitio no usa cookies. Guarda la moneda que elijas en el almacenamiento local de tu navegador y las etiquetas de campaña de tu visita en el almacenamiento de sesión. Ninguna sale de tu navegador, salvo la etiqueta de campaña en los eventos de analítica.',
          'El sitio no te rastrea en otros sitios, así que trata igual cada visita, envíe o no tu navegador la señal "Do Not Track".',
        ],
      },
      {
        heading: 'Seguridad',
        paragraphs: [
          'El sitio se sirve solo por HTTPS, y las cuentas que guardan tus datos están protegidas con verificación en dos pasos.',
        ],
      },
      {
        heading: 'Menores de edad',
        paragraphs: [
          'Este sitio no está dirigido a menores de edad y no recoge sus datos a sabiendas.',
        ],
      },
      {
        heading: 'Cambios a esta política',
        paragraphs: [
          'Si esta política cambia, la nueva versión y su fecha de vigencia se publican en esta página.',
        ],
      },
      {
        heading: 'Contacto',
        paragraphs: ['Para cualquier pregunta sobre esta política, escribe a {email}.'],
      },
    ],
    backHome: 'Volver al inicio',
  },
} satisfies SiteContent
