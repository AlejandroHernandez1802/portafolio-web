# 11 · Calidad, rendimiento y accesibilidad

La v1 se acepta con **PageSpeed Insights sobre producción**: Performance móvil ≥ 90 y LCP < 2,5 s, en `/en` y `/es`, mediana de 3 corridas. Además, la checklist manual de WCAG 2.2 AA debe pasar y el checklist de lanzamiento (§5) debe estar completo.

Las pruebas automáticas (Playwright, axe y Lighthouse CI) llegan en la v1.1. Lighthouse CI se usa como alarma de regresiones, no como criterio de aceptación: corre Lighthouse 12.6, mientras PSI usa la 13.5 ([issue](https://github.com/GoogleChrome/lighthouse-ci/issues/1136)).

---

## 1. Presupuestos de rendimiento

| Métrica | Objetivo | Herramienta | Momento |
|---|---|---|---|
| Lighthouse Performance (móvil) | **≥ 90** | PSI sobre producción, `/en` y `/es`, mediana de 3 | Antes de publicar y en cada versión |
| LCP (laboratorio, móvil) | **< 2,5 s**; el elemento LCP es el `<h1>` | PSI y DevTools → Performance | Ídem |
| CLS | < 0,1 (objetivo ≤ 0,02) | PSI; en campo, Cloudflare Web Analytics si se activa | Ídem |
| TBT (laboratorio) / INP (campo) | ≤ 200 ms | PSI / Cloudflare Web Analytics (opcional) | Ídem / cuando haya tráfico |
| JS de primera carga | ≤ 150 KB comprimidos, incluida la base de React y Next. Se registra la línea base en el primer build | Reporte de `next build` y pestaña *Network* | En cada PR |
| CSS | ≤ 30 KB comprimidos | *Network* | En cada PR |
| Animación del hero | 0 KB de JS; CSS + SVG ≤ 15 KB | Inspección del build | F1-02 |
| Fuentes | 1 archivo variable `woff2`, subconjunto `latin`, ≤ 50 KB | *Network* | F1-03 |
| Terceros al cargar | **1**: el script de Umami (`defer`, ~2,3 KB). Cal.com solo carga con la primera intención | *Network*, filtrando por otros dominios | En cada PR |

## 2. Técnicas de rendimiento

- **Todo SSG en la CDN de Cloudflare.** Las páginas se sirven como archivos estáticos, sin pasar por el Worker, que solo atiende `/`, `/call` y `/llamada`. No hay `proxy.ts`.
- **Server Components por defecto.** Solo 4 islas de cliente pequeñas ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).
- **Hook en CSS** con estado final primero; sin imágenes en el escenario ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)).
- **`next/font` autoalojada**, con `adjustFontFallback`.
- **Imágenes ya optimizadas** (WebP o AVIF, con las medidas de [06 §4](./06-secciones-y-ui.md#4-imágenes)), con dimensiones fijas y carga diferida; ninguna en el primer pliegue. El export no tiene optimizador.
- **Caché larga para `/_next/static/*`** (archivos con hash), declarada en `_headers` ([09 §2](./09-seguridad-y-privacidad.md#2-encabezados-http)).
- **Enlaces internos con `<a>`**, para evitar las solicitudes de prefetch que fallan en el export de Next 16 ([03 §7](./03-arquitectura.md#7-convenciones-de-código)).
- **Cal.com** sin precarga al inicio; `preload` solo con *hover* o *focus*.
- **Analítica de Umami** con `defer` (~2,3 KB): no bloquea el render ni el LCP ([12 §4](./12-medicion-y-analitica.md#4-implementación)).
- **Sin CSS sin usar:** Tailwind 4 genera solo las clases que se usan.

## 3. Accesibilidad (WCAG 2.2 AA)

| Criterio | Cómo se cumple | Cómo se verifica |
|---|---|---|
| 1.1.1 Contenido no textual | `alt` obligatorio en el tipo `ImageRef`; íconos con `aria-hidden`; escenario del hook `aria-hidden` (decorativo, su mensaje está en el H1) | Compilación + axe |
| 1.3.1 Información y relaciones | Landmarks (`header`, `main`, `footer`, `nav`); un único `<h1>`; H2 por sección; listas reales; `<details>` en las preguntas frecuentes | axe + lector de pantalla |
| 1.3.2 / 2.4.3 Orden | Orden del DOM = orden de lectura; el escenario no es enfocable ([05 §8](./05-hero-animacion.md#8-responsive-y-orden-visual)) | Recorrido con Tab |
| 1.4.3 Contraste mínimo | Paleta calculada: texto ≥ 4,5:1 y texto grande ≥ 3:1 ([06 §3](./06-secciones-y-ui.md#3-sistema-visual)) | axe + revisión de tokens |
| 1.4.4 / 1.4.10 Zoom y reflow | Funciona al 200 % y a 320 px sin scroll horizontal | Prueba manual |
| 1.4.11 Contraste no textual | Bordes de campos y anillo de foco ≥ 3:1 | Revisión manual |
| 2.1.1 Teclado | Todo es operable con teclado: enlaces, `<details>`, selector de moneda, formulario | Recorrido con Tab |
| 2.2.2 Pausar | La animación dura 4,2 s y no se repite: queda exenta (el límite es 5 s) | — |
| 2.4.1 Saltar bloques | Enlace "Saltar al contenido" al inicio | Tab desde la carga |
| 2.4.7 / 2.4.11 Foco visible y no oculto | Anillo de 2 px con separación; `scroll-padding-top: 64px` por el header fijo | Recorrido con Tab |
| 2.5.8 Tamaño del objetivo | Áreas táctiles ≥ 44 × 44 px (el mínimo es 24 × 24) | Revisión en móvil |
| 3.1.1 / 3.1.2 Idioma | `<html lang>` por página; el enlace "Español"/"English" lleva su propio `lang` | Inspección |
| 3.3.1 / 3.3.2 Formularios (v1.1) | Etiquetas visibles, errores junto al campo con `aria-describedby`, `aria-invalid`, región `aria-live` | axe + lector de pantalla |
| 4.1.2 Nombre, función, valor | Elementos nativos (`a`, `button`, `details`, `input`) | axe |
| Reducir movimiento (requisito del roadmap) | Estado final estático con `prefers-reduced-motion` | DevTools → *Rendering* |
| Cal.com | Iframe de terceros; el enlace de respaldo permite reservar en la página de Cal.com | Prueba manual |

## 4. Pruebas por versión

### 4.1 v1: manual (dentro de los 0,75 h de QA de F1-10)

- [ ] `pnpm lint` y `pnpm build` sin errores. Next 16 ya no ejecuta ESLint en el build, así que el lint se corre aparte.
- [ ] `pnpm preview` (export + Worker en `localhost:8787`): sin errores en la consola, sin 404 de archivos `.txt` de RSC en *Network*, y `/en` responde sin barra final.
- [ ] PSI ×3 en `/en` y `/es` sobre producción: Performance ≥ 90, LCP < 2,5 s, y el elemento LCP es el `<h1>`.
- [ ] iPhone real (Safari y el navegador interno de Gmail) y Android (Chrome).
- [ ] Recorrido completo con teclado, extensión axe DevTools y una pasada rápida con VoiceOver.
- [ ] Reducir movimiento emulado: se ve el estado final.
- [ ] `?mkt=co`, `?mkt=us` y la zona horaria `America/Bogota` emulada (DevTools → *Sensors*).
- [ ] Reserva de prueba de punta a punta: popup, hora local, preguntas y consentimiento, correo de confirmación, evento en Calendar, UTM en el detalle de la reserva, y `booking_completed` en Umami.
- [ ] Un enlace con UTM desde otro dispositivo: aparece `landing` tras interactuar.
- [ ] `curl -sI` para `/` con `Accept-Language` en `es` y en `en`, y para `/call`: la redirección conserva el query string.
- [ ] Una URL inexistente devuelve 404 con la página bilingüe.
- [ ] `curl -sI` muestra los encabezados de `_headers` en `/en` (CSP, `nosniff`) y HSTS.
- [ ] Rich Results Test, LinkedIn Post Inspector y vista previa en WhatsApp.

### 4.2 v1.1: automatizadas en la CI

```yaml
# .github/workflows/ci.yml (v1.1, ilustrativo; usa las últimas versiones mayores de cada action)
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck        # next typegen && tsc --noEmit && tsc -p worker --noEmit
      - run: pnpm build            # next build → out/
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e         # Playwright contra `wrangler dev` (incluye axe)
      - run: pnpm lhci             # Lighthouse CI: presupuestos como advertencias
      - run: pnpm audit --prod
```

- **Servidor de pruebas:** el `webServer` de Playwright arranca `wrangler dev` sobre `out/` (puerto 8787). `next start` no sirve un export, y `wrangler dev` reproduce el Worker, `_headers` y el 404 de Cloudflare. Lighthouse CI usa el mismo servidor.
- **La CI no despliega:** de eso se encarga Workers Builds.

**Pruebas de humo con Playwright** (`tests/e2e/`):

1. `/?utm_source=x` con `Accept-Language: es-CO` → `/es?utm_source=x`; con `en-US` → `/en?utm_source=x`.
2. `/en` y `/es`: `<html lang>` correcto y `<h1>` visible en el primer fotograma (sin `opacity: 0`).
3. Reducir movimiento: la captura con `reducedMotion: 'reduce'` es igual a la captura con movimiento después de 5 s.
4. Mercado:
   - `timezoneId: 'America/Bogota'` → COP visible y USD oculto.
   - `America/New_York` → USD.
   - `?mkt=co` gana sobre la zona horaria.
   - Sin JavaScript → USD.
5. JSON-LD: el `<script type="application/ld+json">` es JSON válido, contiene Person y ProfessionalService y no tiene `worksFor`.
6. Propuestas:
   - `/en/p/<slug>` responde con el header `x-robots-tag: noindex, nofollow` y la meta robots `noindex`.
   - Un slug desconocido da 404.
   - El sitemap no contiene `/p/`.
7. CTAs de agenda: `href` hacia `cal.com` (respaldo) y atributos `data-cal-link` presentes.
8. Formulario con `/api/contact` interceptado: éxito, error de validación y 502 (se muestra el `mailto`).
9. axe (`@axe-core/playwright`) en `/en`, `/es` y `/en/privacy`: **0 violaciones serias o críticas**.

**Lighthouse CI** (`lighthouserc.json`): 3 corridas en `/en` y `/es`, con emulación móvil por defecto. Asserts en modo advertencia:

| Métrica | Umbral |
|---|---|
| `largest-contentful-paint` | ≤ 2.500 ms |
| `cumulative-layout-shift` | ≤ 0,1 |
| `total-blocking-time` | ≤ 200 ms |
| `resource-summary:script:size` | ≤ 160.000 B |

## 5. Checklist de lanzamiento (17 de octubre)

### Dominio y correo

- [ ] `alejandrodeveloper.com` con SSL; `www` redirige al apex con 308.
- [ ] `hola@` recibe y envía; SPF, DKIM y DMARC en PASS (*Mostrar original* en Gmail).
- [ ] La firma tiene dirección postal y línea de baja.

### Contenido y permisos

- [ ] `disclosure` del caso MRB según la respuesta de Brian (o `anonymized`).
- [ ] Ningún nombre de empleador en el sitio, el JSON-LD ni los enlaces.
- [ ] Marca ficticia verificada.
- [ ] Textos revisados en EN y ES. Sin "Lorem" ni textos de relleno (`grep -ri lorem src/`).

### Funcionalidad

- [ ] Todas las CTAs de agenda abren el popup, y sin JS abren Cal.com.
- [ ] WhatsApp y `mailto` con texto prellenado por idioma.
- [ ] El selector de moneda funciona y persiste.
- [ ] Cambio de idioma en el header y en el pie.

### Rendimiento y accesibilidad

- [ ] §1 y §4.1 en verde.

### SEO

- [ ] [08 §9](./08-seo.md#9-checklist-seo-de-lanzamiento) completo; Search Console verificado; sitemap enviado.

### Analítica

- [ ] Eventos visibles en Umami tras una navegación de prueba con UTM, hecha en producción porque `data-domains` ignora las previews ([12 §3](./12-medicion-y-analitica.md#3-taxonomía-de-eventos)).

### Legal

- [ ] Política de privacidad publicada en ambos idiomas, con versión y fecha.
- [ ] Dirección postal en el pie.
- [ ] Consentimiento obligatorio en Cal.com.

### Después del lanzamiento (18–19 de octubre)

- [ ] Monitoreo de disponibilidad activo (§7).
- [ ] Primer registro en la plantilla de los viernes.
- [ ] Enlaces con UTM listos para la campaña del 19.

## 6. Rollback e incidentes

| Incidente | Respuesta |
|---|---|
| Un despliegue rompe algo | Cloudflare → *Workers & Pages* → `web-portfolio` → *Deployments* → la versión buena → **Rollback** (o `npx wrangler rollback`), en menos de 1 minuto. Luego `git revert` del commit |
| `/` o los enlaces cortos responden 429 o error 1027 | El Worker pasó de 100.000 invocaciones en el día. `/en` y `/es` siguen funcionando, y los correos enlazan directo ahí. Se normaliza a la medianoche UTC; si se repite, revisar el tráfico o pasar a Workers Paid (US$5) |
| Cal.com caído o el popup no abre | El enlace de respaldo lleva a `cal.com`; en el peor caso, se usan WhatsApp y el correo, que siempre están visibles |
| PSI por debajo de 90 tras un cambio | Revisar el elemento LCP, los terceros en *Network* y el tamaño del JS; revertir si no se resuelve en 30 minutos |
| Problema de DNS o SSL | Revisar en Cloudflare → *DNS* y *SSL/TLS*, y el *Custom Domain* del Worker. No hay URL de respaldo, porque la de `workers.dev` está desactivada. Si hace falta, se activa un rato (`workers_dev: true`), sin usarla en correos |
| Spam en el formulario (v1.1) | Bajar el límite de la regla de rate limit; activar Turnstile |
| Texto equivocado publicado | Corregir en `content/*.ts` y desplegar (~1–2 minutos) |

## 7. Monitoreo

| Qué | Cómo | Frecuencia |
|---|---|---|
| Disponibilidad | Servicio gratuito de monitoreo con chequeo de `/en` (HTTP 200 + una palabra del H1). **Alertas a tu correo personal**, no al del dominio, por si el dominio es lo que falla | Cada 5 min |
| Worker | Segundo chequeo en el mismo servicio: `/` debe responder 307. Si falla, el Worker está caído o superó su límite diario | Cada 5 min |
| Despliegues | Estado de Workers Builds en GitHub (check y comentario del PR); GitHub avisa por correo si un check falla | Automático |
| Rendimiento real | Cloudflare Web Analytics, si se activa (Core Web Vitals de campo) | Viernes |
| Agenda | Una reserva de prueba (o con `dryRunBookingSuccessfulV2`) | Mensual |
| Indexación | Search Console: cobertura y errores | Viernes (primeras 4 semanas) |
| Correo | Reportes DMARC; en v1.1, rebotes y quejas en Resend | Semanal |
| Dominio | Renovación automática activa y tarjeta vigente | Trimestral |
| Seguridad | Avisos de seguridad de Next.js; Dependabot | Al llegar el aviso (parche en menos de 48 h) |

## Fuentes

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Issue de Lighthouse CI sobre Lighthouse 13](https://github.com/GoogleChrome/lighthouse-ci/issues/1136)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Playwright](https://playwright.dev)
- [Cloudflare: rollback de versiones](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare: límites de Workers](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Web Analytics: Core Web Vitals](https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/)

Consultadas el 3-oct-2026; Cloudflare, el 4-oct-2026.
