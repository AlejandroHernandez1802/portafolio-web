# 10 · Infraestructura y entornos

La infraestructura se monta en **una sola sesión de 1–2 h**, idealmente este fin de semana (3–4 de octubre) o, a más tardar, el 5. Así el dominio acumula historial antes de que empiece la prospección el 19 de octubre. Consta de:

- **Dominio .com** con renovación automática, en Cloudflare Registrar.
- **Cloudflare, plan Free**, para el DNS, la CDN y el Worker del sitio.
- **Google Workspace** para el correo, con SPF, DKIM y DMARC.
- **Resend** en el subdominio `notify.` para el formulario de la v1.1.
- **Umami Cloud** para la analítica.
- **Search Console.**

El costo total ronda los **US$8 al mes**: Google Workspace y el dominio. El hosting y la analítica son gratis ([ADR-017](./14-decisiones.md#adr-017), [ADR-018](./14-decisiones.md#adr-018)).

---

## 1. Cuentas y servicios

| Servicio | Plan | Para qué | Cuándo |
|---|---|---|---|
| [Cloudflare](https://www.cloudflare.com/plans/) | **Free** | Registrador del dominio, DNS, CDN, Worker, previews y WAF | Fase 0, primero |
| GitHub | Free (repositorio privado) | Código y docs; dispara los builds de Cloudflare | Fase 0 |
| [Google Workspace](https://workspace.google.com/intl/es-419/pricing.html) | Business Starter, 1 usuario | `hola@`, prospección, calendario, Meet | Fase 0 |
| [Umami Cloud](https://umami.is/pricing) | Hobby (gratis) | Analítica sin cookies | Fase 0 |
| [Cal.com](https://cal.com/pricing) | Free | Agenda | Fase 0 |
| [Resend](https://resend.com/pricing) | Free | Correo del formulario | DNS en fase 0; uso en v1.1 |
| Google Search Console y Bing Webmaster Tools | Gratis | Indexación | Al publicar |
| WhatsApp Business | Gratis (app) | Canal directo | Fase 0 |

## 2. Dominio

- **Nombre:** un .com corto con tu nombre o tu marca (roadmap §3). El mismo dominio sirve para la web y el correo.
- **Registrador:**
  - **Recomendado: Cloudflare Registrar.**
    - Cobra el precio del registro y de ICANN, sin margen, y el DNS queda en el mismo panel que el sitio.
    - Exige usar los nameservers de Cloudflare ([Cloudflare](https://developers.cloudflare.com/registrar/faq/)).
    - No publica una lista de precios: el valor aparece al buscar el dominio en el panel. Para un .com, el cálculo da US$10,46 al año. Desde el **1 de noviembre de 2026** serán unos US$11,17, porque Verisign sube su precio mayorista. Comprarlo antes de esa fecha ahorra en el primer año.
  - **Si ya lo compraste en otro registrador** (incluido Vercel): agrégalo a Cloudflare en el plan Free y cambia sus nameservers por los que te asigne Cloudflare. Puedes transferirlo a Cloudflare Registrar cuando pasen los 60 días desde el registro que exige ICANN.
- **Configuración del dominio:**
  - **Renovación automática activada**, con una tarjeta vigente. Perder el dominio es perder el correo y la prospección.
  - Privacidad WHOIS activada y bloqueo de transferencia.
  - Si agregas registros CAA, deben permitir las autoridades que usa Cloudflare para el certificado.

## 3. Tabla DNS

Todo el DNS vive en Cloudflare. Los valores marcados como "del panel" se copian del servicio correspondiente al configurarlo.

| Tipo | Host | Valor | Propósito | Cuándo |
|---|---|---|---|---|
| Automático | `@` | Lo crea Cloudflare, junto con el certificado, al asignar `alejandrodeveloper.com` como *Custom Domain* del Worker ([Cloudflare](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)). No se edita a mano | Sitio (apex) | Fase 0 |
| AAAA (proxy activo) | `www` | `100::` | Solo existe para que se aplique la Redirect Rule `www` → apex ([Cloudflare](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)) | Fase 0 |
| MX | `@` | `smtp.google.com`, prioridad 1 | Correo de Google Workspace ([Google](https://knowledge.workspace.google.com/admin/domains/set-up-mx-records-for-google-workspace)) | Fase 0 |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | SPF del dominio raíz (solo Google) ([Google](https://knowledge.workspace.google.com/admin/security/set-up-spf)) | Fase 0 |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=…` (clave de 2048 bits generada en la consola de administración) | DKIM de Workspace; puede tardar hasta 48 h ([Google](https://knowledge.workspace.google.com/admin/security/set-up-dkim)) | Fase 0 |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@alejandrodeveloper.com` | DMARC, **48 h después** de SPF y DKIM ([Google](https://knowledge.workspace.google.com/admin/security/recommended-dmarc-rollout)) | ~8-oct |
| TXT | `@` | `google-site-verification=…` | Search Console (propiedad de dominio) | Fase 0 |
| MX | `send.notify` | `feedback-smtp.us-east-1.amazonses.com`, prioridad 10 | Rebotes de Resend | Fase 0 |
| TXT | `send.notify` | `v=spf1 include:amazonses.com ~all` | SPF de Resend (subdominio) | Fase 0 |
| TXT | `resend._domainkey.notify` | `p=…` (del panel de Resend) | DKIM de Resend | Fase 0 |
| Por definir | `demo` | Depende de dónde se aloje la demo; se define en sus docs | Tienda demo | v2 |

**Notas:**

- **Un solo registro SPF en la raíz.** Resend usa su propio SPF en `send.notify`, así que no hay conflicto con Workspace.
- **Nombres de host de Resend.** Con el subdominio `notify.alejandrodeveloper.com`, los hosts quedan bajo `notify` (por ejemplo, `send.notify`). **Confirma los nombres exactos en el panel de Resend** al agregar el dominio ([Resend](https://resend.com/docs/add-a-domain)).
- **Los registros de correo quedan "DNS only".** Cloudflare solo aplica su proxy a los registros A, AAAA y CNAME; los MX y TXT nunca pasan por él.
- **Propagación.** Los TTL bajos (300 s) durante la configuración aceleran las correcciones. Después se pueden subir a 3600 s.

## 4. Google Workspace

1. Contrata Business Starter y verifica el dominio con el TXT que indique Google.
2. Crea el usuario principal (p. ej. `alejandro@alejandrodeveloper.com`) y los **alias gratuitos** `hola@` y `dmarc@`.
3. Configura el registro MX `smtp.google.com` y el SPF.
4. Genera la clave DKIM de 2048 bits (*Apps → Gmail → Autenticar correo electrónico*), publica el TXT y pulsa **"Iniciar autenticación"** cuando el DNS propague.
5. **DMARC por etapas**, como recomienda Google:

   | Fecha aprox. | Política |
   |---|---|
   | ~8-oct | `p=none` con `rua` |
   | ~2-nov | `p=quarantine; pct=5`, tras revisar 2–3 semanas de reportes |
   | Noviembre | Subir `pct` hasta 100 |
   | Diciembre | `p=reject` |

   Los reportes `rua` llegan en XML. Un servicio gratuito de resúmenes de DMARC los hace legibles (opcional).
6. **Firma para prospección:** nombre, enlace al sitio con UTM ([12 §5](./12-medicion-y-analitica.md#5-convención-utm)), **dirección postal** y la línea de baja: *"Reply 'no thanks' and I won't write again."* (CAN-SPAM, [09 §6.3](./09-seguridad-y-privacidad.md#63-estados-unidos-can-spam-y-caloppa)).
7. **Seguridad:** activa 2FA y guarda los códigos de recuperación.

**Límites:** 2.000 mensajes al día por usuario (500 durante la prueba gratuita), muy por encima del plan de ~3–5 al día ([Google](https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace)).

## 5. Entregabilidad del dominio nuevo

El 19 de octubre el dominio tendrá unas dos semanas. Google pide a todos los remitentes ([Google](https://support.google.com/mail/answer/81126)):

- SPF o DKIM.
- DNS directo e inverso válidos (Google los gestiona).
- TLS.
- Formato RFC 5322.
- Tasa de spam por debajo de 0,3 % (ideal, por debajo de 0,1 %).

Los requisitos extra (DMARC alineado y baja con un clic) son para remitentes masivos, de 5.000 correos al día o más. No es tu caso, pero DMARC queda configurado de todos modos.

| Práctica | Detalle |
|---|---|
| Calentar con contactos reales | La semana del 12-oct, escribe desde el dominio a contactos que respondan (Brian, colegas, amigos) |
| Volumen bajo y constante | ~15 prospectos nuevos por semana más sus seguimientos: menos de 10 correos al día, repartidos, sin ráfagas |
| Correos 1 a 1 | Personalizados, texto plano, menos de 80 palabras, **sin adjuntos**, **sin rastreo de aperturas**, **sin acortadores**; enlaces solo a tu dominio (diagnóstico §9) |
| Verificar direcciones | Antes de enviar; mantener los rebotes por debajo del 2 % (una dirección ya rebotó en la primera semana) |
| Bajas | Atenderlas en 10 días hábiles y mantener una lista de supresión |
| Revisar autenticación | En Gmail, *Mostrar original* → SPF, DKIM y DMARC = PASS. Prueba con un servicio como mail-tester |
| Postmaster Tools | Verifícalo, pero con este volumen probablemente no mostrará datos ([Google](https://support.google.com/mail/answer/9981691)) |

**Advertencia.** Las guías de Google piden no enviar a quien no se suscribió. La prospección en frío va contra esa guía, así que solo es sostenible si es **1 a 1, personalizada y de bajo volumen**. Si algún día pasas de ~20 correos al día, conviene un dominio secundario solo para prospección, para proteger el principal. La prospección sale siempre de Workspace: las reglas de Resend la prohíben ([Resend](https://resend.com/legal/acceptable-use)).

## 6. Cloudflare

**Plan.** Free ([ADR-017](./14-decisiones.md#adr-017)):

- Sus términos no restringen el uso comercial.
- Las solicitudes a archivos estáticos son gratis e ilimitadas.
- No tiene SLA ni soporte.
- Los sitios de clientes van en la cuenta de cada cliente, porque los términos no permiten contratar el servicio a nombre de terceros.

**Orden de configuración:**

1. Crea la cuenta, activa 2FA y compra el dominio (o agrégalo y cambia sus nameservers, §2).
2. Commitea en `main` el scaffold con `wrangler.jsonc` ([03 §6](./03-arquitectura.md#6-rutas-encabezados-y-configuración)). **Si el repositorio no tiene ese archivo, Workers Builds autoconfigura el proyecto con vinext y abre un PR** ([Cloudflare](https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/)).
3. En *Workers & Pages* → *Create*, importa el repositorio de GitHub y aplica esta tabla:

| Ajuste | Valor |
|---|---|
| Worker | `portafolio`, importado desde GitHub con Workers Builds. Directorio raíz: `/` (la raíz del repositorio es `Code/`) |
| Rama de producción | `main` |
| Comandos | Build: `pnpm build`. Deploy: `npx wrangler deploy`. Preview: `npx wrangler preview`, con *Enable Preview Builds* activado ([Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)) |
| Variables de build | `PNPM_VERSION` = la versión exacta de pnpm 12 instalada (la imagen trae 10.11.1). Node sale de `.nvmrc` (24); también se puede fijar con `NODE_VERSION` ([imagen de build](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)) |
| Dominios | `alejandrodeveloper.com` como *Custom Domain* del Worker; crea el DNS y el certificado |
| `www` → apex | **Redirección 308 al apex** con una Redirect Rule (*Rules* → *Redirect Rules*): `https://www.*` → `https://${1}`, conservando el query string ([Cloudflare](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/)). El plan Free permite 10 reglas |
| SSL/TLS | *Always Use HTTPS* activado. **HSTS** activado en *Edge Certificates*, de 6 a 12 meses, **sin** `preload` ni `includeSubDomains` |
| `workers.dev` | Producción desactivada (`workers_dev: false`), porque esa URL no envía `noindex`. Previews activadas (`preview_urls: true`) |
| Previews | Públicas, con `X-Robots-Tag: noindex` en `workers.dev` ([Cloudflare](https://developers.cloudflare.com/workers/previews/custom-domains/)). El enlace aparece como comentario en el PR. Opcional: protegerlas con Cloudflare Access, gratis hasta 50 usuarios ([Cloudflare](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)) |
| Workers Cache | **Desactivado.** Si se activa, las solicitudes a archivos estáticos pasan a cobrarse ([Cloudflare](https://developers.cloudflare.com/workers/cache/)) |
| Firewall | v1.1: una regla de rate limit para `/api/contact`. El plan Free permite 1 regla, por IP y ruta, con ventana de 10 s y bloqueo de 10 s ([Cloudflare](https://developers.cloudflare.com/waf/rate-limiting-rules/)) |
| Web Analytics | Opcional: Cloudflare Web Analytics con el snippet manual, si se quieren Core Web Vitals de campo ([12 §2](./12-medicion-y-analitica.md#2-herramientas)) |
| Notificaciones | El estado de cada build aparece en GitHub (check y comentario del PR). Confirma que GitHub te avise por correo cuando un check falla |
| Gasto | El plan Free no cobra excedentes. Si el Worker pasa de 100.000 invocaciones en un día, sus rutas responden 429 hasta la medianoche UTC, y `/en` y `/es` siguen funcionando. No hace falta un aviso de gasto |

## 7. Entornos

| Entorno | Cómo se crea | URL | Datos y secretos | Indexación |
|---|---|---|---|---|
| Local | `pnpm dev` (Next, Node 24) para construir; `pnpm preview` (build + `wrangler dev`) para probar el Worker, los encabezados y el 404 | `localhost:3000` y `localhost:8787` | `.dev.vars` (v1.1) | — |
| Preview | Cada push a una rama distinta de `main` | `*.workers.dev`, pública; el enlace llega al PR | Confirmar en V11-02 si hereda los secretos de producción. Si los hereda, el formulario de una preview envía a `hola@` | `noindex` (header de Cloudflare, reforzado en `_headers`) |
| Producción | Merge a `main` | `alejandrodeveloper.com` | Secretos y variables del Worker | Indexable, salvo `/p/*` |

**Rollback:** Cloudflare → *Workers & Pages* → `portafolio` → *Deployments* → elegir una versión anterior → *Rollback*, o `npx wrangler rollback`. Cloudflare guarda las últimas 100 versiones ([Cloudflare](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/), [11 §6](./11-calidad-rendimiento-y-accesibilidad.md#6-rollback-e-incidentes)).

## 8. Variables de entorno

| Variable | Ejemplo | Dónde se define | ¿Secreta? | Versión |
|---|---|---|---|---|
| — | — | — | — | **v1 no necesita variables**: la configuración pública, incluido el ID de Umami, está en `src/content/site.ts` |
| `RESEND_API_KEY` | `re_…` | Secreto del Worker: `npx wrangler secret put RESEND_API_KEY`, o el panel. En local, `.dev.vars` | **Sí** | v1.1 |
| `CONTACT_TO_EMAIL` | `hola@alejandrodeveloper.com` | `vars` en `wrangler.jsonc` | No | v1.1 |
| `CONTACT_FROM_EMAIL` | `Portafolio <web@notify.alejandrodeveloper.com>` | `vars` en `wrangler.jsonc` | No | v1.1 |
| `TURNSTILE_SECRET_KEY` | `0x…` | Secreto del Worker | **Sí** | Solo si se activa Turnstile |
| `WORKERS_CI_BRANCH` | `main` u otra rama | Sistema, solo durante el build ([Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)) | No | Por si algún paso del build debe distinguir producción de preview |

En la v1.1, el Worker valida las variables con Zod al recibir la solicitud. Si falta una, registra un error explícito en sus logs y no envía nada.

## 9. Seguridad de cuentas

- **2FA en todas las cuentas:** GitHub, Cloudflare, Google Workspace, Umami, Cal.com y Resend. Usa un gestor de contraseñas y guarda los códigos de recuperación.
  - Con Cloudflare Registrar, la cuenta de Cloudflare es también la del dominio. Protégela como tal.
- **GitHub:** repositorio privado. Protege `main` (sin *force push*); los PR son opcionales mientras trabajes solo.
- **Accesos en Cloudflare:** solo tu cuenta. Si después entra alguien más, invítalo como miembro con el rol más limitado que permita el plan.

## 10. Costos

| Concepto | Detalle | Fuente | US$/mes |
|---|---|---|---|
| Cloudflare Workers Free | Archivos estáticos gratis e ilimitados; 100.000 invocaciones del Worker al día; 3.000 minutos de build al mes | [Cloudflare](https://developers.cloudflare.com/workers/platform/pricing/) | 0 |
| Google Workspace Business Starter | US$7 con plan anual (US$84 al año) o US$8,40 flexible. En Colombia, COP 29.200 al mes anual, con precio de lanzamiento de COP 26.280 los primeros 12 meses | [Google](https://workspace.google.com/intl/es-419/pricing.html) | 7 |
| Dominio .com (Cloudflare Registrar) | US$10,46 al año; ≈ US$11,17 desde el 1-nov-2026 | [Cloudflare](https://developers.cloudflare.com/registrar/faq/) | ~1 |
| Umami Cloud Hobby | 100.000 eventos al mes, 1 sitio, 6 meses de retención | [Umami](https://umami.is/pricing) | 0 |
| Cal.com Free | — | [Cal.com](https://cal.com/pricing) | 0 |
| Resend Free | 3.000 correos al mes, 100 al día, 3 dominios | [Resend](https://resend.com/pricing) | 0 |
| **Total** | | | **≈ 8** |

**Opcionales**, solo si los datos o los ingresos lo justifican:

- **Workers Paid:** US$5 al mes, si el Worker se acerca a 100.000 invocaciones diarias ([Cloudflare](https://developers.cloudflare.com/workers/platform/pricing/)).
- **Plan pago de Umami:** si se necesitan más de 6 meses de retención, la API o más sitios ([Umami](https://umami.is/pricing)).
- **Vercel Pro:** US$20 al mes, cuando haya ingresos y la demo o los clientes lo justifiquen ([ADR-017](./14-decisiones.md#adr-017)).

## Fuentes

- **Cloudflare:**
  - Planes y términos: [planes](https://www.cloudflare.com/plans/), [términos](https://www.cloudflare.com/terms/), [precios de Workers](https://developers.cloudflare.com/workers/platform/pricing/), [static assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
  - Builds y despliegue: [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/), [imagen de build](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/), [previews](https://developers.cloudflare.com/workers/previews/), [rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
  - Dominio y reglas: [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [www → apex](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/), [rate limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/), [Registrar](https://developers.cloudflare.com/registrar/faq/).
- **Umami:** [precios](https://umami.is/pricing), [términos](https://umami.is/terms).
- **Google Workspace:** [MX](https://knowledge.workspace.google.com/admin/domains/set-up-mx-records-for-google-workspace), [SPF](https://knowledge.workspace.google.com/admin/security/set-up-spf), [DKIM](https://knowledge.workspace.google.com/admin/security/set-up-dkim), [DMARC](https://knowledge.workspace.google.com/admin/security/recommended-dmarc-rollout), [límites](https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace), [guías para remitentes](https://support.google.com/mail/answer/81126), [Postmaster Tools](https://support.google.com/mail/answer/9981691).
- **Resend:** [agregar dominio](https://resend.com/docs/add-a-domain), [uso aceptable](https://resend.com/legal/acceptable-use).

Consultadas el 3-oct-2026; Cloudflare y Umami, el 4-oct-2026.
