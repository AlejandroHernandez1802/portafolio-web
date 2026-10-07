# 01 · Alcance y requisitos

La v1 se publica el 17 de octubre de 2026, con el 18 como colchón. Incluye el hero con el hook A, el caso MRB, el proceso, los precios "desde" (USD o COP según el país del visitante), las preguntas frecuentes, "sobre mí", y el cierre con agenda, WhatsApp y correo.

Hay dos desviaciones del roadmap:

- **Formulario de contacto:** pasa a la v1.1 (19–25 de octubre), y lo justifica el propio §10 del roadmap.
- **Hosting:** el sitio se publica en Cloudflare Free y no en Vercel, para no pagar US$20 al mes ([ADR-017](./14-decisiones.md#adr-017)). El roadmap (§3) ya admitía un hosting gratuito con uso comercial.

Fuente: [roadmap](../../Requerimientos/roadmap_portafolio_servicios_web.md), §§1–10.

---

## 1. Objetivo del sitio

En el orden del roadmap:

1. **Atrapar en 5 segundos** con un hook sobre el problema del cliente, no sobre tecnología.
2. **Probar** que sabes hacerlo: el caso MRB y, desde noviembre, una tienda demo que se puede usar.
3. **Convertir** la visita en una llamada de 15 minutos agendada.

**Métricas de éxito** (roadmap §9; detalle en [12](./12-medicion-y-analitica.md)):

- 10 % o más de visitantes hace clic en "Agendar" o "Probar la tienda".
- 5 conversaciones calificadas al 18 de diciembre.
- Las visitas desde correos crecen con el volumen de envíos.

## 2. Alcance por versión

| Versión | Fecha | Incluye | No incluye |
|---|---|---|---|
| **v1** | Publicación 17-oct (límite 18-oct) | Hero con hook A; secciones 2, 3 y 5–10 del roadmap; precios por país; agenda Cal.com (popup); WhatsApp y mailto; política de privacidad EN/ES; SEO básico; analítica con eventos y UTM; redirecciones | Formulario, propuestas web, CI con pruebas automáticas, CSP completa aplicada |
| **v1.1** | 19–25-oct | Plantilla de propuestas web `/[locale]/p/[slug]`; formulario de contacto (`POST /api/contact` + Resend); CI con Playwright + axe + Lighthouse CI; CSP completa aplicada | — |
| **v2** | 2–8-nov | Sección 4 "Pruébala" con la tienda demo; el CTA secundario del hero y el escenario de la animación apuntan a la demo | La tienda demo en sí, que es un proyecto aparte con sus propios docs |
| **v3** (opcional) | Después del 18-dic | Diagnóstico automático de sitios (hook C), solo si en diciembre hacen falta más prospectos entrantes | — |

## 3. Requisitos funcionales por sección

Los IDs (`RF-xx`) se usan en el [plan](./13-plan-de-implementacion.md) y en las pruebas.

| ID | Sección (roadmap §5) | Requisito | Criterio de aceptación | Versión |
|---|---|---|---|---|
| RF-01 | Header | Header fijo con nombre o marca, cambio de idioma y botón compacto "Book a call" / "Agenda una llamada" | Visible en todo momento en móvil; el foco nunca queda oculto bajo el header (`scroll-padding-top`) | v1 |
| RF-02 | 1. Hero | Titular, subtítulo, CTA principal (agenda), CTA secundario (caso MRB; en v2, la demo), línea de confianza y animación del hook A | El titular se lee aunque la animación no cargue; la animación dura 4,2 s, una sola vez; con "reducir movimiento" se ve el estado final ([05](./05-hero-animacion.md)) | v1 |
| RF-03 | 1. Hero | Titular activo configurable entre 3 variantes por idioma | Cambiar `site.hero.activeHeadline` y desplegar cambia el titular en `/en` y `/es` ([12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares)) | v1 |
| RF-04 | 2. Qué resuelvo | Tres bloques: que te encuentren (Google y respuestas de IA), que te elijan (catálogo claro y reseñas), que te compren o coticen (carrito, cotizador, WhatsApp) | Los 3 bloques en ambos idiomas, con ícono SVG inline | v1 |
| RF-05 | 3. Caso MRB | Antes y después; qué se construyó (catálogo, buscador por referencia OEM, tres idiomas, cotizador); resultado y testimonio si hay permiso | Funciona en modo `named` y en modo `anonymized`; el testimonio y las métricas aparecen solo si existen en el contenido ([04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure)) | v1 |
| RF-06 | 4. Tienda demo | Bloque "Pruébala" con póster y botón hacia la demo | Con `features.demoStore = true` se muestra y el CTA secundario cambia; con `false` no se muestra nada | v2 |
| RF-07 | 5. Cómo trabajo | Prototipo en 5 días → construcción por fases → lanzamiento → plan mensual; actualización cada viernes | 4 pasos en orden, legibles en móvil | v1 |
| RF-08 | 6. Servicios y precios | 3 servicios con precio "desde": prototipo, tienda o catálogo con cotizador, plan mensual | Visitante de Colombia ve COP; el resto ve USD; hay un selector manual; sin saltos de diseño (CLS) ([04 §8](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante)) | v1 |
| RF-09 | 7. Preguntas frecuentes | Máximo 8 preguntas: dominio y hosting a nombre del cliente, tiempos, pagos, cambios, qué pasa si no seguimos… | `<details>`/`<summary>` nativos, operables con teclado, contenido presente en el HTML | v1 |
| RF-10 | 8. Sobre mí | Foto y tres líneas: ingeniero de software y líder de proyectos con más de 4 años | No nombra al empleador actual (tampoco en JSON-LD) | v1 |
| RF-11 | 9. Cierre | Botón de agenda, WhatsApp y correo del dominio | Los tres funcionan sin JavaScript (enlaces reales) | v1 |
| RF-12 | 9. Cierre | Formulario de contacto que llega al correo del dominio | El mensaje llega a `hola@alejandrodeveloper.com` con `Reply-To` del visitante; si el envío falla, se muestra el `mailto` ([07 §5](./07-integraciones.md#5-formulario-de-contacto-v11)) | **v1.1** |
| RF-13 | 10. Pie | Dirección postal, enlace a la política de privacidad, idioma | Dirección idéntica a la de los correos (CAN-SPAM) | v1 |
| RF-14 | Legal | Política de privacidad en `/en/privacy` y `/es/privacy` | Cumple el contenido mínimo de la Ley 1581 y CalOPPA ([09 §6](./09-seguridad-y-privacidad.md#6-privacidad-y-cumplimiento)) | v1 |
| RF-15 | Agenda | Cal.com que muestra la hora del cliente | Popup en idioma de la página; zona horaria del visitante; si el popup no carga, el enlace abre Cal.com en otra pestaña; los UTM llegan a la reserva | v1 |
| RF-16 | Propuestas | Página privada por prospecto `/[locale]/p/[slug]` | Slug no adivinable; `noindex`; fuera del sitemap; slugs desconocidos dan 404 ([04 §9](./04-i18n-contenido-y-precios.md#9-propuestas-web-v11)) | v1.1 |
| RF-17 | Redirecciones | `/` → `/en` o `/es` según el idioma del navegador; `www` → apex; `/call` y `/llamada` → Cal.com | Se conserva el query string (UTM) en todas | v1 |
| RF-18 | 404 | Página 404 bilingüe | Toda ruta desconocida responde 404 con enlaces a `/en` y `/es` | v1 |

## 4. Requisitos no funcionales

| Categoría | Requisito | Umbral | Cómo se verifica |
|---|---|---|---|
| Rendimiento | Lighthouse móvil (Performance) | ≥ 90 en `/en` y `/es` | PageSpeed Insights sobre producción, mediana de 3 corridas ([11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento)) |
| Rendimiento | LCP | < 2,5 s (laboratorio móvil); el elemento LCP es el H1 | PSI y panel Performance de DevTools |
| Rendimiento | CLS | < 0,1 (objetivo ≤ 0,02) | PSI; en campo, Cloudflare Web Analytics (opcional) |
| Rendimiento | INP | < 200 ms (campo) | Cloudflare Web Analytics (opcional), cuando haya datos |
| Rendimiento | Animación del hero | < 50 KB (objetivo ≤ 15 KB de CSS + SVG) y 0 KB de JS | Reporte de `next build` e inspección del HTML |
| Accesibilidad | WCAG 2.2 nivel AA | Contraste 4,5:1 en texto y 3:1 en texto grande y UI; teclado; foco visible; `alt`; `lang`; objetivos ≥ 24×24 px | Checklist de [11 §3](./11-calidad-rendimiento-y-accesibilidad.md#3-accesibilidad-wcag-22-aa), axe y revisión manual |
| Accesibilidad | Reducir movimiento | Con `prefers-reduced-motion: reduce` se ve el estado final sin animación | Emulación en DevTools |
| SEO | Básico | Título y descripción por idioma; OG 1200×630 por idioma; JSON-LD Person + ProfessionalService válido; sitemap con hreflang | Rich Results Test, Schema Validator, inspección del sitemap |
| SEO | Privadas | `/p/*` y la demo con `noindex`, fuera del sitemap | `curl -I` muestra `X-Robots-Tag: noindex` |
| Privacidad | Consentimiento | Casilla sin marcar en el formulario (v1.1) y en las reservas de Cal.com | Revisión manual |
| Privacidad | Sin cookies propias | La analítica no usa cookies; el almacenamiento local es solo funcional | Inspección en DevTools → Application |
| Operación | Despliegue | Automático desde `main`; previews por cada rama o PR | Workers Builds de Cloudflare |
| Operación | Rollback | < 5 minutos (rollback de versiones del Worker) | Simulacro antes del lanzamiento |
| Operación | Secretos | 0 en v1; en v1.1 solo `RESEND_API_KEY`, como secreto del Worker | Revisión de los secretos del Worker en Cloudflare |
| Operación | Costo | Hosting y analítica en planes gratuitos (US$0); total ≈ US$8 al mes | [10 §10](./10-infraestructura-y-entornos.md#10-costos) |

## 5. Matriz de trazabilidad (roadmap → docs)

| Roadmap | Requisito | Dónde se resuelve | Versión | Estado |
|---|---|---|---|---|
| §1 | Atrapar, probar, convertir | [05](./05-hero-animacion.md), [06](./06-secciones-y-ui.md), [07 §2](./07-integraciones.md#2-agenda-con-calcom) | v1 | Cubierto |
| §1 | v1 publicada el 18-oct | [13](./13-plan-de-implementacion.md) (publicación el 17, colchón el 18) | v1 | Cubierto |
| §3 | Marca con tu nombre y descriptor | [README](./README.md#decisiones-pendientes) (pendiente), [08](./08-seo.md) | v1 | Pendiente de ti |
| §3 | Dominio .com y correo del mismo dominio | [10 §2–4](./10-infraestructura-y-entornos.md#2-dominio) | Fase 0 | Cubierto |
| §3 | Inglés por defecto (/en) y español (/es) | [04 §1–3](./04-i18n-contenido-y-precios.md#1-rutas-y-urls) | v1 | Cubierto |
| §3 | Mensaje del nicho: catálogos, pedidos y cotizaciones | [06 §2](./06-secciones-y-ui.md#2-contenido-por-sección) | v1 | Cubierto |
| §3 | Vercel Pro u hosting gratuito con uso comercial | [10 §6](./10-infraestructura-y-entornos.md#6-cloudflare), [ADR-017](./14-decisiones.md#adr-017) | Fase 0 | Cubierto con Cloudflare Free |
| §3 | Precios "desde" visibles | [04 §8](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante) (por país) | v1 | Cubierto, ampliado |
| §4 | Hook A: guion, una sola vez, reducir movimiento, < 50 KB, sin video, marca ficticia, titular legible sin animación | [05](./05-hero-animacion.md) | v1 | Cubierto |
| §4 | Hook B: demo dentro del sitio | [07 §6](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración) (enlace, no iframe) | v2 | Cubierto, con ajuste |
| §4 | Hook C: diagnóstico automático | [07 §7](./07-integraciones.md#7-v3-esbozo-del-diagnóstico-automático-hook-c) | v3 | Esbozo |
| §4 | Titulares alternativos, uno a la vez, dos semanas | [12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares) | v1 | Cubierto |
| §5 | Estructura de 10 secciones | [06 §1](./06-secciones-y-ui.md#1-mapa-de-secciones) | v1 / v2 | Cubierto |
| §5 | Servicios y precios (hipótesis) | [06 §2](./06-secciones-y-ui.md#2-contenido-por-sección), [04 §8](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante) | v1 | Cubierto |
| §6 | Contenido a reunir | [13 §4](./13-plan-de-implementacion.md#4-fase-0-3-al-11-de-octubre) | Fase 0 | Cubierto |
| §7 | Next.js en Vercel con /en y /es | [02](./02-stack-tecnologico.md), [04](./04-i18n-contenido-y-precios.md), [ADR-017](./14-decisiones.md#adr-017) | v1 | **Cubierto, con ajuste:** Next.js exportado y publicado en Cloudflare Free, no en Vercel, por costo |
| §7 | Lighthouse móvil ≥ 90; LCP < 2,5 s | [11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento), [05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento) | v1 | Cubierto |
| §7 | Contraste AA, teclado, `alt`, reducir movimiento | [11 §3](./11-calidad-rendimiento-y-accesibilidad.md#3-accesibilidad-wcag-22-aa) | v1 | Cubierto |
| §7 | SEO: título y descripción por idioma, OG, Person + ProfessionalService, sitemap | [08](./08-seo.md) | v1 | Cubierto |
| §7 | Cal.com o Calendly embebido, con la hora del cliente | [07 §2](./07-integraciones.md#2-agenda-con-calcom) (popup Cal.com) | v1 | Cubierto |
| §7 | Formulario de contacto al correo del dominio | [07 §5](./07-integraciones.md#5-formulario-de-contacto-v11) | **v1.1** | **Desviación aceptada:** el roadmap (§10) dice que el 18-oct solo hacen falta el hook, el caso y la agenda; mientras tanto hay mailto, WhatsApp y Cal.com |
| §7 | Eventos: agendar, WhatsApp, apertura de la demo, vista del caso MRB; UTM | [12 §3](./12-medicion-y-analitica.md#3-taxonomía-de-eventos) | v1 / v2 | Cubierto |
| §7 | Eventos personalizados de Vercel exigen Pro; si no, otra herramienta | [ADR-018](./14-decisiones.md#adr-018) | v1 | Cubierto con Umami Cloud Free |
| §7 | Demos y propuestas con noindex y fuera del sitemap | [08 §6](./08-seo.md#6-noindex-de-propuestas-y-demo) | v1.1 / v2 | Cubierto |
| §8 | Fases y fechas | [13](./13-plan-de-implementacion.md) | — | Cubierto (fase 0 ampliada) |
| §9 | Medición semanal | [12 §7](./12-medicion-y-analitica.md#7-rutina-de-los-viernes) | v1 | Cubierto |
| §10 | Perfeccionismo, empleo, permisos, hosting comercial | [13 §11](./13-plan-de-implementacion.md#11-riesgos-y-mitigaciones), [09 §7](./09-seguridad-y-privacidad.md#7-otros-riesgos) | — | Cubierto |

## 6. Fuera de alcance

- Blog, CMS, newsletter y modo oscuro.
- Chat en vivo, cuentas de usuario y pruebas A/B simultáneas (el tráfico no da para eso, ver [12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares)).
- Otros idiomas y monedas distintas de USD y COP.
- La tienda demo en sí: es un proyecto aparte, con sus propios docs. Aquí solo va su contrato de integración.
- Mostrar el prototipo de Jerrell's (privado sin su permiso) y las propuestas con marcas reales en páginas públicas.

## 7. Supuestos y dependencias de contenido

| Dependencia | Responsable | Fecha límite | Si no llega |
|---|---|---|---|
| Permiso de Brian: caso con nombre, cifra de cotizaciones desde el 27-ago y testimonio de 2–3 líneas | Alejandro | 14-oct | Se publica el caso en modo `anonymized`, sin cifra ni testimonio |
| Capturas del sitio anterior de MRB (archive.org) y del nuevo (escritorio y móvil) | Alejandro | 10-oct | En modo anónimo se usan fragmentos recortados o maquetas genéricas |
| Foto profesional y biografía de 3 líneas EN/ES | Alejandro | 10-oct | Se publica sin foto y se agrega después (el espacio queda reservado) |
| Textos de hero y secciones (base en el roadmap §4–5) | Alejandro | 10-oct | Bloquea la v1: es parte de la ruta crítica |
| FAQ (máx. 8) | Alejandro | 10-oct | Se publican 5 y se completan en la v1.1 |
| Dirección postal | Alejandro | 11-oct | Bloquea el pie y los correos a EE. UU. |
| Texto de la política de privacidad | Alejandro (base en [09 §6.5](./09-seguridad-y-privacidad.md#65-estructura-de-la-política-de-privacidad)) | 11-oct | Bloquea la v1 |
| Producto y marca ficticios de la animación | Alejandro | 11-oct | Se usa un genérico ("Industrial Supply Co."), que no es ideal |
