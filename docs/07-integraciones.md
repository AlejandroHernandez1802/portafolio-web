# 07 · Integraciones

La v1 se integra con tres servicios, todos mediante enlaces reales que funcionan sin JavaScript: **Cal.com** (agenda en popup), **WhatsApp** y **correo**.

| Versión | Integración |
|---|---|
| v1.1 | Formulario con **Resend** |
| v2 | Enlace a la **tienda demo** |
| v3 | Diagnóstico automático (esbozo, §7) |

---

## 1. Resumen

| Integración | Versión | Propósito | Datos personales | Costo | Si falla |
|---|---|---|---|---|---|
| Cal.com (Free) | v1 | Agendar la llamada de 15 min | Nombre, correo, sitio web, consentimiento | US$0 | El enlace abre `cal.com/...` en otra pestaña |
| WhatsApp (`wa.me`) | v1 | Conversación directa | Número y mensajes (en Meta, fuera del sitio) | US$0 | — |
| `mailto:` | v1 | Correo directo | Lo que escriba el visitante | US$0 | — |
| Umami Cloud (Hobby) | v1 | Medición | Ninguno identificable: sin cookies ni datos personales ([12](./12-medicion-y-analitica.md)) | US$0 | El sitio sigue funcionando |
| Resend (Free) | v1.1 | Enviar el formulario a `hola@` | Nombre, correo, empresa, mensaje, consentimiento | US$0 | Error visible + `mailto` prellenado |
| Tienda demo | v2 | Prueba en vivo | Los que defina la demo (proyecto aparte) | Por definir en sus docs | Se apaga con `features.demoStore` |

## 2. Agenda con Cal.com

### 2.1 Configuración en Cal.com (fase 0)

