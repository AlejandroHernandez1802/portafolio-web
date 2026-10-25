# 14 · Registro de decisiones (ADR)

Estas son las decisiones de arquitectura del portafolio, con su contexto, las alternativas que se descartaron y sus consecuencias. Se tomaron el **3 de octubre de 2026**, con la información verificada ese día. El **4 de octubre** cambiaron el hosting y la analítica ([ADR-017](#adr-017) y [ADR-018](#adr-018)), y se ajustaron los ADR afectados. El **24 de octubre** se agregó el sistema visual ([ADR-019](#adr-019)) y, el mismo día, se decidió la reestructuración del sitio: la estructura con páginas de caso ([ADR-020](#adr-020)), los medios reales ([ADR-021](#adr-021)), el video en R2 ([ADR-022](#adr-022)) y el movimiento ([ADR-023](#adr-023)). El **25 de octubre** se sumaron las páginas de Servicios y Sobre mí, los menús desplegables y los demos como casos ([ADR-024](#adr-024)) y, el mismo día, la página de Trabajo, el servicio de diseño y los precios ocultos con LinkedIn en su lugar ([ADR-025](#adr-025)). ADR-022 y ADR-023 se aplican en la fase B ([13 §5.2](./13-plan-de-implementacion.md#52-reestructuración-fase-b-9-al-15-de-noviembre)).

**Regla:** si una tarea necesita cambiar una de estas decisiones, se agrega o actualiza el ADR en el mismo PR. Los estados posibles son *Aceptada*, *Plan B* (alternativa lista si la aceptada falla) y *Reemplazada*.

| ID | Decisión | Estado |
|---|---|---|
| [ADR-001](#adr-001) | Hosting en Vercel Pro | Reemplazada por ADR-017 (4-oct) |
| [ADR-002](#adr-002) | Render 100 % estático con export, sin `proxy.ts` | Aceptada (ajustada el 4-oct) |
| [ADR-003](#adr-003) | i18n nativo con contenido TypeScript tipado | Aceptada |
| [ADR-004](#adr-004) | Redirección de `/` con `Accept-Language` en el Worker | Aceptada (ajustada el 4-oct) |
| [ADR-005](#adr-005) | Precios por país con la zona horaria del dispositivo | Aceptada (IP vía el Worker como plan B) |
| [ADR-006](#adr-006) | Hook A en CSS, con el estado final primero | Aceptada (ajustada el 24-oct por ADR-022 y ADR-023) |
| [ADR-007](#adr-007) | Agenda con Cal.com en popup y mejora progresiva | Aceptada |
| [ADR-008](#adr-008) | Analítica con Vercel Web Analytics (Pro, sin Plus) | Reemplazada por ADR-018 (4-oct) |
| [ADR-009](#adr-009) | Formulario como endpoint `POST /api/contact` + `fetch`, en la v1.1 | Aceptada (ajustada el 4-oct) |
| [ADR-010](#adr-010) | Correo transaccional con Resend en un subdominio | Aceptada |
| [ADR-011](#adr-011) | Contenido largo sin MDX | Aceptada (extendida a los casos el 24-oct por ADR-020) |
| [ADR-012](#adr-012) | Tienda demo en un proyecto aparte, enlazada | Aceptada (ajustada el 4-oct) |
| [ADR-013](#adr-013) | 404 bilingüe con `global-not-found` | Aceptada (404 por defecto como plan B) |
| [ADR-014](#adr-014) | Caso MRB con `disclosure` (con nombre o anónimo) | Aceptada (ajustada el 24-oct por ADR-020: MRB con nombre) |
| [ADR-015](#adr-015) | UI sin librería de componentes | Aceptada |
| [ADR-016](#adr-016) | Aceptación de rendimiento con PSI en producción | Aceptada |
| [ADR-017](#adr-017) | Hosting en Cloudflare Workers Free con export estático | Aceptada |
| [ADR-018](#adr-018) | Analítica con Umami Cloud Hobby | Aceptada |
| [ADR-019](#adr-019) | Sistema visual "plano técnico" | Aceptada (24-oct; ajustada por ADR-020, ADR-021 y ADR-023) |
| [ADR-020](#adr-020) | Estructura: home + páginas de caso tipadas | Aceptada (24-oct) |
| [ADR-021](#adr-021) | Medios reales: capturas locales, marcos en CSS y LCP de texto en celular | Aceptada (24-oct) |
| [ADR-022](#adr-022) | Video del trabajo real en Cloudflare R2 | Aceptada (24-oct; se aplica en la fase B) |
| [ADR-023](#adr-023) | Movimiento: revelados al hacer scroll, transiciones entre páginas y deslizador | Aceptada (24-oct; se aplica en la fase B) |
| [ADR-024](#adr-024) | Páginas de sección, menús desplegables y demos como casos | Aceptada (25-oct; ajusta ADR-012 y ADR-020; ajustada por ADR-025) |
| [ADR-025](#adr-025) | Página de Trabajo, servicio de diseño y precios ocultos | Aceptada (25-oct; ajusta ADR-024 y pone en pausa la parte visible de ADR-005) |

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

> **Ver [ADR-025](#adr-025) (25-oct-2026).** Los precios están ocultos mientras los defines (`site.features.pricing = false`). La detección de mercado sigue, porque la usa el precio del producto ficticio de la animación.

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

> **Ver [ADR-022](#adr-022) y [ADR-023](#adr-023) (24-oct-2026).** La línea "Video: prohibido" ya no aplica a los clips del trabajo real, y el movimiento en CSS se amplía con estas mismas reglas. El hook y el H1 siguen en CSS, con 0 KB de JS y sin video.

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

> **Ver [ADR-020](#adr-020) (24-oct-2026).** Los casos también son datos tipados con una sola plantilla, sin MDX.

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

> **Ver [ADR-024](#adr-024) (25-oct-2026).** Cada demo sigue en su propio proyecto, pero en el portafolio entra como un caso con `kind: 'demo'` y su propia página, no como tarjeta `#demo`.

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

> **Ver [ADR-020](#adr-020) (24-oct-2026).** `disclosure` pasa a cada caso y MRB queda en `'named'`, con el permiso del cliente.

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

<a id="adr-019"></a>

## ADR-019 · Sistema visual "plano técnico"

> **Ver [ADR-020](#adr-020), [ADR-021](#adr-021) y [ADR-023](#adr-023) (24-oct-2026).** La estructura sí cambia: barra fija y páginas de caso, imágenes en el primer pliegue solo en escritorio, `--shadow-2` en los marcos de dispositivo y movimiento al hacer scroll.

- **Fecha:** 24 de octubre de 2026.
- **Contexto:**
  - La v1 usaba Tailwind con grises, un azul por defecto e Inter. Dijiste que la página se veía "demasiado sobria" y pediste darle vida antes de cerrar los pendientes del lanzamiento.
  - Preparaste un design system en `Design system/`, en la raíz del proyecto y fuera del repositorio ([readme](../../Design%20system/readme.md)). Trae tokens, fundamentos, componentes de muestra y un UI kit por sección.
  - El design system cambia la capa visual sin tocar la estructura, el copy ni las reglas técnicas: presupuestos, accesibilidad, mercado y animación.
- **Decisión:**
  - **Adoptar el sistema "plano técnico":** papel crema, tinta azul marino, cobalto para toda acción y un marcador amarillo sol ([06 §3](./06-secciones-y-ui.md#3-sistema-visual)).
  - **Tokens:**
    - Viven como variables en el `:root` de `globals.css` y pasan a Tailwind 4 con `@theme inline`, con los nombres del design system (`paper-1`, `ink-2`, `accent-500`…).
    - La paleta por defecto de Tailwind se elimina (`--color-*: initial`).
    - Desaparecen los tokens anteriores: `bg`, `fg`, `muted`, `surface`, `border`, `accent`, `success` y `focus`.
  - **Tipografía:** reemplazan a Inter dos familias, autoalojadas con `next/font`:
    - Archivo variable, que cubre todos los roles con su eje de ancho (62, 75, 87,5 y 100 %). Va en un archivo propio recortado a ancho 62–100 % y pesos 400–800 (60 KB), con `display: 'swap'` y un respaldo ajustado por rol de ancho que conserva las líneas del H1 ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)).
    - IBM Plex Mono, para los datos, en un solo peso (500).
  - **Componentes propios:**
    - Los JSX y las clases `ah-*` del design system son referencia, no código: se reescriben con utilidades de Tailwind.
    - Solo lleva CSS propio, junto a su componente, lo que las utilidades no expresan bien: keyframes, pseudoelementos y fondos de varias capas.
    - **[ADR-015](#adr-015) sigue vigente:** no se agrega ninguna librería.
  - **El H1 entra en la secuencia del hook:** tachado a 1,2 s y marcador a 3,3 s.
    - Sigue las reglas de **[ADR-006](#adr-006), que no cambian:** estado final primero, solo `transform`, `opacity` y `clip-path`, y 0 KB de JS.
    - El texto del H1 no se anima; solo sus pseudoelementos ([05 §4](./05-hero-animacion.md#4-implementación-el-estado-final-primero)).
- **Alternativas descartadas:**
  - **Mantener el estilo y ajustar solo los colores:** no responde al pedido.
  - **Copiar el CSS del design system** (`styles.css` y clases `ah-*`): habría dos sistemas de estilos en paralelo, con CSS sin usar, y chocaría con la convención de [03 §7](./03-arquitectura.md#7-convenciones-de-código).
  - **Animar `background-size` en el H1, como el UI kit:** esa propiedad no está entre las que permite ADR-006. Se usa un pseudoelemento por palabra con `scaleX`.
  - **Archivo con `display: 'swap'` y el respaldo por defecto de `next/font`, como propone el design system:** si la fuente llega tarde, el H1 pasa de 2 a 3 líneas y mueve toda la primera pantalla.
  - **Archivo con `display: 'optional'`:** evita ese salto, pero en carga en frío por debajo de ~20 Mbps la visita se quedaba toda con Arial (medido el 24-oct), y el sitio es de una sola página. Fue la primera versión del rediseño; se reemplazó por `swap` con respaldo ajustado ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)).
  - **Archivo completa de Google** (ancho 62–125 %, pesos 100–900, 90 KB) **con tres pesos de Plex Mono:** llevaba el LCP de laboratorio a 2,6 s, por encima del presupuesto.
  - **Una librería de componentes o de animación:** innecesaria, y prohibida sin ADR (ADR-006 y ADR-015).
- **Consecuencias:**
  - **Más peso de fuentes:** ~60 KB de Archivo (precargada) más ~10 KB de Plex Mono (sin precarga), frente a ~48 KB de Inter.
    - El presupuesto de fuentes de [11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento) pasa de ≤ 50 KB a ≤ 120 KB.
    - LCP < 2,5 s y CLS < 0,1 no cambian: 2,3 s y 0 en Lighthouse móvil el 24-oct ([11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento)).
  - **Archivo es un archivo del repositorio** (`src/fonts/`, licencia OFL), no una descarga de `next/font/google`: si Google la actualiza, no llega sola. Cómo regenerarla, en [06 §3.2](./06-secciones-y-ui.md#32-tipografía).
  - **Primera visita lenta:** mientras Archivo llega se ve un respaldo de Arial (Roboto en Android) ajustado al ancho de cada rol, con las mismas líneas en el H1. Al llegar cambia el dibujo de las letras, no el layout.
  - **Contrastes recalculados sobre papel crema:** todos cumplen AA ([06 §3.1](./06-secciones-y-ui.md#31-color)). `ink-3` solo puede ir sobre `paper-0` y `paper-1`.
  - **Índices visibles 01–07:** cuando llegue la demo (v2), hay que renumerar las secciones que quedan después de ella.
  - **La variante `a` del titular se ve distinta de `b` y `c`:** solo ella lleva tachado y marcador. Esto afecta la prueba de titulares ([12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares)).
  - **El design system no se sincroniza solo:** el código es la fuente de verdad. Si el design system cambia, el cambio se lleva a mano a `globals.css` y a los componentes.
  - **Las imágenes OG** de F0-11 todavía no existen. Conviene diseñarlas con la paleta y la tipografía nuevas.
  - **Ningún ADR anterior se reemplaza:** ADR-006 y ADR-015 se aplican sin cambios.

<a id="adr-020"></a>

## ADR-020 · Estructura: home + páginas de caso tipadas

> **Ver [ADR-024](#adr-024) (25-oct-2026).** Servicios y Sobre mí tienen ahora su propia página; la home queda con 5 secciones y la barra con 3 menús desplegables. Proceso y Precios viven en `/sobre-mi`.

- **Fecha:** 24 de octubre de 2026. Ajusta [ADR-014](#adr-014) y la frase de [ADR-019](#adr-019) "sin tocar la estructura", y extiende [ADR-011](#adr-011) a los casos.
- **Contexto:**
  - Después del rediseño ([ADR-019](#adr-019)) dijiste que el sitio seguía siendo demasiado simple: no llama la atención, no tiene barra de navegación y es una página plana, sin imágenes ni video. No da una buena primera impresión a un cliente.
  - Malone Road Belt (MRB) dio permiso para mostrar el trabajo con nombre e imágenes. Hasta ahora el caso era anónimo por defecto y solo texto ([ADR-014](#adr-014)).
  - Se revisaron 15 portafolios de servicios que convierten (Designjoy, Tom Hirst, Bootstrap Creative, Huemor, Gorilla 76, Swanky, Charle y otros). Sus patrones comunes:
    - Barra fija con 4–6 enlaces y un solo botón.
    - Trabajo real en la primera pantalla.
    - Casos que muestran primero los resultados y tienen página propia.
    - Precios visibles, "trabajas directamente conmigo" y un solo CTA repetido.
  - ADR-019 cambió la capa visual "sin tocar la estructura". Los colores se quedan; lo que falla es la estructura.
  - **Lo que no cambia:** export estático sin `proxy.ts` ([ADR-002](#adr-002), [ADR-017](#adr-017)), enlaces internos con `<a>`, contenido tipado ([ADR-003](#adr-003)) y UI sin librerías ([ADR-015](#adr-015)).
- **Decisión:**
  - **Home + una página por caso:**
    - La home (`/en`, `/es`) queda en este orden: hero (`#inicio`), Trabajo (`#trabajo`, 01), Servicios (`#servicios`, 02), Proceso (`#proceso`, 03), Precios (`#precios`, 04), Sobre mí (`#sobre-mi`, 05), Preguntas (`#preguntas`, 06) y Contacto (`#contacto`, 07).
    - `#solucion` pasa a `#servicios`, que absorbe "Qué resuelvo", y `#caso` pasa a `#trabajo`. El sitio no se ha lanzado, así que no se rompe ningún enlace externo.
    - Cada caso tiene su página: hero con el resultado como H1, resultados, resumen, antes/después, qué construí, video (fase B, [ADR-022](#adr-022)) y cierre.
  - **Segmentos por idioma:** `/en/work/<slug>` y `/es/trabajos/<slug>`.
    - Son dos envoltorios de ~15 líneas: `src/app/[locale]/work/[slug]/page.tsx` (solo `en`) y `src/app/[locale]/trabajos/[slug]/page.tsx` (solo `es`). Llevan `dynamicParams = false` y un `generateStaticParams` que devuelve slugs solo para su idioma, como `{ locale, slug }`: Next lo llama una vez por cada idioma del padre y falla el export si una llamada devuelve `[]` ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).
    - Las combinaciones cruzadas (`/es/work/…`, `/en/trabajos/…`) y los índices (`/en/work`) no se generan y responden con el 404 bilingüe ([ADR-013](#adr-013)).
    - `src/lib/routes.ts` concentra los segmentos, `casePath()`, `sectionHref()` y `NAV_SECTIONS`, para que ningún componente arme URLs a mano.
    - El Worker y `wrangler.jsonc` no cambian: Cloudflare ya sirve los HTML anidados del export.
  - **Casos como datos tipados** (extiende [ADR-011](#adr-011)):
    - `src/content/cases.ts` exporta `CaseStudy[]`, con el slug por idioma, `disclosure`, medios, cifras y fechas.
    - Los textos visibles siguen en `content/{en,es}.ts`: `caseMrb` pasa a `cases`, `solves` pasa a `services` y `nav` suma los enlaces y el menú ([04 §4](./04-i18n-contenido-y-precios.md#4-modelo-de-contenido-tipado)).
    - Una sola plantilla renderiza todos los casos, como las propuestas. Sin MDX.
  - **`disclosure` por caso** (ajusta [ADR-014](#adr-014)):
    - El campo pasa de `site.caseMrb` a cada `CaseStudy`.
    - **MRB queda en `'named'`**, con el permiso del cliente.
    - Las cifras sin confirmar (por ejemplo, el número de cotizaciones) y el testimonio siguen siendo opcionales: si no existen, su celda o bloque se omite sin dejar hueco.
  - **Barra fija en todas las páginas:**
    - 56 px de alto (antes 48), con `scroll-padding-top: 72px` (antes 64) para que el foco y los anclajes no queden tapados (WCAG 2.4.11).
    - **Escritorio (≥ 1024 px):** nombre · Trabajo · Servicios · Proceso · Precios · Sobre mí · EN/ES · [Agenda una llamada].
    - **Celular y tableta (< 1024 px):** nombre · [Agenda] · botón "Menú". El menú es un panel con la **Popover API nativa**: cierra con Esc y al tocar fuera, y devuelve el foco al botón, sin librería. Una isla mínima (`MenuCloser`, ~0,3 KB) lo cierra al tocar un enlace y cuando el foco sale del panel con Tab.
    - Desde la página del caso, los enlaces van a la home con ancla (`/es#servicios`) y "Trabajo" lleva `aria-current`.
    - El pie repite la navegación y suma el enlace al caso y a la política de privacidad.
    - `PageShell` comparte el enlace para saltar, la barra y el pie entre la home, el caso y la política, con los `alternates` del cambio de idioma.
  - **SEO por caso:** canónica, `hreflang` en/es/x-default e imagen OG propias. El sitemap pasa a 6 URLs, y `jsonld.ts` suma un `Article` con `about` MRB y autor `#person`, más un `BreadcrumbList` ([08](./08-seo.md)).
  - **Analítica:** evento nuevo `case_open`, con `location` `hero`, `work` o `footer`. Los enlaces de sección de la barra no lo envían, porque llevan a `#trabajo` y no al caso. `case_mrb_view` pasa a medirse en `#trabajo` ([12 §3](./12-medicion-y-analitica.md#3-taxonomía-de-eventos)).
- **Alternativas descartadas:**
  - **Seguir con una sola página y ampliar la sección del caso:** los resultados, el antes/después, lo que construí y el video no caben sin alargar mucho la home, y el caso no tendría una URL propia para los correos de prospección.
  - **El mismo segmento en los dos idiomas** (`/es/work/…`): una carpeta menos, pero la URL en español quedaría en inglés.
  - **Un segmento dinámico `[section]` que valide la pareja idioma–segmento:** un solo archivo, pero la validación queda en código en vez de en la estructura de carpetas, y convive en el mismo nivel con `privacy` y `p`.
  - **Una página índice `/work`:** con un solo caso quedaría casi vacía. `#trabajo` cumple ese papel.
  - **MDX para los casos:** ya descartado en [ADR-011](#adr-011). Los casos comparten una sola plantilla.
  - **Menú con `<details>` o con una isla de diálogo propia:** `<details>` no cierra con Esc ni al tocar fuera, y una isla de diálogo suma JS para algo que la Popover API resuelve en HTML (Chrome 114, Safari 17 y Firefox 125).
  - **Una librería de menú (Headless UI) o `next/link`:** prohibidas por [ADR-015](#adr-015) y [ADR-017](#adr-017).
  - **Mantener el caso anónimo:** ya hay permiso, y el caso con nombre e imágenes es la prueba más fuerte que tiene el sitio.
- **Consecuencias:**
  - **Ajusta ADR-014:**
    - MRB deja de ser anónimo por defecto. El tipo conserva `'anonymized'` para casos futuros, con las reglas de [04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure).
    - El alcance del permiso (nombre, logo, capturas, folleto, video y cifras) se confirma por escrito en R-01. Si llega más estrecho, se quitan los campos afectados; volver a `'anonymized'` obligaría a retirar las capturas.
  - **Ajusta ADR-019:** el sistema visual y sus tokens se quedan; lo que cambia es la estructura. Sus reglas de imágenes, sombras y movimiento se ajustan en [ADR-021](#adr-021) y [ADR-023](#adr-023).
  - **La demo no obliga a renumerar:** en la v2 entra como segunda tarjeta (`id="demo"`) dentro de `#trabajo`, así que los índices 01–07 no cambian, a diferencia de lo que preveía ADR-019. El contrato de [ADR-012](#adr-012) sigue igual.
  - **Mientras no haya otro caso,** la tarjeta "siguiente caso" de la página del caso lleva a Servicios y precios. Desde la v2 lleva a la tienda demo.
  - **Agregar un caso** es un objeto en `cases.ts`, sus textos en `en.ts` y `es.ts`, y sus medios. No hace falta crear rutas.
  - **JS:** `MenuCloser` es la única isla nueva de la fase A. Hoy se usan ~142 de los 150 KB, así que todas las islas nuevas, incluidas las de la fase B, deben sumar ≤ ~3 KB ([11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento)). En R-11 (24-oct), la home midió 132,8 KB con `MenuCloser` incluida.
  - **Sin JS,** el menú abre y cierra igual. Solo queda abierto después de tocar un enlace, hasta que se toque fuera o se pulse Esc.
  - Hay que actualizar 01, 03, 04, 06, 08 y 12 (R-10).

<a id="adr-021"></a>

## ADR-021 · Medios reales: capturas locales, marcos en CSS y LCP de texto en celular

- **Fecha:** 24 de octubre de 2026. Ajusta las reglas de imágenes de [ADR-019](#adr-019) y de [06 §4](./06-secciones-y-ui.md#4-imágenes).
- **Contexto:**
  - La estructura nueva ([ADR-020](#adr-020)) pone trabajo real en la primera pantalla y en la página del caso: capturas del sitio de MRB en marcos de computador y de celular.
  - El export no tiene optimizador de imágenes ([ADR-017](#adr-017)). Hasta ahora las imágenes se iban a exportar a mano en `public/`, con Squoosh o `sharp`, y ninguna estaba en el primer pliegue ([06 §4](./06-secciones-y-ui.md#4-imágenes)).
  - El LCP móvil es texto (el H1 o el subtítulo, 2,3 s el 24-oct) y no puede empeorar ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)).
  - archive.org no guarda ninguna captura del sitio anterior de MRB, así que no hay imágenes de "antes".
- **Decisión:**
  - **Capturas con Chrome headless por CDP, en local:** `scripts/lib/cdp.mjs` y `scripts/capture-screens.mjs` usan el Chrome instalado y el `WebSocket` de Node 24, a 1440 × 900 y 390 × 844 con DPR 2. Sin Puppeteer ni Playwright.
  - **Procesamiento con sharp, en local:** `scripts/build-images.mjs` genera AVIF y WebP en varios anchos en `src/media/` y escribe `src/media/manifest.generated.ts`.
    - sharp entra como **`devDependency`** (0.35.5). No es una dependencia de ejecución.
    - Los scripts no corren en Workers Builds.
  - **Imágenes en Git, importadas estáticamente:**
    - El build les pone un hash en el nombre (`/_next/static/media/…`), así que heredan la caché `immutable` de `_headers` ([09 §2](./09-seguridad-y-privacidad.md#2-encabezados-http)).
    - Si falta un archivo, el build falla. Por eso estos medios ya no pasan por `publicFileExists()`.
  - **`ResponsiveImage`:** `<picture>` con AVIF y WebP, `srcset`, `sizes`, `width` y `height` (sin CLS) y carga diferida, salvo la captura del hero en escritorio.
  - **Marcos de dispositivo dibujados en CSS** (`DeviceFrame`): navegador y celular, sin imágenes de maquetas. Son interfaz dibujada, como el escenario, así que pueden llevar `--shadow-2` y, el de celular, esquinas redondeadas.
  - **Regla nueva: en celular el LCP es texto, y las imágenes van después de los CTAs.**
    - Orden en celular: H1 → subtítulo → CTAs → línea de confianza → franja de cifras → marco de celular. El marco de navegador del hero no se descarga en celular.
    - En escritorio, la captura del hero puede ser el LCP: lleva `preload` con `media` y `fetchpriority="high"`.
    - Ninguna imagen del hero entra con fundido ni empieza con `opacity: 0`.
  - **Presupuestos de peso:**

    | Recurso | Límite |
    |---|---|
    | Hero, marco de navegador | ≤ 80 KB en AVIF |
    | Hero, marco de celular | ≤ 45 KB |
    | Captura del caso | ≤ 120 KB |

  - **Imágenes OG:** `scripts/build-og.mjs` genera las 4 (home y caso, en EN y ES) a partir de una plantilla HTML con las fuentes reales.
  - **Antes/después sin capturas de "antes":** son paneles de texto que comparan el proceso de antes con el de después. El lado "después" puede mostrar capturas.
- **Alternativas descartadas:**
  - **El optimizador de `next/image`:** no existe en el export ([ADR-017](#adr-017)).
  - **Cloudflare Images:** otro servicio y transformaciones en tiempo de ejecución para ~20 imágenes que no cambian entre despliegues.
  - **Imágenes en `public/`:** sin hash no admiten caché `immutable`, y un archivo que falta se omite en silencio.
  - **Squoosh a mano:** no se puede repetir igual cuando cambie el sitio de MRB.
  - **Puppeteer o Playwright:** dependencias grandes que descargan su propio navegador. CDP con el `WebSocket` de Node 24 alcanza.
  - **Maquetas de dispositivo en PNG o SVG:** pesan más, tienen licencias propias y no siguen los tokens.
  - **Procesar las imágenes en Workers Builds:** builds más lentos y un binario nativo en la imagen de build, para resultados que no cambian.
  - **Mostrar la captura del hero también en celular:** pasaría a ser el LCP móvil.
- **Consecuencias:**
  - **Ajusta ADR-019 y el design system:**
    - "Ninguna imagen en el primer pliegue" pasa a valer solo **en celular**.
    - La página deja de ser del todo plana: `--shadow-2` se permite en los marcos de dispositivo.
    - El `readme.md` del design system se ajusta en R-10.
  - **El repositorio crece** con cada imagen generada (varios anchos × 2 formatos). Los presupuestos de peso lo acotan.
  - **Regenerar es manual:** si cambia el sitio de MRB, se corren `capture-screens` y `build-images` y se commitean los archivos.
  - **Workers Builds instala sharp aunque no lo use,** porque es `devDependency`.
  - **Sin datos reales:** las capturas usan datos ficticios, el cotizador de MRB nunca se envía y ninguna captura muestra datos de clientes.
  - **No hay capturas de "antes":** la tabla de [06 §4](./06-secciones-y-ui.md#4-imágenes) y la de [04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure) se ajustan en R-10, y el deslizador de [ADR-023](#adr-023) depende de que aparezca una imagen de "antes".
  - **Se verifica en R-11:** el elemento LCP en Lighthouse móvil es el H1 o el subtítulo, y `curl -I` de `/_next/static/media/*.avif` muestra `immutable`.

<a id="adr-022"></a>

## ADR-022 · Video del trabajo real en Cloudflare R2

- **Fecha:** 24 de octubre de 2026. Se aplica en la fase B (R-12 a R-14 y R-18). Reemplaza la línea "Video: prohibido" de [ADR-006](#adr-006) para los clips del trabajo real, no para el hook ni el H1.
- **Contexto:**
  - Hiciste videos para MRB:
    - El teaser de 49 s es 100 % tuyo y no tiene audio.
    - El video de 163 s usa material 3D de Smiley Monroe y música de stock, así que **queda fuera**.
  - La estructura nueva ([ADR-020](#adr-020)) usa 3 clips cortos del sitio de MRB (búsqueda por referencia OEM, cambio de idioma y cotización en celular) y el teaser en la página del caso.
  - ADR-006 descartó el video por el roadmap. Esa regla era para el hook A (roadmap §4), no para mostrar trabajo real.
  - **Servir el video desde los assets estáticos del Worker no conviene:**
    - Su documentación no garantiza respuestas `206` a peticiones por rango (`Range`), que Safari necesita para reproducir video. La caché de Cloudflare sí las documenta ([Cloudflare](https://developers.cloudflare.com/cache/reference/range-requests/)).
    - Cada archivo tiene un límite de 25 MiB en el plan Free ([Cloudflare](https://developers.cloudflare.com/workers/platform/limits/)), y cada despliegue volvería a subir los videos.
    - Los términos de la CDN piden usar la Developer Platform, Images o Stream "in order to serve video and other large files via the CDN" ([Cloudflare](https://www.cloudflare.com/service-specific-terms-application-services/)). R2 es parte de la Developer Platform.
  - El plan gratuito de R2 incluye 10 GB-mes de almacenamiento, 1 millón de operaciones clase A, 10 millones clase B y salida gratis ([Cloudflare](https://developers.cloudflare.com/r2/pricing/)). Para activarlo hay que registrar una tarjeta.
- **Decisión:**
  - **Bucket `web-portfolio-media`** con el dominio propio `media.alejandrodeveloper.com`, que pasa por la caché de Cloudflare. `r2.dev` queda apagado: tiene límite de velocidad y es solo para desarrollo ([Cloudflare](https://developers.cloudflare.com/r2/buckets/public-buckets/)).
  - **Nombres versionados** (por ejemplo, `mrb/oem-search.v1.webm`) con caché `immutable`. Un cambio es un archivo nuevo, nunca una sobrescritura.
  - **Codificación local:**
    - `scripts/encode-video.sh` usa ffmpeg de Homebrew, que no entra al repositorio. Genera AV1 en WebM y H.264 en MP4 con `+faststart`, sin pista de audio, en 1280 y 720 px de ancho, más la portada.
    - `scripts/upload-media.sh` sube los archivos a R2.
    - Las fuentes crudas (`media-raw/`) y los videos (`media-out/`) van en `.gitignore`.
  - **La portada es una imagen estática del repositorio** ([ADR-021](#adr-021)): se ve sin R2, y es el punto de enganche que deja la fase A donde irá cada clip.
  - **Isla `LoopVideo` para los clips:**
    - `muted`, `playsinline`, `loop` y `preload="none"`. Empieza solo cuando el clip está en vista y después del evento `load`, así que no compite con el LCP.
    - Con "reducir movimiento" o Save-Data muestra solo la portada.
    - Tiene un botón visible de pausa, por WCAG 2.2.2: el clip arranca solo y, en bucle, dura más de 5 s.
    - Los clips son decorativos (`aria-hidden`) y llevan al lado un texto que cuenta lo mismo.
  - **Teaser con clic para reproducir:** portada, controles nativos y un bloque desplegable "Descripción del video", que es la alternativa de texto que pide WCAG 1.2.1 para un video sin audio. Envía el evento `video_play`.
  - **CSP:** se agrega `media-src 'self' https://media.alejandrodeveloper.com` ([09 §2](./09-seguridad-y-privacidad.md#2-encabezados-http)).
  - **Presupuestos:**

    | Recurso | AV1 (WebM) | H.264 (MP4) |
    |---|---|---|
    | Cada clip | ≤ 700 KB | ≤ 1,5 MB |
    | Teaser | ≤ 4 MB | ≤ 8 MB |

  - **Lo que no cambia de ADR-006:** el hook y el H1 siguen en CSS, con 0 KB de JS y sin video.
- **Alternativas descartadas:**
  - **Los assets estáticos del Worker:** ver el contexto.
  - **Cloudflare Stream:** no tiene plan gratuito; el almacenamiento se prepaga en bloques de US$5 al mes ([Cloudflare](https://developers.cloudflare.com/stream/pricing/)).
  - **YouTube o Vimeo:** un iframe de terceros con cookies y cientos de KB de JS, que obligaría a cambiar la CSP y la política de privacidad.
  - **GIF o AVIF animado:** pesan más que AV1 o H.264 en grabaciones de pantalla y no se pausan sin JS.
  - **Otra CDN (Bunny u otras):** otro proveedor y otra factura por unos 15 MB de video.
  - **Videos en Git:** el repositorio crecería con cada versión, y se seguirían sirviendo como assets estáticos.
- **Consecuencias:**
  - **Costo US$0** dentro del plan gratuito, pero con tarjeta registrada: un exceso sí se cobraría. Se crea una alerta de facturación en US$1 ([10 §10](./10-infraestructura-y-entornos.md#10-costos)).
  - **Un subdominio más:** `media.` se crea al conectar el dominio al bucket ([10 §3](./10-infraestructura-y-entornos.md#3-tabla-dns)). No cuenta como tercero: es el mismo sitio y carga después del evento `load`.
  - **R-12 lo verifica antes de construir:** `curl -sI -H 'Range: bytes=0-1'` devuelve `206` con `Accept-Ranges`, y la segunda petición muestra `cf-cache-status: HIT`. Safari en Mac y en iPhone se prueba en R-19.
  - **El clip del cotizador se graba en el entorno local de MRB, con Resend apagado:** ningún correo real llega a MRB y no aparecen datos de clientes.
  - **Depende de ti:** activar R2 con la tarjeta (R-12), instalar ffmpeg con Homebrew y grabar los 3 clips (R-13).
  - Hay que actualizar 01 (la regla "sin video"), 02, 09, 10 y 11 (R-19).

<a id="adr-023"></a>

## ADR-023 · Movimiento: revelados al hacer scroll, transiciones entre páginas y deslizador

- **Fecha:** 24 de octubre de 2026. Se aplica en la fase B (R-15 a R-17), salvo lo que se indica como fase A. Relaja dos reglas de [06 §3.5](./06-secciones-y-ui.md#35-movimiento-estados-y-foco) y del design system: "un solo momento coreografiado" y "sin animaciones al hacer scroll".
- **Contexto:**
  - Con una home de 7 secciones y una página de caso ([ADR-020](#adr-020)), un solo momento animado deja quieto el resto del recorrido. Pediste un sitio que llame la atención.
  - [ADR-006](#adr-006) fija las reglas: estado final primero, solo `transform`, `opacity` y `clip-path`, y sin librerías. Hoy se usan ~142 de los 150 KB de JS.
  - CSS ya anima con el scroll y entre páginas, sin JS:
    - Animaciones ligadas al scroll (`animation-timeline: view()`): Chrome y Edge desde la 115 y Safari desde la 26.
    - Transiciones de vista entre documentos (`@view-transition`): Chrome desde la 126 y Safari desde la 18.2.
    - Firefox todavía no activa ninguna de las dos por defecto.
- **Decisión:**
  - **Reglas comunes:** todo en CSS, primero el estado final, solo `transform`, `opacity` y `clip-path`, dentro de `@supports` y de `prefers-reduced-motion: no-preference`. Sin soporte o con "reducir movimiento", se ve el estado final.
  - **Fase A** (con R-06 y R-07):
    - El escenario del hook pasa al bloque B de Servicios y se reproduce una vez al entrar en vista, con 0 KB de JS: una animación ligada al scroll cambia una variable CSS cuando el escenario entra en vista, y una consulta de estilo mantiene la secuencia en pausa hasta entonces ([05 §4](./05-hero-animacion.md#4-implementación-el-estado-final-primero)). Sin esas dos funciones (Firefox), la secuencia corre al cargar y el visitante llega a la escena final; con "reducir movimiento", la escena final está desde el principio. Su secuencia no cambia. Falta probarlo en Safari 26 (R-11).
    - El H1 conserva el tachado y el marcador. Sin el escenario al lado, se re-temporizan a ~0,4 s y ~1,0 s.
    - Al pasar el mouse, la captura de la tarjeta del caso se desplaza lentamente (también con el foco del teclado), los marcos del hero suben 4 px, los bloques del bento cambian su regla a cobalto y las flechas se mueven 3 px. El menú de celular entra en 200 ms. Son transiciones, y solo corren sin "reducir movimiento".
  - **Fase B:**
    - **Revelados con CSS ligado al scroll** (R-16): la regla de tinta de cada H2 se dibuja, un marcador sol pasa bajo cada cifra, la línea de tiempo del proceso se llena y las capturas suben 16 px.
    - **Transiciones de vista entre la home y el caso** (R-17): `@view-transition { navigation: auto }` y un `view-transition-name` compartido entre la tarjeta del caso y el hero de su página. Funcionan con los `<a>` de siempre.
    - **Deslizador antes/después** (R-15): la isla `CompareSlider`, accesible con teclado. Sin JS se ven los paneles enfrentados. Envía el evento `compare_use`.
  - **Fuera:** parallax, contadores, carruseles, scroll secuestrado y animaciones en el texto de cuerpo, los precios o las preguntas. Nada que pueda ser el elemento LCP se anima.
- **Alternativas descartadas:**
  - **Motion o GSAP con ScrollTrigger:** decenas de KB de JS, prohibidos por [ADR-006](#adr-006) y [ADR-015](#adr-015), con el presupuesto casi lleno.
  - **Una isla con `IntersectionObserver` para los revelados:** suma JS, corre en el hilo principal y, si falla o tarda en hidratar, puede dejar contenido oculto. El CSS ligado al scroll corre en el compositor, con 0 KB.
  - **Transiciones con el router de Next (`next/link`):** no se usa en el export ([ADR-017](#adr-017)).
  - **Mantener un solo momento coreografiado:** no responde al pedido.
- **Consecuencias:**
  - **0 KB de JS** para los revelados y las transiciones. El deslizador es la única isla de este ADR y entra en los ~3 KB de [ADR-020](#adr-020).
  - **Firefox ve el contenido completo, sin los efectos.** Se verifica en R-19, junto con "reducir movimiento" y la navegación sin JS.
  - **WCAG 2.2.2 no aplica a los revelados:** los mueve el scroll del visitante; no arrancan solos.
  - **Sin CLS:** solo se animan propiedades que no mueven el layout.
  - **El deslizador necesita una imagen de "antes",** que hoy no existe ([ADR-021](#adr-021)). Si no aparece, R-15 se descarta y los paneles de texto quedan como están.
  - Hay que actualizar 05, 06 §3.5 y el `readme.md` del design system: R-10 para lo de la fase A y R-19 para lo de la fase B.

<a id="adr-024"></a>

## ADR-024 · Páginas de sección, menús desplegables y demos como casos

> **Ver [ADR-025](#adr-025) (25-oct-2026).** Trabajo tiene ahora su propia página (`/en/work`, `/es/trabajos`) y la home muestra solo un resumen. Servicios suma el diseño (7 bloques), y Sobre mí muestra LinkedIn en lugar de Precios mientras los precios estén ocultos.

- **Fecha:** 25 de octubre de 2026. Ajusta [ADR-020](#adr-020) (orden de la home, barra y "siguiente caso") y [ADR-012](#adr-012) (cómo entra la demo en el portafolio). El titular con pregunta ajusta la variante `a` de [04 §7](./04-i18n-contenido-y-precios.md#7-variantes-del-titular).
- **Contexto:**
  - Al revisar la fase A pediste cinco cambios antes del commit:
    1. El tachado de “call for pricing” debe ir encima de las letras.
    2. "Trabajo" debe desplegar MRB y las dos tiendas demo que estás preparando, cada una con su resumen en la home y "See the full case".
    3. Servicios debe tener su propia página, con ejemplos reales, y conservar el resumen en la home.
    4. Proceso y Precios pasan a una página de Sobre mí, con su resumen en la home.
    5. El titular debe hablarle también a quien ya tiene un sitio desactualizado, no solo a quien no tiene sitio.
  - Decisiones tuyas del 25-oct:
    - Los demos entran cuando tengan URL y capturas; el lanzamiento no los espera.
    - Servicios es una sola página, con un bloque por servicio.
    - El titular lleva la pregunta "¿Sin página web o con una desactualizada?" antes de la frase.
    - El resumen de Sobre mí en la home muestra los pasos y los precios.
  - **Lo que no cambia:** export estático sin `proxy.ts`, enlaces con `<a>`, contenido tipado, UI sin librerías y 0 KB de JS en la animación del hero.
- **Decisión:**
  - **Páginas nuevas, con segmento traducido** (como los casos):
    - `/en/services` y `/es/servicios`; `/en/about` y `/es/sobre-mi`.
    - Son 4 envoltorios en `src/app/[locale]/{services,servicios,about,sobre-mi}/page.tsx`. Cada uno devuelve `[{ locale }]` en `generateStaticParams` con `dynamicParams = false`, así que las combinaciones cruzadas (`/es/services`, `/en/sobre-mi`) no se generan y dan 404. Verificado con `next build` y `wrangler dev` el 25-oct.
    - `routes.ts` suma `PAGE_SEGMENT`, `pagePath()`, `pageAlternates()`, `anchorHref()`, `SERVICE_ANCHOR` y `ABOUT_SECTION`.
  - **Home:** hero, 01 Trabajo, 02 Servicios (el bento, con enlace a la página), 03 Sobre mí (resumen), 04 Preguntas y 05 Contacto. `#proceso` y `#precios` viven ahora en la página de Sobre mí.
  - **Servicios** (`ServicesPage`):
    - Hero con la ruta de navegación, el H1 y un índice de los 6 servicios.
    - Un bloque por servicio, en el orden del bento: resultado, título, cuerpo, introducción y "qué incluye".
    - Al lado, el ejemplo de cada caso destacado que tenga uno (`CaseStudy.examples` y su leyenda en `cases.<id>.examples`), con enlace al caso. Un demo se rotula "Demo · {nombre}".
    - El plan mensual no tiene captura: muestra el plan y su precio.
    - Cierra con la banda de contacto.
  - **Sobre mí** (`AboutPage`): el hero con el H1 "Trabajas directamente conmigo", el retrato y los datos; luego 01 Cómo trabajo, 02 Precios y 03 Contacto. En la home, `AboutTeaser` muestra el texto de presentación, los 4 pasos en una línea, los 3 planes con su precio por mercado y dos enlaces a la página.
  - **Barra con 3 menús desplegables:**
    - Trabajo, Servicios y Sobre mí. Cada uno es un botón con `popovertarget` que abre un panel a todo el ancho bajo la barra (Popover API, sin librería ni JS nuevo).
    - El panel de Trabajo muestra una tarjeta por caso, con miniatura. El de Servicios muestra los 6 servicios, y el de Sobre mí, quién soy, cómo trabajo y precios.
    - En celular, el menú muestra los 3 grupos con sus elementos.
    - `MenuCloser` pasa a recibir una lista de ids y cierra cualquiera de los paneles al tocar un enlace o al salir con Tab.
    - Sin Popover API, cada grupo es un enlace simple a su página.
    - Se descarta posicionar con `anchor()`: bajo una barra fija no hace falta, y Firefox no lo soporta.
  - **Demos como casos:**
    - `CaseStudy.kind` vale `'client'` o `'demo'`. Un demo se agrega como una entrada más en `cases.ts`, cuando tenga URL y capturas.
    - Las tarjetas de `#trabajo` alternan el lado de la captura. El texto de introducción tiene versión de un caso y de varios (`work.lead.one/many`).
    - Un demo lleva el chip "Demo · proyecto propio" y nunca muestra cifras, aunque su copy las tenga.
    - La tarjeta "siguiente" de cada caso lleva al siguiente caso destacado; la del último lleva a la página de Servicios.
  - **Titular:**
    - El texto antes de la primera comilla, si termina en "?", es la línea de público. Se pone arriba, a ~0,42 em y nunca por debajo de 22 px, dentro del mismo H1.
    - Con esa línea, el H1 baja a un máximo de 7 rem, para que las dos frases sigan ocupando dos líneas en escritorio.
    - El tachado se dibuja encima de las letras (`z-index: 1`); la frase sigue en `ink-3`.
    - En la imagen OG, la pregunta va como *kicker* sobre el H1.
  - **SEO y analítica:**
    - El sitemap pasa a 10 URLs. Las páginas nuevas llevan canónica, `hreflang` en/es/x-default y la imagen OG de la home.
    - `case_open` suma las ubicaciones `nav` (menú de Trabajo) y `services` (ejemplos de la página de Servicios).
- **Alternativas descartadas:**
  - **Una página por servicio (12 URLs):** ayuda más al SEO por servicio, pero triplica el copy y deja páginas con poco contenido mientras haya un solo caso real.
  - **Tarjetas "Próximamente" para los demos:** se ven como trabajo sin terminar.
  - **Menús que abren al pasar el mouse:** no funcionan con toque ni con teclado sin JS. El clic, con Popover API, sí.
  - **Un segmento dinámico `[page]`:** ya descartado en [ADR-020](#adr-020).
  - **Dejar Proceso y Precios en la home:** contradice tu pedido. El resumen conserva los precios a un scroll del hero, que era lo que pedía [ADR-020](#adr-020).
- **Consecuencias:**
  - **Ajusta ADR-020:** la home pasa de 7 a 5 secciones; la barra pasa de 5 enlaces a 3 menús; Precios queda en `/sobre-mi#precios`.
  - **Ajusta ADR-012:** cada demo sigue en su propio proyecto y subdominio, pero en el portafolio entra como caso (`kind: 'demo'`), con su página, en lugar de como tarjeta `#demo`. V2-01 cambia en consecuencia; el espacio `demo` de `Work` queda para una tarjeta sin página.
  - **JS:** igual que antes (171,3 KB con el polyfill, ~132,8 KB sin él, medido el 25-oct). `MenuCloser` sigue siendo la única isla nueva.
  - **Agregar un demo:**
    - una entrada en `cases.ts`, con `kind: 'demo'`, sus medios y `examples`;
    - su copy en `en.ts` y `es.ts`, con las leyendas de `examples`;
    - su id en `CaseId`, y ampliar el tipo de `alts`, que hoy solo admite las claves `mrb/*`.
  - **Copy por revisar:** `REVIEW(R-24)` (página de Servicios) y `REVIEW(R-25)` (menús, Trabajo con varios casos y Sobre mí).

<a id="adr-025"></a>

## ADR-025 · Página de Trabajo, servicio de diseño y precios ocultos

- **Fecha:** 25 de octubre de 2026. Ajusta [ADR-024](#adr-024): la home ya no lista los casos, Servicios pasa a 7 bloques y Sobre mí muestra LinkedIn. Mientras `site.features.pricing` esté apagado, pone en pausa la parte visible de [ADR-005](#adr-005). También resuelve la decisión pendiente de `sameAs` de [08 §4](./08-seo.md#4-datos-estructurados-json-ld).
- **Contexto:**
  - Al revisar los cambios de ADR-024 pediste cuatro más:
    1. Quitar "Tiendas y catálogos en línea" de la barra.
    2. Trabajo debe ser una página aparte con todos los trabajos. En la home va un resumen de lo que haces, las categorías y las industrias, con un botón a esa página.
    3. Servicios no decía que haces diseño. Además, "Que te elijan" no debe segmentar la búsqueda por OEM o máquina, porque debe servir para cualquier catálogo.
    4. Ocultar por ahora los precios y todas sus referencias mientras los defines, y poner enlaces a tu LinkedIn en su lugar.
  - Decisiones tuyas del 25-oct:
    - El perfil es `https://www.linkedin.com/in/alejandro-hernandez-quintero/`. Al enlazarlo, quien entre ve lo que tu perfil muestre.
    - Las categorías y las industrias salen de los casos publicados, no de una lista fija.
    - El diseño entra como un servicio propio, "Diseño de tu sitio y tu marca", con el logo y el folleto de MRB como ejemplo.
    - Se ocultan solo los montos: "prototipo gratis" y la forma de pago 40/40/20 se quedan.
  - **Lo que no cambia:** export estático sin `proxy.ts`, enlaces con `<a>`, contenido tipado, UI sin librerías y 0 KB de JS en la animación del hero.
- **Decisión:**
  - **Página de Trabajo** (`WorkPage`):
    - Vive en `/en/work` y `/es/trabajos`, el segmento que ya usaban los casos, que ahora cuelgan de ella. `PAGE_SEGMENT.work` reemplaza a `CASE_SEGMENT`.
    - Son 2 envoltorios en `src/app/[locale]/{work,trabajos}/page.tsx`, con un solo idioma en `generateStaticParams` y `dynamicParams = false`. `/es/work` y `/en/trabajos` dan 404.
    - Contiene la ruta de navegación, el H1 "Trabajo, caso por caso" y la introducción (`workPage.lead.one/many`). Sigue una banda por caso destacado con su tarjeta: numerada, alternando tono y lado, con el slug como ancla (`/es/trabajos#malone-road-belt`). Cierra con la banda de contacto.
    - La ruta de navegación de cada caso y su `BreadcrumbList` llevan a esta página, no a `/#trabajo`. El menú de Trabajo y su enlace "Todo el trabajo" también.
  - **Resumen en la home (01 Trabajo):**
    - A la izquierda, lo que haces y el botón "Ver todo mi trabajo".
    - A la derecha, una hoja de datos con tres filas: las categorías (`CaseStudy.categories`, con los textos de `work.categories`), las industrias (`cases.<id>.card.industry`, sin repetir) y una fila por proyecto, con miniatura, que lleva a su caso.
    - Un demo suma sus categorías y su industria al entrar en `cases.ts`.
  - **Barra:** solo lleva el nombre. El lema sigue en el pie, en la imagen OG y en los datos estructurados.
  - **Servicios, ahora 7:**
    - `design` entra como tercer servicio (`SERVICE_ANCHOR.design = 'diseno'`).
    - En el bento es una ficha de 2 columnas con el folleto abierto de MRB, y la nota de propiedad pasa a ocupar toda la última fila.
    - En la página de Servicios, su ejemplo es el folleto bajo el logo, como en el caso: reutiliza `Capture` de `CaseFeatures` con el marco `plain`.
    - "Que te elijan" pasa a "Catálogo con búsqueda y filtros", por nombre, referencia o categoría, y su prueba pasa a los productos de MRB. Las leyendas de los ejemplos de MRB siguen hablando de OEM porque describen ese caso.
    - El hero, la descripción y la introducción de Servicios dicen "Diseño y construyo".
  - **Precios ocultos** con `site.features.pricing = false`. Todo vuelve con `true`, y el contenido de `pricing` queda intacto:
    - En Sobre mí, la sección 02 es "Conóceme mejor" (`#linkedin`), con una tarjeta de perfil en lugar de Precios.
    - En el resumen de Sobre mí de la home, la tarjeta de LinkedIn reemplaza los 3 planes y desaparece "Ver todos los precios".
    - En el menú de Sobre mí, LinkedIn (en una pestaña nueva) reemplaza a Precios.
    - En el hero, la celda del precio muestra su `fallback`: "100 % del dominio, el hosting y las cuentas, a tu nombre".
    - En el bento y en la página de Servicios, el plan mensual no muestra precio, y "Ver precios" pasa a "Ver cómo trabajo" (`/sobre-mi#proceso`).
    - El JSON-LD no lleva `priceRange`, y la descripción de Sobre mí ya no menciona precios.
    - Se quedan "prototipo gratis", el 40/40/20 en las preguntas y en el proceso, y el precio del producto ficticio de la animación, que es parte de la escena y no un precio tuyo.
  - **LinkedIn:**
    - Aparece como tarjeta en Sobre mí y en su resumen, como elemento del menú y como enlace en el pie. Siempre abre en una pestaña nueva, y eso se anuncia a los lectores de pantalla.
    - Hay un evento nuevo, `linkedin_open`, con ubicación `nav`, `about` o `footer`.
    - La persona del JSON-LD suma `sameAs` con el perfil.
  - **SEO:** el sitemap pasa a 12 URLs.
- **Alternativas descartadas:**
  - **Borrar la sección de precios:** obligaría a rehacerla cuando los definas. Con el interruptor vuelven cambiando una línea.
  - **Una lista fija de industrias:** mostraría sectores sin un caso detrás.
  - **Mencionar el diseño solo en los textos:** no se vería en el bento ni en el menú.
  - **Mantener las tarjetas completas en la home:** es justo lo que pediste cambiar. Ahora las lista la página de Trabajo.
- **Consecuencias:**
  - **Ajusta ADR-024:**
    - La home ya no lista los casos: las tarjetas viven en `/trabajos`.
    - Servicios pasa de 6 a 7 bloques.
    - Sobre mí muestra LinkedIn en lugar de Precios mientras el interruptor esté apagado.
    - Se elimina el espacio `demo` de `Work`, porque los demos entran como casos.
  - **ADR-005** queda en pausa en lo visible. La detección de mercado sigue, para el precio del producto de la animación.
  - **Para volver a mostrar los precios:** poner `site.features.pricing = true`, revisar el copy de `pricing` y volver a mencionarlos en `aboutPage.meta`.
  - **Copy por revisar:**
    - `REVIEW(R-26)`: página y resumen de Trabajo.
    - `REVIEW(R-27)`: el servicio de diseño y el catálogo sin OEM.
    - `REVIEW(R-28)`: LinkedIn y la celda del 100 %.
