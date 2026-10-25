# 01 · Alcance y requisitos

La v1 se iba a publicar el 17 de octubre de 2026. Incluye el hero con el hook A, el caso MRB, el proceso, los precios "desde" (USD o COP según el país del visitante), las preguntas frecuentes, "sobre mí", y el cierre con agenda, WhatsApp y correo.

**Reestructuración del 24-oct** ([ADR-020](./14-decisiones.md#adr-020) a [ADR-023](./14-decisiones.md#adr-023)). La v1 se construyó pero no se publicó: era una página plana, sin barra de navegación ni imágenes. Antes de publicar, el sitio pasa a una home con barra fija y una página por caso, con el trabajo de MRB con nombre y capturas reales en marcos de dispositivo (fase A). La publicación se mueve al **7 de noviembre**. El video y el movimiento al hacer scroll llegan después, en la fase B (9–15 de noviembre) ([13 §5.1](./13-plan-de-implementacion.md#51-reestructuración-fase-a-24-de-octubre-al-7-de-noviembre)).

Hay dos desviaciones del roadmap:

- **Formulario de contacto:** pasa a la v1.1 (16–22 de noviembre; antes, 19–25 de octubre), y lo justifica el propio §10 del roadmap.
- **Hosting:** el sitio se publica en Cloudflare Free y no en Vercel, para no pagar US$20 al mes ([ADR-017](./14-decisiones.md#adr-017)). El roadmap (§3) ya admitía un hosting gratuito con uso comercial.

Fuente: [roadmap](../../Requerimientos/roadmap_portafolio_servicios_web.md), §§1–10.

---

## 1. Objetivo del sitio

En el orden del roadmap:

1. **Atrapar en 5 segundos** con un hook sobre el problema del cliente, no sobre tecnología.
2. **Probar** que sabes hacerlo: el trabajo real de MRB en la primera pantalla, su página de caso con los resultados primero y, desde diciembre, una tienda demo que se puede usar.
3. **Convertir** la visita en una llamada de 15 minutos agendada.

**Métricas de éxito** (roadmap §9; detalle en [12](./12-medicion-y-analitica.md)):

- 10 % o más de visitantes hace clic en "Agendar" o "Probar la tienda".
- 5 conversaciones calificadas al 18 de diciembre.
- Las visitas desde correos crecen con el volumen de envíos.

## 2. Alcance por versión

| Versión | Fecha | Incluye | No incluye |
|---|---|---|---|
| **v1** | Construida del 12 al 17-oct; rediseño el 24-oct. Se publica con la fase A | Hero con hook A; secciones 2, 3 y 5–10 del roadmap; precios por país; agenda Cal.com (popup); WhatsApp y mailto; política de privacidad EN/ES; SEO básico; analítica con eventos y UTM; redirecciones | Formulario, propuestas web, CI con pruebas automáticas, CSP completa aplicada |
| **Fase A** | 24-oct → publicación el 7-nov | Barra fija con menú; home de 7 secciones con capturas reales de MRB, franja de cifras y servicios en bento; página del caso en EN y ES; imágenes OG; MRB con nombre ([ADR-020](./14-decisiones.md#adr-020), [ADR-021](./14-decisiones.md#adr-021)) | Video, revelados al hacer scroll, transiciones entre páginas |
| **Fase B** | 9–15-nov | Clips del trabajo real y teaser en Cloudflare R2 ([ADR-022](./14-decisiones.md#adr-022)); revelados al hacer scroll y transiciones de vista en CSS; deslizador antes/después, solo si aparece una captura de "antes" ([ADR-023](./14-decisiones.md#adr-023)) | — |
| **v1.1** | 16–22-nov (antes 19–25-oct) | Plantilla de propuestas web `/[locale]/p/[slug]`; formulario de contacto (`POST /api/contact` + Resend) en un panel de `#contacto`; CI con Playwright + axe + Lighthouse CI; CSP completa aplicada | — |
| **v2** | 30-nov → 6-dic (antes 2–8-nov) | La tienda demo como segunda tarjeta (`id="demo"`) dentro de `#trabajo`; el CTA secundario del hero y el escenario de la animación apuntan a la demo | La tienda demo en sí, que es un proyecto aparte con sus propios docs |
| **v3** (opcional) | Después del 18-dic | Diagnóstico automático de sitios (hook C), solo si en diciembre hacen falta más prospectos entrantes | — |

## 3. Requisitos funcionales por sección

Los IDs (`RF-xx`) se usan en el [plan](./13-plan-de-implementacion.md) y en las pruebas.

| ID | Sección (roadmap §5) | Requisito | Criterio de aceptación | Versión |
|---|---|---|---|---|
| RF-01 | Header y navegación | Barra fija de 56 px en todas las páginas. Desde 1024 px: nombre, los 5 enlaces (Trabajo, Servicios, Proceso, Precios, Sobre mí), idioma y "Book a call" / "Agenda una llamada". En menos de 1024 px: nombre, "Agenda" y un botón "Menú" que abre un panel con la Popover API ([ADR-020](./14-decisiones.md#adr-020)) | Visible en todo momento; el foco y los anclajes nunca quedan ocultos bajo la barra (`scroll-padding-top: 72px`). El menú abre con Enter, se recorre con Tab y cierra con Esc, al tocar fuera, al tocar un enlace o al salir con Tab, con el foco de vuelta al botón al cerrar con Esc. En la página del caso, "Trabajo" lleva `aria-current` | v1 / fase A |
| RF-02 | 1. Hero | Titular, subtítulo, CTA principal (agenda), CTA secundario (página del caso MRB; en v2, la demo), línea de confianza, franja de cifras y el trabajo real en marcos de navegador y de celular | El titular se lee siempre; el tachado y el marcador del H1 terminan en ~1,5 s, una sola vez; con "reducir movimiento" se ve el estado final. En celular el elemento LCP es texto y el marco de navegador no se descarga ([05](./05-hero-animacion.md), [ADR-021](./14-decisiones.md#adr-021)) | v1 / fase A |
| RF-03 | 1. Hero | Titular activo configurable entre 3 variantes por idioma | Cambiar `site.hero.activeHeadline` y desplegar cambia el titular en `/en` y `/es` ([12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares)) | v1 |
| RF-04 | 2. Qué resuelvo → Servicios | Desde la fase A, "Qué resuelvo" se integra en Servicios (`#servicios`): una cuadrícula bento de 6 servicios, más un bloque con "Dominio, hosting y cuentas a tu nombre", cuyas etiquetas son los resultados ("Que te encuentren", "Que te elijan", "Que te compren o coticen"…), con capturas de MRB y el escenario del hook A en el bloque B | Los 6 bloques en ambos idiomas; el escenario se reproduce una vez al entrar en vista y, sin soporte o con "reducir movimiento", muestra la escena final ([06 §2](./06-secciones-y-ui.md#2-contenido-por-sección)) | v1 / fase A |
| RF-05 | 3. Caso MRB → Trabajo | Tarjeta del caso en `#trabajo`: captura de la home en un marco de navegador, el resultado, 3 métricas, lo que se construyó como chips y los enlaces a la página del caso y a malonebelt.com | MRB va con nombre (`disclosure: 'named'`). Una cifra sin verificar (la de cotizaciones) se omite sin dejar hueco; no hay testimonio ([04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure)) | v1 / fase A |
| RF-06 | 4. Tienda demo | Segunda tarjeta (`id="demo"`) dentro de `#trabajo`, con póster y botón hacia la demo | Con `features.demoStore = true` se muestra y el CTA secundario cambia; con `false` no se muestra nada. Los índices 01–07 no cambian | v2 |
| RF-07 | 5. Cómo trabajo | Prototipo en 5 días → construcción por fases → lanzamiento → plan mensual, cada paso con su duración; actualización cada viernes y 3 rondas de cambios por fase | 4 pasos en orden, legibles en móvil | v1 |
| RF-08 | 6. Servicios y precios | 3 servicios con precio "desde": prototipo, tienda o catálogo con cotizador, plan mensual; cierra con "Pide tu prototipo gratis" (agenda) y un enlace a las preguntas | Visitante de Colombia ve COP; el resto ve USD; hay un selector manual; sin saltos de diseño (CLS) ([04 §8](./04-i18n-contenido-y-precios.md#8-precios-por-país-del-visitante)) | v1 |
| RF-09 | 7. Preguntas frecuentes | Máximo 8 preguntas: dominio y hosting a nombre del cliente, tiempos, pagos, cambios, qué pasa si no seguimos… | `<details>`/`<summary>` nativos, operables con teclado, contenido presente en el HTML | v1 |
| RF-10 | 8. Sobre mí | "Trabajas directamente conmigo": una entrada en primera persona y una tabla de datos (Colombia UTC−5, idiomas, respuesta en 1 día hábil, más de 4 años, el diseño de marca para MRB), con retrato 4:5 cuando exista | No nombra al empleador actual (tampoco en JSON-LD). Sin retrato, el texto ocupa todo el ancho, sin recuadro vacío | v1 / fase A |
| RF-11 | 9. Cierre | Botón de agenda, WhatsApp y correo del dominio | Los tres funcionan sin JavaScript (enlaces reales) | v1 |
| RF-12 | 9. Cierre | Formulario de contacto que llega al correo del dominio | El mensaje llega a `hola@alejandrodeveloper.com` con `Reply-To` del visitante; si el envío falla, se muestra el `mailto` ([07 §5](./07-integraciones.md#5-formulario-de-contacto-v11)) | **v1.1** |
| RF-13 | 10. Pie | La navegación repetida, el enlace al caso, la política de privacidad, el idioma y la dirección postal | Dirección idéntica a la de los correos (CAN-SPAM); mientras sea el marcador "Por definir", no se muestra | v1 / fase A |
| RF-14 | Legal | Política de privacidad en `/en/privacy` y `/es/privacy` | Cumple el contenido mínimo de la Ley 1581 y CalOPPA ([09 §6](./09-seguridad-y-privacidad.md#6-privacidad-y-cumplimiento)) | v1 |
| RF-15 | Agenda | Cal.com que muestra la hora del cliente | Popup en idioma de la página; zona horaria del visitante; si el popup no carga, el enlace abre Cal.com en otra pestaña; los UTM llegan a la reserva | v1 |
| RF-16 | Propuestas | Página privada por prospecto `/[locale]/p/[slug]` | Slug no adivinable; `noindex`; fuera del sitemap; slugs desconocidos dan 404 ([04 §9](./04-i18n-contenido-y-precios.md#9-propuestas-web-v11)) | v1.1 |
| RF-17 | Redirecciones | `/` → `/en` o `/es` según el idioma del navegador; `www` → apex; `/call` y `/llamada` → Cal.com | Se conserva el query string (UTM) en todas | v1 |
| RF-18 | 404 | Página 404 bilingüe | Toda ruta desconocida responde 404 con enlaces a `/en` y `/es`, también `/es/work/…`, `/en/trabajos/…` y `/en/work` | v1 |
| RF-19 | Página del caso | `/en/work/malone-road-belt` y `/es/trabajos/malone-road-belt`: hero con el resultado como H1 y una captura grande, resultados, resumen, antes/después, qué construí y cierre con agenda ([ADR-020](./14-decisiones.md#adr-020)) | Se generan solo esas dos rutas; cada una con canónica, `hreflang` en/es/x-default, imagen OG propia, `Article` y `BreadcrumbList` ([08](./08-seo.md)). Ninguna cifra sin verificar en pantalla; sin pagos ni carrito de varias piezas | Fase A |
| RF-20 | Medios | Capturas reales de MRB en AVIF y WebP, en marcos de navegador y de celular dibujados en CSS ([ADR-021](./14-decisiones.md#adr-021)) | Dentro de los presupuestos de peso de [06 §4](./06-secciones-y-ui.md#4-imágenes); sin CLS; ninguna captura muestra datos de clientes y el cotizador de MRB nunca se envía | Fase A |
| RF-21 | Video | 3 clips cortos del sitio de MRB y el teaser de 49 s, alojados en Cloudflare R2 ([ADR-022](./14-decisiones.md#adr-022)) | Reproducen solo en vista, sin audio y con pausa visible (WCAG 2.2.2); con "reducir movimiento" o Save-Data, solo la portada. El teaser tiene descripción en texto (WCAG 1.2.1) | Fase B |

## 4. Requisitos no funcionales

| Categoría | Requisito | Umbral | Cómo se verifica |
|---|---|---|---|
| Rendimiento | Lighthouse móvil (Performance) | ≥ 90 en `/en`, `/es` y las dos páginas del caso | PageSpeed Insights sobre producción, mediana de 3 corridas ([11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento)) |
| Rendimiento | LCP | < 2,5 s (laboratorio móvil). En celular el elemento LCP es texto estático, pintado en el primer fotograma: el H1 o el subtítulo del hero (en el caso, su resumen). Las imágenes van después de los CTAs. En escritorio puede serlo la captura del hero, precargada ([ADR-021](./14-decisiones.md#adr-021)) | PSI y panel Performance de DevTools |
| Rendimiento | CLS | < 0,1 (objetivo ≤ 0,02) | PSI; en campo, Cloudflare Web Analytics (opcional) |
| Rendimiento | INP | < 200 ms (campo) | Cloudflare Web Analytics (opcional), cuando haya datos |
| Rendimiento | Animación del hero | < 50 KB (objetivo ≤ 15 KB de CSS + SVG) y 0 KB de JS, también para el escenario del bloque B y su disparo al entrar en vista | Reporte de `next build` e inspección del HTML |
| Rendimiento | JS y CSS | JS de primera carga ≤ 150 KB y CSS ≤ 30 KB, comprimidos; las islas nuevas de la reestructuración suman ≤ ~3 KB | [11 §1](./11-calidad-rendimiento-y-accesibilidad.md#1-presupuestos-de-rendimiento) |
| Accesibilidad | WCAG 2.2 nivel AA | Contraste 4,5:1 en texto y 3:1 en texto grande y UI; teclado; foco visible; `alt`; `lang`; objetivos ≥ 24×24 px | Checklist de [11 §3](./11-calidad-rendimiento-y-accesibilidad.md#3-accesibilidad-wcag-22-aa), axe y revisión manual |
| Accesibilidad | Reducir movimiento | Con `prefers-reduced-motion: reduce` se ve el estado final sin animación; sin desplazamiento de capturas al pasar el mouse y, en la fase B, sin video automático ni revelados | Emulación en DevTools |
| SEO | Básico | Título y descripción por idioma y por página; OG 1200×630 por idioma, para la home y para cada caso; JSON-LD Person + ProfessionalService en la home y Article + BreadcrumbList en cada caso; sitemap con hreflang (6 URLs) | Rich Results Test, Schema Validator, inspección del sitemap |
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
| §4 | Hook A: guion, una sola vez, reducir movimiento, < 50 KB, sin video, marca ficticia, titular legible sin animación | [05](./05-hero-animacion.md) | v1 | Cubierto. Desde la fase A el escenario vive en el bloque B de Servicios. El "sin video" sigue valiendo para el hook; los clips del trabajo real llegan en la fase B ([ADR-022](./14-decisiones.md#adr-022)) |
| §4 | Hook B: demo dentro del sitio | [07 §6](./07-integraciones.md#6-tienda-demo-v2-contrato-de-integración) (enlace, no iframe) | v2 | Cubierto, con ajuste |
| §4 | Hook C: diagnóstico automático | [07 §7](./07-integraciones.md#7-v3-esbozo-del-diagnóstico-automático-hook-c) | v3 | Esbozo |
| §4 | Titulares alternativos, uno a la vez, dos semanas | [12 §6](./12-medicion-y-analitica.md#6-prueba-secuencial-de-titulares) | v1 | Cubierto |
| §5 | Estructura de 10 secciones | [06 §1](./06-secciones-y-ui.md#1-mapa-de-secciones) | v1 / v2 | **Cubierto, con ajuste:** desde la fase A, home de 7 secciones más una página por caso ([ADR-020](./14-decisiones.md#adr-020)); "Qué resuelvo" entra en Servicios y la demo será una tarjeta de Trabajo |
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
- Logos de clientes o testimonios que no existen, fotos de stock, carruseles automáticos, scroll secuestrado y video con sonido automático ([ADR-020](./14-decisiones.md#adr-020)).
- Atribuirte los pagos o los pedidos en línea de MRB: son su fase 2, de otro equipo. El caso tampoco habla de un carrito de varias piezas, porque el cotizador de MRB pide un solo producto con su urgencia.

## 7. Supuestos y dependencias de contenido

| Dependencia | Responsable | Fecha límite | Si no llega |
|---|---|---|---|
| Permiso de MRB por escrito: nombre, logo, capturas, folleto, video y cifras (R-01). Sin testimonio por ahora | Alejandro | Antes de R-11 | Si llega más estrecho, se quitan los campos afectados; volver a `anonymized` obligaría a retirar las capturas ([ADR-020](./14-decisiones.md#adr-020)) |
| Cifras de MRB: cotizaciones desde el 27-ago, duración de la fase 1 y confirmación de las cifras del catálogo (R-08) | Alejandro | 4-nov | Cada cifra que falta se omite sin hueco. Las que se muestran se verificaron en malonebelt.com el 24-oct y llevan `REVIEW(R-08)` en el código |
| Capturas del sitio nuevo de MRB (escritorio y celular) | Claude Code, con `pnpm media:capture` | 24-oct (hechas) | archive.org no guarda el sitio anterior: el antes/después compara el proceso de compra en texto ([ADR-021](./14-decisiones.md#adr-021)) |
| Foto profesional en alta resolución (retrato 4:5, 1:1 y avatar) | Alejandro | R-09 | Se publica sin foto: Sobre mí ocupa todo el ancho y el avatar del hero es un check. Se agrega después sin tocar el layout |
| Textos de hero y secciones (base en el roadmap §4–5) | Alejandro | 10-oct | Bloquea la v1: es parte de la ruta crítica |
| FAQ (máx. 8) | Alejandro | 10-oct | Se publican 5 y se completan en la v1.1 |
| Dirección postal | Alejandro | 11-oct | Bloquea el pie y los correos a EE. UU. |
| Texto de la política de privacidad | Alejandro (base en [09 §6.5](./09-seguridad-y-privacidad.md#65-estructura-de-la-política-de-privacidad)) | 11-oct | Bloquea la v1 |
| Producto y marca ficticios de la animación | Alejandro | 11-oct | Se usa un genérico ("Industrial Supply Co."), que no es ideal |
