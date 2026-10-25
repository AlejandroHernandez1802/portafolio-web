# 08 · SEO

El SEO de la v1 cubre exactamente lo que pide el roadmap (§7):

- Título y descripción por idioma.
- Imagen para compartir (Open Graph) por idioma.
- Datos estructurados Person y ProfessionalService.
- Sitemap con hreflang.

A eso se suma el `noindex` de las propuestas y la demo. Desde la reestructuración del 24-oct ([ADR-020](./14-decisiones.md#adr-020)), **cada caso tiene su página indexable** con canónica, `hreflang`, imagen OG y JSON-LD propios (§2.1 y §4.1). Todo se genera en el build con la Metadata API de Next.js; nada se calcula en tiempo de ejecución.

El sitio también aplica lo que vendes ("que te encuentren en Google y en las respuestas de IA"): contenido claro en HTML, datos de entidad consistentes y rastreo abierto.

---

## 1. Objetivos

| Objetivo | Indicador |
|---|---|
| Que `/en` y `/es` se indexen como versiones alternas de la misma página | Search Console muestra ambas URL indexadas, con la canonical correcta |
| Que al compartir el enlace (correo, LinkedIn, WhatsApp) se vea una tarjeta cuidada | La vista previa muestra la imagen OG del idioma correcto, distinta para la home y para el caso |
| Que el caso MRB se encuentre como página propia | `/en/work/malone-road-belt` y `/es/trabajos/malone-road-belt` indexadas como alternas, con `Article` y `BreadcrumbList` válidos |
| Que buscadores e IA entiendan quién eres, qué ofreces y dónde | JSON-LD válido en el [Rich Results Test](https://search.google.com/test/rich-results) y en el [Schema Validator](https://validator.schema.org/) |
| Que las propuestas y la demo nunca aparezcan en buscadores | `X-Robots-Tag: noindex` en cada respuesta; ausentes del sitemap |

## 2. Metadata por idioma

| Campo | `/en` | `/es` |
|---|---|---|
| `title` (≤ 60 caracteres) | Online stores & quote systems \| Alejandro Hernández | Tiendas y catálogos con cotizador \| Alejandro Hernández |
| `description` (≤ 155 caracteres) | I build online stores and quote systems for businesses that sell products. See a working prototype in 5 days before committing. | Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ve un prototipo funcionando en 5 días. |
| `canonical` | `/en` | `/es` |
| `alternates.languages` | `en: /en`, `es: /es`, `x-default: /` | Igual |
| `og:locale` | `en_US` (alterno `es_CO`) | `es_CO` (alterno `en_US`) |
| Imagen OG | `/og/og-en.png` (1200 × 630) | `/og/og-es.png` (1200 × 630) |

Los títulos y descripciones viven en `content/{en,es}.ts` → `meta`. `x-default` apunta a `/`, que redirige según el idioma del navegador: es el patrón para páginas de inicio con selección automática de idioma.

```ts
// src/app/[locale]/page.tsx (extracto ilustrativo)
export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const c = getContent(locale)
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: `/${locale}`, languages: { en: '/en', es: '/es', 'x-default': '/' } },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: site.name,
      locale: locale === 'en' ? 'en_US' : 'es_CO',
      alternateLocale: locale === 'en' ? ['es_CO'] : ['en_US'],
      title: c.meta.title,
      description: c.meta.description,
      // Solo si public/og/og-{locale}.png existe (publicFileExists); si no, sin imagen y card 'summary'
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: c.meta.ogImageAlt }] }),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}
// En el root layout: metadataBase: new URL(site.url) y, mientras site.indexable sea false, robots noindex
```

La política de privacidad tiene su propio `title` y `description`, y alternates `/en/privacy` ↔ `/es/privacy`.

### 2.1 Páginas de caso

`caseMetadata(lang, slug)`, en `src/components/case/CasePage.tsx`, arma la metadata de cada caso a partir de `cases.<id>.page.meta` y de `cases.ts`:

| Campo | `/en/work/malone-road-belt` | `/es/trabajos/malone-road-belt` |
|---|---|---|
| `title` | Malone Road Belt case: catalog and quote system \| Alejandro Hernández | Caso Malone Road Belt: catálogo y cotizador \| Alejandro Hernández |
| `description` | How I built the catalog, the OEM part-number search and the quote requests of Malone Road Belt, a U.S. industrial belt supplier, in English, Portuguese and Spanish. | Cómo construí el catálogo, el buscador por referencia OEM y el cotizador de Malone Road Belt, un proveedor de correas industriales de EE. UU., en inglés, portugués y español. |
| `canonical` | `/en/work/malone-road-belt` | `/es/trabajos/malone-road-belt` |
| `alternates.languages` | `en`, `es` y `x-default` → la ruta en inglés | Igual |
| `og:type` | `article`, con `publishedTime` y `modifiedTime` (`published` y `updated` de `cases.ts`) | Igual |
| Imagen OG | `/og/case-mrb-en.png` | `/og/case-mrb-es.png` |

- **`x-default` va a la ruta en inglés,** no a `/`: la redirección de `/` solo lleva a la home, y la versión en inglés es la de por defecto.
- **`<html lang>`** sale del layout `[locale]`, así que cada página del caso lo tiene correcto.
- **Las fechas** (`published` y `updated`, 2026-11-06) llevan `REVIEW(R-08)` hasta el día de la publicación.

## 3. Imágenes Open Graph

- **Home y casos: cuatro PNG generados en local** con `pnpm media:og` (`scripts/build-og.mjs`, R-09): `public/og/og-en.png`, `og-es.png`, `case-mrb-en.png` y `case-mrb-es.png`, de 1200 × 630 y entre 124 y 136 KB, frente a un límite de 300 KB.
  - **Cómo se generan:** Chrome headless dibuja `scripts/og/template.html` a 2× con las fuentes del sitio (Archivo de `src/fonts/` y Plex Mono 500 de `scripts/og/fonts/`, con su OFL), los colores de `globals.css` leídos al correr y las capturas. sharp lo baja a 1200 × 630 y lo guarda como PNG de 256 colores; si una imagen pasara de 300 KB, bajaría a menos colores. Tarda ~11 s.
  - **El copy sale de los archivos tipados** (`content/{en,es,site,cases}.ts` y `lib/cases.ts`), que Node 24 importa directamente; la plantilla no tiene texto propio.
  - **Home:** el nombre y el descriptor arriba, `ALEJANDRODEVELOPER.COM` en mono, el titular activo en dos líneas con el tachado y el marcador, la home de MRB en un marco de navegador y el cotizador en uno de celular, y la cifra "5 días hábiles · para ver tu prototipo navegable, gratis".
  - **Caso:** la misma barra, `card.meta` en mono cobalto, el título del caso como H1, el cotizador de MRB en el navegador y su home en el celular, y una banda azul con "3 · idiomas: inglés, portugués y español". Cuando exista la cifra de cotizaciones, ocupa ese lugar en la siguiente corrida.
  - **Las versiones en español muestran el sitio de MRB en inglés:** solo hay capturas en inglés.
  - **No se actualizan solas:** hay que correr `pnpm media:og` cuando cambian el titular, el título del caso, una cifra o una captura, y commitear los PNG.
  - **La metadata las agrega solo si el archivo existe** (`publicFileExists()`); si falta, la página sale sin imagen y con `twitter:card` `summary`.
- **Propuestas (v1.1): generadas con `next/og`** (`opengraph-image.tsx` en `p/[slug]`), con el nombre del prospecto en el título. Límites de `ImageResponse`:
  - Fuentes `ttf`, `otf` o `woff` (no `woff2`).
  - Solo flexbox.
  - Paquete de hasta 500 KB.
  - Con el export estático, la imagen se genera en el build: el archivo lleva `export const dynamic = 'force-static'` y `generateStaticParams` ([04 §9](./04-i18n-contenido-y-precios.md#9-propuestas-web-v11)).

  Fuente: [docs de `ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response).
- **Verificación:** [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), la vista previa de WhatsApp (enviándote el enlace) y [opengraph.xyz](https://www.opengraph.xyz/).

## 4. Datos estructurados (JSON-LD)

Un solo `@graph` por idioma en la página principal, con tres entidades enlazadas por `@id`: el sitio, tú (Person) y tu servicio (ProfessionalService, subtipo de LocalBusiness).

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://alejandrodeveloper.com/#website",
      "url": "https://alejandrodeveloper.com/",
      "name": "Alejandro Hernández",
      "inLanguage": ["en", "es"],
      "publisher": { "@id": "https://alejandrodeveloper.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://alejandrodeveloper.com/#person",
      "name": "Alejandro Hernández",
      "jobTitle": "Software engineer · Online stores and quote systems",
      "url": "https://alejandrodeveloper.com/",
      "knowsLanguage": ["en", "es"],
      "knowsAbout": ["E-commerce", "B2B quote systems", "Product catalogs", "Next.js"]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://alejandrodeveloper.com/#service",
      "name": "Alejandro Hernández · Online stores and catalogs",
      "url": "https://alejandrodeveloper.com/en",
      "image": "https://alejandrodeveloper.com/og/og-en.png",
      "email": "hola@alejandrodeveloper.com",
      "founder": { "@id": "https://alejandrodeveloper.com/#person" },
      "areaServed": [
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Colombia" }
      ],
      "priceRange": "US$150–US$3,000+",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "…",
        "addressLocality": "…",
        "addressRegion": "…",
        "postalCode": "…",
        "addressCountry": "CO"
      }
    }
  ]
}
```

**Reglas:**

- **Sin `worksFor`.** No se nombra al empleador actual (roadmap §5 y §10).
- **`sameAs` con LinkedIn** (decidido el 25-oct, [ADR-025](./14-decisiones.md#adr-025)). El sitio ya enlaza tu perfil en Sobre mí, el menú y el pie, así que `sameAs` no expone nada nuevo y ayuda a que buscadores e IA confirmen tu identidad. Lo que muestre el perfil (incluido el empleo actual) queda a la vista de quien entre; el sitio sigue sin nombrar al empleador.
- **`address`.** Google lo exige para LocalBusiness y sus subtipos ([Google](https://developers.google.com/search/docs/appearance/structured-data/local-business)). Se usa la **misma dirección postal del pie** (CAN-SPAM). Con un buzón virtual, se mantiene igual: estos datos no buscan resultados enriquecidos de negocio local.
- **`priceRange`.** Menos de 100 caracteres y en USD fijo, porque el JSON-LD es estático.
- **Versión en español:** cambian `name`, `jobTitle`, `url` (`/es`) e `image` (`og-es.png`).
- **`image` de Person:** se agrega con el retrato 1:1 (`portrait/square`, R-09) cuando exista. Hoy no lo lleva.
- **`address`:** solo se agrega cuando `site.legal.postalAddress` deja de ser el marcador (F0-07).

**Render** ([guía de Next](https://nextjs.org/docs/app/guides/json-ld)):

- Se usa un `<script type="application/ld+json">` nativo, no `next/script`, porque no es código ejecutable.
- Se escapa `<` con `JSON.stringify(data).replace(/</g, '\\u003c')`.
- Se tipa con `schema-dts` (`Graph`).
- Los constructores viven en `src/lib/jsonld.ts`: `homeJsonLd()` y `caseJsonLd()`.

### 4.1 Páginas de caso

Cada página de caso lleva su propio `@graph` con un `Article`, un `Person` y un `BreadcrumbList`. El `Person` es una versión corta del de la home (nombre, cargo y URL) con el mismo `@id`. Así el autor tiene nombre aunque un lector, como la prueba de resultados enriquecidos de Google, lea la página sola, y el `@id` compartido permite que los buscadores unan los dos nodos:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://alejandrodeveloper.com/es/trabajos/malone-road-belt#article",
      "headline": "De cotizar por teléfono a recibir solicitudes en línea",
      "description": "Cómo construí el catálogo, el buscador por referencia OEM y el cotizador de Malone Road Belt…",
      "url": "https://alejandrodeveloper.com/es/trabajos/malone-road-belt",
      "mainEntityOfPage": "https://alejandrodeveloper.com/es/trabajos/malone-road-belt",
      "inLanguage": "es",
      "datePublished": "2026-11-06",
      "dateModified": "2026-11-06",
      "author": { "@id": "https://alejandrodeveloper.com/#person" },
      "publisher": { "@id": "https://alejandrodeveloper.com/#person" },
      "about": { "@type": "Organization", "name": "Malone Road Belt", "url": "https://www.malonebelt.com" },
      "image": "https://alejandrodeveloper.com/og/case-mrb-es.png"
    },
    {
      "@type": "Person",
      "@id": "https://alejandrodeveloper.com/#person",
      "name": "Alejandro Hernández",
      "jobTitle": "Ingeniero de software · Tiendas y catálogos con cotizador",
      "url": "https://alejandrodeveloper.com/"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://alejandrodeveloper.com/es/trabajos/malone-road-belt#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://alejandrodeveloper.com/es" },
        { "@type": "ListItem", "position": 2, "name": "Trabajo", "item": "https://alejandrodeveloper.com/es#trabajo" },
        { "@type": "ListItem", "position": 3, "name": "Malone Road Belt", "item": "https://alejandrodeveloper.com/es/trabajos/malone-road-belt" }
      ]
    }
  ]
}
```

- **`headline`** es el H1 del caso (`page.hero.title`), y `description`, la de su metadata.
- **`about`** nombra al cliente porque MRB está en `disclosure: 'named'` ([04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure)).
- **Sin `worksFor`**, igual que en la home.
- **La miga visible** dice "Trabajo / Malone Road Belt"; el `BreadcrumbList` agrega "Inicio" como primer nivel.

## 5. Sitemap y robots

```ts
// src/app/sitemap.ts (extracto)
export const dynamic = 'force-static' // obligatorio con output: 'export'

// Una entrada por página e idioma, cada una con sus dos versiones como alternas:
// home, trabajo, servicios, sobre mí, política y cada caso = 12 URLs con MRB. Nunca /p/*.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { paths: homeAlternates, lastModified: new Date() },
    { paths: privacyAlternates, lastModified: new Date(site.legal.privacyVersion) },
    ...cases.map((c) => ({ paths: caseAlternates(c.id), lastModified: new Date(c.updated) })),
  ]
  return pages.flatMap(({ paths, lastModified }) =>
    (['en', 'es'] as const).map((l) => ({
      url: `${site.url}${paths[l]}`,
      lastModified,
      alternates: { languages: { en: `${site.url}${paths.en}`, es: `${site.url}${paths.es}` } },
    })),
  )
}
```

Con `alternates.languages`, Next genera las etiquetas `xhtml:link hreflang` ([docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)). Las rutas salen de `src/lib/routes.ts` y los casos de `content/cases.ts`, así que un caso nuevo entra al sitemap sin tocar este archivo.

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export const dynamic = 'force-static' // obligatorio con output: 'export'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${site.url}/sitemap.xml` }
}
```

- **`force-static` es obligatorio con el export.** Sin esa línea, el build con `output: 'export'` falla en estas rutas, como en cualquier Route Handler que no se declare estático ([Next.js](https://nextjs.org/docs/app/guides/static-exports)).
- **No se bloquean los rastreadores de IA** (GPTBot, ClaudeBot, PerplexityBot…): que te citen en respuestas de IA es parte de lo que vendes.
- **No se bloquea `/p/` en `robots.txt`.** Si se bloqueara, los buscadores no podrían leer el `noindex`, y una URL enlazada desde fuera podría indexarse sin contenido (§6).

## 6. Noindex de propuestas y demo

| Capa | Propuestas `/[locale]/p/[slug]` (v1.1) | Demo `demo.alejandrodeveloper.com` (v2) |
|---|---|---|
| Meta robots | `robots: { index: false, follow: false }` en `generateMetadata` | La define la demo |
| Header HTTP | `X-Robots-Tag: noindex, nofollow` vía `public/_headers` (abajo) | `X-Robots-Tag: noindex, nofollow` en **todas** sus rutas ([07 §6](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración)) |
| Sitemap | Excluidas | Sin sitemap |
| `robots.txt` | **Sin** `Disallow`, para que se vea el `noindex` | Ídem |
| Descubrimiento | Slug no adivinable (empresa + 6 caracteres aleatorios), sin enlaces internos | Solo enlazada desde `#demo` |

```text
# public/_headers (extracto; el archivo completo está en 09 §2)
/en/p/*
  X-Robots-Tag: noindex, nofollow

/es/p/*
  X-Robots-Tag: noindex, nofollow
```

**Previews.** Las previews de Cloudflare en `workers.dev` envían `X-Robots-Tag: noindex` ([Cloudflare](https://developers.cloudflare.com/workers/previews/custom-domains/)), y `_headers` lo refuerza para cualquier URL de `workers.dev`. Así no compiten con producción. Confírmalo con `curl -I` en una URL de preview. La URL `workers.dev` de producción queda desactivada (`workers_dev: false`), porque esa no envía `noindex`.

## 7. Indexación: Search Console y Bing

1. **Google Search Console:**
   - Propiedad de tipo **dominio**, verificada con un TXT en el DNS ([10 §3](./10-infraestructura-y-entornos.md#3-tabla-dns)).
   - Enviar `https://alejandrodeveloper.com/sitemap.xml`.
   - Inspeccionar `/en`, `/es` y las dos páginas del caso, y solicitar la indexación.
2. **Bing Webmaster Tools:** importar el sitio desde Search Console (5 minutos). Bing alimenta Copilot y parte de los resultados web de la búsqueda de ChatGPT, así que estar indexado ahí sirve para la visibilidad en IA. No hace falta IndexNow: el sitio cambia poco.
3. **Después del lanzamiento:** revisar en Search Console la cobertura y las páginas indexadas cada viernes, durante las primeras 4 semanas.

## 8. Visibilidad en respuestas de IA (aplicar lo que vendes)

- **Afirmaciones claras en HTML:** quién (tu nombre), qué (tiendas y catálogos con cotizador), para quién (negocios que venden productos; industriales y B2B), dónde (EE. UU. y Colombia) y desde cuánto (precios "desde").
- **Preguntas frecuentes** como texto real en el HTML (`<details>` deja el contenido en el DOM).
- **Caso con hechos verificables y página propia:** qué se construyó, las cifras del catálogo tomadas de malonebelt.com y, cuando la confirmes, la de cotizaciones. Nada sin verificar en pantalla.
- **Datos consistentes:** el mismo nombre, correo y dirección en el sitio, el JSON-LD, la firma de correo y tus perfiles.
- **Rastreo abierto:** sitio rápido y renderizado en el servidor, sin contenido que dependa de JavaScript.

## 9. Checklist SEO de lanzamiento

- [ ] `site.indexable = true`. Durante el prelanzamiento (desde F0-08), todo el sitio lleva `noindex` para que no se indexe a medio construir ([13 §4](./13-plan-de-implementacion.md#4-fase-0-3-al-11-de-octubre)).
- [ ] `title` y `description` distintos en `/en` y `/es`; ninguno duplicado.
- [ ] `<html lang>` correcto en cada idioma.
- [ ] Canonical y hreflang (`en`, `es`, `x-default`) en el HTML y en el sitemap, en la home, la política y los dos casos.
- [ ] El sitemap tiene 12 URLs: `/en`, `/es`, `/en/work`, `/es/trabajos`, `/en/services`, `/es/servicios`, `/en/about`, `/es/sobre-mi`, `/en/privacy`, `/es/privacy`, `/en/work/malone-road-belt` y `/es/trabajos/malone-road-belt` ([ADR-024](./14-decisiones.md#adr-024), [ADR-025](./14-decisiones.md#adr-025)).
- [ ] Las páginas del caso tienen `og:type` `article`, `og:image` propia, `Article` y `BreadcrumbList` sin errores. Verificado en el HTML exportado el 24-oct; falta el Rich Results Test en producción.
- [ ] `/es/work/malone-road-belt`, `/en/trabajos/malone-road-belt` y `/en/work` responden 404.
- [ ] OG de la home y del caso, en cada idioma, probadas en LinkedIn Post Inspector y en WhatsApp. Si el titular o una cifra cambiaron, `pnpm media:og` antes de publicar.
- [ ] JSON-LD sin errores en el Rich Results Test y el Schema Validator, sin `worksFor` y con `sameAs` apuntando a LinkedIn.
- [ ] `robots.txt` y `sitemap.xml` accesibles; el sitemap no incluye `/p/`.
- [ ] `curl -I https://alejandrodeveloper.com/en/p/<slug>` muestra `x-robots-tag: noindex, nofollow` (v1.1).
- [ ] Search Console verificado y sitemap enviado; sitio importado en Bing.
- [ ] Un 404 real (status 404) en rutas inexistentes: Cloudflare sirve `out/404.html`.
- [ ] `curl -I` en una URL de preview (`*.workers.dev`) muestra `x-robots-tag: noindex`.

## Fuentes

- **Next.js:** [metadata y OG](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [JSON-LD](https://nextjs.org/docs/app/guides/json-ld), [export estático](https://nextjs.org/docs/app/guides/static-exports).
- **Cloudflare:** [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/), [previews y noindex](https://developers.cloudflare.com/workers/previews/custom-domains/).
- **Google:** [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) (actualizada el 8-sep-2026).
- **Herramientas:** [Rich Results Test](https://search.google.com/test/rich-results), [Schema Markup Validator](https://validator.schema.org/), [Bing Webmaster Tools](https://www.bing.com/webmasters).

Consultadas el 3-oct-2026; export estático y Cloudflare, el 4-oct-2026; páginas de caso, el 24-oct-2026.
