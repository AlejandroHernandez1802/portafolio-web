# 14 · Registro de decisiones (ADR)

Estas son las decisiones de arquitectura del portafolio, con su contexto, las alternativas que se descartaron y sus consecuencias. Se tomaron el **3 de octubre de 2026**, con la información verificada ese día. El **4 de octubre** cambiaron el hosting y la analítica ([ADR-017](#adr-017) y [ADR-018](#adr-018)), y se ajustaron los ADR afectados.

**Regla:** si una tarea necesita cambiar una de estas decisiones, se agrega o actualiza el ADR en el mismo PR. Los estados posibles son *Aceptada*, *Plan B* (alternativa lista si la aceptada falla) y *Reemplazada*.

| ID | Decisión | Estado |
|---|---|---|
| [ADR-001](#adr-001) | Hosting en Vercel Pro | Reemplazada por ADR-017 (4-oct) |
| [ADR-002](#adr-002) | Render 100 % estático con export, sin `proxy.ts` | Aceptada (ajustada el 4-oct) |
| [ADR-003](#adr-003) | i18n nativo con contenido TypeScript tipado | Aceptada |
| [ADR-004](#adr-004) | Redirección de `/` con `Accept-Language` en el Worker | Aceptada (ajustada el 4-oct) |
| [ADR-005](#adr-005) | Precios por país con la zona horaria del dispositivo | Aceptada (IP vía el Worker como plan B) |
| [ADR-006](#adr-006) | Hook A en CSS, con el estado final primero | Aceptada |
| [ADR-007](#adr-007) | Agenda con Cal.com en popup y mejora progresiva | Aceptada |
| [ADR-008](#adr-008) | Analítica con Vercel Web Analytics (Pro, sin Plus) | Reemplazada por ADR-018 (4-oct) |
| [ADR-009](#adr-009) | Formulario como endpoint `POST /api/contact` + `fetch`, en la v1.1 | Aceptada (ajustada el 4-oct) |
| [ADR-010](#adr-010) | Correo transaccional con Resend en un subdominio | Aceptada |
| [ADR-011](#adr-011) | Contenido largo sin MDX | Aceptada |
| [ADR-012](#adr-012) | Tienda demo en un proyecto aparte, enlazada | Aceptada (ajustada el 4-oct) |
| [ADR-013](#adr-013) | 404 bilingüe con `global-not-found` | Aceptada (404 por defecto como plan B) |
| [ADR-014](#adr-014) | Caso MRB con `disclosure` (con nombre o anónimo) | Aceptada |
| [ADR-015](#adr-015) | UI sin librería de componentes | Aceptada |
| [ADR-016](#adr-016) | Aceptación de rendimiento con PSI en producción | Aceptada |
| [ADR-017](#adr-017) | Hosting en Cloudflare Workers Free con export estático | Aceptada |
| [ADR-018](#adr-018) | Analítica con Umami Cloud Hobby | Aceptada |

---

<a id="adr-001"></a>

## ADR-001 · Hosting en Vercel Pro

> **Reemplazada el 4-oct-2026 por [ADR-017](#adr-017).** No se quiere asumir US$20 al mes mientras el side project no tenga ingresos. Se conserva como registro.

- **Contexto:**
  - Vercel es tu stack actual y el roadmap pide Next.js en Vercel.
  - El plan Hobby es "solo para uso personal no comercial". El uso comercial incluye "anunciar la venta de un producto o servicio" ([Vercel](https://vercel.com/docs/limits/fair-use-guidelines)).
- **Decisión:** Vercel Pro, US$20 al mes por asiento con US$20 de crédito de uso incluido.
- **Alternativas descartadas:**
  - **Hobby:** prohibido para este uso.
  - **Netlify Free:** funciona con créditos (300 al mes; cada despliegue a producción cuesta 15, así que el máximo son 20 despliegues) y pausa los proyectos al agotarse. La declaración de que admite uso comercial es anterior a los planes por créditos.
  - **Cloudflare Workers Free con OpenNext:** 100.000 solicitudes al día y 10 ms de CPU por invocación; las imágenes van por Cloudflare Images (5.000 transformaciones gratis). Sus términos de uso comercial no son explícitos.
- **Consecuencias:**
  - US$20 al mes.
  - El mismo equipo cubre la demo, las propuestas y los sitios de clientes, que también son comerciales.
  - Incluye eventos personalizados de analítica, WAF con 40 reglas, previews protegidas e Instant Rollback.
  - Conviene bajar el aviso de gasto a ~US$30.

<a id="adr-002"></a>

## ADR-002 · Render 100 % estático con export, sin `proxy.ts`

- **Contexto:**
  - Se exige Lighthouse móvil ≥ 90, hay 7,5 h de construcción y la superficie de ataque y los costos deben ser mínimos. En Next 16, `proxy.ts` corre antes de la caché de la CDN, y la documentación oficial lo recomienda como último recurso.
  - (4-oct) El hosting en Cloudflare Free ([ADR-017](#adr-017)) publica el sitio como archivos estáticos generados con `output: 'export'`.
- **Decisión:**
  - Todas las páginas son SSG y se exportan a `out/`.
  - La redirección de `/` y los enlaces cortos van en un Worker mínimo que solo atiende esas rutas (ADR-004).
  - Lo que depende del visitante se resuelve en el navegador (ADR-005).
  - La única lógica de servidor adicional llega en la v1.1 (`/api/contact`, en el mismo Worker).
- **Alternativas descartadas:**
  - `proxy.ts` para idioma y mercado: código en cada visita, y el export no lo soporta.
  - Render dinámico: más lento y más caro, sin ningún beneficio para este sitio.
- **Consecuencias:**
  - La v1 no tiene secretos.
  - Cualquier personalización futura por visitante debe ir en el cliente, en el Worker o en un ADR nuevo.

<a id="adr-003"></a>

## ADR-003 · i18n nativo con contenido TypeScript tipado

- **Contexto:** son dos idiomas y una página principal. Next 16.3 documenta un patrón sin librerías e introdujo `next/root-params`.
- **Decisión:**
  - `app/[locale]/` es el root layout, con `generateStaticParams` y `dynamicParams = false`.
  - Los diccionarios son `content/en.ts` y `content/es.ts`, con `satisfies SiteContent`: si falta una clave, la compilación falla.
- **Alternativas descartadas:**
  - **next-intl 4.14:** soporta Next 16 y `root-params`, pero agrega dependencia y convenciones que no hacen falta para dos idiomas.
  - **Diccionarios JSON:** sin paridad de tipos ni estructuras ricas.
- **Consecuencias:**
  - No hay plurales ICU, que no se necesitan.
  - El endpoint del formulario vive en el Worker, fuera de Next, y no conoce el idioma de la página: el formulario envía el idioma en el body.
  - Migrar a next-intl después sería un esfuerzo moderado.

<a id="adr-004"></a>

## ADR-004 · Redirección de `/` con `Accept-Language` en el Worker

- **Contexto:**
  - `/` debe llevar a `/en` (por defecto) o a `/es`.
  - (4-oct) El export estático no admite `redirects()` en `next.config` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)), y los `_redirects` de Cloudflare no redirigen por idioma ([Cloudflare](https://developers.cloudflare.com/workers/static-assets/redirects/)).
- **Decisión:**
  - Un Worker mínimo (`worker/index.ts`) atiende `/` antes que los archivos estáticos (`run_worker_first`).
  - Si el primer idioma de `accept-language` empieza por `es`, `/` va a `/es`; si no, a `/en`. Es una redirección 307 que conserva el query string.
  - El mismo Worker resuelve `/call` y `/llamada` ([04 §2](./04-i18n-contenido-y-precios.md#2-redirección-de-)).
- **Alternativas descartadas:**
  - **Redirect Rule de Cloudflare por `Accept-Language`:** funciona en el plan Free, pero vive en el panel, fuera de Git, y no se puede probar en local ni en las previews.
  - **Negociación completa de idiomas:** más código sin beneficio para dos idiomas.
  - **`/` fijo a `/en`:** los hispanohablantes caerían en inglés.
  - **Una página de selección de idioma:** un clic extra.
- **Consecuencias:**
  - Solo se mira el primer idioma preferido.
  - Los UTM sobreviven.
  - `x-default` apunta a `/`.
  - Los correos enlazan directo al idioma, sin pasar por la redirección.
  - Cada visita a `/` cuenta como una invocación del Worker. El plan Free da 100.000 al día ([ADR-017](#adr-017)).

<a id="adr-005"></a>

## ADR-005 · Precios por país con la zona horaria del dispositivo

- **Contexto:**
  - **Decisión del usuario:** COP solo para visitantes en Colombia y USD para el resto, en ambos idiomas.
  - La opción presentada mencionaba la geolocalización por IP. Esa vía exige que cada visita a `/en` y `/es` pase por código de servidor (antes `proxy.ts`; con Cloudflare, el Worker), y el país del visitante no existe en local.
- **Decisión:**
  - El HTML estático trae ambas monedas.
  - Un script inline de ~300 B fija `html[data-market]` antes del primer pintado. El orden de prioridad es:
    1. `?mkt=` en la URL.
    2. La elección previa guardada en `localStorage`.
    3. La zona horaria `America/Bogota` → `co`.
    4. `us`.
  - El CSS muestra solo la moneda activa, y hay un selector manual.
- **Alternativas descartadas:**
  - **Plan B: IP vía el Worker.** Se agregan `/en` y `/es` a `run_worker_first`. El Worker lee `request.cf.country` ([Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/request/)) y fija `data-market` con `HTMLRewriter` o una cookie `mkt`; el render es igual. Cada visita pasaría a contar para el límite diario del Worker. Se activa si `currency_switch` muestra muchas correcciones manuales, por ejemplo más del 10 % de las visitas de un mercado.
  - **Reescritura a 4 variantes estáticas `/[locale]/[market]`:** segmento oculto y URLs duplicadas.
  - **Por idioma:** el usuario lo descartó.
  - **Ambas monedas visibles en `/es`.**
- **Consecuencias:**
  - Sin costo de servidor y funciona en local.
  - Sin JavaScript se ve USD.
  - Una VPN corporativa no confunde la detección.
  - El HTML contiene ambos precios, uno oculto.

<a id="adr-006"></a>

## ADR-006 · Hook A en CSS, con el estado final primero

- **Contexto:** el roadmap pide una animación de 4,2 s que no se repita, respete "reducir movimiento", pese menos de 50 KB, no use video y deje legible el titular aunque falle.
- **Decisión:**
  - Keyframes CSS sobre HTML y SVG renderizados en el servidor.
  - El CSS base es el estado final y las animaciones solo hacen entrar los elementos (`fill-mode: both`).
  - Solo se anima `transform`, `opacity` y `clip-path`.
  - Hay un corte a 1,5 h.
- **Alternativas descartadas:**
  - **Motion 14:** ~20 KB con `LazyMotion` + `domAnimation` ([Motion](https://motion.dev/docs/react-reduce-bundle-size)).
  - **Lottie:** un runtime pesado.
  - **SVG SMIL:** peor control y accesibilidad.
  - **Video:** prohibido por el roadmap.
- **Consecuencias:**
  - 0 KB de JavaScript, y la animación corre antes de la hidratación.
  - Reducir movimiento y los fallos muestran el estado final sin código adicional.
  - La secuencia se coordina con retrasos CSS, lo que exige disciplina con los tiempos.

<a id="adr-007"></a>

## ADR-007 · Agenda con Cal.com en popup y mejora progresiva

- **Contexto:** el roadmap pide Cal.com o Calendly embebido, mostrando la hora del cliente. Hay que proteger el LCP.
- **Decisión:**
  - Cal.com Free con el embed de popup por clic en enlaces reales (`href` a cal.com como respaldo).
  - `embed.js` se carga con la primera intención; `preload` solo con *hover* o *focus*.
  - Se escucha `bookingSuccessfulV2`, y los UTM se pasan en la configuración del embed.
- **Alternativas descartadas:**
  - **Calendly Free:** 1 tipo de evento y 1 calendario; su evento trae menos datos.
  - **Embed inline de Cal.com en el cierre:** una segunda integración y más peso.
  - **Solo un enlace externo:** no cumple "embebido".
- **Consecuencias:**
  - La marca de Cal.com es visible en el plan Free.
  - Hay que confirmar en la app el límite de tipos de evento.
  - El consentimiento va como pregunta obligatoria de la reserva.

<a id="adr-008"></a>

## ADR-008 · Analítica con Vercel Web Analytics (Pro, sin Plus)

> **Reemplazada el 4-oct-2026 por [ADR-018](#adr-018).** Los eventos personalizados de Vercel requieren Pro, y el hosting pasó a Cloudflare ([ADR-017](#adr-017)). Se conserva como registro.

- **Contexto:** se necesitan eventos personalizados (agendar, WhatsApp, demo, caso MRB) y atribución por campaña con UTM.
  - Los eventos personalizados de Vercel requieren Pro, que ya se paga, y en Pro admiten 2 propiedades por evento.
  - El panel de UTM solo existe en Web Analytics Plus, por US$10 más al mes ([Vercel](https://vercel.com/docs/analytics/limits-and-pricing)).
- **Decisión:**
  - Web Analytics en Pro, con eventos `{location, campaign}`.
  - La campaña se captura al aterrizar y viaja como propiedad.
  - Un evento `landing` registra la llegada tras una interacción real.
  - Las reservas de Cal.com guardan sus propios UTM.
- **Alternativas descartadas:**
  - **Web Analytics Plus:** mejora disponible si se necesita el panel.
  - **PostHog Free:** 1 millón de eventos, embudos y experimentos, pero un script de ~50–100 KB comprimidos según mediciones de la comunidad.
  - **Umami Cloud Free:** 100.000 eventos, script de menos de 2 KB y UTM nativos, pero es otro proveedor.
  - **GA4:** usa cookies, lo que obliga a un banner y a gestionar el consentimiento.
- **Consecuencias:**
  - Sin cookies ni banner, y sin costo extra.
  - Máximo 2 propiedades: la variante del titular se deduce por la fecha.

<a id="adr-009"></a>

## ADR-009 · Formulario como endpoint `POST /api/contact` + `fetch`, en la v1.1

- **Contexto:**
  - El roadmap pide un formulario que llegue al correo del dominio, pero su §10 dice que para el 18 de octubre bastan el hook, el caso y la agenda.
  - Las Server Actions tenían fricciones: un envío antes de hidratar no lleva el token antispam, las pestañas abiertas durante un deploy fallan con "Failed to find Server Action" y no tienen una ruta estable para una regla del WAF.
  - (4-oct) Con el export estático ([ADR-017](#adr-017)) no existen Server Actions ni Route Handlers que lean `Request` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)).
- **Decisión:** `POST /api/contact` como endpoint del Worker (`worker/contact.ts`), llamado con `fetch` desde una isla de cliente. Se entrega en la v1.1, o en la fase 1 si sobra tiempo. Sin JavaScript queda el `mailto`. *(Hasta el 3-oct era un Route Handler de Next en Vercel.)*
- **Alternativas descartadas:**
  - Server Action con `useActionState`: no existe en el export.
  - Servicios externos de formularios: otro encargado de datos personales.
- **Consecuencias:**
  - Es una desviación documentada del roadmap, por una semana.
  - El endpoint se prueba con `curl` y se protege por ruta: una regla de rate limit y, si aparece spam, Turnstile ([07 §5.3](./07-integraciones.md#53-capas-antispam)).
  - `/api/*` se agrega a `run_worker_first` en la v1.1.

<a id="adr-010"></a>

## ADR-010 · Correo transaccional con Resend en un subdominio

- **Contexto:** el formulario debe llegar a `hola@` sin poner en riesgo la reputación del dominio que se usa para prospectar.
- **Decisión:**
  - Resend Free (3.000 correos al mes, 100 al día, 3 dominios) enviando desde `notify.alejandrodeveloper.com`, con su SPF y DKIM propios.
  - `replyTo` con el correo del visitante.
- **Alternativas descartadas:**
  - **SMTP de Google Workspace con contraseña de aplicación:** frágil, y ata el envío a las credenciales de tu buzón.
  - **SendGrid o Postmark:** válidos, pero con más configuración o costo para este volumen.
- **Consecuencias:**
  - La reputación del envío queda aislada.
  - Hay registros DNS adicionales bajo `notify` (fase 0).

<a id="adr-011"></a>

## ADR-011 · Contenido largo sin MDX

- **Contexto:** hay contenido largo en la política de privacidad y en las propuestas por prospecto. El objetivo de las propuestas es bajar de ~1,5 h por PDF a minutos.
- **Decisión:**
  - La política se escribe en TSX, una por idioma.
  - Las propuestas son objetos `Proposal` tipados, renderizados por una sola plantilla.
- **Alternativas descartadas:**
  - **`@next/mdx`:** configuración extra, y una libertad de maquetación que vuelve a costar tiempo por propuesta.
  - **Un CMS.**
- **Consecuencias:**
  - Las propuestas quedan consistentes, rápidas de crear y validadas por tipos.
  - Si aparece un blog, se reconsidera MDX.

<a id="adr-012"></a>

## ADR-012 · Tienda demo en un proyecto aparte, enlazada

- **Contexto:** según el diagnóstico, la demo debe ser una plantilla reutilizable para clientes. El roadmap admite una demo "embebida o enlace".
- **Decisión:**
  - Repositorio y proyecto aparte, en `demo.alejandrodeveloper.com`. *(4-oct: su hosting se decide en sus propios docs; ya no se asume Vercel.)*
  - El portafolio la enlaza desde `#demo`, el CTA secundario y el escenario, con `demo_open`.
  - El contrato de integración está en [07 §6](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración).
- **Alternativas descartadas:**
  - **Una ruta `/demo` dentro del portafolio:** mezcla responsabilidades y no sirve como plantilla.
  - **Un iframe:** mala experiencia móvil, Stripe Checkout no se puede enmarcar y pesa en el rendimiento.
- **Consecuencias:**
  - Ciclos de vida independientes.
  - Umami Hobby admite un solo sitio ([ADR-018](#adr-018)): la demo usa el mismo sitio, filtrado por hostname, o su propia herramienta.
  - Si la demo se aloja en Cloudflare Free, el pago va solo por Stripe Checkout alojado: sus términos prohíben capturar datos de tarjetas en una propiedad del plan Free ([ADR-017](#adr-017)).

<a id="adr-013"></a>

## ADR-013 · 404 bilingüe con `global-not-found`

- **Contexto:** con el root layout en `app/[locale]` y `dynamicParams = false`, el patrón `[...rest]` + `notFound()` no alcanza a ejecutarse ([issue #87738](https://github.com/vercel/next.js/issues/87738)). Además requeriría `proxy.ts` para las rutas sin idioma.
- **Decisión:** una única página `app/global-not-found.tsx`, bilingüe, con enlaces a `/en` y `/es`. Requiere activar `experimental.globalNotFound` ([Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)).
- **Alternativas descartadas:**
  - 404 localizado con `proxy.ts` y `[...rest]`.
  - El 404 por defecto de Next, que queda como plan B si el flag experimental falla.
- **Consecuencias:**
  - Depende de una función experimental, aunque disponible desde 15.4, con un plan B trivial.
  - (4-oct) La documentación no dice cómo se comporta con el export estático. F0-08 verifica que `out/404.html` sea la página bilingüe. Cloudflare sirve ese archivo con estado 404 (`not_found_handling: "404-page"`, [Cloudflare](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)).

<a id="adr-014"></a>

## ADR-014 · Caso MRB con `disclosure` (con nombre o anónimo)

- **Contexto:** publicar el caso con nombre, la métrica y el testimonio requiere el permiso de Brian, que puede no llegar antes del lanzamiento. El permiso afecta la línea de confianza, el CTA secundario y el título, no solo el testimonio.
- **Decisión:**
  - `site.caseMrb.disclosure: 'named' | 'anonymized'`. La versión anónima se construye primero y es la predeterminada.
  - La métrica y el testimonio son campos opcionales.
- **Alternativas descartadas:**
  - Esperar el permiso: bloquea el lanzamiento.
  - Publicar sin permiso: es un riesgo ético y comercial.
- **Consecuencias:**
  - Hay dos variantes de texto y de imágenes.
  - La versión anónima no puede usar capturas identificables.

<a id="adr-015"></a>

## ADR-015 · UI sin librería de componentes

- **Contexto:** se necesitan 3 o 4 componentes simples: botón-enlace, contenedor, precio e ícono. Las preguntas frecuentes pueden usar `<details>` nativo.
- **Decisión:** componentes propios con Tailwind 4 y tokens; `<details>` y `<summary>` para las preguntas frecuentes; íconos SVG inline.
- **Alternativas descartadas:**
  - **shadcn/ui:** su CLI v4 usa Base UI por defecto desde julio de 2026; agrega dependencias para algo que el HTML ya resuelve.
  - **Headless UI.**
- **Consecuencias:**
  - Menos JavaScript y menos dependencias.
  - Si el formulario o nuevas páginas crecen, se reconsidera shadcn/ui.

<a id="adr-016"></a>

## ADR-016 · Aceptación de rendimiento con PSI en producción

- **Contexto:** el roadmap pide Lighthouse móvil ≥ 90 y LCP < 2,5 s. Lighthouse CI 0.15 sigue usando Lighthouse 12.6, mientras PageSpeed Insights usa la 13.5 ([issue](https://github.com/GoogleChrome/lighthouse-ci/issues/1136)).
- **Decisión:**
  - El criterio de aceptación es PSI sobre producción, en `/en` y `/es`, con la mediana de 3 corridas.
  - Lighthouse CI (v1.1) se usa solo como alarma de regresiones, con presupuestos en modo advertencia.
- **Alternativas descartadas:** Lighthouse CI como compuerta de puntaje (falsos positivos o negativos por la diferencia de versiones).
- **Consecuencias:** cada versión incluye una corrida manual de PSI en la QA.

<a id="adr-017"></a>

## ADR-017 · Hosting en Cloudflare Workers Free con export estático

- **Fecha:** 4 de octubre de 2026. Reemplaza a [ADR-001](#adr-001).
- **Contexto:**
  - No se quiere pagar US$20 al mes de Vercel Pro mientras el side project no tenga ingresos.
  - Vercel Hobby no es opción:
    - Sus reglas lo limitan a "non-commercial personal use only", y el uso comercial incluye "Advertising the sale of a product or service" ([Vercel](https://vercel.com/docs/limits/fair-use-guidelines)).
    - El personal de Vercel confirmó que un sitio estático que muestra servicios "falls under the Commercial usage" ([foro](https://community.vercel.com/t/fair-use-of-the-hobby-plan/2725)).
    - Sus términos permiten cerrar proyectos Hobby sin aviso ([Vercel](https://vercel.com/legal/terms)).
  - El roadmap (§3) admite "un hosting cuyo plan gratuito permita uso comercial".
  - La v1 ya era 100 % estática ([ADR-002](#adr-002)): casi nada dependía de funciones de Vercel.
- **Decisión:**
  - Next.js con `output: 'export'` genera `out/`.
  - Cloudflare Workers, plan Free, sirve `out/` como *static assets* desde su CDN.
  - Un Worker mínimo (`worker/index.ts`) atiende solo `/`, `/call` y `/llamada` (más `/api/*` desde la v1.1), mediante `run_worker_first`.
  - Los encabezados van en `public/_headers`, y `www` → apex en una Redirect Rule.
  - Builds y previews con Workers Builds, conectado a GitHub.
  - El dominio, en Cloudflare Registrar o con los nameservers de Cloudflare.
  - La configuración está en [03 §6](./03-arquitectura.md#6-rutas-encabezados-y-configuración) y [10 §6](./10-infraestructura-y-entornos.md#6-cloudflare).
- **Alternativas descartadas:**
  - **Vercel Hobby:** prohibido para este uso.
  - **Vercel Pro:** US$20 al mes. Se reconsidera cuando haya ingresos.
  - **Netlify Free:** funciona con 300 créditos al mes. Cada despliegue a producción cuesta 15 y, si se agotan, se pausan todos los proyectos hasta el siguiente ciclo ([Netlify](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)).
  - **GitHub Pages:** sus términos excluyen los sitios dirigidos a un negocio en línea, exige un plan pago si el repositorio es privado y no permite encabezados propios ([GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)).
  - **Cloudflare Pages:** sigue funcionando, pero Cloudflare pide empezar los proyectos nuevos en Workers ([Cloudflare](https://developers.cloudflare.com/pages/)).
  - **Next.js completo en Workers (OpenNext o vinext):** innecesario para un sitio estático. Cada página pasaría por el Worker y contaría para el límite diario.
- **Consecuencias:**
  - **US$0 de hosting.**
    - Las solicitudes a archivos estáticos son gratis e ilimitadas ([Cloudflare](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)).
    - Las 100.000 invocaciones diarias del plan Free solo cuentan para las rutas del Worker. Si se superan, esas rutas responden 429 hasta la medianoche UTC, mientras `/en` y `/es` siguen funcionando.
  - **Lo que el export no soporta:** `redirects()`, `headers()`, `proxy.ts`, la optimización de imágenes y los Route Handlers que leen `Request` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)).
    - Por eso existen el Worker y `_headers`, y las imágenes llegan ya optimizadas ([06 §4](./06-secciones-y-ui.md#4-imágenes)).
    - `sitemap.ts`, `robots.ts` y `opengraph-image.tsx` llevan `export const dynamic = 'force-static'`.
  - **Enlaces internos con `<a>`.** En exports de Next 16, el prefetch de `next/link` pide los payloads RSC en rutas equivocadas y da 404 ([issue #85374](https://github.com/vercel/next.js/issues/85374)).
  - **Previews públicas con `noindex`.** Se pierden las previews protegidas de Vercel; Cloudflare Access (gratis hasta 50 usuarios) queda como opción.
  - **Sin SLA ni soporte.** Cloudflare puede terminar un servicio gratuito a su discreción (§2.6 de sus [términos](https://www.cloudflare.com/terms/)).
  - **Sitios de clientes en la cuenta de cada cliente.** Los términos no permiten contratar el servicio a nombre de terceros (§2.2.1 a) ni capturar datos de tarjetas en una propiedad del plan Free (§2.7 h).
  - **Workers Cache queda desactivado:** si se activa, las solicitudes a archivos estáticos pasan a cobrarse ([Cloudflare](https://developers.cloudflare.com/workers/cache/)).
  - **Se reconsidera** con Workers Paid (US$5 al mes) si el Worker se acerca al límite diario, o con Vercel Pro cuando haya ingresos y la demo o los clientes lo justifiquen.

<a id="adr-018"></a>

## ADR-018 · Analítica con Umami Cloud Hobby

- **Fecha:** 4 de octubre de 2026. Reemplaza a [ADR-008](#adr-008).
- **Contexto:**
  - Se necesitan eventos personalizados (agendar, WhatsApp, demo, caso MRB) y atribución por campaña con UTM (roadmap §7 y §9).
  - Vercel Web Analytics solo da eventos personalizados en Pro, y el hosting pasó a Cloudflare ([ADR-017](#adr-017)).
  - Cloudflare Web Analytics es gratis y sin cookies, pero no tiene eventos personalizados ni UTM ([Cloudflare](https://developers.cloudflare.com/web-analytics/faq/)).
- **Decisión:**
  - Umami Cloud, plan Hobby (US$0). El script se carga con `defer` desde `cloud.umami.is`, con `data-domains` para contar solo el dominio de producción.
  - Misma taxonomía de eventos ([12 §3](./12-medicion-y-analitica.md#3-taxonomía-de-eventos)), enviada con `umami.track()` desde `TrackingListener`.
  - Umami lee los UTM de la URL y los muestra en su reporte. La propiedad `campaign` y el evento `landing` se mantienen, porque `landing` filtra los escáneres de enlaces de correo.
- **Alternativas descartadas:**
  - **Solo Cloudflare Web Analytics:** sin eventos ni UTM. Queda como opcional para Core Web Vitals de campo.
  - **PostHog Free:** 1 millón de eventos y embudos, pero un script de ~50–100 KB comprimidos.
  - **GA4:** usa cookies, lo que obliga a un banner y a gestionar el consentimiento.
  - **Vercel Web Analytics:** eventos solo en Pro.
- **Consecuencias:**
  - Sin cookies, sin banner y sin costo.
  - **Límites del plan Hobby** ([Umami](https://umami.is/pricing)):
    - 100.000 eventos al mes; cada propiedad guardada cuenta como un evento.
    - **1 sitio.**
    - **6 meses** de retención. La plantilla de los viernes ([12 §7](./12-medicion-y-analitica.md#7-rutina-de-los-viernes)) es el registro permanente.
    - Sin API de lectura.
  - **Es el único tercero al cargar la página:** ~2,3 KB comprimidos desde otro dominio, que los bloqueadores pueden quitar. Mejora opcional: servirlo por el Worker ([Umami](https://docs.umami.is/docs/bypass-ad-blockers)).
  - Ya no hay límite de 2 propiedades por evento, pero la taxonomía se mantiene igual para no complicarla.
  - Sus términos permiten el uso para "internal business purpose" ([Umami](https://umami.is/terms)).
  - Umami pasa a ser encargado en la política de privacidad ([09 §6](./09-seguridad-y-privacidad.md#6-privacidad-y-cumplimiento)).
