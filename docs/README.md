# Portafolio de servicios web: propuesta técnica

Sitio en inglés y español que vende "tiendas y catálogos con cotizador" a pymes que venden productos: una home con barra de navegación fija y una página por caso, con el trabajo real de Malone Road Belt en marcos de navegador y de celular. Está construido con Next.js 16.3, exportado como sitio 100 % estático y publicado en Cloudflare, en el plan gratuito. Se publica el **7 de noviembre de 2026** (antes, el 17 de octubre) y cuesta unos **US$8 al mes**.

| | |
|---|---|
| Estado | La v1 se construyó (F1-01 a F1-09) y se rediseñó (F1-12, commit `8ba1036`). El 24-oct se construyó la fase A de la reestructuración (R-02 a R-09), sin commit ni publicar: falta la revisión del copy y de las cifras de MRB (R-08), el QA final y la publicación (R-11). Ver [13 §5.1](./13-plan-de-implementacion.md#51-reestructuración-fase-a-24-de-octubre-al-7-de-noviembre). |
| Fecha | 3 de octubre de 2026. Versiones, precios y límites verificados en esa fecha. El 4 de octubre se cambiaron el hosting (Cloudflare Free en lugar de Vercel Pro) y la analítica (Umami): ver [ADR-017](./14-decisiones.md#adr-017) y [ADR-018](./14-decisiones.md#adr-018). El 24 de octubre se adoptó el sistema visual y se reestructuró el sitio: [ADR-019](./14-decisiones.md#adr-019) a [ADR-023](./14-decisiones.md#adr-023). El 25 de octubre se sumaron las páginas de Servicios y Sobre mí, los menús desplegables y los demos como casos ([ADR-024](./14-decisiones.md#adr-024)) y, el mismo día, la página de Trabajo, el servicio de diseño y los precios ocultos con LinkedIn en su lugar ([ADR-025](./14-decisiones.md#adr-025)). |
| Requisitos de origen | [Roadmap del portafolio](../../Requerimientos/roadmap_portafolio_servicios_web.md) y el [diagnóstico crítico del side project](https://claude.ai/code/artifact/8a596e99-c90e-4d4c-907e-93f88cceed51) |
| Convenciones | `tu-usuario` (Cal.com) y `57XXXXXXXXXX` (WhatsApp) en los ejemplos de los documentos son marcadores; los valores reales están en `src/content/site.ts`. |

---

## Resumen ejecutivo

- **Qué se construye.**
  - **Una home** en `/en` (por defecto) y `/es`: el titular "¿Sin página web o con una desactualizada? Pasa de 'precio por interno' a 'agregar al carrito'" junto al trabajo real de MRB, una franja de cifras, el resumen de Trabajo, los servicios en una cuadrícula *bento* con el hook animado, el resumen de Sobre mí, las preguntas frecuentes y un botón para agendar una llamada de 15 minutos. Trabajo, Servicios y Sobre mí tienen además su propia página ([ADR-024](./14-decisiones.md#adr-024), [ADR-025](./14-decisiones.md#adr-025)).
  - **Una página por caso:** `/en/work/malone-road-belt` y `/es/trabajos/malone-road-belt`, con los resultados primero.
  - **Una barra fija** con los enlaces a cada sección y, en celular, un menú.
- **Cómo.**
  - Next.js 16.3 (App Router), TypeScript y Tailwind CSS 4, todo generado de forma estática (SSG) y exportado a archivos.
  - Cloudflare sirve esos archivos gratis desde su CDN. La v1 solo ejecuta un Worker mínimo para tres redirecciones y no guarda secretos. Por eso el sitio es rápido, gratis de alojar y difícil de atacar.
  - La animación del hero y del hook es solo CSS: 0 KB de JavaScript.
  - Las capturas de MRB se toman y se codifican en local (Chrome headless y sharp) y se sirven como archivos estáticos con caché `immutable`. El video llega en la fase B, desde Cloudflare R2.
  - La agenda usa Cal.com en un popup. La analítica usa Umami, sin cookies, con eventos personalizados.
- **Cuándo** (re-planificado el 24-oct, [13](./13-plan-de-implementacion.md)).
  - Fase 0: del 3 al 11 de octubre.
  - v1: del 12 al 17 de octubre (unas 7,5 h); rediseño el 24.
  - Reestructuración, fase A: del 24 de octubre al 7 de noviembre, con la publicación.
  - Reestructuración, fase B: del 9 al 15 de noviembre (video y movimiento).
  - v1.1: del 16 al 22 de noviembre (propuestas web y formulario).
  - v2: del 30 de noviembre al 6 de diciembre (tienda demo).
  - v3: opcional, después del 18 de diciembre.
- **Riesgos principales.**
  - El alcance del permiso escrito de MRB: condiciona las capturas, el logo y las cifras. Si llega más estrecho, se quitan los campos afectados.
  - El LCP móvil de la home queda justo: 2,15 s en laboratorio sobre HTTP/2 el 24-oct, con 2,5 s de límite. Se confirma con PSI en producción ([11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento)).
  - La entregabilidad de un dominio que tendrá dos semanas de vida cuando empiece la prospección.
  - La tienda demo compite por las mismas ~4 h semanales.

## Decisiones clave

| Tema | Decisión | Por qué | Detalle |
|---|---|---|---|
| Hosting | Cloudflare Workers, plan Free (US$0) | Vercel Hobby prohíbe el uso comercial, incluido "anunciar la venta de un servicio", y Pro cuesta US$20/mes. Cloudflare Free no tiene esa restricción y sirve archivos estáticos sin límite | [10](./10-infraestructura-y-entornos.md), [ADR-017](./14-decisiones.md#adr-017) |
| Render | 100 % estático, exportado con `output: 'export'`; un Worker mínimo solo para `/`, `/call` y `/llamada` | Máximo rendimiento, mínima superficie de ataque y cero costo de servidor | [03](./03-arquitectura.md), [ADR-002](./14-decisiones.md#adr-002) |
| Idiomas | i18n nativo de Next.js y contenido tipado en `content/{en,es}.ts` | Si falta un texto, la compilación falla. No requiere librerías | [04](./04-i18n-contenido-y-precios.md), [ADR-003](./14-decisiones.md#adr-003) |
| Precios | COP solo para visitantes de Colombia y USD para el resto, en ambos idiomas. **Ocultos por ahora** (`site.features.pricing = false`), con LinkedIn en su lugar | Decisión tuya. Se detecta con la zona horaria del dispositivo, sin servidor. Se ocultan mientras los defines ([ADR-025](./14-decisiones.md#adr-025)) | [04](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante), [ADR-005](./14-decisiones.md#adr-005) |
| Hook A | CSS keyframes sobre HTML y SVG; el estado final es la base | 0 KB de JS. Si la animación falla o el visitante pide reducir movimiento, se ve el estado final | [05](./05-hero-animacion.md), [ADR-006](./14-decisiones.md#adr-006) |
| Sistema visual | "Plano técnico" del design system de `Design system/`: papel crema, tinta, cobalto y marcador sol; Archivo e IBM Plex Mono | La página se veía demasiado sobria. Tokens en Tailwind 4 y componentes propios, sin librerías | [06 §3](./06-secciones-y-ui.md#3-sistema-visual), [ADR-019](./14-decisiones.md#adr-019) |
| Agenda | Cal.com (gratis) en popup, con enlace de respaldo | Muestra la hora del visitante, guarda los UTM y no carga nada hasta que hay intención | [07](./07-integraciones.md#2-agenda-con-calcom), [ADR-007](./14-decisiones.md#adr-007) |
| Analítica | Umami Cloud Hobby (gratis): eventos con `{location, campaign}` | Sin cookies ni banner, ~2,3 KB y reporte de UTM incluido. Límites: 1 sitio y 6 meses de retención | [12](./12-medicion-y-analitica.md), [ADR-018](./14-decisiones.md#adr-018) |
| Formulario | v1.1: `POST /api/contact` en el Worker + Resend | El roadmap (§10) pide para el 18 de octubre solo el hook, el caso y la agenda | [07](./07-integraciones.md#5-formulario-de-contacto-v11), [ADR-009](./14-decisiones.md#adr-009) |
| Estructura | Home + páginas de Trabajo, Servicios y Sobre mí + una página por caso (`/en/work/…`, `/es/trabajos/…`), barra fija con 3 menús desplegables (Popover) y casos como datos tipados, incluidos los demos | El sitio era una página plana; los portafolios que convierten muestran trabajo real y casos con página propia | [06 §1](./06-secciones-y-ui.md#1-mapa-de-secciones), [ADR-020](./14-decisiones.md#adr-020), [ADR-024](./14-decisiones.md#adr-024), [ADR-025](./14-decisiones.md#adr-025) |
| Caso MRB | Con nombre (`disclosure: 'named'`, por caso) | MRB dio permiso; las cifras sin confirmar se omiten sin hueco | [04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure), [ADR-014](./14-decisiones.md#adr-014), [ADR-020](./14-decisiones.md#adr-020) |
| Medios | Capturas reales tomadas y codificadas en local, en marcos dibujados en CSS; en celular el LCP sigue siendo texto | El export no tiene optimizador; las imágenes no pueden mover el LCP móvil | [06 §4](./06-secciones-y-ui.md#4-imágenes), [ADR-021](./14-decisiones.md#adr-021) |
| Video y movimiento (fase B) | Clips del trabajo real en Cloudflare R2; revelados y transiciones en CSS | Los assets del Worker no garantizan las peticiones por rango que Safari necesita; 0 KB de JS para el movimiento | [ADR-022](./14-decisiones.md#adr-022), [ADR-023](./14-decisiones.md#adr-023) |
| Tienda demo | Proyecto aparte en `demo.alejandrodeveloper.com`, enlazado desde la página | Es una plantilla reutilizable para clientes, con su propio ciclo de vida | [07](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración), [ADR-012](./14-decisiones.md#adr-012) |

## Índice

| # | Documento | Para qué sirve |
|---|---|---|
| 01 | [Alcance y requisitos](./01-alcance-y-requisitos.md) | Qué entra en cada versión, requisitos medibles y trazabilidad con el roadmap |
| 02 | [Stack tecnológico](./02-stack-tecnologico.md) | Herramientas, versiones, por qué se eligieron y cuánto cuestan |
| 03 | [Arquitectura](./03-arquitectura.md) | Diagramas, rutas (home, casos y política), estructura del repositorio, islas de cliente, scripts de medios y convenciones |
| 04 | [i18n, contenido y precios](./04-i18n-contenido-y-precios.md) | Idiomas y URLs, modelo de contenido tipado (incluidos los casos y sus cifras), `disclosure`, flags, precios por país y propuestas web |
| 05 | [Hero y animación](./05-hero-animacion.md) | El hero con el trabajo real y la franja de cifras, el H1 y el hook A (en Servicios), con sus guardas de rendimiento y accesibilidad |
| 06 | [Secciones y UI](./06-secciones-y-ui.md) | Cada sección de la home y del caso, sus componentes, el sistema visual "plano técnico", el movimiento y el pipeline de imágenes |
| 07 | [Integraciones](./07-integraciones.md) | Cal.com, WhatsApp, correo, formulario, contrato de la demo y esbozo de la v3 |
| 08 | [SEO](./08-seo.md) | Metadata, hreflang, Open Graph, JSON-LD (también de los casos), sitemap y noindex |
| 09 | [Seguridad y privacidad](./09-seguridad-y-privacidad.md) | Headers, antispam, secretos, Ley 1581, CAN-SPAM y CalOPPA |
| 10 | [Infraestructura y entornos](./10-infraestructura-y-entornos.md) | Dominio, DNS, Google Workspace, Resend, Cloudflare, variables y costos |
| 11 | [Calidad, rendimiento y accesibilidad](./11-calidad-rendimiento-y-accesibilidad.md) | Presupuestos con las mediciones de la fase A, WCAG 2.2 AA, pruebas, checklist de lanzamiento y monitoreo |
| 12 | [Medición y analítica](./12-medicion-y-analitica.md) | Eventos, UTM, prueba de titulares y rutina de los viernes |
| 13 | [Plan de implementación](./13-plan-de-implementacion.md) | Tareas con horas (también R-00 a R-19 de la reestructuración), calendario, ruta crítica y riesgos |
| 14 | [Decisiones (ADR)](./14-decisiones.md) | Registro de decisiones y alternativas descartadas (ADR-001 a ADR-025) |

**Orden de lectura sugerido:** README → 01 → 13 → 03. Los demás docs se consultan cuando se trabaja en cada tarea.

## Costo mensual estimado

| Concepto | Plan | Costo |
|---|---|---|
| Cloudflare (hosting, CDN, DNS, Worker) | Free: archivos estáticos sin límite; 100.000 invocaciones del Worker al día | US$0 |
| Google Workspace | Business Starter, 1 usuario, plan anual | US$7 (COP 29.200 en Colombia) |
| Dominio .com | Cloudflare Registrar: US$10,46 al año; ≈ US$11,17 desde el 1-nov-2026 | ~US$1 |
| Umami Cloud | Hobby: 100.000 eventos/mes, 1 sitio, 6 meses de retención | US$0 |
| Cal.com | Free | US$0 |
| Resend (v1.1) | Free: 3.000 correos/mes, 100/día | US$0 |
| **Total** | | **≈ US$8** |

Mejoras opcionales, solo si los datos o los ingresos lo justifican:

- **Workers Paid** (US$5/mes), si el Worker se acerca a su límite diario.
- **Plan pago de Umami**, para más retención, API o más sitios.
- **Vercel Pro** (US$20/mes), cuando haya ingresos y la demo o los clientes lo justifiquen.

Ver [10 §10](./10-infraestructura-y-entornos.md#10-costos).

## Decisiones pendientes

Estas decisiones son tuyas. Cada una está marcada en el doc correspondiente.

- [ ] **Marca y dominio .com.** Propuesta del roadmap: "Alejandro Hernández · Tiendas y catálogos en línea". Revisa disponibilidad e idealmente compra el dominio en Cloudflare Registrar **este fin de semana**, para que tenga más días de historial antes del 19 de octubre (y antes del 1 de noviembre, cuando sube el precio del .com). Si ya lo compraste en otro registrador, basta con apuntar sus nameservers a Cloudflare ([10 §2](./10-infraestructura-y-entornos.md#2-dominio)).
- [ ] **Dirección postal** para el pie del sitio y los correos a EE. UU. (CAN-SPAM). Puede ser una dirección física, un apartado de USPS o un buzón privado comercial. Un buzón virtual puede tardar días en activarse.
- [ ] **Permiso de MRB por escrito**, con su alcance: nombre, logo, capturas, folleto, video y cifras (R-01). Sin testimonio por ahora.
- [ ] **Cifras de MRB** (R-08): las cotizaciones desde el 27-ago y tu OK para publicarlas, la duración de la fase 1, y la confirmación de 15 productos, 4 líneas, 29 marcas OEM y 6 máquinas. Las que se muestran se verificaron en malonebelt.com el 24-oct; las del plan (16, 5, 30 y 7) no coinciden. Están marcadas con `REVIEW(R-08)` en el código.
- [ ] **Tu foto profesional** en alta resolución (R-09).
- [x] **¿Enlazar tu LinkedIn** en los datos estructurados (`sameAs`)? Sí, desde el 25-oct: el sitio ya lo enlaza ([ADR-025](./14-decisiones.md#adr-025), [08 §4](./08-seo.md#4-datos-estructurados-json-ld)).
- [ ] **¿Mostrar tu WhatsApp +57 en la versión en inglés?** Ver [06 §5](./06-secciones-y-ui.md#5-whatsapp-y-contacto-según-mercado).
- [ ] **Producto y marca ficticios** para la animación. Verifica que no existan. Ver [05 §12](./05-hero-animacion.md#12-producto-y-marca-ficticios).
- [ ] **`experimental.inlineCss` de Next**, solo si PSI en producción da el LCP móvil por encima de 2,5 s (en laboratorio sobre HTTP/2 pasa): necesita un ADR ([11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento)).
- [ ] **Cláusula de exclusividad** de tu contrato laboral: revísala antes de publicar servicios (riesgo del roadmap, §10).

## Cómo usar estos docs con Claude Code

1. **En la fase 0**, crea `CLAUDE.md` en la raíz del repositorio con algo como esto:

   ```markdown
   # Portafolio — reglas para agentes
   - Lee docs/README.md y el doc de la tarea antes de escribir código.
   - Las decisiones de docs/14-decisiones.md no se cambian sin preguntarme. Si una tarea exige cambiarlas, propón un ADR nuevo.
   - Next.js 16.3 App Router con output: 'export', publicado en Cloudflare Workers (plan Free). No agregues proxy.ts, Server Actions, Route Handlers dinámicos, librerías de UI, de i18n ni de animación sin un ADR.
   - Redirecciones y endpoints van en worker/index.ts; encabezados en public/_headers. Enlaces internos con <a>, no con next/link.
   - Todo texto visible vive en src/content/{en,es}.ts. Nunca escribas copy dentro de los componentes.
   - Presupuestos: LCP < 2,5 s, CLS < 0,1, animación del hero 0 KB de JS. Ver docs/11.
   - Código e identificadores en inglés. Docs en español.
   ```

2. **Pide una tarea a la vez**, por su ID del [plan](./13-plan-de-implementacion.md). Por ejemplo: *"Implementa F1-02 siguiendo docs/05-hero-animacion.md. Al terminar, verifica los criterios de aceptación de la tarea y dime qué quedó pendiente."*
3. **Si una decisión cambia**, actualiza el ADR en [14](./14-decisiones.md) y el doc afectado en el mismo commit.
