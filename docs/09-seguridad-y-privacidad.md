# 09 · Seguridad y privacidad

La v1 tiene una superficie de ataque mínima: es un sitio estático, sin base de datos ni secretos. Su único código de servidor es un Worker de ~25 líneas que redirige tres rutas. La v1.1 agrega a ese Worker un solo endpoint (`POST /api/contact`) con un secreto (`RESEND_API_KEY`).

En privacidad, el sitio:

- Recoge datos personales solo en la reserva de Cal.com y, desde la v1.1, en el formulario. Ambos llevan consentimiento previo, expreso e informado (Ley 1581).
- No usa cookies propias, así que no necesita banner.
- Publica la dirección postal que exige CAN-SPAM y una política que cumple Ley 1581 y CalOPPA.

> Este documento no es asesoría legal. Antes de publicar, conviene que un abogado valide la política y la forma en que la Ley 1581 aplica al correo comercial entre empresas, como recomienda el diagnóstico (§10).

---

## 1. Superficie de ataque

| Versión | Qué expone | Riesgo principal | Mitigación |
|---|---|---|---|
| v1 | HTML, CSS, JS e imágenes estáticos en la CDN de Cloudflare; el Worker de redirecciones, sin estado ni secretos | *Clickjacking*; inyección vía terceros (Cal.com, Umami) | `frame-ancestors 'self'`; CSP; Cal.com aislado en un iframe de otro origen |
| v1.1 | `POST /api/contact` en el Worker | Spam, abuso de cuota de Resend, inyección en el correo | Capas antispam (§3); texto plano; límite de tamaño; regla de rate limit |
| v1.1 | Propuestas `/p/[slug]` | Que un tercero adivine o filtre la URL | Slug no adivinable; `noindex`; sin enlaces internos; se borran al vencer |

## 2. Encabezados HTTP

| Header | Valor | Dónde | Versión |
|---|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Todas las rutas | v1 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Todas | v1 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Todas | v1 |
| `Content-Security-Policy` (**aplicada**) | `frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'` | Todas | v1 |
| `Content-Security-Policy-Report-Only` | Política completa (abajo) | Todas, también en las previews | v1 en observación → aplicada en v1.1 |
| `X-Robots-Tag` | `noindex, nofollow` | `/en/p/*` y `/es/p/*` | v1.1 |
| `X-Robots-Tag` | `noindex` | URL de `workers.dev` (previews) | v1 |
| `Cache-Control` | `public, max-age=31536000, immutable` | `/_next/static/*` (archivos con hash en el nombre) | v1 |
| `Strict-Transport-Security` | Se activa en Cloudflare (*SSL/TLS → Edge Certificates → HSTS*), de 6 a 12 meses, **sin** `preload` ni `includeSubDomains`. Confírmalo con `curl -I` | Todas | v1 |

