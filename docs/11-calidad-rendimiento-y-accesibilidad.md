# 11 · Calidad, rendimiento y accesibilidad

La v1 se acepta con **PageSpeed Insights sobre producción**: Performance móvil ≥ 90 y LCP < 2,5 s, en `/en`, `/es` y, desde la fase A, en las dos páginas del caso, mediana de 3 corridas. Además, la checklist manual de WCAG 2.2 AA debe pasar y el checklist de lanzamiento (§5) debe estar completo.

Las pruebas automáticas (Playwright, axe y Lighthouse CI) llegan en la v1.1. Lighthouse CI se usa como alarma de regresiones, no como criterio de aceptación: corre Lighthouse 12.6, mientras PSI usa la 13.5 ([issue](https://github.com/GoogleChrome/lighthouse-ci/issues/1136)).

---

## 1. Presupuestos de rendimiento

| Métrica | Objetivo | Herramienta | Momento |
|---|---|---|---|
| Lighthouse Performance (móvil) | **≥ 90** | PSI sobre producción, `/en`, `/es` y los dos casos, mediana de 3 | Antes de publicar y en cada versión |
| LCP (laboratorio, móvil) | **< 2,5 s**; el elemento LCP es texto estático del hero, pintado en el primer fotograma: el `<h1>` o, en teléfonos, el subtítulo, que ocupa más área; en el caso, su resumen ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)). Ninguno se anima. En escritorio puede serlo la captura del hero, precargada ([ADR-021](./14-decisiones.md#adr-021)). **R-11 (24-oct, §2): sobre HTTP/2, 2,15 s en la home y 2,0 s en el caso; pasa** | PSI y DevTools → Performance | Ídem |
| CLS | < 0,1 (objetivo ≤ 0,02) | PSI; en campo, Cloudflare Web Analytics si se activa | Ídem |
| TBT (laboratorio) / INP (campo) | ≤ 200 ms | PSI / Cloudflare Web Analytics (opcional) | Ídem / cuando haya tráfico |
| JS de primera carga | ≤ 150 KB comprimidos, incluida la base de React y Next. Las islas nuevas de la reestructuración suman ≤ ~3 KB ([ADR-020](./14-decisiones.md#adr-020)). **R-11 (24-oct): 132,8 KB en `/es`.** Si se cuenta el polyfill para navegadores antiguos, que los modernos no descargan, son 171,3 KB; para comparar con otra medición, hay que usar el mismo método | Reporte de `next build` y pestaña *Network* | En cada PR |
| CSS | ≤ 30 KB comprimidos. **R-11: 14,7 KB en `/es` y 12,7 KB en el caso** | *Network* | En cada PR |
| Animación del hero | 0 KB de JS; CSS + SVG ≤ 15 KB. También el escenario del bloque B y su disparo al entrar en vista | Inspección del build | F1-02, R-06, R-07 |
| Imágenes | AVIF por captura, con los presupuestos de [06 §4.2](./06-secciones-y-ui.md#42-inventario-y-presupuestos): hero en navegador ≤ 80 KB a 1280 px (48,2 KB), hero en celular ≤ 45 KB a 600 px (17,1 KB), capturas del caso ≤ 120 KB, captura completa de la tarjeta ≤ 160 KB (101,3 KB), que en pantallas táctiles cambia por su cuadrado superior (29,3 KB a 720 px); OG ≤ 300 KB (124–136 KB). En celular no se descarga ninguna captura de escritorio del hero | `pnpm media:images` avisa si una pasa su presupuesto; *Network* a 390 px | R-04, R-09, en cada cambio de capturas |
| Fuentes | 2 familias, subconjunto `latin`, ≤ 120 KB en total (hoy ~70 KB). Archivo variable recortada a ancho 62–100 % y pesos 400–800: 1 `woff2` de ~60 KB, precargado. IBM Plex Mono 500: 1 `woff2` de ~10 KB, sin precarga. Antes era 1 archivo de ≤ 50 KB; subió con [ADR-019](./14-decisiones.md#adr-019) | *Network* y `out/_next/static/media/` | F1-03, F1-12 |
| Terceros al cargar | **1**: el script de Umami (`defer`, ~2,3 KB). Cal.com solo carga con la primera intención. En la fase B, los clips de `media.alejandrodeveloper.com` cargan después de `load` y solo en vista | *Network*, filtrando por otros dominios | En cada PR |

## 2. Técnicas de rendimiento

- **Todo SSG en la CDN de Cloudflare.** Las páginas se sirven como archivos estáticos, sin pasar por el Worker, que solo atiende `/`, `/call` y `/llamada`. No hay `proxy.ts`.
- **Server Components por defecto.** Solo 4 islas de cliente pequeñas en la fase A; la nueva es `MenuCloser`, de ~0,35 KB ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).
- **Hook en CSS** con estado final primero; sin imágenes en el escenario, que arranca al entrar en vista sin JS ([05 §4](./05-hero-animacion.md#4-implementación-el-estado-final-primero)).
- **Fuentes autoalojadas con `next/font`:**
  - **Archivo** sale de un archivo propio servido con `next/font/local`, recortado a ancho 62–100 % y pesos 400–800: 60 KB en vez de los 90 KB del archivo completo de Google ([06 §3.2](./06-secciones-y-ui.md#32-tipografía)). Va precargada y con `display: 'swap'`. Cada rol angosto tiene un respaldo ajustado con `size-adjust`, así que el H1 no cambia de líneas cuando llega la fuente ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)).
  - **Plex Mono** va en un solo peso (500), sin precarga y con `swap`. Aun sin precarga compite con Archivo: las etiquetas mono de la primera pantalla (la línea de confianza, la franja de cifras y la leyenda de los marcos) la usan, así que Chrome la pide con prioridad muy alta antes del primer pintado. Por eso es un solo archivo de 10 KB. Antes de R-06 era el escenario el que la usaba ahí.
  - **Medido el 24-oct** con Lighthouse 12.8 en móvil (export servido con brotli, 3 corridas por idioma, todas iguales): LCP 2,3 s, FCP 1,2 s, Performance 98 y CLS 0. Con Archivo completa y los tres pesos de Plex Mono daba LCP 2,6 s y Performance 97.
  - **Si el LCP vuelve a pasar de 2,5 s por las fuentes,** las opciones que quedan son estrechar más el rango de pesos de Archivo o recortar Plex Mono a los caracteres que usa.
- **Medido en R-11 el 24-oct**, con Lighthouse 12.8 en móvil, en local, servido con brotli y 3 corridas por página. Se midió de dos formas, porque la simulación de Lighthouse cobra el protocolo:
  - **Sobre HTTPS con HTTP/2**, como sirve Cloudflare (HTTP/2 o HTTP/3). Es la cifra que se compara con el presupuesto.
  - **Sobre HTTP/1.1 sin TLS**, como el primer QA. La simulación cobra una conexión nueva por cada una de las 5 hojas de estilo y los scripts que bloquean el pintado, así que esta cifra no se compara con producción.

  | Página | LCP móvil, HTTP/2 | LCP móvil, HTTP/1.1 | Elemento LCP móvil | Performance móvil (HTTP/2) | LCP escritorio | CLS |
  |---|---|---|---|---|---|---|
  | `/es` y `/en` | **2,15 s** (FCP 1,05 s) | 2,8 s (FCP 1,4 s) | El subtítulo | 0,99 | 0,6 s (la captura del hero) | 0,003 móvil, 0 escritorio |
  | Los dos casos | **2,0 s** (FCP 0,9 s) | 2,6–2,7 s (FCP 1,4 s) | El resumen del hero | 0,99 | 0,6 s (la captura del hero) | 0 |

  - **Pasa el presupuesto sobre HTTP/2.** Con HTTP/1.1, la base F1-12 daba 2,6 s el mismo día; esa cifra tampoco se compara con producción.
  - **`experimental.inlineCss` de Next no hace falta.** Se probó y se revirtió: sobre HTTP/1.1 bajaba la home a 2,5 s. No se abre un ADR por la cifra de HTTP/1.1.
  - **El criterio sigue siendo PSI en producción** ([ADR-016](./14-decisiones.md#adr-016)), con la mediana de 3. Si PSI pasa de 2,5 s, la primera opción es un ADR para `inlineCss`; la segunda, recortar CSS de la primera pantalla.
  - **Cómo repetirlo:** un servidor estático `node:http2` con certificado propio sobre `out/` (o `wrangler dev`, si sirve HTTP/2) y Chrome con `--ignore-certificate-errors`. En la pestaña *Network* de Lighthouse, el protocolo debe decir `h2`.
- **Imágenes ya codificadas** en AVIF y WebP por `pnpm media:images`, con `srcset`, `sizes`, `width` y `height` del manifiesto (sin CLS) y carga diferida ([06 §4](./06-secciones-y-ui.md#4-imágenes)). El export no tiene optimizador. Las únicas `eager` son la captura del hero en escritorio (con `fetchpriority="high"` y `preload` con `media`) y el marco de celular del hero, con prioridad baja. En celular, la captura de escritorio del hero no se descarga.
- **Caché larga para `/_next/static/*`** (archivos con hash, también las capturas), declarada en `_headers` ([09 §2](./09-seguridad-y-privacidad.md#2-encabezados-http)). R-11 confirmó `immutable` en `/_next/static/media/*.avif` con `pnpm preview`.
- **Enlaces internos con `<a>`**, para evitar las solicitudes de prefetch que fallan en el export de Next 16 ([03 §7](./03-arquitectura.md#7-convenciones-de-código)).
- **Cal.com** sin precarga al inicio; `preload` solo con *hover* o *focus*.
- **Analítica de Umami** con `defer` (~2,3 KB): no bloquea el render ni el LCP ([12 §4](./12-medicion-y-analitica.md#4-implementación)).
- **Sin CSS sin usar:** Tailwind 4 genera solo las clases que se usan.

## 3. Accesibilidad (WCAG 2.2 AA)

| Criterio | Cómo se cumple | Cómo se verifica |
|---|---|---|
| 1.1.1 Contenido no textual | Cada captura tiene su `alt` en `cases.<id>.alts`, obligatorio en el tipo `CaseContent`; en la página del caso, un `alt` que falta hace fallar el build. El cromo de los marcos, los íconos y el escenario del hook llevan `aria-hidden` (decorativos: su mensaje está en el texto del bloque) | Compilación + axe |
| 1.2.1 Solo video (fase B) | El teaser sin audio tiene un bloque "Descripción del video"; los clips cortos son decorativos y llevan al lado un texto que cuenta lo mismo ([ADR-022](./14-decisiones.md#adr-022)) | Revisión manual (R-19) |
| 1.3.1 Información y relaciones | Landmarks (`header`, `main`, `footer`, `nav`); cada `nav` con su nombre (`nav.label`, `nav.menu.label`, `footer.navLabel` y la miga del caso); un único `<h1>` por página; H2 por sección; listas reales; la franja de cifras como `<dl>`; `<details>` en las preguntas frecuentes | axe + lector de pantalla |
| 1.3.2 / 2.4.3 Orden | Orden del DOM = orden de lectura; el escenario y el enlace de los marcos del hero no son enfocables ([05 §8](./05-hero-animacion.md#8-responsive-y-orden-visual)). El panel del menú va justo después de su botón en el DOM, así que Tab entra del botón al panel | Recorrido con Tab |
| 1.4.3 Contraste mínimo | Paleta calculada ([06 §3.1](./06-secciones-y-ui.md#31-color)): `ink-1` 16:1 y `ink-2` 7,4:1 sobre papel; blanco sobre cobalto 8,2:1; tinta sobre sol 12,2:1; `on-ink-2` 7,5:1 sobre azul profundo. `ink-3` (4,5:1) solo se usa sobre `paper-0` y `paper-1`, porque sobre arena baja a 4:1 | axe + revisión de tokens |
| 1.4.4 / 1.4.10 Zoom y reflow | Funciona al 200 % y a 320 px sin scroll horizontal. El 24-oct se revisó de 280 a 1440 px en la home, el caso, la política y el 404, en ambos idiomas; falta el zoom al 200 % | Prueba manual |
| 1.4.11 Contraste no textual | Anillo de foco de tinta (16:1), o sol en las bandas azules (≥ 5,8:1); bordes de campos en `ink-2` (7,4:1); marco del selector de moneda en cobalto (7,6:1). Con colores forzados (alto contraste de Windows), las barras del ícono del menú y el borde de su botón se pintan en `ButtonText`, porque el navegador borra fondos y sombras (`nav.css`) | Revisión manual; DevTools → *Rendering* → `forced-colors` |
| 2.1.1 Teclado | Todo es operable con teclado: enlaces, menú, `<details>`, selector de moneda, formulario. La captura de la tarjeta de Trabajo también se desplaza con el foco, no solo con el mouse | Recorrido con Tab |
| 2.2.2 Pausar | El escenario dura 4,2 s y no se repite: queda exento (el límite es 5 s). El desplazamiento de la captura de la tarjeta lo inicia el visitante y se detiene al salir. **Fase B:** los clips en bucle duran más de 5 s, así que llevan un botón visible de pausa ([ADR-022](./14-decisiones.md#adr-022)); los revelados los mueve el scroll del visitante | — / R-19 |
| 2.4.1 Saltar bloques | Enlace "Saltar al contenido" al inicio | Tab desde la carga |
| 2.4.7 / 2.4.11 Foco visible y no oculto | Anillo de 2 px con separación, de tinta o sol según la banda; `scroll-padding-top: 72px` por la barra fija de 56 px. Con el menú abierto, `MenuCloser` lo cierra cuando Tab sale del panel, para que el foco no caiga en contenido tapado | Recorrido con Tab |
| 2.5.8 Tamaño del objetivo | El mínimo es 24 × 24 px.<ul><li>Botones de 48 px de alto; enlaces con flecha (`secondary`) de 44 px.</li><li>El CTA de la barra y el botón "Menú" miden 36 px de alto, con un área táctil de 48 px dentro de la barra de 56 px, y al menos 44 px de ancho, también con el botón de solo ícono bajo 375 px.</li><li>El enlace "Trabajo" de la miga del caso mide 44 px de alto y, con su relleno, 49 px de ancho en inglés.</li><li>Los enlaces de la barra y el de idioma miden 44 px; las filas del menú, 64 px.</li><li>Todos los enlaces del pie miden 44 px.</li><li>Las opciones del selector de moneda miden 36 px.</li></ul> | Revisión en móvil |
| 3.1.1 / 3.1.2 Idioma | `<html lang>` por página; el enlace "Español"/"English" lleva su propio `lang` | Inspección |
| 3.3.1 / 3.3.2 Formularios (v1.1) | Etiquetas visibles, errores junto al campo con `aria-describedby`, `aria-invalid`, región `aria-live` | axe + lector de pantalla |
| 4.1.2 Nombre, función, valor | Elementos nativos (`a`, `button`, `details`, `input`). El botón del menú usa `popovertarget`, así que el navegador expone si está abierto; su nombre sigue siendo "Menú". El enlace actual de la barra lleva `aria-current="page"` | axe |
| Reducir movimiento (requisito del roadmap) | Estado final estático con `prefers-reduced-motion`: el H1 y el escenario terminados, sin desplazamiento de capturas, sin subida de marcos y sin la entrada del menú. En la fase B, tampoco video automático, revelados ni transiciones de vista | DevTools → *Rendering* |
| Cal.com | Iframe de terceros; el enlace de respaldo permite reservar en la página de Cal.com | Prueba manual |

## 4. Pruebas por versión

### 4.1 v1: manual (dentro de los 0,75 h de QA de F1-10)

- [ ] `pnpm lint` y `pnpm build` sin errores. Next 16 ya no ejecuta ESLint en el build, así que el lint se corre aparte.
- [ ] `pnpm preview` (export + Worker en `localhost:8787`): sin errores en la consola, sin 404 de archivos `.txt` de RSC en *Network*, y `/en` responde sin barra final.
- [ ] PSI ×3 en `/en`, `/es` y los dos casos sobre producción: Performance ≥ 90, LCP < 2,5 s, y el elemento LCP es el `<h1>` o, en teléfonos, el subtítulo del hero (en el caso, su resumen): texto estático, sin animación.
- [ ] iPhone real (Safari y el navegador interno de Gmail) y Android (Chrome).
- [ ] Recorrido completo con teclado, extensión axe DevTools y una pasada rápida con VoiceOver.
- [ ] **Menú con teclado, a 390 px:** el orden es enlace para saltar → nombre → Agenda → Menú → contenido. Enter en "Menú" lo abre y el foco se queda en el botón; Tab recorre los 5 enlaces, el idioma y el CTA; un Tab más lo cierra y el foco entra a la página. Esc lo cierra y devuelve el foco a "Menú". Tocar la página atenuada lo cierra. Enter en "Precios" lo cierra y la sección queda a 72 px, bajo la barra. *(Verificado en Chrome por CDP el 24-oct; faltan Safari y Firefox.)*
- [ ] **A 1280 px, en el caso:** enlace para saltar → nombre → 5 enlaces → idioma → CTA → contenido, sin botón ni panel de menú; "Trabajo" lleva `aria-current`.
- [ ] **La captura de escritorio del hero no se descarga en celular:** en *Network*, a 390 px, no aparece ningún `home-desktop-*` en la home, y en el caso solo aparece desde 768 px. *(Verificado con Lighthouse el 24-oct.)*
- [ ] **El escenario de Servicios en Safari 26, en Mac y en iPhone:** queda en pausa bajo el pliegue y se reproduce al entrar en vista. Si se queda en su punto de partida, hay que pasar a la isla mínima de [05 §10](./05-hero-animacion.md#10-pruebas).
- [ ] La captura de la tarjeta de Trabajo se desplaza al pasar el mouse y con el foco del teclado, y no se mueve con "reducir movimiento".
- [ ] Reducir movimiento emulado: se ve el estado final, con el tachado y el marcador del H1 completos.
- [ ] Fuentes bloqueadas (DevTools → *Network* → *Block request URL* con `woff2`): el H1 conserva sus líneas con el respaldo ajustado, sin romper el layout ni tapar el escenario.
- [ ] `?mkt=co`, `?mkt=us` y la zona horaria `America/Bogota` emulada (DevTools → *Sensors*).
- [ ] Reserva de prueba de punta a punta: popup, hora local, preguntas y consentimiento, correo de confirmación, evento en Calendar, UTM en el detalle de la reserva, y `booking_completed` en Umami.
- [ ] Un enlace con UTM desde otro dispositivo: aparece `landing` tras interactuar.
- [ ] `curl -sI` para `/` con `Accept-Language` en `es` y en `en`, y para `/call`: la redirección conserva el query string.
- [ ] Una URL inexistente devuelve 404 con la página bilingüe, también `/es/work/malone-road-belt`, `/en/trabajos/malone-road-belt`, `/en/work/x` y `/en/work`. Las dos páginas del caso dan 200. *(Verificado con `pnpm preview` el 24-oct.)*
- [ ] `curl -I` de un `/_next/static/media/*.avif` muestra `immutable`. *(Verificado el 24-oct.)*
- [ ] `curl -sI` muestra los encabezados de `_headers` en `/en` (CSP, `nosniff`) y HSTS.
- [ ] Rich Results Test (home y caso), LinkedIn Post Inspector y vista previa en WhatsApp.

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
3. Reducir movimiento: la captura con `reducedMotion: 'reduce'` coincide con la captura con movimiento después de 5 s, con una tolerancia pequeña por el antialiasing del H1 (por ejemplo, `maxDiffPixels: 50`; [05 §10](./05-hero-animacion.md#10-pruebas)).
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
9. axe (`@axe-core/playwright`) en `/en`, `/es`, `/en/privacy` y los dos casos: **0 violaciones serias o críticas**.
10. Menú: abre con el botón, cierra con Esc y devuelve el foco, y se cierra al activar un enlace.
11. Rutas cruzadas del caso (`/es/work/…`, `/en/trabajos/…`) y de las páginas de sección (`/es/work`, `/en/trabajos`, `/es/services`, `/en/sobre-mi`…) responden 404, y el sitemap tiene 12 URLs.

**Lighthouse CI** (`lighthouserc.json`): 3 corridas en `/en`, `/es` y los dos casos, con emulación móvil por defecto. Asserts en modo advertencia:

| Métrica | Umbral |
|---|---|
| `largest-contentful-paint` | ≤ 2.500 ms |
| `cumulative-layout-shift` | ≤ 0,1 |
| `total-blocking-time` | ≤ 200 ms |
| `resource-summary:script:size` | ≤ 160.000 B |

## 5. Checklist de lanzamiento

Para la publicación del 7 de noviembre (antes, 17 de octubre), al cierre de la fase A (R-11).

### Dominio y correo

- [ ] `alejandrodeveloper.com` con SSL; `www` redirige al apex con 308.
- [ ] `hola@` recibe y envía; SPF, DKIM y DMARC en PASS (*Mostrar original* en Gmail).
- [ ] La firma tiene dirección postal y línea de baja.

### Contenido y permisos

- [ ] Permiso de MRB por escrito con su alcance (R-01); `disclosure: 'named'` y los campos que cubre.
- [ ] Ningún `REVIEW(R-08)` pendiente con una cifra sin verificar en pantalla (`grep -rn "REVIEW(R-08)" src/content`).
- [ ] El caso no afirma pagos, checkout ni un carrito de varias piezas de MRB.
- [ ] Ningún nombre de empleador en el sitio, el JSON-LD ni los enlaces.
- [ ] Marca ficticia verificada.
- [ ] Textos revisados en EN y ES. Sin "Lorem" ni textos de relleno (`grep -ri lorem src/`).

### Funcionalidad

- [ ] Todas las CTAs de agenda abren el popup, y sin JS abren Cal.com.
- [ ] WhatsApp y `mailto` con texto prellenado por idioma.
- [ ] El selector de moneda funciona y persiste.
- [ ] Cambio de idioma en la barra, en el menú y en el pie, también desde el caso (lleva a la misma página en el otro idioma).
- [ ] Los enlaces de la barra y del pie llevan a cada sección desde la home y desde el caso.

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

### Después del lanzamiento

- [ ] Monitoreo de disponibilidad activo (§7).
- [ ] Primer registro en la plantilla de los viernes.
- [ ] Enlaces con UTM listos para la campaña, también hacia la página del caso.

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

Consultadas el 3-oct-2026; Cloudflare, el 4-oct-2026. Mediciones de la fase A, el 24-oct-2026.
