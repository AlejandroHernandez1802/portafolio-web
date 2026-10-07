# 08 · SEO

El SEO de la v1 cubre exactamente lo que pide el roadmap (§7):

- Título y descripción por idioma.
- Imagen para compartir (Open Graph) por idioma.
- Datos estructurados Person y ProfessionalService.
- Sitemap con hreflang.

A eso se suma el `noindex` de las propuestas y la demo. Todo se genera en el build con la Metadata API de Next.js; nada se calcula en tiempo de ejecución.

El sitio también aplica lo que vendes ("que te encuentren en Google y en las respuestas de IA"): contenido claro en HTML, datos de entidad consistentes y rastreo abierto.

---

## 1. Objetivos

| Objetivo | Indicador |
|---|---|
| Que `/en` y `/es` se indexen como versiones alternas de la misma página | Search Console muestra ambas URL indexadas, con la canonical correcta |
| Que al compartir el enlace (correo, LinkedIn, WhatsApp) se vea una tarjeta cuidada | La vista previa muestra la imagen OG del idioma correcto |
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

Los títulos y descripciones son *sugerencias*: viven en `content/{en,es}.ts` → `meta`. `x-default` apunta a `/`, que redirige según el idioma del navegador: es el patrón para páginas de inicio con selección automática de idioma.

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
      images: [{ url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: c.meta.ogImageAlt }],
    },
    twitter: { card: 'summary_large_image' },
  }
}
// En el root layout: export const metadata = { metadataBase: new URL(site.url) }
```

La política de privacidad tiene su propio `title` y `description`, y alternates `/en/privacy` ↔ `/es/privacy`.

## 3. Imágenes Open Graph

- **Página principal: dos PNG estáticos** (`public/og/og-en.png` y `og-es.png`, 1200 × 630, ≤ 300 KB). Llevan el titular, tu nombre y un elemento visual del hook. Se diseñan una vez (Figma o Canva) en la fase 0. Es más rápido que generarlas y no requiere fuentes en el build.
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
      "image": "https://alejandrodeveloper.com/images/about/alejandro.webp",
      "knowsLanguage": ["en", "es"],
      "knowsAbout": ["E-commerce", "B2B quote systems", "Product catalogs", "Next.js"]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://alejandrodeveloper.com/#service",
      "name": "Alejandro Hernández · Online stores and catalogs",
      "url": "https://alejandrodeveloper.com/",
      "image": "https://alejandrodeveloper.com/og/og-en.png",
      "email": "hola@alejandrodeveloper.com",
      "founder": { "@id": "https://alejandrodeveloper.com/#person" },
      "areaServed": [
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Colombia" }
      ],
      "priceRange": "US$350–US$3,000+",
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
- **`sameAs` es una decisión pendiente.** Enlazar LinkedIn ayuda a que buscadores e IA confirmen tu identidad, pero tu perfil probablemente muestra a tu empleador. Opciones:
  - No incluirlo.
  - Incluir solo GitHub.
  - Incluir LinkedIn cuando el perfil no exponga el empleo actual.
- **`address`.** Google lo exige para LocalBusiness y sus subtipos ([Google](https://developers.google.com/search/docs/appearance/structured-data/local-business)). Se usa la **misma dirección postal del pie** (CAN-SPAM). Con un buzón virtual, se mantiene igual: estos datos no buscan resultados enriquecidos de negocio local.
- **`priceRange`.** Menos de 100 caracteres y en USD fijo, porque el JSON-LD es estático.
- **Versión en español:** cambian `name`, `jobTitle` e `image` (`og-es.png`).

**Render** ([guía de Next](https://nextjs.org/docs/app/guides/json-ld)):

- Se usa un `<script type="application/ld+json">` nativo, no `next/script`, porque no es código ejecutable.
- Se escapa `<` con `JSON.stringify(data).replace(/</g, '\\u003c')`.
- Se tipa con `schema-dts` (`WithContext<ProfessionalService>`).
- Los constructores viven en `src/lib/jsonld.ts`.

## 5. Sitemap y robots

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export const dynamic = 'force-static' // obligatorio con output: 'export'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/privacy'] // nunca /p/*
  return paths.flatMap((p) =>
    (['en', 'es'] as const).map((l) => ({
      url: `${site.url}/${l}${p}`,
      lastModified: new Date(),
      alternates: { languages: { en: `${site.url}/en${p}`, es: `${site.url}/es${p}` } },
    })),
  )
}
```

Con `alternates.languages`, Next genera las etiquetas `xhtml:link hreflang` ([docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)).

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
   - Inspeccionar `/en` y `/es` y solicitar la indexación.
2. **Bing Webmaster Tools:** importar el sitio desde Search Console (5 minutos). Bing alimenta Copilot y parte de los resultados web de la búsqueda de ChatGPT, así que estar indexado ahí sirve para la visibilidad en IA. No hace falta IndexNow: el sitio cambia poco.
3. **Después del lanzamiento:** revisar en Search Console la cobertura y las páginas indexadas cada viernes, durante las primeras 4 semanas.

## 8. Visibilidad en respuestas de IA (aplicar lo que vendes)

- **Afirmaciones claras en HTML:** quién (tu nombre), qué (tiendas y catálogos con cotizador), para quién (negocios que venden productos; industriales y B2B), dónde (EE. UU. y Colombia) y desde cuánto (precios "desde").
- **Preguntas frecuentes** como texto real en el HTML (`<details>` deja el contenido en el DOM).
- **Caso con hechos verificables:** qué se construyó y, con permiso, la métrica.
- **Datos consistentes:** el mismo nombre, correo y dirección en el sitio, el JSON-LD, la firma de correo y tus perfiles.
- **Rastreo abierto:** sitio rápido y renderizado en el servidor, sin contenido que dependa de JavaScript.

## 9. Checklist SEO de lanzamiento

- [ ] `site.indexable = true`. Durante el prelanzamiento (desde F0-08), todo el sitio lleva `noindex` para que no se indexe a medio construir ([13 §4](./13-plan-de-implementacion.md#4-fase-0-3-al-11-de-octubre)).
- [ ] `title` y `description` distintos en `/en` y `/es`; ninguno duplicado.
- [ ] `<html lang>` correcto en cada idioma.
- [ ] Canonical y hreflang (`en`, `es`, `x-default`) en el HTML y en el sitemap.
- [ ] OG de cada idioma probada en LinkedIn Post Inspector y en WhatsApp.
- [ ] JSON-LD sin errores en el Rich Results Test y el Schema Validator, sin `worksFor` y con la decisión de `sameAs` tomada.
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

Consultadas el 3-oct-2026; export estático y Cloudflare, el 4-oct-2026.