Con el export estático, los encabezados viven en `public/_headers`. Next lo copia a `out/` y Cloudflare lo aplica a los archivos estáticos ([Cloudflare](https://developers.cloudflare.com/workers/static-assets/headers/)):

```text
# public/_headers (dominios de Cal.com y Umami: confirmar en QA)
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://app.cal.com https://cloud.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https://app.cal.com https://api.cal.com https://cloud.umami.is; frame-src https://app.cal.com https://cal.com

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/en/p/*
  X-Robots-Tag: noindex, nofollow

/es/p/*
  X-Robots-Tag: noindex, nofollow

https://:version.:subdomain.workers.dev/*
  X-Robots-Tag: noindex
```

- **Límites:** hasta 100 reglas y 2.000 caracteres por línea.
- **No cubre las respuestas que genera el Worker** (las redirecciones y `/api/contact`). Esas respuestas no son HTML, así que no necesitan CSP.
- **Si se activa Cloudflare Web Analytics**, se agrega `https://static.cloudflareinsights.com` a `script-src` y `https://cloudflareinsights.com` a `connect-src`.

**Por qué `'unsafe-inline'` en `script-src`.** Next.js inserta scripts inline (la carga de RSC) y el sitio tiene el script de mercado. Los *nonces* obligarían a renderizar cada solicitud en el servidor y eliminarían el SSG. Sin contenido generado por usuarios, el valor real de la CSP está en `frame-ancestors`, `base-uri`, `object-src`, `form-action`, `frame-src` y `connect-src`.

**Por qué también en las previews.** Antes se limitaba a producción porque las previews de Vercel cargan una barra de herramientas que la política bloquearía. Cloudflare no inyecta nada, así que la misma política sirve en todos los entornos y se prueba antes de llegar a producción.

**Cómo pasar a aplicada (v1.1):**

1. Revisar la consola del navegador durante la QA.
2. Abrir y completar el popup de Cal.com.
3. Ajustar los dominios.
4. En `_headers`, unir las dos políticas en un solo `Content-Security-Policy`.

## 3. Antispam y abuso

El detalle está en [07 §5.3](./07-integraciones.md#53-capas-antispam). En resumen:

- Honeypot.
- `elapsedMs` mínimo de 3 s.
- Zod, un límite de 10 KB y verificación del `content-type`.
- Una regla de rate limit en el WAF de Cloudflare para `/api/contact` (en el plan Free, por IP y con ventana de 10 s).
- Turnstile, solo si aparece spam.
- Los mensajes van en **texto plano**, así que no hay HTML del visitante en tu buzón.
- No hay respuesta automática al visitante, para evitar que el formulario sirva de relé de spam.

## 4. Secretos y configuración

- **v1: cero secretos.** La configuración pública vive en `src/content/site.ts`.
- **v1.1:** `RESEND_API_KEY` se guarda solo como secreto del Worker (`npx wrangler secret put RESEND_API_KEY`). Nunca va en `wrangler.jsonc`, en el código ni con prefijo `NEXT_PUBLIC_`.
  - Se crea en Resend con permiso **"Sending access"**, restringido al dominio `notify.alejandrodeveloper.com`.
  - Las previews son públicas. En V11-02 se confirma si heredan los secretos de producción. Si los heredan, un envío desde una preview llega a `hola@`, lo cual es aceptable porque el destinatario es fijo.
- `.dev.vars` (secretos locales de `wrangler dev`) va en `.gitignore`; `.dev.vars.example` lista los nombres sin valores.
- **Si una clave se filtra:** se revoca en Resend, se crea otra y se actualiza el secreto del Worker.
- **Cuentas:** 2FA en GitHub, Cloudflare (que también es el registrador del dominio), Google, Umami, Cal.com y Resend ([10 §9](./10-infraestructura-y-entornos.md#9-seguridad-de-cuentas)).

## 5. Dependencias

- Lockfile commiteado; versiones exactas de `next`, `react` y `react-dom`.
- Dependabot semanal; `pnpm audit --prod` en la CI (v1.1).
- **Parches de seguridad de Next.js en menos de 48 h.** El 16.3.8 del 30-sep-2026 fue uno de ellos ([anuncio](https://nextjs.org/blog/september-2026-security-release)).
- Pocas dependencias de ejecución (Next y React; en v1.1, `resend` y `zod` dentro del Worker): menos superficie de ataque en la cadena de suministro. La analítica es un script externo de Umami, no un paquete.

## 6. Privacidad y cumplimiento

### 6.1 Datos personales que se tratan

| Dato | Dónde se recoge | Finalidad | Terceros (encargados) | Conservación (sugerida) |
|---|---|---|---|---|
| Nombre, correo, sitio web, consentimiento, notas | Reserva en Cal.com | Agendar y preparar la llamada | Cal.com; Google (Calendar y Meet) | 24 meses o hasta que se pida la supresión |
| Nombre, correo, empresa, mensaje, consentimiento (v1.1) | Formulario | Responder la solicitud | Cloudflare (procesa en el Worker), Resend (envía), Google Workspace (buzón) | 24 meses o hasta que se pida la supresión |
| Número y mensajes | WhatsApp (fuera del sitio) | Conversación comercial | Meta (WhatsApp) | Según WhatsApp y tu dispositivo |
| Datos técnicos agregados: páginas, eventos, país, navegador, UTM | Umami Cloud | Medir el sitio | Umami | 6 meses (plan Hobby). Sin cookies ni datos personales ([Umami](https://umami.is/pricing)) |
| Datos técnicos de cada solicitud: IP, navegador, URL | Cloudflare (CDN y Worker) | Servir el sitio y protegerlo de abusos | Cloudflare | Según la política de Cloudflare |
| Preferencia de moneda (`localStorage`) y UTM de la sesión (`sessionStorage`) | Navegador del visitante | Funcional | Ninguno (no salen del navegador, salvo la etiqueta de campaña en los eventos) | Hasta que el visitante la borre / fin de la sesión |

### 6.2 Colombia: Ley 1581 de 2012 y Decreto 1377 de 2013

- **Autorización previa, expresa e informada.**
  - Es una casilla **sin marcar**: el silencio no cuenta como autorización.
  - Va en el formulario (v1.1) y como pregunta obligatoria en la reserva de Cal.com.
  - **Se conserva la prueba:** Cal.com guarda la respuesta, y el correo del formulario incluye la versión de la política y la fecha y hora ([07 §5.2](./07-integraciones.md#52-endpoint-en-el-worker)).
- **Al recoger los datos** se informa la finalidad, los derechos del titular y la identificación del responsable: nombre, dirección, correo y teléfono.
- **Derechos del titular:**
  - Conocer, actualizar y rectificar sus datos.
  - Pedir prueba de la autorización.
  - Ser informado del uso.
  - Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).
  - Revocar la autorización o pedir la supresión.
  - Acceder gratis a sus datos.
- **Plazos de respuesta:**

  | Tipo | Plazo | Prórroga |
  |---|---|---|
  | Consultas | 10 días hábiles | +5 días hábiles |
  | Reclamos | 15 días hábiles | +8 días hábiles |

- **Transmisión internacional:** Cloudflare, Umami, Cal.com, Google y Resend procesan datos fuera de Colombia, principalmente en EE. UU. Se informa en la política, y la autorización cubre esa transmisión a encargados.
- **RNBD:** el registro de bases de datos ante la SIC solo es obligatorio para sociedades con activos totales de más de 100.000 UVT. **Las personas naturales están exentas.**
- **En trámite:** hay un proyecto de reforma (PL 282/2026 Cámara). Conviene revisar si se aprueba.

### 6.3 Estados Unidos: CAN-SPAM y CalOPPA

**CAN-SPAM** aplica a los correos de prospección, también entre empresas ([FTC](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)). Exige:

1. Encabezados veraces (De, Para, Responder a).
2. Asunto no engañoso.
3. Identificar el mensaje como comercial, de forma clara.
4. **Una dirección postal válida:** dirección física, apartado registrado en USPS o buzón privado de una agencia comercial de recepción de correo (CMRA).
5. **Una forma clara de darse de baja.** Responder "no thanks" es válido, y el mecanismo debe funcionar al menos 30 días después del envío.
6. **Atender las bajas en 10 días hábiles** y mantener una lista de supresión.
7. Supervisar a quien envíe en tu nombre.

Multas de hasta **US$53.088 por correo**. La misma dirección va en el pie del sitio.

**CalOPPA** (California) aplica a sitios que recogen datos personales de residentes de California. Exige:

- Una política visible, enlazada desde el pie con la palabra "Privacy".
- Las categorías de datos que se recogen.
- Las categorías de terceros con quienes se comparten.
- Cómo puede el usuario revisar o pedir cambios.
- **Cómo responde el sitio a las señales "Do Not Track":** el sitio no rastrea entre sitios y la analítica no usa cookies, así que se declara eso.
- La fecha de vigencia y cómo se notifican los cambios.

**CCPA/CPRA** no aplica: un profesional independiente está muy por debajo de sus umbrales de ingresos y volumen de datos.

### 6.4 Cookies y almacenamiento local

- **El sitio no crea cookies.** La analítica de Umami no usa cookies y el almacenamiento local es funcional, sin datos personales.
- **Cal.com:** su iframe puede usar sus propias cookies cuando se abre el popup. Se declara en la política como tercero.
- **Sin banner de cookies.** Es una interpretación, no asesoría legal: con analítica sin cookies y almacenamiento funcional, en general no se requiere. Igual se declara todo en la política. La SIC considera que las cookies que recogen datos personales están sujetas a la Ley 1581, y este sitio no las usa.

### 6.5 Estructura de la política de privacidad

Una página por idioma (`/en/privacy`, `/es/privacy`), en TSX, con `site.legal.privacyVersion` como fecha de vigencia visible.

1. **Responsable:** nombre, domicilio, dirección postal, correo y teléfono.
2. **Datos que se recogen y cómo:** reserva, formulario (v1.1), WhatsApp, correo, analítica.
3. **Finalidades.**
4. **Autorización:** cómo se obtiene y cómo revocarla.
5. **Encargados y transmisión internacional:** Cloudflare (hosting y formulario), Umami (analítica), Cal.com, Google, Resend, Meta (WhatsApp).
6. **Conservación.**
7. **Derechos del titular y cómo ejercerlos:** correo de contacto y plazos de 10 y 15 días hábiles.
8. **Cookies, almacenamiento local y "Do Not Track".**
9. **Medidas de seguridad.**
10. **Menores:** el sitio no está dirigido a menores.
11. **Cambios a la política:** versión y fecha.
12. **Contacto.**

## 7. Otros riesgos

| Riesgo | Mitigación |
|---|---|
| **Empleo actual** | No nombrar al empleador en el sitio, el JSON-LD ni los perfiles enlazados (`sameAs`, ver [08 §4](./08-seo.md#4-datos-estructurados-json-ld)). Revisar la cláusula de exclusividad y conflicto de interés **antes de publicar** (roadmap §10) |
| **Permisos de clientes** | MRB con nombre, métrica o testimonio solo con autorización escrita de Brian ([04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure)). El prototipo de Jerrell's no se muestra |
| **Marcas reales en propuestas** | Solo en `/p/[slug]` privadas y con `noindex`. Nunca en la página pública |
| **Testimonios** | Solo reales, textuales y autorizados. La FTC y Google prohíben las reseñas y testimonios falsos, pagados o condicionados (diagnóstico §10) |
| **Marca ficticia de la animación** | Verificar que no exista ([05 §12](./05-hero-animacion.md#12-producto-y-marca-ficticios)) |

## Fuentes

- **Colombia:** [Ley 1581 de 2012](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/ley_1581_2012.htm), [Decreto 1377 de 2013](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1377_2013.htm).
- **EE. UU.:** [FTC: guía de CAN-SPAM](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business).
- **Cloudflare:** [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/), [rate limiting del WAF](https://developers.cloudflare.com/waf/rate-limiting-rules/), [Turnstile](https://developers.cloudflare.com/turnstile/plans/), [términos](https://www.cloudflare.com/terms/).
- **Umami:** [precios y privacidad](https://umami.is/pricing), [términos](https://umami.is/terms).
- **Next.js:** [security release de septiembre de 2026](https://nextjs.org/blog/september-2026-security-release).

Consultadas el 3-oct-2026; Cloudflare y Umami, el 4-oct-2026.
