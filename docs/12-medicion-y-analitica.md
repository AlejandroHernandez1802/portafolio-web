# 12 · Medición y analítica

La medición usa **Umami Cloud**, en el plan Hobby gratuito ([ADR-018](./14-decisiones.md#adr-018)), con 9 eventos personalizados. A eso se suman las reservas de **Cal.com**, que guardan los UTM de cada llamada agendada.

Umami no usa cookies, lee los UTM de la URL y los muestra en su propio reporte. Aun así, se mantienen dos piezas propias:

- La campaña viaja como propiedad `campaign` en cada evento.
- Un evento `landing` registra las llegadas con UTM, pero solo después de una interacción real, lo que filtra los escáneres de enlaces de correo.

Con eso se responde todo lo que pide el roadmap (§9) sin pagar.

---

## 1. Preguntas que responde la medición

| Pregunta (roadmap §9) | Dato | Fuente |
|---|---|---|
| ¿Cuántas visitas llegan desde mis correos, por campaña? | `landing` filtrado por `source = email`, agrupado por `campaign` | Umami → Events |
| ¿Qué % de visitantes hace clic en "Agendar" o "Probar la tienda"? (meta ≥ 10 %) | (`book_call_click` + `demo_open`) ÷ visitantes | Umami |
| ¿Cuántas llamadas se agendan y desde qué campaña? (meta: 5 conversaciones calificadas al 18-dic) | `booking_completed`; UTM en el detalle de cada reserva | Umami + Cal.com |
| ¿Cuántas veces se abre la demo? (v2) | `demo_open` por `campaign` | Umami |
| ¿Qué titular funciona mejor? | Tasa de clic del CTA del hero por ventana de fechas (§6) | Umami |

## 2. Herramientas

| Herramienta | Uso | Por qué |
|---|---|---|
| Umami Cloud (Hobby) | Páginas vistas, visitantes, referentes, países, UTM y eventos personalizados | Sin cookies (sin banner), ~2,3 KB y gratis hasta 100.000 eventos al mes ([Umami](https://umami.is/pricing)) |
| Cal.com | Reservas con sus `utm_*` | Atribución de la conversión real, aunque falle la analítica |
| Cloudflare Web Analytics (opcional) | Core Web Vitals de usuarios reales (LCP, INP, CLS) | Gratis y sin cookies. No tiene eventos ni UTM, así que solo sirve para rendimiento ([Cloudflare](https://developers.cloudflare.com/web-analytics/faq/)). Se activa si hacen falta datos de campo |
| Search Console | Búsquedas e indexación | Visibilidad orgánica |

Las alternativas descartadas (Vercel Web Analytics, PostHog, GA4 y Cloudflare Web Analytics como única herramienta) están en [ADR-018](./14-decisiones.md#adr-018).

## 3. Taxonomía de eventos

| Evento | Cuándo se dispara | Propiedades (máx. 2) | Origen | Versión |
|---|---|---|---|---|
| `landing` | Primera **interacción real** de una sesión que llegó con UTM: scroll, toque o clic, tecla, o 4 s con la pestaña visible. Una vez por sesión | `source`, `campaign` | Cliente | v1 |
| `book_call_click` | Clic en cualquier CTA de agenda | `location`, `campaign` | Cliente | v1 |
| `booking_completed` | Cal.com emite `bookingSuccessfulV2` | `location` (botón que abrió el popup), `campaign` | Cliente | v1 |
| `whatsapp_click` | Clic en WhatsApp | `location`, `campaign` | Cliente | v1 |
| `email_click` | Clic en el `mailto` | `location`, `campaign` | Cliente | v1 |
| `case_mrb_view` | La sección `#caso` está visible al 50 % durante 1 s o más. Una vez por sesión | `campaign` | Cliente | v1 |
| `currency_switch` | El visitante cambia USD/COP a mano | `to` (`us` o `co`), `detected` (mercado que se había detectado) | Cliente | v1 |
| `demo_open` | Clic hacia la tienda demo (sección o escenario) | `location`, `campaign` | Cliente | v2 |
| `contact_submitted` | `/api/contact` respondió `ok`, es decir, el correo ya salió | `locale`, `campaign` | Cliente, tras la respuesta del Worker | v1.1 |

**Valores:**

- `location`: `header`, `hero`, `stage`, `pricing`, `faq`, `closing` o `demo`.
- `campaign`: el `utm_campaign` de la sesión, o `none`.
- `source`: el `utm_source`.
- Ningún valor lleva datos personales.
- **Por qué máximo 2 propiedades.** Umami no tiene ese límite, pero cada propiedad guardada cuenta como un evento en la cuota mensual. Dos alcanzan para las preguntas de §1.

**Sin evento propio:** las vistas de propuestas (`/en/p/…`) ya aparecen como páginas vistas por su ruta.

## 4. Implementación

- **Script de Umami** en el root layout, con `defer` para no bloquear el render:

  ```tsx
  // src/app/[locale]/layout.tsx (extracto)
  <script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id={site.analytics.umamiWebsiteId}
    data-domains="alejandrodeveloper.com" // solo cuenta producción: ni localhost ni las previews
  />
  ```

- **Un `track()` propio.** `src/lib/analytics.ts` envuelve a Umami. Si un bloqueador quitó el script, no pasa nada:

  ```ts
  // src/lib/analytics.ts (extracto)
  declare global {
    interface Window { umami?: { track: (event: string, data?: Record<string, string>) => void } }
  }

  export function track(event: EventName, data?: Record<string, string>) {
    window.umami?.track(event, data)
  }
  ```

- **Marcado en el servidor.** Cada CTA lleva `data-track="book_call_click"` y `data-track-location="hero"`, con valores tomados de una unión de tipos en `src/lib/analytics.ts`, para que un error de tipeo no compile. Las secciones que se miden por visibilidad llevan `data-track-view="case_mrb_view"`.
- **`TrackingListener`.** Una sola isla de cliente, montada en el layout:

```tsx
// src/components/analytics/TrackingListener.tsx (ilustrativo)
'use client'
import { useEffect } from 'react'
import { track, type EventName } from '@/lib/analytics'
import { captureUtm, getCampaign, getSource } from '@/lib/utm'

export function TrackingListener() {
  useEffect(() => {
    const utm = captureUtm() // 1.ª vista de la sesión: guarda utm_* en sessionStorage (first-touch)

    // Clics: fase de CAPTURA, para que ningún tercero (p. ej. Cal.com) los detenga con stopPropagation
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
      if (!el?.dataset.track) return
      track(el.dataset.track as EventName, { location: el.dataset.trackLocation ?? 'unknown', campaign: getCampaign() })
    }
    document.addEventListener('click', onClick, { capture: true })

    // landing: solo con UTM y solo tras una interacción real (filtra escáneres de enlaces de correo)
    // → primera de: scroll > 100 px, pointerdown, keydown o 4 s visibles; marca en sessionStorage
    // case_mrb_view: IntersectionObserver (threshold 0.5) + 1 s visible; una vez por sesión

    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
```

**Por qué `landing` espera una interacción.** Las herramientas de seguridad de correo corporativo (Safe Links, Proofpoint y similares) abren los enlaces antes que el prospecto, y algunas ejecutan JavaScript. Umami contaría esas cargas como páginas vistas, y las "visitas desde correo" se inflarían. Con la condición de interacción, `landing` solo cuenta personas.

**Formulario (v1.1).** `ContactForm` envía `contact_submitted` cuando el Worker responde `{ ok: true }`, es decir, cuando el correo ya salió. Va en el cliente para que el Worker no dependa de Umami.

## 5. Convención UTM

| Parámetro | Valores | Ejemplo |
|---|---|---|
| `utm_source` | `email` (prospección), `referral`, `linkedin`, `whatsapp`, `signature` | `email` |
| `utm_medium` | `outreach` (1.er correo), `followup` (2.º y 3.º), `social`, `dm` | `outreach` |
| `utm_campaign` | `{año}-w{semana ISO}-{nicho}-{mercado}` | `2026-w43-industrial-us` |
| `utm_content` | Paso de la secuencia (`e1`, `e2`, `e3`) o ubicación (`firma`) | `e1` |

**Reglas:**

- Todo en minúsculas, separado con guiones y en menos de 40 caracteres.
- **Nunca** nombres de prospectos ni de empresas: se verían en la URL y en los datos.
- Los enlaces apuntan **directo al idioma**, para evitar el salto de la redirección de `/`.

**Enlaces de ejemplo:**

| Uso | Enlace |
|---|---|
| Correo a EE. UU. | `https://alejandrodeveloper.com/en?utm_source=email&utm_medium=outreach&utm_campaign=2026-w43-industrial-us&utm_content=e1` |
| Correo a Colombia | `https://alejandrodeveloper.com/es?mkt=co&utm_source=email&utm_medium=outreach&utm_campaign=2026-w43-industrial-co&utm_content=e1` |
| Agenda directa (firma) | `https://alejandrodeveloper.com/call?utm_source=signature&utm_medium=email&utm_campaign=2026-q4` → el Worker redirige a Cal.com conservando los UTM, que Cal.com guarda en la reserva |

**Deja una plantilla** (una hoja de cálculo o una nota) con el enlace de la semana, para no escribirlo a mano en cada correo.

## 6. Prueba secuencial de titulares

El roadmap (§4) pide probar un titular a la vez, dos semanas cada uno, comparando clics en el botón principal. Con el tráfico esperado, unas pocas decenas o cientos de visitas por ventana, el resultado es **direccional, no estadísticamente concluyente**. Con 100 visitantes y una tasa del 10 %, el margen al 95 % es de ±6 puntos aproximadamente: solo una diferencia de más del doble se notaría.

| Ventana | Variante | Notas |
|---|---|---|
| 17-oct → 1-nov | `a`: From "call for pricing" to "add to cart". | Lanzamiento |
| 2-nov → 8-nov | `a` (sin cambio) | Semana de construcción de la v2: la página cambia y los datos no son comparables |
| 9-nov → 22-nov | `b`: Your website should take orders, not just look nice. | Después de la v2 |
| 23-nov → 6-dic | `c`: See your new store working in 5 days. | **Ojo:** Thanksgiving (26-nov) reduce el tráfico de EE. UU. |

**Métrica:** `book_call_click` con `location = hero`, dividido entre los visitantes de la ventana. Como apoyo, la tasa total de clic de agenda y la tasa sobre `landing` con `source = email`.

**Cambio de variante:** se edita `site.hero.activeHeadline` y se despliega. Cada cambio queda en Git y en este registro:

| Ventana | Variante | Visitantes | Clics en el hero | % | Correos enviados | Cambios en el sitio o campañas |
|---|---|---|---|---|---|---|
| 17-oct → 1-nov | a | | | | | |

## 7. Rutina de los viernes

Unos 30 minutos.

1. **Umami, últimos 7 días:**
   - Visitantes, páginas, referentes, países y el reporte de UTM.
   - En *Events*: `landing` (por `campaign`), `book_call_click` (por `location` y `campaign`), `booking_completed`, `whatsapp_click`, `email_click`, `case_mrb_view` y `currency_switch`.
2. **Cal.com:** reservas de la semana y sus UTM.
3. **Buzón:** respuestas a correos y, desde la v1.1, mensajes del formulario.
4. **Search Console**, en las primeras 4 semanas: indexación y errores.
5. **Registrar la semana:**

| Semana | Correos enviados | Visitas desde correo (`landing`, source=email) | Visitantes totales | Clics en agendar | % clic | Llamadas agendadas | Respuestas | Notas |
|---|---|---|---|---|---|---|---|---|
| w43 | | | | | | | | |

**La plantilla es el registro permanente.** Umami Hobby guarda 6 meses de datos, así que los números de cada viernes quedan anotados aquí.

**Metas:** ≥ 10 % de clic en agendar o probar la tienda, y 5 conversaciones calificadas al 18-dic (roadmap §9).

## 8. Limitaciones conocidas

- **Bloqueadores de anuncios.** El script viene de `cloud.umami.is`, otro dominio, y algunos bloqueadores lo quitan. Las reservas de Cal.com son la fuente de verdad de las conversiones. Hay una mejora opcional en §9.
- **Límites del plan Hobby** ([Umami](https://umami.is/pricing)):
  - 100.000 eventos al mes, y cada propiedad cuenta como un evento.
  - 1 sitio.
  - 6 meses de retención.
  - Sin API de lectura.
- **Bajo tráfico:** las tasas son direccionales (§6).
- **2 propiedades por evento**, por decisión propia: ahorran cuota y bastan para las preguntas de §1. Por eso la variante del titular se deduce de la fecha.

## 9. Mejoras futuras

- **Servir Umami desde tu dominio**, a través del Worker, para que los bloqueadores no lo quiten ([Umami](https://docs.umami.is/docs/bypass-ad-blockers)). Antes de activarlo, verifica que Umami siga viendo el país y los visitantes únicos, porque las solicitudes le llegarían desde Cloudflare.
- **Propiedad `headline` en `book_call_click`**, para no depender de las ventanas de fechas en la prueba de titulares.
- **Plan pago de Umami** si se necesitan más de 6 meses de datos, más sitios o la API, por ejemplo para automatizar el reporte de los viernes desde Claude Code.

## Fuentes

- [Umami: precios y límites](https://umami.is/pricing)
- [Umami: evitar bloqueadores](https://docs.umami.is/docs/bypass-ad-blockers)
- [Umami: envío de eventos](https://docs.umami.is/docs/api/sending-stats)
- [Cloudflare Web Analytics: preguntas frecuentes](https://developers.cloudflare.com/web-analytics/faq/)
- [Cal.com: UTM en reservas](https://cal.com/help/bookings/utm-tracking)
- [Cal.com: eventos del embed](https://cal.com/help/embedding/embed-events)

Consultadas el 3-oct-2026; Umami y Cloudflare, el 4-oct-2026.
