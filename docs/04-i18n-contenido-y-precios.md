# 04 · i18n, contenido y precios

El sitio tiene dos idiomas (`/en` por defecto y `/es`) con el patrón nativo de Next.js 16.3: `app/[locale]/` como root layout, `next/root-params` para leer el idioma y diccionarios TypeScript tipados.

El idioma y el mercado son independientes. El idioma lo elige la URL. El mercado (USD o COP) se decide en el navegador: COP solo para visitantes en Colombia, USD para el resto.

---

## 1. Rutas y URLs

| URL | Qué es | Indexable |
|---|---|---|
| `/` | Redirección 307 a `/en` o `/es` según el navegador | No (redirección) |
| `/en`, `/es` | La página única | Sí |
| `/en/privacy`, `/es/privacy` | Política de privacidad | Sí |
| `/en/p/{slug}`, `/es/p/{slug}` | Propuesta privada por prospecto (v1.1) | **No** |
| `/call`, `/llamada` | Enlaces cortos a la agenda de Cal.com | No (redirección) |
| `https://www.alejandrodeveloper.com/*` | Redirección 308 al apex (Redirect Rule de Cloudflare, [10 §6](./10-infraestructura-y-entornos.md#6-cloudflare)) | No |

**Regla para correos:** los enlaces de prospección apuntan directo a `/en?utm_…` o `/es?utm_…&mkt=co`, para evitar el salto de la redirección de `/` (ver [12 §5](./12-medicion-y-analitica.md#5-convención-utm)).

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

`satisfies` valida la **forma**: si a `es.ts` le falta una clave, la compilación falla. No valida que el texto esté traducido, así que se revisa en el PR. Los textos visibles son **obligatorios** en el tipo; solo son opcionales los que dependen de permisos (testimonio, métricas).

```ts
// src/content/types.ts (extracto)
export type Locale = 'en' | 'es'
export type HeadlineVariant = 'a' | 'b' | 'c'
export type TrackLocation = 'header' | 'hero' | 'stage' | 'pricing' | 'closing' | 'faq' | 'demo'

export type ImageRef = { src: string; width: number; height: number; alt: string } // alt obligatorio

export type PriceSpec =
  | { kind: 'from'; amount: number; period?: 'month' } // "Desde US$3,000"
  | { kind: 'range'; min: number; max: number; period?: 'month' } // "US$350–500"
export type PriceByMarket = { us: PriceSpec; co: PriceSpec } // USD y COP

export type SiteContent = {
  meta: { title: string; description: string; ogImageAlt: string }
  nav: { bookCall: string; switchLanguage: string; skipToContent: string }
  hero: {
    headlines: Record<HeadlineVariant, string>
    subtitle: string
    primaryCta: string // "Book a 15-minute call"
    secondaryCta: { caseNamed: string; caseAnonymized: string; demo: string }
    trustLine: { named: string; anonymized: string }
    stage: {
      linkTitle: string // tooltip del escenario clicable; el escenario es aria-hidden (ver 05 §7)
      customerMessage: string // "Hi, how much for…?"
      businessReply: string // "Call for pricing"
      product: { brand: string; name: string; price: { us: string; co: string }; unit: string; qtyLabel: string } // precio por mercado, con data-only-market (05 §12)
      addToCart: string
      orderReceived: string // "Order received · Delivery Thursday"
    }
  }
  solves: { title: string; items: Array<{ icon: 'search' | 'star' | 'cart'; title: string; body: string }> }
  caseMrb: {
    title: { named: string; anonymized: string }
    summary: { named: string; anonymized: string }
    before: { label: string; points: string[]; images: { named: ImageRef[]; anonymized: ImageRef[] } }
    after: { label: string; points: string[]; images: { named: ImageRef[]; anonymized: ImageRef[] } }
    built: string[] // catálogo, buscador por referencia OEM, tres idiomas, cotizador
    result?: { metric: string; note: string } // solo con permiso
    testimonial?: { quote: string; author: string; role: string } // solo con permiso
    link?: { label: string; href: string } // solo en modo named
  }
  demo: { title: string; body: string; cta: string; posterAlt: string } // v2
  process: { title: string; steps: Array<{ title: string; body: string }>; weeklyUpdate: string }
  pricing: {
    title: string
    note: string // "Prices are starting points…"
    currencyToggle: { label: string; usd: string; cop: string }
    plans: Array<{ name: string; description: string; price: PriceByMarket; features: string[] }>
  }
  faq: { title: string; items: Array<{ q: string; a: string }> } // máximo 8
  about: { title: string; lines: [string, string, string]; photo: ImageRef }
  closing: {
    title: string
    body: string
    bookCall: string
    whatsapp: { label: string; prefilledMessage: string }
    email: { label: string; subject: string }
  }
  contactForm: {
    /* v1.1: etiquetas, consentimiento, estados (enviando, éxito, error) */
  }
  footer: { addressLabel: string; privacy: string; rights: string }
  notFound: { title: string; body: string; backHome: string }
}
```

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
    demoStore: false, // v2: muestra #demo y cambia el CTA secundario y el escenario
    contactForm: false, // v1.1: muestra el formulario en el cierre
  },
  hero: { activeHeadline: 'a' as const }, // ver 12 §6
  caseMrb: { disclosure: 'anonymized' as 'named' | 'anonymized' }, // 'named' cuando Brian autorice
  contact: {
    email: 'hola@alejandrodeveloper.com',
    whatsapp: '57XXXXXXXXXX', // sin "+" ni espacios (formato wa.me)
    calLink: { en: 'tu-usuario/15min', es: 'tu-usuario/15min-es' }, // un evento por idioma (07 §2.1)
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

El permiso de Brian no solo condiciona el testimonio y la métrica: también el **nombre** del cliente en tres lugares visibles. Por eso existe `site.caseMrb.disclosure`, y la versión anónima es la que se construye primero.

| Elemento | `named` (con permiso) | `anonymized` (por defecto) |
|---|---|---|
| Línea de confianza (hero) | "Built the catalog and quote system for Malone Road Belt, Kentucky." | "Built the catalog and quote system for a U.S. industrial supplier." Sin estado ni producto exacto, que lo harían identificable |
| CTA secundario (v1) | "See the Malone Road Belt case" | "See the industrial supplier case" |
| Título de la sección | "Malone Road Belt: from phone quotes to online requests" (sugerencia) | "An industrial supplier: from phone quotes to online requests" (sugerencia) |
| Capturas | Sitio anterior (archive.org) y nuevo, escritorio y móvil | Recortes sin logo ni nombre, o maquetas genéricas |
| Enlace a malonebelt.com | Sí | No |
| Métrica de cotizaciones | Solo si Brian la autoriza | No |
| Testimonio | Solo si Brian lo envía | No |

Los textos en español siguen la misma lógica. La fecha límite para decidir es el **14 de octubre** ([13](./13-plan-de-implementacion.md)).

## 7. Variantes del titular

- `hero.headlines` tiene tres variantes por idioma (roadmap §4):

  | Variante | EN | ES |
  |---|---|---|
  | `a` | From "call for pricing" to "add to cart". | De "precio por interno" a "agregar al carrito". |
  | `b` | Your website should take orders, not just look nice. | Tu sitio debería recibir pedidos, no solo verse bien. |
  | `c` | See your new store working in 5 days. | Ve tu nueva tienda funcionando en 5 días. |

- `site.hero.activeHeadline` elige la variante activa en ambos idiomas.
- La comparación es por ventana de fechas, con un registro en [12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares).

## 8. Precios por país del visitante

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
<!-- Price (Server Component) renderiza ambas -->
<span data-only-market="us">From US$3,000</span>
<span data-only-market="co">From COP 3,000,000</span>
```

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
  findings: Array<{ title: string; evidence: string; image?: ImageRef }> // 3 hallazgos verificables
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
