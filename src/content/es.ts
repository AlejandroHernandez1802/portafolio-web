import type { SiteContent } from './types'

// Base texts from the roadmap (§4–§5) and docs/06 §2, plus F0-10 drafts. Lines marked
// REVIEW(F0-10) are facts to confirm before launch; REVIEW(R-08) marks the copy of the
// restructure (docs/14 ADR-020) that the owner confirms, mostly claims about the MRB case.
// Case figures are placeholders like {products}, filled from content/cases.ts (lib/cases.ts).
export const es = {
  meta: {
    title: 'Tiendas y catálogos con cotizador | Alejandro Hernández',
    description:
      'Diseño y construyo tiendas y catálogos con cotizador para negocios que venden productos. Ve un prototipo funcionando en 5 días.',
    ogImageAlt:
      '¿Sin página web o con una desactualizada? Pasa de “precio por interno” a “agregar al carrito” · Alejandro Hernández',
  },
  nav: {
    tagline: 'Tiendas y catálogos en línea',
    bookCall: 'Agenda',
    bookCallFull: 'Agenda una llamada',
    switchLanguage: 'English',
    skipToContent: 'Saltar al contenido',
    label: 'Principal',
    links: { work: 'Trabajo', services: 'Servicios', about: 'Sobre mí' },
    // The dropdowns of the bar (docs/14 ADR-024)
    groups: {
      work: { all: 'Todo el trabajo' },
      services: { all: 'Todos los servicios, con ejemplos' },
      about: {
        intro: {
          title: 'Quién soy',
          body: 'Con quién trabajas, desde la primera llamada hasta el lanzamiento.',
        },
        process: {
          title: 'Cómo trabajo',
          body: 'Prototipo gratis, construcción por fases, lanzamiento y plan mensual.',
        },
        pricing: { title: 'Precios', body: 'Precios de referencia en USD o COP.' },
        // In the place of pricing while the prices are hidden (ADR-025)
        linkedin: { title: 'LinkedIn', body: 'Mi trayectoria y experiencia, en mi perfil.' },
      },
    },
    menu: { open: 'Menú', close: 'Cerrar', label: 'Menú del sitio' },
  },
  hero: {
    headlines: {
      // Text before the first quote ending in “?” is the audience line, set above (HeroHeadline)
      a: '¿Sin página web o con una desactualizada? Pasa de “precio por interno” a “agregar al carrito”.',
      b: 'Tu sitio debería recibir pedidos, no solo verse bien.',
      c: 'Ve tu nueva tienda funcionando en 5 días.',
    },
    subtitle:
      'Diseño y construyo tiendas y catálogos con cotizador para negocios que venden productos. Ves un prototipo funcionando en 5 días, antes de comprometerte con el proyecto completo.',
    primaryCta: 'Agenda una llamada de 15 minutos',
    secondaryCta: {
      case: 'Ver el caso de Malone Road Belt',
      demo: 'Prueba la tienda demo',
    },
    trustLine: 'Trabajas directamente conmigo · Colombia, UTC−5',
    figures: {
      label: 'En cifras',
      items: [
        // REVIEW(R-08): the OEM brand count stands in until cases.ts has the quote count
        {
          kind: 'fact',
          value: '{quotes}',
          label: 'solicitudes de cotización en Malone Road Belt desde el 27 de agosto',
          // REVIEW(R-08): 29 brand names on the malonebelt.com home strip; the plan said 30
          fallback: { value: '{oemBrands}', label: 'marcas OEM que cubre malonebelt.com' },
        },
        {
          kind: 'fact',
          value: '{languages} idiomas',
          label: '{products} productos en malonebelt.com',
        },
        { kind: 'fact', value: '5 días hábiles', label: 'para ver tu prototipo navegable, gratis' },
        {
          kind: 'price',
          label: 'por una tienda o catálogo con cotizador',
          // Shown while the prices are hidden (ADR-025)
          fallback: { value: '100 %', label: 'del dominio, el hosting y las cuentas, a tu nombre' },
        },
      ],
    },
    showcase: { label: 'Trabajo real · malonebelt.com' },
  },
  // The home summary of the work page (ADR-025)
  work: {
    title: 'Trabajo reciente',
    lead: 'Diseño y construyo catálogos, cotizadores y tiendas en línea para negocios que venden productos, desde la marca y la interfaz hasta el sitio publicado en tu dominio. Cada proyecto tiene su caso completo.',
    categoriesLabel: 'Qué he construido',
    categories: {
      catalog: 'Catálogos de productos',
      quote: 'Cotizadores en línea',
      store: 'Tiendas con carrito y pago',
      languages: 'Sitios en varios idiomas',
      design: 'Diseño web y de marca',
    },
    industriesLabel: 'Industrias',
    projectsLabel: 'Proyectos',
    allWork: 'Ver todo mi trabajo',
    card: {
      viewCase: 'Ver el caso completo',
      builtLabel: 'Qué construí',
      demoBadge: 'Demo · proyecto propio',
      nextCase: 'Siguiente caso',
    },
  },
  services: {
    title: 'Qué incluye tu tienda',
    // Design joins the services (ADR-025)
    lead: 'Lo que necesita tu negocio para que lo encuentren, lo elijan y le compren o pidan cotización, diseñado y construido alrededor de tu catálogo.',
    tiles: {
      // For any catalog, not only industrial parts
      catalog: {
        outcome: 'Que te elijan',
        title: 'Catálogo con búsqueda y filtros',
        body: 'Tu cliente encuentra el producto exacto por nombre, referencia o categoría, y ve fichas y fotos antes de escribirte.',
        proof: '{products} productos en Malone Road Belt',
      },
      quote: {
        outcome: 'Que te compren o coticen',
        title: 'Cotizador o carrito',
        body: 'Cotizador, carrito o WhatsApp: tu cliente actúa sin esperar a que lo llamen, y cada solicitud llega a tu correo.',
      },
      design: {
        outcome: 'Que te recuerden',
        title: 'Diseño de tu sitio y tu marca',
        body: 'Un diseño hecho para tu negocio, no una plantilla: la interfaz de tu tienda y, si lo necesitas, tu logo y tu material de ventas, para que todo se vea como una sola empresa.',
        proof: 'Sitio, logo y folleto de Malone Road Belt',
      },
      languages: {
        outcome: 'Que te entiendan', // REVIEW(R-08): new label
        title: 'Varios idiomas',
        body: 'Inglés, español o portugués, cada uno con sus páginas, para que cada cliente te lea en su idioma.',
        proof: '{languages} idiomas en Malone Road Belt',
      },
      seo: {
        outcome: 'Que te encuentren',
        title: 'Google y respuestas de IA',
        body: 'Páginas rápidas que dicen claramente qué vendes, con los datos estructurados que leen los buscadores y los asistentes de IA.',
        list: [
          'Páginas de producto',
          'Datos estructurados',
          'Sitemap y hreflang',
          'Perfil de Google Business',
        ],
      },
      analytics: {
        outcome: 'Que sepas qué te piden', // REVIEW(R-08): new label
        title: 'Analítica de cotizaciones',
        body: 'Ves cuántas cotizaciones y pedidos trae el sitio, y por qué productos te preguntan.',
        // REVIEW(R-08): new list, restates the body
        list: [
          'Solicitudes de cotización por semana',
          'Pedidos, si vendes en línea',
          'Productos por los que te preguntan',
        ],
      },
      care: {
        outcome: 'Que siga mejorando', // REVIEW(R-08): new label
        title: 'Plan mensual de cuidado',
        body: 'Actualizaciones, copias de seguridad, cambios pequeños y un informe mensual, para que la tienda siga funcionando mientras vendes.',
      },
    },
    ownership: 'Dominio, hosting y cuentas a tu nombre.',
    pricingLink: 'Ver precios',
    processLink: 'Ver cómo trabajo',
    allServices: 'Ver cada servicio con ejemplos',
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
  // The work page (ADR-025)
  workPage: {
    meta: {
      title: 'Trabajo: casos de tiendas y catálogos | Alejandro Hernández',
      description:
        'Los proyectos que he diseñado y construido, cada uno con su caso completo: el problema, lo que construí y los resultados.',
    },
    breadcrumb: { label: 'Ruta de navegación', home: 'Inicio' },
    title: 'Trabajo, caso por caso',
    // REVIEW(R-08)
    lead: {
      one: 'Un proyecto, mostrado completo: el catálogo con cotizador que construí para un proveedor de correas industriales en EE.\u00a0UU., en línea desde agosto de 2026.',
      // Shown once a demo store joins cases.ts
      many: 'Trabajo para clientes y tiendas demo que construyo para mostrar lo que es posible, cada uno con su caso completo.',
    },
  },
  // The services page, with design and the global catalog (ADR-024, ADR-025)
  servicesPage: {
    meta: {
      title: 'Servicios: diseño y desarrollo de tiendas y catálogos | Alejandro Hernández',
      description:
        'Catálogo con búsqueda y filtros, cotizador o carrito, diseño de tu sitio y tu marca, varios idiomas, Google y respuestas de IA, analítica y plan mensual de cuidado, con ejemplos reales.',
    },
    breadcrumb: { label: 'Ruta de navegación', home: 'Inicio' },
    title: 'Servicios, con ejemplos reales',
    lead: 'Siete partes que convierten tu catálogo en un sitio donde te encuentran, te entienden y te piden, diseñado para tu marca. Cada una con lo que incluye y, donde ya está en línea, un ejemplo real.',
    indexLabel: 'Servicios en esta página',
    includedLabel: 'Qué incluye',
    exampleLabel: { client: 'Ejemplo real · {name}', demo: 'Demo · {name}' },
    viewCase: 'Ver el caso completo',
    items: {
      catalog: {
        intro:
          'Tu cliente llega sabiendo qué necesita, aunque no sepa cómo se llama en tu catálogo. Lo busca por nombre, por referencia o por categoría, y los filtros y las fichas con fotos lo llevan al producto correcto sin tener que llamar.',
        included: [
          'Búsqueda por nombre, referencia o categoría',
          'Filtros por categoría y características',
          'Una página por producto, con su ficha y fotos',
          'Catálogo cargado desde tu hoja de cálculo',
        ],
      },
      quote: {
        intro:
          'Algunos productos tienen precio fijo y van al carrito; otros necesitan cotización. Tú eliges por producto: un formulario que pide lo que necesitas para responder, un carrito con pago en línea o un botón de WhatsApp con el producto ya escrito en el mensaje.',
        included: [
          'Cotizador con los campos que hoy pides por teléfono',
          'Carrito y pago en línea, si vendes con precio fijo',
          'WhatsApp con el producto en el mensaje',
          'Cada solicitud en tu correo, con el producto y los datos del comprador',
        ],
      },
      design: {
        intro:
          'Antes de construir, diseño cómo se ve y cómo se usa tu sitio: colores, tipografía, páginas de producto y formularios, pensados para tus clientes y no tomados de una plantilla. Si tu marca necesita ponerse al día, también diseño el logo y el material de ventas, para que el sitio y lo que entregas en mano cuenten lo mismo.',
        included: [
          'Diseño de la interfaz a medida, sin plantillas',
          'Pensado primero para celular, y también para computador',
          'Logo e identidad de marca, si los necesitas',
          'Folletos y material de ventas con la misma imagen',
        ],
      },
      languages: {
        intro:
          'Cada idioma tiene sus propias páginas y su dirección (/en, /es, /pt), no un traductor automático, para que cada comprador te lea en su idioma y los buscadores muestren la versión correcta en cada país.',
        included: [
          'Inglés, español o portugués',
          'Una dirección propia por idioma, con hreflang',
          'Cada página, producto y formulario traducido',
          'Cambio de idioma en todas las páginas',
        ],
      },
      seo: {
        intro:
          'Cada producto tiene su propia página, con un título, una descripción y una ficha claros, para que quien busca una referencia llegue a ella. Se hace desde la primera página, no se agrega después, y es también lo que leen los asistentes de IA cuando responden sobre un producto.',
        included: [
          'Una página por producto, con su propio título y descripción',
          'Datos estructurados de tus productos y tu negocio',
          'Sitemap, hreflang y Search Console',
          'Perfil de Google Business configurado',
        ],
      },
      analytics: {
        intro:
          'Ves cuántas cotizaciones y pedidos trae el sitio cada semana, y por qué productos te preguntan, con una analítica que respeta la privacidad y no necesita aviso de cookies.',
        included: [
          'Cada cotización o pedido cuenta como conversión',
          'Solicitudes por semana y por producto',
          'De dónde llegan tus visitantes',
          'Un resumen mensual, con el plan de cuidado',
        ],
      },
      care: {
        intro:
          'Después del lanzamiento la tienda sigue funcionando y mejorando: actualizaciones, copias de seguridad, parches de seguridad y cambios pequeños de contenido cada mes, más un informe de visitas, cotizaciones y pedidos.',
        included: [
          'Actualizaciones, copias de seguridad y parches de seguridad',
          'Cambios pequeños de contenido cada mes',
          'Informe mensual de visitas, cotizaciones y pedidos',
          'Perfil de Google Business y solicitud de reseñas',
        ],
      },
    },
    care: { planLabel: 'Plan mensual' },
  },
  cases: {
    // REVIEW(R-08): the whole case copy, against the MRB permission and the live site
    mrb: {
      visitSite: 'Visitar malonebelt.com',
      alts: {
        'mrb/home-desktop':
          'Página de inicio de Malone Road Belt en computador, con el buscador de correas por máquina o referencia OEM',
        'mrb/home-full-desktop':
          'La página de inicio completa de Malone Road Belt, desde el buscador hasta el pie',
        'mrb/home-full-top':
          'La parte de arriba de la página de inicio de Malone Road Belt, con el buscador de correas',
        'mrb/search-desktop': 'Resultados de búsqueda por referencia OEM en malonebelt.com',
        'mrb/product-desktop':
          'Una página de producto de Malone Road Belt con su tabla de especificaciones',
        'mrb/quote-desktop':
          'Formulario de cotización con la urgencia: máquina parada ahora o compra planificada',
        'mrb/home-pt-desktop': 'La página de inicio de Malone Road Belt en portugués',
        'mrb/home-mobile': 'La página de inicio de Malone Road Belt en celular',
        'mrb/product-mobile': 'Una página de producto de Malone Road Belt en celular',
        'mrb/quote-mobile': 'El formulario de cotización de Malone Road Belt en celular',
        'mrb/logo': 'Logo de Malone Road Belt',
        'mrb/brochure': 'Portada del folleto de Malone Road Belt',
        'mrb/brochure-spread': 'Páginas interiores del folleto de Malone Road Belt',
      },
      card: {
        meta: 'Malone Road Belt · Correas industriales · EE.\u00a0UU.',
        industry: 'Correas transportadoras industriales',
        outcome: 'De cotizar por teléfono a recibir solicitudes en línea, en 3 idiomas',
        metrics: [
          { figure: 'quotes', label: 'solicitudes de cotización desde el 27 de agosto' },
          { figure: 'languages', label: 'idiomas: EN, PT, ES' },
          { figure: 'products', label: 'productos que se buscan por máquina o referencia OEM' },
          { figure: 'oemBrands', label: 'marcas OEM cubiertas' },
        ],
        built: ['Catálogo de productos', 'Buscador por referencia OEM', '3 idiomas', 'Cotizador'],
      },
      // Captions of the MRB examples on the services page
      examples: {
        catalog:
          'Búsqueda por referencia OEM en malonebelt.com: el comprador escribe la referencia de la correa vieja y encuentra la que le sirve.',
        quote:
          'El cotizador en celular: producto, medida de la correa y urgencia, “Máquina parada ahora” o “Compra planificada”.',
        design:
          'El logo y el folleto de Malone Road Belt, diseñados junto con el sitio para que la tienda y el material de ventas se vean como una sola empresa.',
        languages:
          'La página de inicio de Malone Road Belt en portugués, uno de sus {languages} idiomas, cada uno con su propia dirección.',
        seo: 'Cada producto tiene su propia página con su ficha técnica: construcción, resistencia, perfil y tiempo de despacho.',
        analytics:
          'Cada cotización enviada desde este formulario cuenta como conversión, así el cliente ve semana a semana cuántas solicitudes trae el sitio.',
      },
      page: {
        meta: {
          title: 'Caso Malone Road Belt: catálogo y cotizador | Alejandro Hernández',
          description:
            'Cómo construí el catálogo, el buscador por referencia OEM y el cotizador de Malone Road Belt, un proveedor de correas industriales de EE.\u00a0UU., en inglés, portugués y español.',
          ogImageAlt: 'Caso Malone Road Belt · Alejandro Hernández',
        },
        breadcrumb: { label: 'Ruta de navegación', home: 'Inicio', work: 'Trabajo' },
        hero: {
          title: 'De cotizar por teléfono a recibir solicitudes en línea',
          summary:
            'Malone Road Belt vende correas transportadoras para equipos móviles de procesamiento de material en EE.\u00a0UU. Diseñé y construí su catálogo, su buscador por máquina o referencia OEM y su formulario de cotización, en 3 idiomas.',
          facts: [
            { label: 'Cliente', value: 'Malone Road Belt' },
            { label: 'Industria', value: 'Correas transportadoras industriales' },
            { label: 'Mercado', value: 'EE.\u00a0UU.' },
            { label: 'Alcance', value: 'Fase 1: catálogo, buscador y cotizador' },
            { label: 'Duración', value: '{weeks} semanas' },
            { label: 'En línea desde', value: '{launched}' },
          ],
        },
        results: {
          title: 'Resultados',
          items: [
            { figure: 'quotes', label: 'solicitudes de cotización desde el 27 de agosto de 2026' },
            { figure: 'products', label: 'productos en {categories} líneas' },
            { figure: 'oemBrands', label: 'marcas OEM y {machines} máquinas en el buscador' },
            { figure: 'languages', label: 'idiomas: inglés, portugués y español' },
          ],
          source: {
            catalog: 'Cifras del catálogo tomadas de malonebelt.com en octubre de 2026.',
            quotes: 'Solicitudes de cotización según la analítica del sitio.',
          },
        },
        overview: {
          title: 'Resumen',
          client: {
            label: 'Cliente',
            value:
              'Malone Road Belt suministra correas transportadoras con especificación OEM para trituradoras, cribas y equipos de reciclaje móviles, despachadas desde inventario en EE.\u00a0UU.',
          },
          problem: {
            label: 'Problema',
            value:
              'El comprador suele tener el modelo de su máquina o una referencia OEM, no la especificación de la correa. Sin un catálogo donde buscar, conocer un precio exigía llamar o escribir.',
          },
          role: {
            label: 'Mi papel',
            value:
              'Diseño y desarrollo del sitio, además de la marca: logo, folleto y video de producto.',
          },
          stackLabel: 'Herramientas',
        },
        beforeAfter: {
          title: 'Antes y después',
          lead: 'Cómo conseguía un precio el comprador, antes y después del sitio nuevo.',
          // REVIEW(R-08): process before the site (no archive.org snapshot of an older site)
          before: {
            label: 'Antes',
            points: [
              'Para saber el precio y la disponibilidad de una correa había que llamar o escribir.',
              'No se podía buscar por el modelo de la máquina ni por la referencia OEM que el comprador ya tenía.',
              'No había nada en portugués ni en español.',
            ],
          },
          after: {
            label: 'Después',
            points: [
              'El comprador encuentra la correa por modelo de máquina o referencia OEM en segundos.',
              'Pide la cotización en línea, a cualquier hora, con el producto que necesita y qué tan urgente es.',
              'El catálogo está disponible en inglés, portugués y español.',
            ],
          },
        },
        features: {
          title: 'Qué construí',
          items: {
            // Internally "BeltMatch"; on the site it reads “Find my belt”
            search: {
              title: 'Buscador por máquina o referencia OEM',
              body: 'El comprador escribe el modelo de su máquina o la referencia OEM que ya tiene, y el buscador lo lleva a la correa que le sirve.',
            },
            quote: {
              title: 'Cotizador con urgencia',
              body: 'Un formulario con el producto, la medida de la correa y la urgencia: “Máquina parada ahora” o “Compra planificada”. Cada solicitud llega por correo al buzón de ventas.',
            },
            languages: {
              title: 'Inglés, portugués y español',
              body: 'Cada página, producto y formulario existe en 3 idiomas, cada uno con su propia dirección, para que compradores y buscadores lleguen a la versión correcta.',
            },
            catalog: {
              title: 'Catálogo y fichas técnicas',
              body: '{products} correas en {categories} líneas, cada una con su tabla de especificaciones: construcción, resistencia, perfil y tiempo de despacho.',
            },
            analytics: {
              title: 'Analítica de cotizaciones',
              body: 'Cada cotización enviada cuenta como conversión, así el cliente ve cuántas solicitudes trae el sitio, semana a semana.',
            },
            brand: {
              title: 'Marca: logo y folleto',
              body: 'También diseñé el logo, el folleto impreso y un video corto de producto, para que el sitio y el material de ventas se vean como una sola empresa.',
            },
          },
        },
        closing: {
          title: '¿Todavía cotizas por teléfono?',
          body: 'En una llamada de 15 minutos vemos cómo te piden precios hoy y si un prototipo tiene sentido para tu negocio.',
          cta: 'Agenda una llamada de 15 minutos',
        },
        next: {
          label: 'Siguiente',
          title: 'Servicios',
          body: 'Qué incluye tu tienda, con ejemplos reales.',
        },
      },
    },
    industrial: {
      visitSite: 'Abrir la demo',
      alts: {
        'industrial/home-desktop':
          'Página de inicio de la demo Industrial Parts en computador, con el buscador por número de parte',
        'industrial/home-full-desktop':
          'La página de inicio completa de la demo Industrial Parts, desde el buscador hasta el pie',
        'industrial/home-full-top':
          'La parte de arriba de la página de inicio de Industrial Parts, con el buscador por número de parte',
        'industrial/home-mobile': 'La página de inicio de Industrial Parts en celular',
        'industrial/search-desktop':
          'La búsqueda de “ab 1234-x” en Industrial Parts: AB-1234-X como coincidencia exacta y AB-1234-XL como número que empieza igual',
        'industrial/search-mobile': 'La misma búsqueda por número de parte, en celular',
        'industrial/product-desktop':
          'La ficha de una bomba de engranajes con sus números OEM, de fabricante y de referencia cruzada, la rotación elegida y el aviso de que se agregó a la cotización',
        'industrial/product-mobile':
          'La tabla de referencias de la bomba y el botón para agregarla a la cotización, en celular',
        'industrial/quote-desktop':
          'La lista de cotización con una bomba, una manguera de 3 m y un número que no está en el catálogo',
        'industrial/miss-mobile':
          'Una búsqueda sin resultados que ofrece agregar el número a la cotización como texto libre, en celular',
      },
      card: {
        meta: 'Industrial Parts · Repuestos hidráulicos · Demo',
        industry: 'Repuestos hidráulicos',
        outcome: 'Encontrar el repuesto con cualquier número y pedir la cotización',
        metrics: [],
        built: ['Buscador por número de parte', 'Referencias cruzadas', 'Lista de cotización'],
      },
      examples: {
        catalog:
          'Búsqueda en la demo Industrial Parts: “ab 1234-x” encuentra AB-1234-X, porque los espacios, los guiones y las mayúsculas no importan.',
        quote:
          'En la ficha de cada repuesto, el comprador elige la opción y la cantidad y lo agrega a su lista de cotización, sin precios ni carrito.',
      },
      page: {
        meta: {
          title: 'Demo Industrial Parts: repuestos por número de parte | Alejandro Hernández',
          description:
            'Una tienda demo de repuestos hidráulicos que construí: buscador por número OEM, de fabricante o de referencia cruzada, fichas con sus referencias y lista de cotización.',
          ogImageAlt: 'Demo Industrial Parts · Alejandro Hernández',
        },
        breadcrumb: { label: 'Ruta de navegación', home: 'Inicio', work: 'Trabajo' },
        hero: {
          title: 'Encontrar el repuesto con el número que ya tienes',
          summary:
            'Industrial Parts es una tienda demo de repuestos hidráulicos que construí para mostrar cómo vende en línea un mostrador de repuestos: el comprador busca por el número de la placa, ve la ficha con todas sus referencias y pide la cotización. La marca es ficticia y no se cobra ni se despacha nada.',
          facts: [
            { label: 'Tipo', value: 'Demo · proyecto propio' },
            { label: 'Industria', value: 'Repuestos hidráulicos' },
            { label: 'Comprador', value: 'Talleres y flotas' },
            { label: 'Venta', value: 'Solo por cotización' },
            { label: 'Idioma', value: 'Inglés' },
          ],
        },
        tryIt: {
          title: 'Pruébalo',
          lead: 'La demo está en línea. Estas tres pruebas toman unos dos minutos.',
          steps: [
            {
              title: 'Busca “ab 1234-x”',
              body: 'Escrito así, con espacio y en minúsculas, encuentra AB-1234-X. Prueba también 4471 para ver los números que empiezan igual.',
              cta: 'Buscar el número',
            },
            {
              title: 'Arma el pedido',
              body: 'Abre la bomba de engranajes de 16 cc, elige la rotación y la cantidad, y agrégala a la lista de cotización.',
              cta: 'Abrir la bomba',
            },
            {
              title: 'Pide algo que no está',
              body: 'En la lista de cotización, escribe un número que no esté en el catálogo: entra como una línea más, con su cantidad.',
              cta: 'Abrir la lista de cotización',
            },
          ],
          note: 'Es una tienda de demostración: no se cobra ni se despacha nada.',
        },
        overview: {
          title: 'Resumen',
          client: {
            label: 'Proyecto',
            value:
              'Una tienda propia para mostrar cómo vende en línea un proveedor de repuestos hidráulicos: 8 productos en 4 categorías, de bombas a mangueras, todos con precio a cotizar.',
          },
          problem: {
            label: 'Problema',
            value:
              'El mecánico tiene el número de la placa, pero cada fabricante lo escribe a su manera y el catálogo lo tiene con otro formato. Si la búsqueda no lo encuentra, llama, y si nadie contesta, compra en otra parte.',
          },
          role: {
            label: 'Mi papel',
            value:
              'Diseño y desarrollo completos: el buscador, las fichas, la lista de cotización y el formulario.',
          },
          stackLabel: 'Herramientas',
        },
        features: {
          title: 'Qué construí',
          items: {
            search: {
              title: 'Un buscador que entiende el número',
              body: 'Encuentra el repuesto por su número OEM, de fabricante o de referencia cruzada, lo escriba como lo escriba el comprador: “ab 1234-x”, “AB1234X” y “ab.1234.x” dan lo mismo. Primero muestra la coincidencia exacta y después los números que empiezan igual.',
            },
            references: {
              title: 'Fichas con todas sus referencias',
              body: 'Cada repuesto muestra sus números en una tabla, con el tipo y el fabricante, además de sus especificaciones, el stock y el tiempo de despacho. El comprador elige la opción, como la rotación o el largo, y la cantidad.',
            },
            quoteList: {
              title: 'Una lista de cotización',
              body: 'El comprador suma repuestos y cantidades como en un carrito, y cada línea guarda el número tal como lo buscó. La lista dura 30 días sin crear una cuenta, y el formulario solo pide nombre y correo.',
            },
            miss: {
              title: 'Si no está, igual se cotiza',
              body: 'Una búsqueda sin resultados no es un callejón sin salida: ofrece agregar el número a la cotización como texto libre, para que el proveedor lo busque.',
            },
            quality: {
              title: 'Accesible y rápida',
              body: 'Se usa con teclado y con lector de pantalla, respeta “reducir movimiento” y no se desborda en un celular de 390 px. Las páginas se generan por adelantado, así que cargan rápido.',
            },
          },
        },
        closing: {
          title: '¿Tus clientes te buscan por número de parte?',
          body: 'En una llamada de 15 minutos vemos cómo te piden repuestos hoy y si una tienda como esta tiene sentido para tu negocio.',
          cta: 'Agenda una llamada de 15 minutos',
        },
        next: {
          label: 'Siguiente',
          title: 'Servicios',
          body: 'Qué incluye tu tienda, con ejemplos reales.',
        },
      },
    },
    landscape: {
      visitSite: 'Abrir la demo',
      alts: {
        'landscape/home-desktop':
          'Página de inicio de la demo Landscape Supply en computador, con el código postal 30301 comprobado: Zona A, envío de US$75 y pedido mínimo de US$100',
        'landscape/home-full-desktop':
          'La página de inicio completa de la demo Landscape Supply, desde el comprobador de envío hasta el pie',
        'landscape/home-full-top':
          'La parte de arriba de la página de inicio de Landscape Supply, con el comprobador de envío',
        'landscape/home-mobile': 'La página de inicio de Landscape Supply en celular',
        'landscape/zip-mobile':
          'El comprobador de envío en celular, con la respuesta para el código postal 30301',
        'landscape/product-desktop':
          'La calculadora en la ficha del mulch: 200 ft² a 3 pulgadas de profundidad dan 1,85 yd³, redondeadas a 2 y pasadas a la cantidad',
        'landscape/product-mobile':
          'La misma calculadora en celular, con 2 yd³ listas para agregar al carrito',
        'landscape/checkout-desktop':
          'El pago en modo de prueba, con envío a domicilio a la Zona A y un total de US$201',
        'landscape/pavers-desktop':
          'La ficha de los adoquines, con precio a cotizar y la calculadora que cuenta 946 unidades con un 5 % extra para cortes',
      },
      card: {
        meta: 'Landscape Supply · Materiales de paisajismo · Demo',
        industry: 'Materiales de paisajismo a granel',
        outcome: 'Calcular cuánto pedir, saber si hay envío y pagar en línea',
        metrics: [],
        built: [
          'Calculadora de cantidades',
          'Envío por código postal',
          'Carrito y pago',
          'Cotizador',
        ],
      },
      examples: {
        catalog:
          'En la demo Landscape Supply, cada ficha calcula la cantidad con las medidas del comprador: 200 ft² a 3 pulgadas son 2 yd³.',
        quote:
          'El pago en modo de prueba: carrito, envío a domicilio según el código postal y total, sin cobrar nada.',
      },
      page: {
        meta: {
          title: 'Demo Landscape Supply: tienda con calculadora y envío | Alejandro Hernández',
          description:
            'Una tienda demo de materiales de paisajismo que construí: calculadora de cantidades, envío por código postal, carrito y pago en modo de prueba, y productos que se cotizan.',
          ogImageAlt: 'Demo Landscape Supply · Alejandro Hernández',
        },
        breadcrumb: { label: 'Ruta de navegación', home: 'Inicio', work: 'Trabajo' },
        hero: {
          title: 'De las medidas del jardín al carrito, sin llamar',
          summary:
            'Landscape Supply es una tienda demo de mulch, piedra y tierra a granel que construí para mostrar cómo vende en línea un patio de materiales: el comprador mide, la tienda calcula cuánto pedir, le dice si hay envío a su código postal y le deja pagar o pedir una cotización. La marca es ficticia y no se cobra ni se despacha nada.',
          facts: [
            { label: 'Tipo', value: 'Demo · proyecto propio' },
            { label: 'Industria', value: 'Materiales de paisajismo' },
            { label: 'Comprador', value: 'Hogares y contratistas' },
            { label: 'Venta', value: 'Pago en línea y cotización' },
            { label: 'Idioma', value: 'Inglés' },
          ],
        },
        tryIt: {
          title: 'Pruébalo',
          lead: 'La demo está en línea. Estas tres pruebas toman unos dos minutos.',
          steps: [
            {
              title: 'Calcula el mulch para 200 ft²',
              body: 'La ficha ya trae el área: la calculadora redondea hacia arriba a media yarda y pasa la cantidad al carrito con un clic.',
              cta: 'Abrir la calculadora',
            },
            {
              title: 'Comprueba el envío',
              body: 'Escribe 30301 o 30310 para ver las dos zonas de envío, o 12345 para ver qué pasa fuera de ellas. Retirar en el patio siempre es gratis.',
              cta: 'Comprobar un código postal',
            },
            {
              title: 'Paga en modo de prueba',
              body: 'Agrega 3 yd³ al carrito, elige envío a domicilio al 30301 y paga con la tarjeta 1, que aprueba. La 2 rechaza.',
              cta: 'Abrir el producto',
            },
          ],
          note: 'Es una tienda de demostración: no se cobra ni se despacha nada.',
        },
        overview: {
          title: 'Resumen',
          client: {
            label: 'Proyecto',
            value:
              'Una tienda propia para mostrar cómo vende en línea un proveedor de materiales a granel: 16 productos en 4 categorías, vendidos por yarda, por tonelada o por bolsa, y adoquines que se cotizan.',
          },
          problem: {
            label: 'Problema',
            value:
              'El comprador sabe el tamaño de su jardín, no cuántas yardas pedir, y tampoco sabe si le llevan el material ni cuánto cuesta el envío. Con esas dudas, llama o no compra.',
          },
          role: {
            label: 'Mi papel',
            value:
              'Diseño y desarrollo completos: el catálogo, la calculadora, las zonas de envío, el carrito, el pago y la cotización.',
          },
          stackLabel: 'Herramientas',
        },
        features: {
          title: 'Qué construí',
          items: {
            calculator: {
              title: 'Una calculadora de cantidades',
              body: 'El comprador escribe el largo y el ancho, el diámetro o el área, y la profundidad. La tienda calcula el volumen, lo redondea hacia arriba a media yarda o a bolsas enteras, muestra la cuenta y lo pasa a la cantidad con un clic. Si el pedido no cabe en un camión, ofrece cotizarlo.',
            },
            delivery: {
              title: 'Envío según el código postal',
              body: 'Con el código postal, la tienda dice si hay envío, cuánto cuesta y cuál es el pedido mínimo, en dos zonas de US$75 y US$95. En el carrito avisa cuánto falta para llegar al mínimo, y retirar en el patio siempre es gratis.',
            },
            checkout: {
              title: 'Carrito y pago en modo de prueba',
              body: 'Del carrito al pago en dos pasos, con el envío y el total a la vista antes de pagar. En la demo el pago es simulado: la tarjeta 1 aprueba, la 2 rechaza y la 3 muestra un error.',
            },
            quoteOnly: {
              title: 'Vender y cotizar en la misma tienda',
              body: 'Los adoquines no tienen precio fijo: su ficha calcula las unidades con un 5 % extra para cortes y las agrega a una lista de cotización. Y cualquier carrito se convierte en cotización con un clic.',
            },
            quality: {
              title: 'Accesible y rápida',
              body: 'Se usa con teclado y con lector de pantalla, anuncia el resultado del envío, respeta “reducir movimiento” y no se desborda en un celular de 390 px. Las páginas se generan por adelantado, así que cargan rápido.',
            },
          },
        },
        closing: {
          title: '¿Tus clientes te llaman para saber cuánto pedir?',
          body: 'En una llamada de 15 minutos vemos cómo vendes hoy y si una tienda como esta tiene sentido para tu negocio.',
          cta: 'Agenda una llamada de 15 minutos',
        },
        next: {
          label: 'Siguiente',
          title: 'Servicios',
          body: 'Qué incluye tu tienda, con ejemplos reales.',
        },
      },
    },
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
        title: 'Prototipo gratis',
        body: 'Una versión navegable de tu sitio con tus productos reales, sin compromiso.',
        duration: '5 días hábiles',
      },
      {
        title: 'Construcción por fases',
        body: 'Fases cortas que apruebas una por una.',
        duration: '3–6 semanas · 40/40/20', // REVIEW(F0-10): confirm the 3–6 week range
      },
      {
        title: 'Lanzamiento',
        body: 'Tu tienda sale al aire con tu propio dominio y hosting.',
        duration: 'En tu dominio',
      },
      {
        title: 'Plan mensual',
        body: 'Cuidado y visibilidad después del lanzamiento, si lo quieres.',
        duration: 'Opcional',
      },
    ],
    weeklyUpdate: 'Cada viernes recibes una actualización.',
    changes: '3 rondas de cambios por fase.',
  },
  pricing: {
    title: 'Precios de referencia',
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
    cta: 'Pide tu prototipo gratis',
    faqLink: 'Preguntas sobre pagos y tiempos',
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
    title: 'Trabajas directamente conmigo',
    lead: 'Soy Alejandro, ingeniero de software y líder de proyectos. Diseño y construyo tiendas, catálogos y cotizadores para negocios que venden productos, y soy la persona con la que hablas desde la primera llamada hasta el lanzamiento.',
    facts: [
      { label: 'Desde', value: 'Colombia · UTC−5' },
      { label: 'Idiomas', value: 'Español e inglés' },
      { label: 'Respuesta', value: 'En máximo 1 día hábil' },
      { label: 'Experiencia', value: 'Más de 4 años construyendo software' },
      // REVIEW(R-08): confirm "brand" means the logo, and that the video is the 49 s teaser
      {
        label: 'Diseño',
        value: 'También diseñé el logo, el folleto y el video de producto de Malone Road Belt',
      },
    ],
    photo: { alt: 'Alejandro Hernández' },
  },
  // The home summary and the About page
  aboutTeaser: {
    lead: 'Soy Alejandro, ingeniero de software y líder de proyectos en Colombia. Diseño y construyo tu tienda yo mismo, y soy la persona con la que hablas desde la primera llamada hasta el lanzamiento.',
    stepsLabel: 'Cómo trabajo',
    pricesLabel: 'Precios de referencia',
    cta: 'Conoce más sobre mí y cómo trabajo',
    pricingLink: 'Ver todos los precios',
  },
  // In the place of the prices while they are hidden (ADR-025)
  linkedin: {
    title: 'Conóceme mejor',
    body: 'Mi trayectoria como ingeniero de software y líder de proyectos está en LinkedIn, para que sepas con quién vas a trabajar antes de la primera llamada.',
    cta: 'Ver mi perfil de LinkedIn',
    newTab: '(se abre en una pestaña nueva)',
  },
  aboutPage: {
    // Without the prices; mention them again when site.features.pricing returns
    meta: {
      title: 'Sobre mí y cómo trabajo | Alejandro Hernández',
      description:
        'Quién construye tu tienda y cómo avanza un proyecto, desde el prototipo gratis hasta el lanzamiento.',
    },
    breadcrumb: { label: 'Ruta de navegación', home: 'Inicio' },
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
    navLabel: 'Pie de página',
    caseLink: 'Caso {name}',
    linkedin: 'LinkedIn',
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
