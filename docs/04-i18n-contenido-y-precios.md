# 04 · i18n, contenido y precios

El sitio tiene dos idiomas (`/en` por defecto y `/es`) con el patrón nativo de Next.js 16.3: `app/[locale]/` como root layout, `next/root-params` para leer el idioma y diccionarios TypeScript tipados.

El idioma y el mercado son independientes. El idioma lo elige la URL. El mercado (USD o COP) se decide en el navegador: COP solo para visitantes en Colombia, USD para el resto.

---

## 1. Rutas y URLs

| URL | Qué es | Indexable |
|---|---|---|
| `/` | Redirección 307 a `/en` o `/es` según el navegador | No (redirección) |
| `/en`, `/es` | La home | Sí |
| `/en/work/{slug}`, `/es/trabajos/{slug}` | Página de un caso; hoy solo `malone-road-belt` ([ADR-020](./14-decisiones.md#adr-020)) | Sí |
| `/en/privacy`, `/es/privacy` | Política de privacidad | Sí |
| `/en/p/{slug}`, `/es/p/{slug}` | Propuesta privada por prospecto (v1.1) | **No** |
| `/call`, `/llamada` | Enlaces cortos a la agenda de Cal.com | No (redirección) |
| `https://www.alejandrodeveloper.com/*` | Redirección 308 al apex (Redirect Rule de Cloudflare, [10 §6](./10-infraestructura-y-entornos.md#6-cloudflare)) | No |

**Segmento traducido.** El caso vive en `work` en inglés y en `trabajos` en español (`CASE_SEGMENT` en `src/lib/routes.ts`). El slug también es por idioma (`slug.en`, `slug.es` en `cases.ts`); para MRB es el mismo. Cada ruta genera solo su idioma, así que `/es/work/…`, `/en/trabajos/…`, `/en/work` y `/es/trabajos` responden con el 404 bilingüe ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).

**Anclas de la home.** Los ids van en español en los dos idiomas: `#inicio` (hero), `#trabajo`, `#servicios`, `#proceso`, `#precios`, `#sobre-mi`, `#preguntas` y `#contacto` (`SECTION` en `routes.ts`). Desde el caso y la privacidad, la barra y el pie enlazan `/{lang}#{id}`. En la home usan el ancla sola (`#precios`), para que el salto no recargue la página ni pierda la query de la URL (`?mkt=co`, las UTM); `sectionHref()` elige la forma según la página. `#solucion` y `#caso` ya no existen; el sitio no se había publicado, así que no se rompió ningún enlace externo.

**Regla para correos:** los enlaces de prospección apuntan directo a `/en?utm_…`, `/es?utm_…&mkt=co` o a la página del caso (`/en/work/malone-road-belt?utm_…`), para evitar el salto de la redirección de `/` (ver [12 §5](./12-medicion-y-analitica.md#5-convención-utm)).

## 2. Redirección de `/`

Se resuelve en un Worker mínimo de Cloudflare ([ADR-004](./14-decisiones.md#adr-004)). Hay dos motivos:

- El export estático no admite `redirects()` en `next.config` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)).
- Los `_redirects` de Cloudflare no redirigen por idioma ([Cloudflare](https://developers.cloudflare.com/workers/static-assets/redirects/)).

El Worker **pasa el query string al destino**, así que los UTM sobreviven.

```ts
// worker/index.ts (extracto ilustrativo)
const SHORT_LINKS: Record<string, string> = {
  '/call': 'https://cal.com/tu-usuario/15min',
  '/llamada': 'https://cal.com/tu-usuario/15min-es', // o 15min si el plan Free solo admite un evento (07 §2.1)
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      // Solo el primer idioma preferido: es, es-CO, es-419… → /es; lo demás → /en
      const first = (request.headers.get('accept-language') ?? '').trim().toLowerCase()
      return redirect((first.startsWith('es') ? '/es' : '/en') + url.search)
    }

    const shortLink = SHORT_LINKS[url.pathname]
    if (shortLink) return redirect(shortLink + url.search)

    // v1.1: if (url.pathname === '/api/contact') return handleContact(request, env)
    return env.ASSETS.fetch(request) // cualquier otra ruta: archivos estáticos
  },
} satisfies ExportedHandler<Env> // `wrangler types` genera Env a partir de wrangler.jsonc

// 307: no queda en caché del navegador; url.search lleva los UTM al destino
function redirect(location: string) {
  return new Response(null, {
    status: 307,
    headers: { location, 'cache-control': 'no-store', vary: 'accept-language' },
  })
}
```

- **Solo esas rutas pasan por el Worker.** Se declaran en `run_worker_first` de `wrangler.jsonc` ([03 §6](./03-arquitectura.md#6-rutas-encabezados-y-configuración)). Las demás las sirven directamente los archivos estáticos, sin contar para el límite diario del plan Free.
- **Por qué basta `startsWith('es')`.** Solo mira el idioma principal: `es-CO,es;q=0.9,en;q=0.8` va a `/es` y `en-US,en;q=0.9,es;q=0.8` va a `/en`. Ningún otro código de idioma empieza por `es`.
- **Prueba**, en local con `pnpm preview` (puerto 8787) o en producción:

  ```bash
  curl -sI -H 'Accept-Language: es-CO,es;q=0.9' 'https://alejandrodeveloper.com/?utm_source=x' | grep -i location
  # location: /es?utm_source=x
  curl -sI 'https://alejandrodeveloper.com/call?utm_source=signature' | grep -i location
  # location: https://cal.com/tu-usuario/15min?utm_source=signature
  ```

## 3. Root layout y parámetros estáticos

```tsx
// src/app/[locale]/layout.tsx (extracto)
import { locale } from 'next/root-params' // Next ≥ 16.3; solo en Server Components

export const dynamicParams = false // cualquier locale distinto de en/es → 404
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const lang = await locale()
  return (
    // suppressHydrationWarning: el script de mercado agrega data-market antes de hidratar
    <html lang={lang} suppressHydrationWarning>
      <head>{/* script inline de mercado: §8.4 */}</head>
      <body>{children}</body>
    </html>
  )
}
```

**Restricciones de `next/root-params`.** Funciona en Server Components y en utilidades del servidor. **No** funciona en Client Components, Server Actions ni Route Handlers ([docs](https://nextjs.org/docs/app/api-reference/functions/next-root-params)). Las islas de cliente reciben sus textos como props. El endpoint del formulario (v1.1) vive en el Worker, fuera de Next, así que el formulario envía `locale` en el cuerpo.

## 4. Modelo de contenido tipado

Todo texto visible vive en `src/content/en.ts` y `src/content/es.ts`. Ambos archivos cumplen el mismo tipo:

```ts
// src/content/en.ts
import type { SiteContent } from './types'
export const en = { /* … */ } satisfies SiteContent
```

`satisfies` valida la **forma**: si a `es.ts` le falta una clave, la compilación falla. No valida que el texto esté traducido, así que se revisa en el PR. Los textos visibles son **obligatorios** en el tipo. Solo son opcionales los que dependen de un dato que puede faltar: la prueba de un bloque de Servicios (`proof?`), sus listas (`list?`) y la cifra de respaldo de la franja (`fallback?`).

```ts
// src/content/types.ts (extracto; la fuente de verdad es el archivo)
export type Locale = 'en' | 'es'
export type TrackLocation =
  'header' | 'nav' | 'hero' | 'stage' | 'work' | 'case' | 'pricing' | 'closing' | 'faq' | 'demo' | 'footer'

export type SiteContent = {
  meta: { title: string; description: string; ogImageAlt: string }
  nav: {
    tagline: string
    bookCall: string // "Agenda": CTA compacto (< 1024 px)
    bookCallFull: string // "Agenda una llamada": desde 1024 px y dentro del menú
    switchLanguage: string; skipToContent: string; label: string
    links: { work: string; services: string; process: string; pricing: string; about: string }
    menu: { open: string; close: string; label: string } // menú Popover (< 1024 px)
  }
  hero: {
    headlines: Record<HeadlineVariant, string>
    subtitle: string
    primaryCta: string // "Book a 15-minute call"
    secondaryCta: { case: string; demo: string } // página del caso (fase A) → tienda demo (v2)
    trustLine: string // "Trabajas directamente conmigo · Colombia, UTC−5"
    figures: { label: string; items: FigureCell[] } // franja de cifras
    showcase: { label: string } // leyenda de los marcos; los alt salen de cases.<id>.alts
  }
  work: { title: string; lead: string; card: { viewCase: string; builtLabel: string } }
  services: {
    title: string; lead: string
    tiles: Record<'catalog' | 'quote' | 'languages' | 'seo' | 'analytics' | 'care', ServiceTile>
    ownership: string // "Dominio, hosting y cuentas a tu nombre."
    pricingLink: string // enlace a #precios
    stage: { /* el escenario del hook A, antes hero.stage (05 §5) */ }
  }
  cases: Record<CaseId, CaseContent> // textos de cada caso, ver abajo
  demo: { title: string; body: string; cta: string; posterAlt: string } // v2
  process: { title: string; steps: Array<{ title: string; body: string; duration: string }>; weeklyUpdate: string; changes: string }
  pricing: { /* title, note, currencyToggle, priceLabels, plans */ cta: string; faqLink: string }
  faq: { title: string; items: Array<{ q: string; a: string }> } // máximo 8
  about: { title: string; lead: string; facts: Fact[]; photo: { alt: string } }
  closing: { title: string; body: string; bookCall: string; whatsapp: {…}; email: {…} }
  contactForm: Record<string, never> // v1.1
  footer: { addressLabel: string; privacy: string; rights: string; navLabel: string; caseLink: string }
  notFound: { title: string; body: string; backHome: string }
  privacy: { /* meta, title, effectiveLabel, sections, backHome */ }
}

export type ServiceTile = {
  outcome: string // la etiqueta de resultado: "Que te encuentren", "Que te elijan"…
  title: string; body: string
  proof?: string // puede usar {cifras} del caso destacado: "{oemBrands} marcas OEM en Malone Road Belt"
  list?: string[] // bloques D y E: lista mono
}

export type FigureCell =
  | { kind: 'fact'; value: string; label: string; fallback?: { value: string; label: string } }
  | { kind: 'price'; label: string } // el precio "desde" de la tienda, por mercado
```

**Casos: datos y textos por separado** ([ADR-020](./14-decisiones.md#adr-020), que extiende [ADR-011](./14-decisiones.md#adr-011)):

- **`src/content/cases.ts`** exporta `cases: CaseStudy[]`, sin textos: `id`, `slug` por idioma, `disclosure`, el cliente (`name`, `url`, `domain`), las fechas (`published`, `updated`, `launched`), `featured`, las cifras, los idiomas y el stack, los medios de cada lugar (`hero`, `card`, `showcase`, `after`, `services`) y las filas de "Qué construí" (`features`, cada una con su captura y su marco). También `getCase(id)`, `caseBySlug(lang, slug)` y `featuredCases`.
- **Los textos de cada caso** viven en `en.ts` y `es.ts`, en `cases.<id>` (`CaseContent`): `visitSite`; `alts`, con un `alt` por cada clave de medios del caso, que se usa en todo el sitio; `card` (la tarjeta de `#trabajo`); y `page` (meta, migas, hero, resultados, resumen, antes/después, qué construí, cierre y "siguiente").
- **Las cifras se escriben una sola vez,** en `cases.ts` (`figures`), y el copy las nombra con marcadores: `{products}`, `{languages}`, `{oemBrands}`, `{machines}`, `{categories}`, `{quotes}`, `{weeks}` y `{launched}` (el mes de salida, "agosto de 2026"). `fillCase()` de `src/lib/cases.ts` los reemplaza en el build con `Intl.NumberFormat` del idioma. **Si una cifra es `null`, el texto que la usa devuelve `null` y el componente omite esa celda, línea o fila sin dejar hueco.** `resolveMetrics()` hace lo mismo con las métricas (`Metric = { figure, label }`).
- **Cifras sin verificar:** cada una lleva `// REVIEW(R-08)` junto al valor en `cases.ts`, con su fuente. Al 24-oct: `quotes` y `weeks` son `null`; `products` 15 (malonebelt.com), `categories` 4, `oemBrands` 29 (el plan decía 16, 5 y 30) y `machines` 6 (datos de ejemplo del repo de MRB; el plan decía 7).

**Lo que se eliminó del modelo** con la reestructuración: `caseMrb` (pasó a `cases.mrb`), `solves` (pasó a `services`), `hero.stage` (pasó a `services.stage`), `about.lines` (pasó a `about.lead` y `about.facts`), `ImageRef` (las imágenes se nombran por su clave del manifiesto de medios, [06 §4](./06-secciones-y-ui.md#4-imágenes)) y `site.caseMrb`.

**Flujo de textos (fase 0):** se escriben directamente en `content/en.ts` y `content/es.ts`, partiendo de los textos del roadmap (§4 y §5). Si prefieres redactar en un documento aparte, se pegan al final. El código no contiene ningún texto visible.

## 5. Configuración y flags

`src/content/site.ts` concentra lo que no depende del idioma y lo que se cambia entre versiones:

```ts
// src/content/site.ts (extracto)
export const site = {
  url: 'https://alejandrodeveloper.com',
  name: 'Alejandro Hernández',
  indexable: false, // prelanzamiento: noindex en todo el sitio; true al publicar (F1-10)
  features: {
    demoStore: false, // v2: cambia el CTA secundario y el escenario a la tienda demo
    contactForm: false, // v1.1: muestra el formulario en el cierre
    pricing: false, // apagado mientras defines los precios: sin montos y con LinkedIn en su lugar (ADR-025)
  },
  hero: { activeHeadline: 'a' as const }, // ver 12 §6
  // disclosure ya no vive aquí: es un campo de cada caso en content/cases.ts (ADR-020)
  media: { baseUrl: 'https://media.alejandrodeveloper.com' }, // fase B: clips en R2 (ADR-022)
  contact: {
    email: 'hola@alejandrodeveloper.com',
    whatsapp: '57XXXXXXXXXX', // sin "+" ni espacios (formato wa.me)
    calLink: { en: 'tu-usuario/15min', es: 'tu-usuario/15min-es' }, // un evento por idioma (07 §2.1)
    linkedin: 'https://www.linkedin.com/in/alejandro-hernandez-quintero/', // también sameAs (08 §4)
  },
  demoUrl: 'https://demo.alejandrodeveloper.com', // v2
  analytics: { umamiWebsiteId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, // ID público de Umami (12 §4)
  legal: {
    postalAddress: 'Por definir', // CAN-SPAM; la misma de los correos
    privacyVersion: '2026-10-17', // fecha de vigencia de la política
  },
}
```

Cambiar un flag requiere commit y despliegue (~1–2 minutos con Workers Builds). Es intencional: cada cambio queda registrado en Git, lo que sirve para la prueba de titulares.

## 6. Caso MRB con `disclosure`

Desde el 24-oct, `disclosure` es un campo de cada `CaseStudy` en `content/cases.ts`, y no de `site.ts` ([ADR-020](./14-decisiones.md#adr-020), que ajusta [ADR-014](./14-decisiones.md#adr-014)). **MRB está en `'named'`**: dio permiso para mostrar el trabajo con nombre e imágenes. El alcance exacto del permiso (nombre, logo, capturas, folleto, video y cifras) se confirma por escrito en R-01 y está marcado con `REVIEW(R-08)` junto al campo.

| Elemento | MRB hoy (`named`) | Si el permiso llega más estrecho |
|---|---|---|
| Nombre del cliente | En la tarjeta de `#trabajo`, el CTA secundario del hero ("Ver el caso de Malone Road Belt"), el pie, la página del caso y su JSON-LD (`about`) | Volver a `'anonymized'` obliga a reescribir el copy de `cases.mrb` y a retirar las capturas |
| Capturas del sitio | En el hero, la tarjeta, los bloques A y C de Servicios y la página del caso. `HeroShowcase` no dibuja nada si el caso no es `'named'`, porque las capturas identifican al cliente | Se quitan las claves afectadas de `media` y `features` |
| Logo y folleto | En "Qué construí" (fila "Marca") | Se quita la fila `brand` |
| Enlace a malonebelt.com | "Visitar malonebelt.com" en la tarjeta y en el hero del caso, en otra pestaña con `noopener` | Se quita `visitSite` |
| Cifras del catálogo (productos, marcas OEM, idiomas…) | Verificadas en malonebelt.com el 24-oct, con `REVIEW(R-08)` | Se ponen en `null` y desaparecen sin hueco |
| Cotizaciones desde el 27-ago | `null` hasta que la confirmes: su celda en la franja del hero la ocupa la cifra de marcas OEM (`fallback`), y la de resultados se omite | — |
| Testimonio | No hay, y el modelo no lo tiene: no queda ningún espacio esperándolo | Si llega, se agrega como campo opcional |

**Antes/después.** archive.org no guarda ninguna captura del sitio anterior de MRB. Por eso el antes/después compara en texto el proceso de compra de antes (llamar o escribir para conocer un precio) con el de después, y solo el lado "después" lleva capturas ([ADR-021](./14-decisiones.md#adr-021)).

**Lo que el caso afirma, y lo que no** (verificado en el sitio en vivo y en el repositorio de MRB el 24-oct):

- El cotizador pide **un solo producto con su urgencia** ("Machine is down now" o "Planned purchase") y envía la solicitud al correo de ventas con Resend. Nunca se habla de un carrito de varias piezas ni de "las piezas exactas".
- Los pagos y los pedidos en línea **no son tu trabajo**: son la fase 2 de MRB, de otro equipo. El caso no menciona checkout.
- Los idiomas son **inglés, portugués y español** (`/en`, `/pt` y `/es`).
- El stack que se muestra es Next.js, Vercel y Resend.
- El buscador se llama "BeltMatch" por dentro, pero el sitio dice "Find my belt", así que el copy dice "buscador por máquina o referencia OEM".

**`'anonymized'` sigue en el tipo** para casos futuros. Hoy solo `HeroShowcase` lo consulta. Un caso anónimo necesitaría además copy sin el nombre y capturas recortadas, y su página tendría que revisar qué medios muestra; se resuelve cuando llegue uno.

## 7. Variantes del titular

- `hero.headlines` tiene tres variantes por idioma (roadmap §4):

  | Variante | EN | ES |
  |---|---|---|
  | `a` | No website, or an outdated one? Go from “call for pricing” to “add to cart”. | ¿Sin página web o con una desactualizada? Pasa de “precio por interno” a “agregar al carrito”. |
  | `b` | Your website should take orders, not just look nice. | Tu sitio debería recibir pedidos, no solo verse bien. |
  | `c` | See your new store working in 5 days. | Ve tu nueva tienda funcionando en 5 días. |

- `site.hero.activeHeadline` elige la variante activa en ambos idiomas.
- **Línea de público** (25-oct, [ADR-024](./14-decisiones.md#adr-024)): si el texto antes de la primera comilla termina en "?", `HeroHeadline` lo pone en su propia línea, más pequeño, dentro del mismo H1, y el H1 baja a un máximo de 7 rem. Así la variante `a` le habla a quien no tiene sitio y a quien lo tiene desactualizado. Antes decía “From “call for pricing” to “add to cart”.” / “De “precio por interno” a “agregar al carrito”.”.
- **Las comillas tipográficas “ ” son parte del contrato.** `HeroHeadline` tacha la primera frase entre comillas y marca la segunda con el resaltador ([05 §3](./05-hero-animacion.md#3-guion--línea-de-tiempo-técnica)). Una variante sin dos frases entre comillas, como `b` y `c`, se ve como texto plano. Con comillas rectas (`"`) no se decora nada.
- La comparación es por ventana de fechas, con un registro en [12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares).

## 8. Precios por país del visitante

> **Ocultos desde el 25-oct ([ADR-025](./14-decisiones.md#adr-025)).** Con `site.features.pricing = false` no se muestra ningún monto: ni la sección de precios, ni la celda del hero, ni el plan mensual, ni `priceRange`. Todo lo de esta sección vuelve con `true`.

**Decisión del usuario:** COP solo para visitantes en Colombia; USD para todos los demás, en `/en` y en `/es`. Así un proveedor hispano de EE. UU. que lea `/es` ve USD, y un cliente colombiano ve COP aunque lea en inglés.

### 8.1 Detección

Un script inline en el `<head>` decide el mercado antes del primer pintado, en este orden:

1. **`?mkt=co` o `?mkt=us` en la URL.** Se guarda en `localStorage`. Sirve para campañas a Colombia y para QA.
2. **Elección previa** del visitante, guardada por el selector manual en `localStorage`.
3. **Zona horaria del dispositivo.** `America/Bogota` → `co`. Esa zona solo existe en Colombia. Perú (`America/Lima`), Ecuador (`America/Guayaquil`) o Panamá (`America/Panama`) quedan en USD, que es lo más útil para ellos.
4. **USD por defecto**, también sin JavaScript.

**Por qué zona horaria y no IP.** La geolocalización por IP (`request.cf.country` en Cloudflare) exige que cada visita a `/en` y `/es` pase por el Worker, lo que consume el límite diario del plan Free y no funciona igual en local. La zona horaria logra el mismo resultado sin servidor y no se confunde con VPN corporativas. La variante por IP queda como plan B en [ADR-005](./14-decisiones.md#adr-005). El evento `currency_switch` mide si la heurística falla: muchos cambios manuales indicarían que hay que pasar al plan B.

### 8.2 Render sin saltos

El HTML estático trae **las dos monedas**. El CSS muestra solo la del mercado activo:

```html
<!-- Price (Server Component) renderiza ambas; cada una en tres piezas (06 §3.7) -->
<span data-only-market="us">
  <span>From</span> <span>$3,000</span>                <!-- etiqueta mono, importe condensado -->
</span>
<span data-only-market="co">
  <span>From</span> <span>COP 3,000,000</span>
</span>
```

`priceParts()` (`lib/market.ts`) devuelve las piezas `{ label?, amount, period? }`: la etiqueta "From" / "Desde", el importe y el periodo "/ month" / "/ mes".

```css
/* globals.css */
[data-only-market="co"] { display: none; }
html[data-market="co"] [data-only-market="co"] { display: inline; }
html[data-market="co"] [data-only-market="us"] { display: none; }
```

- El atributo de los precios se llama `data-only-market` y no `data-market`. Si llevaran el mismo atributo que `<html>`, el selector `[data-market="co"]` ocultaría la página entera.
- `display: none` saca del árbol de accesibilidad la moneda oculta: el lector de pantalla solo lee una.
- El script corre antes del pintado, así que no hay CLS.

### 8.3 Formato de moneda

| Mercado | Página | Formato | Ejemplo |
|---|---|---|---|
| `us` | `/en` | `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })` | $3,000 |
| `us` | `/es` | `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })` | US$ 3.000 |
| `co` | `/es` | `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', currencyDisplay: 'code', maximumFractionDigits: 0 })` | COP 3.000.000 |
| `co` | `/en` | `Intl.NumberFormat('en-US', { style: 'currency', currency: 'COP', currencyDisplay: 'code', maximumFractionDigits: 0 })` | COP 3,000,000 |

Con `currencyDisplay: 'code'`, el peso nunca se confunde con el dólar (ambos usan "$"). Los precios se formatean en el servidor, durante el build, así que no hay JavaScript en el cliente.

**Valores** (hipótesis del roadmap §5; se ajustan tras las primeras cinco conversaciones):

| Servicio | `us` | `co` |
|---|---|---|
| Prototipo navegable en 5 días hábiles, gratis y sin compromiso (decisión del 6-oct) | `free` | `free` |
| Tienda o catálogo con cotizador | `from` 3.000 | `from` 3.000.000 |
| Plan mensual de cuidado y visibilidad | `range` 150–300 / mes | `range` 250.000–500.000 / mes |

### 8.4 Script inline (~300 B)

```html
<script>
  (function () {
    try {
      var q = new URLSearchParams(location.search).get('mkt')
      if (q === 'co' || q === 'us') localStorage.setItem('mkt', q)
      var m = localStorage.getItem('mkt') ||
        (Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Bogota' ? 'co' : 'us')
      document.documentElement.setAttribute('data-market', m)
    } catch (e) {}
  })()
</script>
```

- Va dentro de `<head>` en el root layout, como los scripts de tema del patrón de `next-themes`.
- `<html>` lleva `suppressHydrationWarning`, porque su atributo cambia antes de la hidratación.
- `MarketToggle` escribe `localStorage.mkt`, cambia el atributo y envía `currency_switch {to, detected}`.

### 8.5 Pruebas

- `?mkt=co` y `?mkt=us` en local y en preview.
- Chrome DevTools → *Sensors* → *Location* para emular la zona horaria `America/Bogota`.
- Playwright (v1.1): un contexto con `timezoneId: 'America/Bogota'` debe ver COP; otro con `America/New_York` debe ver USD; y sin JavaScript debe verse USD.

## 9. Propuestas web (v1.1)

Reemplazan los PDF de 2–15 MB: se envía un enlace liviano solo a quien respondió o tuvo una llamada (diagnóstico §7). Cada propuesta es **un objeto tipado** renderizado por **una sola plantilla**. Producir una nueva es llenar datos, no maquetar.

```ts
// src/content/types.ts (extracto)
export type Proposal = {
  slug: string // 'dixie-precision-k7f3q9' (empresa + sufijo aleatorio de 6 caracteres)
  locale: Locale
  prospect: { company: string; contactName?: string; website?: string }
  createdAt: string // ISO
  validUntil?: string // ISO; se muestra como "propuesta válida hasta…"
  findings: Array<{ title: string; evidence: string; image?: { key: KnownMediaKey; alt: string } }> // 3 hallazgos verificables; la imagen, del manifiesto de medios (06 §4)
  plan: {
    summary: string
    phases: Array<{ name: string; deliverables: string[]; weeks: number; price: PriceSpec }>
    currency: 'USD' | 'COP'
    paymentTerms: string // p. ej. "40 % al iniciar, 40 % con el primer avance aprobado, 20 % al publicar"
  }
  video?: { url: string; title: string } // el video de 2 min que ofrece el correo
  cta: { label: string }
}
```

- **Registro:** `src/content/proposals/index.ts` exporta la lista. `p/[slug]/page.tsx` usa `generateStaticParams` con esa lista y `dynamicParams = false`.
- **Privacidad:** `noindex` + `X-Robots-Tag` (vía `_headers`); fuera del sitemap; slug no adivinable; sin enlaces desde el sitio ([08 §6](./08-seo.md#6-noindex-de-propuestas-y-demo)). Las propuestas pueden nombrar marcas reales del prospecto: por eso son privadas.
- **Caducidad:** cuando una propuesta vence, se borra su archivo y se despliega, y la URL pasa a dar 404.
- **Imagen para compartir:** `opengraph-image.tsx` con `next/og` y el nombre del prospecto. Fuentes `ttf`, `otf` o `woff` (no `woff2`), solo flexbox ([docs](https://nextjs.org/docs/app/api-reference/functions/image-response)).
  - Con el export estático, la imagen se genera en el build. El archivo lleva `export const dynamic = 'force-static'` y `generateStaticParams` con la lista de propuestas. Sin eso, el build falla con `output: export`.
- **Seguimiento:** la página vista aparece en Umami por su ruta (`/en/p/…`). No hace falta un evento propio.

## Fuentes

- [Internacionalización en Next.js](https://nextjs.org/docs/app/guides/internationalization)
- [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params)
- [Next.js: export estático](https://nextjs.org/docs/app/guides/static-exports)
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Cloudflare: `_redirects` en static assets](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Cloudflare: `run_worker_first`](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare: propiedades `cf` de la solicitud](https://developers.cloudflare.com/workers/runtime-apis/request/) (plan B)
- [Ayuda de WhatsApp: formato `wa.me`](https://faq.whatsapp.com/5913398998672934/)

Consultadas el 3-oct-2026; hosting y redirecciones, el 4-oct-2026.
