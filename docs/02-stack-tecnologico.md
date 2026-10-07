# 02 · Stack tecnológico

Next.js 16.3 (App Router) con TypeScript y Tailwind CSS 4. El sitio se exporta como archivos estáticos y se publica en Cloudflare Workers, plan gratuito. En la v1 no hay librerías de UI, de i18n, de animación ni de MDX: el stack es lo mínimo que cumple el roadmap en 7,5 h y saca 90 o más en Lighthouse móvil.

Versiones verificadas el 3 de octubre de 2026; hosting y analítica, el 4 de octubre. Las versiones exactas se fijan en `package.json` y `pnpm-lock.yaml` al hacer el scaffold.

---

## 1. Stack

| Capa | Herramienta | Versión mínima | Rol | Por qué | Costo |
|---|---|---|---|---|---|
| Framework | [Next.js](https://nextjs.org/blog/next-16-3) (App Router) | **16.3.8** | Rutas, render estático exportado con `output: 'export'`, metadata, fuentes | Tu stack actual. 16.3.8 es el parche de seguridad del 30-sep-2026 de la línea Active LTS ([anuncio](https://nextjs.org/blog/september-2026-security-release)) | — |
| UI | React | 19 (incluido por Next) | Componentes de servidor y 4 islas de cliente | Viene con Next; no se instala aparte | — |
| Lenguaje | TypeScript | 5.x, `strict: true` | Tipos del contenido, la configuración y los eventos | Hace que falte una traducción sea un error de compilación ([04](./04-i18n-contenido-y-precios.md)) | — |
| Estilos | [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/nextjs) + `@tailwindcss/postcss` | 4.3 | Utilidades y tokens de diseño en CSS (`@theme`) | Configuración en CSS, sin `tailwind.config.js`; variantes `motion-safe:` y `motion-reduce:` | — |
| Fuentes | `next/font` | Incluido | Una fuente variable autoalojada (p. ej. Inter o Geist) | Sin peticiones a Google en tiempo de ejecución; `adjustFontFallback` reduce el CLS | — |
| Imágenes | `next/image` con `unoptimized` + archivos ya optimizados | Incluido | Dimensiones fijas (sin CLS), carga diferida, escritorio o móvil con `<picture>` y `getImageProps()` | El export no incluye el optimizador de imágenes ([docs](https://nextjs.org/docs/app/guides/static-exports)). Las imágenes se exportan en WebP o AVIF con las medidas de [06 §4](./06-secciones-y-ui.md#4-imágenes) | — |
| i18n | Nativo: `[locale]` + [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) + diccionarios TS | Next ≥ 16.3 | Idiomas `/en` y `/es` | Patrón oficial; 0 KB en el cliente ([ADR-003](./14-decisiones.md#adr-003)) | — |
| Animación | CSS `@keyframes` + SVG inline | — | Hook A | 0 KB de JS; se ejecuta antes de la hidratación ([ADR-006](./14-decisiones.md#adr-006)) | — |
| Hosting y CDN | [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) (plan Free) con *static assets* | — | CDN de los archivos de `out/`; un Worker mínimo para 3 redirecciones y, en la v1.1, el formulario | Gratis y sin restricción de uso comercial; las solicitudes a archivos estáticos son ilimitadas ([ADR-017](./14-decisiones.md#adr-017)) | US$0 |
| Builds y previews | [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) | — | Build y despliegue desde GitHub; una preview por rama | Integrado con Cloudflare; 3.000 minutos de build al mes en el plan Free ([límites](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)) | US$0 |
| CLI y configuración | [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (dependencia de desarrollo) | **≥ 4.135** | `wrangler.jsonc`, `wrangler dev`, secretos, rollback | Las previews por rama exigen 4.135.0 o más ([docs](https://developers.cloudflare.com/workers/previews/)) | — |
| Analítica | [Umami Cloud](https://umami.is/pricing) (plan Hobby) | Script de Umami Cloud | Páginas vistas, eventos personalizados y UTM | Sin cookies, ~2,3 KB y reporte de UTM incluido ([ADR-018](./14-decisiones.md#adr-018)) | US$0 |
| Rendimiento real (opcional) | [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) | — | Core Web Vitals (LCP, INP, CLS) de usuarios reales | Gratis y sin cookies; se activa si hacen falta datos de campo ([12 §2](./12-medicion-y-analitica.md#2-herramientas)) | US$0 |
| Agenda | [Cal.com](https://cal.com/pricing) (Free), embed por clic | Embed oficial | Llamadas de 15 min | Hora del visitante, UTM guardados, eventos del embed ([ADR-007](./14-decisiones.md#adr-007)) | US$0 |
| Correo del dominio | [Google Workspace Business Starter](https://workspace.google.com/intl/es-419/pricing.html) | — | `hola@`, prospección, calendario | Lo recomienda el diagnóstico; buena entregabilidad | US$7/mes anual (COP 29.200) |
| Correo transaccional (v1.1) | [Resend](https://resend.com/pricing) + SDK `resend` | Actual | Envío del formulario al buzón, desde el Worker | Plan gratuito suficiente; subdominio aislado ([ADR-010](./14-decisiones.md#adr-010)). Sus reglas prohíben la prospección en frío: solo se usa para el formulario | US$0 |
| Validación (v1.1) | [Zod](https://zod.dev/v4/versioning) | 4.6 (`import * as z from "zod"`) | Validar el cuerpo de `/api/contact` | Solo en el Worker: no pesa en el navegador | — |
| JSON-LD | [`schema-dts`](https://www.npmjs.com/package/schema-dts) (dev) | Actual | Tipos para Person y ProfessionalService | Lo recomienda la [guía de Next](https://nextjs.org/docs/app/guides/json-ld) | — |
| Paquetes | [pnpm](https://pnpm.io/installation) | 12 | Instalación y lockfile | Rápido y estricto. La imagen de Workers Builds trae pnpm 10.11.1, así que se fija la versión con la variable `PNPM_VERSION` ([imagen de build](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)) | — |
| Runtime | Node.js | **24.x** | Builds | Workers Builds usa Node 24.18.0 por defecto y respeta `.nvmrc`. El Worker no corre en Node, sino en el runtime de Cloudflare | — |
| Lint | ESLint + `eslint-config-next` (flat config) | **9.39.x** + 16.3.8 | Calidad de código | `next lint` ya no existe. **ESLint 10 aún rompe la configuración de Next** ([PR #99628](https://github.com/vercel/next.js/pull/99628)) | — |
| Formato | Prettier + `prettier-plugin-tailwindcss` | 3.x | Formato uniforme y orden de clases | Estándar del ecosistema | — |
| Pruebas (v1.1) | [Playwright](https://playwright.dev) + `@axe-core/playwright` | 1.63 + 4.13 | Humo end-to-end y accesibilidad | Probar redirecciones, mercado, noindex y JSON-LD contra `wrangler dev`, igual que en producción | — |
| Rendimiento en CI (v1.1) | Lighthouse CI (`@lhci/cli`) | 0.15 | Presupuestos como advertencias | Corre Lighthouse 12.6, mientras PSI usa 13.5, así que no sirve como criterio de aceptación ([issue](https://github.com/GoogleChrome/lighthouse-ci/issues/1136)) | — |
| CI (v1.1) | GitHub Actions | — | Lint, tipos, build, pruebas | Gratis para repositorios privados dentro de la cuota | US$0 |
| Repositorio | GitHub (privado) | — | Código y docs; dispara los builds de Cloudflare | Integración nativa con Workers Builds | US$0 |

## 2. Lo que no se usa en la v1 (y por qué)

| Herramienta | Por qué no | Cuándo reconsiderarla |
|---|---|---|
| next-intl (4.14) | Dos idiomas y una página no justifican una librería; el patrón nativo no envía código al cliente | Si el sitio pasa de ~5 páginas o necesita plurales y formatos complejos |
| `proxy.ts` (antes `middleware.ts`) | El export estático no lo soporta, y además correría en cada visita. La redirección de `/` va en el Worker ([ADR-004](./14-decisiones.md#adr-004)) | Si la detección de mercado por zona horaria falla, el plan B usa el Worker ([ADR-005](./14-decisiones.md#adr-005)) |
| OpenNext o vinext (Next.js completo en Workers) | El sitio es estático: no hace falta ejecutar Next en el servidor, y cada página contaría para el límite diario del Worker ([ADR-017](./14-decisiones.md#adr-017)) | Si el sitio necesita render dinámico |
| `next/link` para la navegación interna | En exports de Next 16, su prefetch pide los payloads RSC en rutas equivocadas y da 404 ([issue #85374](https://github.com/vercel/next.js/issues/85374)). Entre páginas estáticas, un `<a>` es igual de rápido | Cuando Next corrija el issue |
| MDX | La política se escribe en TSX; las propuestas, como objetos tipados con una sola plantilla ([ADR-011](./14-decisiones.md#adr-011)) | Si aparece un blog |
| Motion (antes Framer Motion, v14) | El hook se resuelve con CSS: 0 KB frente a ~20 KB de `LazyMotion` + `domAnimation` ([ref.](https://motion.dev/docs/react-reduce-bundle-size)) | Si se necesitan animaciones con gestos o arrastre |
| shadcn/ui | Se necesitan 3 o 4 componentes simples; las preguntas frecuentes usan `<details>` nativo ([ADR-015](./14-decisiones.md#adr-015)) | Si el formulario o futuras páginas crecen |
| CMS headless | Los textos cambian poco y viven versionados en Git | Si alguien más va a editar contenido |
| Base de datos | No hay datos que guardar en v1 ni en v1.1 | En la v3, para guardar leads del diagnóstico |
| Server Actions y Route Handlers dinámicos | El export no los soporta. El formulario usa un endpoint del Worker ([ADR-009](./14-decisiones.md#adr-009)) | — |
| GA4 / PostHog | Más peso (PostHog ronda 50–100 KB comprimidos según mediciones de la comunidad) y GA4 usa cookies, que piden banner ([ADR-018](./14-decisiones.md#adr-018)) | Si se necesitan embudos avanzados o grabaciones de sesión |
| Calendly | El plan gratuito permite 1 tipo de evento y menos control del embed ([ADR-007](./14-decisiones.md#adr-007)) | — |
| Turnstile | Solo si aparece spam en el formulario. Es gratis y el token se verifica en el Worker ([07 §5.3](./07-integraciones.md#53-capas-antispam)) | v1.1 o después, según el spam |
| Workers Cache | Si se activa, las solicitudes a archivos estáticos pasan a cobrarse ([Cloudflare](https://developers.cloudflare.com/workers/cache/)) | — |

## 3. Entorno local

Tu máquina tiene Node 26 y no tiene pnpm. Para que lo local coincida con el build de Cloudflare:

```bash
nvm install 24 && nvm use 24          # misma versión que Workers Builds
npm install -g pnpm@12                 # no dependas de Corepack
echo "24" > .nvmrc                     # en la fase 0, dentro del repositorio
pnpm add -D wrangler                   # en el scaffold: la CLI de Cloudflare va como dependencia del proyecto
```

En `package.json` van `"engines": { "node": "24.x" }`, `"packageManager": "pnpm@12.9.1"` y estos scripts (así quedaron en el scaffold, F0-08):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "next build && wrangler dev",
    "lint": "eslint",
    "typecheck": "next typegen && tsc --noEmit && tsc -p worker --noEmit",
    "format": "prettier --write .",
    "cf-typegen": "wrangler types worker/worker-configuration.d.ts"
  }
}
```

- **`pnpm dev`** (puerto 3000) sirve para construir. No ejecuta el Worker ni `_headers`, así que ahí `/` no redirige.
- **`pnpm preview`** (puerto 8787) sirve `out/` con el Worker, los encabezados y el 404, igual que en Cloudflare. Úsalo antes de cada PR; la CI también lo usa.
- **`pnpm typecheck`** revisa la app y el Worker por separado: el Worker tiene su propio `worker/tsconfig.json` con los tipos del runtime de Cloudflare, que chocarían con los del navegador.
- **`pnpm cf-typegen`** regenera `worker/worker-configuration.d.ts` (el tipo `Env` y los tipos del runtime) a partir de `wrangler.jsonc`. El archivo se commitea; hay que regenerarlo cuando cambien los bindings, por ejemplo en la v1.1.
- **`pnpm-workspace.yaml`:** pnpm 12 solo ejecuta los scripts de instalación aprobados. Se permiten los de `esbuild` y `workerd` (los usa Wrangler) y se bloquean `sharp` y `unrs-resolver`, que el sitio no necesita.

## 4. Política de versiones

- **Versiones exactas** en `package.json`, sin `^` ni `~` en `next`, `react` y `react-dom`, más el lockfile commiteado.
- **Dependabot** (o Renovate) semanal para dependencias de desarrollo, y revisión manual de Next.js.
- **Parches de seguridad de Next.js en menos de 48 h.** Next 16.3 publica parches de seguridad, como el 16.3.8 del 30-sep.
- **No actualizar a ESLint 10** hasta que `eslint-config-next` lo soporte.
- **Wrangler ≥ 4.135**, que exigen las previews por rama.
- **Node:** Node 24 pasa a mantenimiento el 20-oct-2026 y Node 26 será LTS activa desde el 28-oct. Se sube a 26 cambiando `.nvmrc` cuando un build de prueba en Workers Builds pase con esa versión.

## 5. Costo mensual

| Concepto | Detalle | US$/mes |
|---|---|---|
| Cloudflare Workers Free | Archivos estáticos gratis e ilimitados; 100.000 invocaciones del Worker al día; 3.000 minutos de build al mes | 0 |
| Google Workspace | Business Starter, 1 usuario: US$7 anual u US$8,40 flexible; en Colombia COP 29.200 (anual), con precio de lanzamiento de COP 26.280 los primeros 12 meses | 7 |
| Dominio .com | US$10,46 al año en Cloudflare Registrar; ≈ US$11,17 desde el 1-nov-2026 | ~1 |
| Umami, Cal.com y Resend | Planes gratuitos | 0 |
| **Total** | | **≈ 8** |

Detalle y fuentes en [10 §10](./10-infraestructura-y-entornos.md#10-costos).

## Fuentes

Consultadas el 3-oct-2026 (hosting y analítica, el 4-oct-2026):

- [Next.js 16.3](https://nextjs.org/blog/next-16-3)
- [Security release de septiembre de 2026](https://nextjs.org/blog/september-2026-security-release)
- [Next.js: export estático](https://nextjs.org/docs/app/guides/static-exports)
- [Issue #85374 (prefetch de `next/link` en exports)](https://github.com/vercel/next.js/issues/85374)
- [Guía de internacionalización](https://nextjs.org/docs/app/guides/internationalization)
- [ESLint en Next](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Tailwind con Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Cloudflare: static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare: precios de Workers](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare: imagen de Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [Cloudflare: previews de Workers](https://developers.cloudflare.com/workers/previews/)
- [Precios de Umami](https://umami.is/pricing)
- [Calendario de Node.js](https://github.com/nodejs/Release)
- [Precios de Cal.com](https://cal.com/pricing)
- [Precios de Resend](https://resend.com/pricing)
- [Precios de Google Workspace (Colombia)](https://workspace.google.com/intl/es-419/pricing.html)
- [Motion: tamaño del bundle](https://motion.dev/docs/react-reduce-bundle-size)
- [Zod v4](https://zod.dev/v4/versioning)