- **Cuenta y calendario:** cuenta Free con el calendario de Google Workspace conectado (detección de conflictos) y la app **Google Meet** para el enlace de videollamada.
- **Tipo de evento:** "Llamada de 15 minutos", slug `15min`. Dentro del evento:
  - Disponibilidad pensada para EE. UU. y Colombia. En invierno compartes hora con el este de EE. UU. (diagnóstico §6).
  - Aviso mínimo de 12 h y 10 min de margen entre llamadas.
  - **"Lock timezone" desactivado**, para que Cal.com muestre los horarios en la zona del visitante, que es su comportamiento por defecto ([Cal.com](https://cal.com/help/event-types/timezone-lock)).
- **Preguntas de la reserva:** además de nombre y correo, que vienen por defecto:
  - "Company website / Sitio web de la empresa" (texto, opcional).
  - **Consentimiento obligatorio** (casilla), con enlace a la política (Ley 1581, ver [09 §6](./09-seguridad-y-privacidad.md#6-privacidad-y-cumplimiento)). Ejemplo en ES: *"Autorizo el tratamiento de mis datos personales según la política de privacidad: alejandrodeveloper.com/es/privacy"*.
- **Idioma:**
  - **Preferido:** dos tipos de evento, `15min` (EN) y `15min-es` (ES), cada uno con sus preguntas en su idioma.
  - **Si no se puede:** la página de precios de Cal.com dice que el plan Free incluye tipos de evento ilimitados, pero un post de Cal.com de 2025 habla de "un tipo de evento activo". **Confírmalo en la app.** Si el límite es uno, se usa un solo evento con etiquetas bilingües.
- **Recordatorios:** el plan Free envía el recordatorio por defecto, que no se puede personalizar ([Cal.com](https://cal.com/help/workflows/workflowsoverview)).

### 2.2 Marcado de los botones (servidor)

Cada CTA de agenda es un `<a>` real, renderizado en el servidor:

```tsx
<a
  href="https://cal.com/tu-usuario/15min"        // respaldo: funciona sin JS (otra pestaña)
  target="_blank" rel="noopener"
  data-cal-link="tu-usuario/15min"               // atributos del embed "pop-up via element click"
  data-cal-namespace="15min"
  data-cal-config='{"layout":"month_view"}'
  data-track="book_call_click" data-track-location="hero"
>
  Book a 15-minute call
</a>
```

### 2.3 Carga diferida y mejora progresiva (`CalLoader`)

`CalLoader` es una isla de cliente montada una vez en el layout. Su comportamiento:

1. **No carga nada al inicio.** No se precarga el widget, para proteger el LCP y el TBT.
2. **Carga `embed.js` con la primera intención:** `pointerover`, `focusin` o `touchstart` sobre cualquier `[data-cal-link]`. Como respaldo, usa `requestIdleCallback` unos segundos después de la carga. El snippet es el que genera Cal.com en *Event type → Embed → Pop-up via element click*. Se copia de ahí; no se escribe a mano.
3. **Al cargar, ejecuta:**
   - `Cal("init", "15min", { origin: … })`
   - `Cal.ns["15min"]("ui", { hideEventTypeDetails: false, layout: "month_view" })`
   - `Cal.ns["15min"]("preload", { calLink })` en el primer *hover* o *focus*, para que el popup abra al instante ([Cal.com](https://cal.com/help/embedding/embed-instructions)).
4. **Agrega los UTM** guardados en `sessionStorage` (ver [12 §4](./12-medicion-y-analitica.md#4-implementación)) al `data-cal-config` de cada botón: `{"layout":"month_view","utm_source":"email","utm_campaign":"2026-w43-industrial-us",…}`. Cal.com guarda los cinco `utm_*` en cada reserva, visibles para ti en el detalle ([Cal.com](https://cal.com/help/bookings/utm-tracking)). `forwardQueryParams` está apagado por defecto y solo vería la URL actual, por eso se pasan explícitos ([Cal.com](https://cal.com/help/embedding/embed-auto-forward-query-params)).
5. **Evita la doble apertura** con un listener de clic en **fase de captura**:
   - **Embed ya cargado:** llama a `preventDefault()`, que impide abrir la pestaña, y deja que el manejador de Cal abra el popup.
   - **Embed aún no cargado:** el navegador sigue el enlace en otra pestaña y se dispara la carga para los siguientes clics.
   - **Verificar en QA** que, con el embed cargado, solo se abre el popup.
6. **Si el embed falla** (evento `linkFailed`), se abre el `href` en otra pestaña.

### 2.4 Eventos del embed

| Evento de Cal.com | Acción |
|---|---|
| `bookingSuccessfulV2` | `track('booking_completed', { location, campaign })`. `location` es el botón que abrió el popup, guardado al hacer clic. El evento `bookingSuccessful` (sin V2) está obsoleto ([Cal.com](https://cal.com/help/embedding/embed-events)) |
| `linkFailed` | Abrir el enlace directo en otra pestaña |
| `dryRunBookingSuccessfulV2` | Solo en pruebas: confirma el flujo sin crear una reserva real |

### 2.5 Privacidad y rendimiento

- **Rendimiento:** Cal.com se carga en un iframe de otro origen y solo cuando hay intención. Por eso no afecta el LCP. La CSP debe permitir sus dominios en `frame-src` y `script-src` ([09 §2](./09-seguridad-y-privacidad.md#2-encabezados-http)).
- **Privacidad:** Cal.com actúa como encargado. Las respuestas de la reserva, incluido el consentimiento, quedan en Cal.com y en tu Google Calendar. Así se lista en la política de privacidad.
- **Alternativa descartada:** Calendly. Su plan Free permite 1 tipo de evento y 1 calendario, y su evento `calendly.event_scheduled` trae menos datos ([ADR-007](./14-decisiones.md#adr-007)).

## 3. WhatsApp

- **Enlace:** `https://wa.me/57XXXXXXXXXX?text=<mensaje codificado>`, con el número completo sin "+", espacios ni guiones ([WhatsApp](https://faq.whatsapp.com/5913398998672934/)). Mensaje por idioma en `closing.whatsapp.prefilledMessage`.
- **Atributos:** `target="_blank" rel="noopener"`, `data-track="whatsapp_click"` y `data-track-location`.
- **App:** se recomienda **WhatsApp Business**, gratis, con perfil de empresa, mensaje de bienvenida y respuestas rápidas.
- **Orden y visibilidad por mercado:** ver [06 §5](./06-secciones-y-ui.md#5-whatsapp-y-contacto-según-mercado).

## 4. Correo (`mailto`)

- `mailto:hola@alejandrodeveloper.com?subject=<asunto codificado por idioma>`, con `data-track="email_click"`.
- La dirección se publica en texto plano. Los filtros de Google Workspace manejan bien el spam y ofuscarla complica la accesibilidad.

## 5. Formulario de contacto (v1.1)

**Prioridad P1:** entra en la fase 1 solo si sobra tiempo; si no, va del 19 al 25 de octubre. Se activa con `site.features.contactForm = true`.

### 5.1 Experiencia

| Campo | Tipo | Reglas |
|---|---|---|
| Nombre | `text`, `autocomplete="name"` | Obligatorio, 2–100 caracteres |
| Correo | `email`, `autocomplete="email"` | Obligatorio |
| Empresa o sitio web | `text`, `autocomplete="organization"` | Opcional, hasta 200 caracteres |
| Mensaje | `textarea` | Obligatorio, 10–2.000 caracteres |
| Consentimiento | `checkbox`, **sin marcar** | Obligatorio; enlace a la política (Ley 1581: el silencio no es autorización) |
| `website_url` | Honeypot | Fuera de pantalla, `tabIndex={-1}`, `autoComplete="off"`, contenedor `aria-hidden`. Debe llegar vacío |
| `locale`, `campaign`, `elapsedMs` | Ocultos | `elapsedMs` = milisegundos desde que se montó el formulario, medidos con `performance.now()` |

- **Validación en el cliente:** solo la nativa de HTML (`required`, `type="email"`, `maxLength`). Zod no viaja al navegador.
- **Accesibilidad:**
  - Cada error va junto a su campo, con `aria-invalid` y `aria-describedby`.
  - El estado general va en una región con `role="status"` y `aria-live="polite"`.
  - Si hay errores, el foco pasa al primer campo inválido.
- **Envío:** `fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body })`.
- **Sin JavaScript:** el formulario no se muestra y queda el `mailto` del cierre, que siempre está visible.

### 5.2 Endpoint en el Worker

`POST /api/contact` vive en el mismo Worker que las redirecciones ([ADR-009](./14-decisiones.md#adr-009)). El export estático no admite Server Actions ni Route Handlers que lean la solicitud. Un endpoint propio, además:

- Tiene una **ruta estable** para la regla de rate limit y para Turnstile.
- Se prueba con `curl`.
- No depende de la versión de Next desplegada.

En la v1.1 se agrega `/api/*` a `run_worker_first`, y `worker/index.ts` enruta `/api/contact` a esta función. Si el SDK `resend` diera problemas en el runtime de Workers, se llama directo a su API REST con `fetch` (`POST https://api.resend.com/emails`).

```ts
// worker/contact.ts (esqueleto ilustrativo, v1.1)
import * as z from 'zod'
import { Resend } from 'resend'
import { site } from '../src/content/site'

const POLICY_VERSION = site.legal.privacyVersion // evidencia de qué política aceptó

const Body = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  locale: z.enum(['en', 'es']),
  elapsedMs: z.number().int().nonnegative(),
  website_url: z.string().max(0).optional(), // honeypot
  campaign: z.string().max(60).optional(),
})

// worker/index.ts la llama cuando la ruta es /api/contact
export async function handleContact(req: Request, env: Env): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 })
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return new Response(null, { status: 415 })
  }
  const raw = await req.text()
  if (raw.length > 10_000) return new Response(null, { status: 413 })

  let json: unknown
  try { json = JSON.parse(raw) } catch { return Response.json({ ok: false }, { status: 400 }) }

  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return Response.json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 })
  }
  const d = parsed.data

  // Antispam silencioso: el bot recibe "ok" y no se envía nada
  if (d.website_url || d.elapsedMs < 3000) return Response.json({ ok: true })

  const resend = new Resend(env.RESEND_API_KEY) // secreto del Worker
  const { error } = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL, // "Portafolio <web@notify.alejandrodeveloper.com>", en vars de wrangler.jsonc
    to: env.CONTACT_TO_EMAIL,     // "hola@alejandrodeveloper.com"
    replyTo: d.email,
    subject: `[Web] ${d.name}${d.company ? ` · ${d.company}` : ''}`,
    text: [
      `Nombre: ${d.name}`, `Correo: ${d.email}`, `Empresa: ${d.company ?? '-'}`, '', d.message, '',
      `Consentimiento: sí · Política v${POLICY_VERSION} · ${new Date().toISOString()}`,
      `Idioma: ${d.locale} · Campaña: ${d.campaign ?? 'none'}`,
    ].join('\n'),
  })
  if (error) return Response.json({ ok: false }, { status: 502 })

  return Response.json({ ok: true }) // al recibirlo, ContactForm envía contact_submitted a Umami (12 §3)
}
```

**Por qué `elapsedMs` y no una marca de tiempo absoluta.** En un sitio estático, una marca de tiempo del servidor sería la del build. Y comparar relojes de cliente y servidor descarta mensajes reales cuando el reloj del visitante está adelantado.

### 5.3 Capas antispam

| Capa | Costo | Detiene |
|---|---|---|
| Honeypot `website_url` | 0 | Bots que llenan todos los campos |
| `elapsedMs < 3 s` | 0 | Bots que envían al instante |
| Zod + límite de 10 KB + `content-type` | 0 | Cargas malformadas o enormes |
| Regla de rate limit del WAF de Cloudflare para `/api/contact`, por ejemplo más de 3 solicitudes en 10 s → bloqueo. El plan Free permite 1 regla, por IP y ruta, con ventana de 10 s y bloqueo de 10 s ([Cloudflare](https://developers.cloudflare.com/waf/rate-limiting-rules/)). Alternativa: el binding `ratelimits` del Worker (periodo de 10 o 60 s), si V11-02 confirma que está disponible en Free ([Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)) | US$0 | Ráfagas desde una IP |
| **Solo si aparece spam:** Turnstile (gratis). El widget se carga al enfocar el formulario y el Worker verifica el token con `siteverify` antes de enviar ([Cloudflare](https://developers.cloudflare.com/turnstile/plans/)) | US$0 | Bots con navegador real |

### 5.4 Configuración

- **Variables:**
  - `RESEND_API_KEY` es un secreto del Worker: `npx wrangler secret put RESEND_API_KEY`, y en local, `.dev.vars`.
  - `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` van en `vars` de `wrangler.jsonc`.
  - Detalle en [10 §8](./10-infraestructura-y-entornos.md#8-variables-de-entorno).
- **Dominio de envío:** `notify.alejandrodeveloper.com`, verificado en Resend ([10 §3](./10-infraestructura-y-entornos.md#3-tabla-dns)).
- **Plan Free de Resend:** 3.000 correos al mes, 100 al día y 3 dominios. Suspende el envío si los rebotes llegan al 4 % o las quejas al 0,08 % ([Resend](https://resend.com/docs/knowledge-base/account-quotas-and-limits)).
- **Sin respuesta automática al visitante en la v1.1.** Un formulario que envía correos a direcciones arbitrarias se puede usar para enviar spam en tu nombre.

### 5.5 Pruebas

```bash
# Válido (en local con `pnpm preview` y una RESEND_API_KEY de prueba en .dev.vars)
curl -s -X POST localhost:8787/api/contact -H 'content-type: application/json' \
  -d '{"name":"Ana","email":"ana@example.com","message":"Hola, quiero una tienda","consent":true,"locale":"es","elapsedMs":8000}'
# Honeypot lleno → {"ok":true} y no llega correo
# Sin consentimiento → 400 con errores por campo
```

- **Playwright:** intercepta `/api/contact` para probar los estados de éxito, error y 502 sin enviar correos.

## 6. Tienda demo (v2): contrato de integración

La demo es una **plantilla reutilizable para clientes**: un distribuidor ficticio con catálogo, búsqueda por referencia, cotización con carga de planos, carrito y pago de prueba (diagnóstico §7). Vive en **otro repositorio y otro proyecto**, en `demo.alejandrodeveloper.com`, y tendrá sus propios docs. Ahí se decide su hosting: Cloudflare Workers (Free o Paid) o Vercel Pro, cuando haya ingresos. Este contrato fija lo que cada lado debe cumplir.

**La demo debe:**

- [ ] Enviar `X-Robots-Tag: noindex, nofollow` en **todas** sus rutas y quedar fuera de cualquier sitemap.
- [ ] Mostrar un banner permanente de modo prueba: *"Demo store · test mode · use card 4242 4242 4242 4242, any future date, any CVC"* ([Stripe](https://docs.stripe.com/testing)).
- [ ] Usar marca y productos ficticios, nunca datos reales.
- [ ] Usar Stripe con claves de prueba, en un **sandbox** (lo que Stripe recomienda hoy para integraciones nuevas, [Stripe](https://docs.stripe.com/sandboxes)). Nunca claves *live*.
- [ ] Cobrar solo con **Stripe Checkout alojado**, que redirige a Stripe. Nunca campos de tarjeta propios: si la demo se aloja en Cloudflare Free, sus términos prohíben capturar datos de tarjetas ([ADR-017](./14-decisiones.md#adr-017)).
- [ ] Guardar los planos subidos de forma privada (p. ej. R2 de Cloudflare o Vercel Blob), con un límite de tamaño (p. ej. 10 MB) y **borrado automático** (p. ej. a los 7 días). Las subidas van directo al almacenamiento desde el cliente, con una URL firmada, sin pasar el archivo por una función.
- [ ] Tener un CTA "Book a call" hacia Cal.com y un enlace de regreso al portafolio.
- [ ] Tener su propia analítica (`add_to_cart`, `checkout_started`, `quote_submitted`). Umami Hobby admite un solo sitio: la demo usa el mismo, filtrado por hostname, o su propia herramienta.
- [ ] Tener su propio aviso de privacidad, o enlazar al del portafolio si trata los mismos datos.

**El portafolio debe:**

- [ ] Con `site.features.demoStore = true`, mostrar la sección `#demo`: póster estático (WebP o AVIF ≤ 150 KB), título, una línea y el botón "Try the demo store" / "Prueba la tienda demo".
- [ ] Enlazar a `https://demo.alejandrodeveloper.com/?utm_source=portfolio&utm_medium=demo_block&utm_campaign={campaign}` en otra pestaña, con `data-track="demo_open"`.
- [ ] Cambiar el CTA secundario del hero y el destino del escenario de la animación a la demo.
- [ ] **No usar un iframe.** La experiencia móvil es mala, Stripe Checkout no se puede enmarcar y el iframe pesaría en el rendimiento de la página ([ADR-012](./14-decisiones.md#adr-012)).

## 7. v3: esbozo del diagnóstico automático (hook C)

Es opcional y va después del 18 de diciembre, solo si hacen falta más prospectos entrantes. El roadmap estima 10–15 h. Esto es un esbozo; el diseño detallado se hará si se aprueba.

**Flujo:**

1. El visitante escribe la URL de su sitio y su correo, y marca el consentimiento.
2. Una función valida la URL y ejecuta las revisiones.
3. Ve un informe con 3–5 hallazgos y un CTA de agenda, y recibe una copia por correo.

**Revisiones candidatas:**

- [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started): rendimiento móvil, LCP y CLS; requiere una API key gratuita.
- HTTPS y el aviso "Not secure".
- Título y descripción.
- `viewport`.
- Datos estructurados: LocalBusiness, Product, Organization.
- Señales de conversión: formulario de cotización, `tel:`, `wa.me`, carrito.
- `sitemap.xml` y `robots.txt`.
- Opcional, con costo: presencia en Google Maps vía Places API.

**Seguridad (obligatoria):**

- **SSRF:**
  - Solo `http` y `https`.
  - Resolver el DNS y bloquear rangos privados y reservados, y volver a validar después de cada redirección.
  - Máximo 3 redirecciones, 10 s de timeout y 2 MB de respuesta.
- **Abuso:**
  - Turnstile y una regla de rate limit.
  - Límite por correo y por día.
  - Caché de resultados por dominio durante 24 h (p. ej. KV de Cloudflare).

**Datos:**

- Los leads (correo, URL, consentimiento) requieren almacenamiento: D1 de Cloudflare o una base Postgres como Neon.
- El correo con el informe sale por Resend.
- Hay que actualizar la política de privacidad.

**Ejecución:**

- Un endpoint del Worker con estados de progreso en la UI; PSI puede tardar 10–30 s. Esperar la red no consume los 10 ms de CPU por invocación del plan Free, pero el análisis de las respuestas sí: el diseño debe medirlo o asumir Workers Paid.
- Opcional: un resumen redactado por IA.

## Fuentes

- **Cal.com:** [precios](https://cal.com/pricing), [instrucciones de embed](https://cal.com/help/embedding/embed-instructions), [eventos del embed](https://cal.com/help/embedding/embed-events), [UTM](https://cal.com/help/bookings/utm-tracking), [reenvío de parámetros](https://cal.com/help/embedding/embed-auto-forward-query-params), [bloqueo de zona horaria](https://cal.com/help/event-types/timezone-lock).
- **Resend:** [precios](https://resend.com/pricing), [límites](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [uso aceptable](https://resend.com/legal/acceptable-use).
- **Cloudflare:** [rate limiting del WAF](https://developers.cloudflare.com/waf/rate-limiting-rules/), [binding de rate limit](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [Turnstile](https://developers.cloudflare.com/turnstile/plans/), [términos](https://www.cloudflare.com/terms/).
- **Umami:** [precios](https://umami.is/pricing).
- **Stripe:** [pruebas](https://docs.stripe.com/testing), [sandboxes](https://docs.stripe.com/sandboxes).
- **WhatsApp:** [click to chat](https://faq.whatsapp.com/5913398998672934/).

Consultadas el 3-oct-2026; Cloudflare y Umami, el 4-oct-2026.
