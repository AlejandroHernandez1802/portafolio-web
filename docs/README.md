# Portafolio de servicios web: propuesta técnica

Sitio de una página, en inglés y español, que vende "tiendas y catálogos con cotizador" a pymes que venden productos. Está construido con Next.js 16.3, exportado como sitio 100 % estático y publicado en Cloudflare, en el plan gratuito. Se publica el **17 de octubre de 2026**, con el 18 como colchón, y cuesta unos **US$8 al mes**.

| | |
|---|---|
| Estado | Propuesta para revisión. Aún no hay código. |
| Fecha | 3 de octubre de 2026. Versiones, precios y límites verificados en esa fecha. El 4 de octubre se cambiaron el hosting (Cloudflare Free en lugar de Vercel Pro) y la analítica (Umami): ver [ADR-017](./14-decisiones.md#adr-017) y [ADR-018](./14-decisiones.md#adr-018). |
| Requisitos de origen | [Roadmap del portafolio](../../Requerimientos/roadmap_portafolio_servicios_web.md) y el [diagnóstico crítico del side project](https://claude.ai/code/artifact/8a596e99-c90e-4d4c-907e-93f88cceed51) |
| Convenciones | `alejandrodeveloper.com`, `hola@alejandrodeveloper.com` y `tu-usuario` (Cal.com) son marcadores. Se reemplazan cuando se elija el dominio. |

---

## Resumen ejecutivo

- **Qué se construye.** Una página con el hook animado "De 'precio por interno' a 'agregar al carrito'", el caso de Malone Road Belt, el proceso de trabajo, los precios "desde", las preguntas frecuentes, la sección "sobre mí" y un botón para agendar una llamada de 15 minutos. Está en `/en` (por defecto) y `/es`.
- **Cómo.**
  - Next.js 16.3 (App Router), TypeScript y Tailwind CSS 4, todo generado de forma estática (SSG) y exportado a archivos.
  - Cloudflare sirve esos archivos gratis desde su CDN. La v1 solo ejecuta un Worker mínimo para tres redirecciones y no guarda secretos. Por eso el sitio es rápido, gratis de alojar y difícil de atacar.
  - La animación del hero es solo CSS: 0 KB de JavaScript.
  - La agenda usa Cal.com en un popup. La analítica usa Umami, sin cookies, con eventos personalizados.
- **Cuándo.**
  - Fase 0: del 3 al 11 de octubre.
  - v1: del 12 al 17 de octubre (unas 7,5 h).
  - v1.1: del 19 al 25 de octubre (propuestas web y formulario).
  - v2: del 2 al 8 de noviembre (tienda demo).
  - v3: opcional, después del 18 de diciembre.
- **Riesgos principales.**
  - El permiso de Brian para publicar el caso con nombre. Se mitiga con una versión anónima lista por defecto.
  - La entregabilidad de un dominio que tendrá dos semanas de vida cuando empiece la prospección.
  - La tienda demo compite por las mismas ~4 h semanales.

## Decisiones clave

| Tema | Decisión | Por qué | Detalle |
|---|---|---|---|
| Hosting | Cloudflare Workers, plan Free (US$0) | Vercel Hobby prohíbe el uso comercial, incluido "anunciar la venta de un servicio", y Pro cuesta US$20/mes. Cloudflare Free no tiene esa restricción y sirve archivos estáticos sin límite | [10](./10-infraestructura-y-entornos.md), [ADR-017](./14-decisiones.md#adr-017) |
| Render | 100 % estático, exportado con `output: 'export'`; un Worker mínimo solo para `/`, `/call` y `/llamada` | Máximo rendimiento, mínima superficie de ataque y cero costo de servidor | [03](./03-arquitectura.md), [ADR-002](./14-decisiones.md#adr-002) |
| Idiomas | i18n nativo de Next.js y contenido tipado en `content/{en,es}.ts` | Si falta un texto, la compilación falla. No requiere librerías | [04](./04-i18n-contenido-y-precios.md), [ADR-003](./14-decisiones.md#adr-003) |
| Precios | COP solo para visitantes de Colombia y USD para el resto, en ambos idiomas | Decisión tuya. Se detecta con la zona horaria del dispositivo, sin servidor | [04](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante), [ADR-005](./14-decisiones.md#adr-005) |
| Hook A | CSS keyframes sobre HTML y SVG; el estado final es la base | 0 KB de JS. Si la animación falla o el visitante pide reducir movimiento, se ve el estado final | [05](./05-hero-animacion.md), [ADR-006](./14-decisiones.md#adr-006) |
| Agenda | Cal.com (gratis) en popup, con enlace de respaldo | Muestra la hora del visitante, guarda los UTM y no carga nada hasta que hay intención | [07](./07-integraciones.md#2-agenda-con-calcom), [ADR-007](./14-decisiones.md#adr-007) |
| Analítica | Umami Cloud Hobby (gratis): eventos con `{location, campaign}` | Sin cookies ni banner, ~2,3 KB y reporte de UTM incluido. Límites: 1 sitio y 6 meses de retención | [12](./12-medicion-y-analitica.md), [ADR-018](./14-decisiones.md#adr-018) |
| Formulario | v1.1: `POST /api/contact` en el Worker + Resend | El roadmap (§10) pide para el 18 de octubre solo el hook, el caso y la agenda | [07](./07-integraciones.md#5-formulario-de-contacto-v11), [ADR-009](./14-decisiones.md#adr-009) |
| Caso MRB | `disclosure: 'named' \| 'anonymized'` | Si Brian no responde a tiempo, el lanzamiento no se bloquea | [04](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure), [ADR-014](./14-decisiones.md#adr-014) |
| Tienda demo | Proyecto aparte en `demo.alejandrodeveloper.com`, enlazado desde la página | Es una plantilla reutilizable para clientes, con su propio ciclo de vida | [07](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración), [ADR-012](./14-decisiones.md#adr-012) |

## Índice

| # | Documento | Para qué sirve |
|---|---|---|
| 01 | [Alcance y requisitos](./01-alcance-y-requisitos.md) | Qué entra en cada versión, requisitos medibles y trazabilidad con el roadmap |
| 02 | [Stack tecnológico](./02-stack-tecnologico.md) | Herramientas, versiones, por qué se eligieron y cuánto cuestan |
| 03 | [Arquitectura](./03-arquitectura.md) | Diagramas, rutas, estructura del repositorio y convenciones |
| 04 | [i18n, contenido y precios](./04-i18n-contenido-y-precios.md) | Idiomas, modelo de contenido tipado, flags, precios por país y propuestas web |
| 05 | [Hero y animación](./05-hero-animacion.md) | Especificación del hook A, con sus guardas de rendimiento y accesibilidad |
| 06 | [Secciones y UI](./06-secciones-y-ui.md) | Cada sección, sus componentes, tokens visuales e imágenes |
| 07 | [Integraciones](./07-integraciones.md) | Cal.com, WhatsApp, correo, formulario, contrato de la demo y esbozo de la v3 |
| 08 | [SEO](./08-seo.md) | Metadata, hreflang, Open Graph, JSON-LD, sitemap y noindex |
| 09 | [Seguridad y privacidad](./09-seguridad-y-privacidad.md) | Headers, antispam, secretos, Ley 1581, CAN-SPAM y CalOPPA |
| 10 | [Infraestructura y entornos](./10-infraestructura-y-entornos.md) | Dominio, DNS, Google Workspace, Resend, Cloudflare, variables y costos |
| 11 | [Calidad, rendimiento y accesibilidad](./11-calidad-rendimiento-y-accesibilidad.md) | Presupuestos, WCAG 2.2 AA, pruebas, checklist de lanzamiento y monitoreo |
| 12 | [Medición y analítica](./12-medicion-y-analitica.md) | Eventos, UTM, prueba de titulares y rutina de los viernes |
| 13 | [Plan de implementación](./13-plan-de-implementacion.md) | Tareas con horas, calendario, ruta crítica y riesgos |
| 14 | [Decisiones (ADR)](./14-decisiones.md) | Registro de decisiones y alternativas descartadas |

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
- [ ] **Permiso de Brian** para el caso con nombre, la cifra de cotizaciones y el testimonio. Fecha límite: **14 de octubre**. Sin respuesta, se publica la versión anónima.
- [ ] **¿Enlazar tu LinkedIn** en los datos estructurados (`sameAs`)? Puede revelar a tu empleador actual. Ver [08 §4](./08-seo.md#4-datos-estructurados-json-ld).
- [ ] **¿Mostrar tu WhatsApp +57 en la versión en inglés?** Ver [06 §5](./06-secciones-y-ui.md#5-whatsapp-y-contacto-según-mercado).
- [ ] **Producto y marca ficticios** para la animación. Verifica que no existan. Ver [05 §12](./05-hero-animacion.md#12-producto-y-marca-ficticios).
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
