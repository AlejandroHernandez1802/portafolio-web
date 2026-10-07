# 06 · Secciones y UI

La página tiene 10 secciones (roadmap §5) más el header. Todas son Server Components; la interactividad se reduce a 4 islas de cliente pequeñas ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).

La UI usa Tailwind 4 con tokens propios, una sola fuente variable, íconos SVG inline y `<details>` nativo para las preguntas frecuentes. No hay librería de componentes ([ADR-015](./14-decisiones.md#adr-015)).

---

## 1. Mapa de secciones

| # | Sección | Ancla | Componente | Tipo | Contenido (`SiteContent`) | Eventos | Versión |
|---|---|---|---|---|---|---|---|
| — | Header fijo | — | `Header` | Servidor | `nav` | `book_call_click` (`header`) | v1 |
| 1 | Hero con hook | `#inicio` | `Hero` + `HookStage` | Servidor (CSS) | `hero` | `book_call_click` (`hero`); `demo_open` (`stage`, v2) | v1 |
| 2 | Qué resuelvo | `#solucion` | `Solves` | Servidor | `solves` | — | v1 |
| 3 | Caso MRB | `#caso` | `CaseMrb` | Servidor | `caseMrb` + `site.caseMrb.disclosure` | `case_mrb_view` (`data-track-view`) | v1 |
| 4 | Tienda demo | `#demo` | `DemoTeaser` | Servidor | `demo` + `site.features.demoStore` | `demo_open` (`demo`) | **v2** |
| 5 | Cómo trabajo | `#proceso` | `Process` | Servidor | `process` | — | v1 |
| 6 | Servicios y precios "desde" | `#precios` | `Pricing` + `Price` + `MarketToggle` | Servidor + 1 isla | `pricing` | `book_call_click` (`pricing`); `currency_switch` | v1 |
| 7 | Preguntas frecuentes | `#preguntas` | `Faq` | Servidor (`<details>`) | `faq` (máx. 8) | — | v1 |
| 8 | Sobre mí | `#sobre-mi` | `About` | Servidor | `about` | — | v1 |
| 9 | Cierre | `#contacto` | `Closing` (+ `ContactForm` en v1.1) | Servidor (+ isla en v1.1) | `closing`, `contactForm` | `book_call_click`, `whatsapp_click` y `email_click` (`closing`); `contact_submitted` (servidor, v1.1) | v1 / v1.1 |
| 10 | Pie | — | `Footer` | Servidor | `footer` + `site.legal` | — | v1 |

Islas de cliente globales: `TrackingListener` y `CalLoader`, montadas una sola vez en el layout.

## 2. Contenido por sección

Los textos base vienen del roadmap. Lo marcado como *sugerencia* es un punto de partida editable.

**Header.** Nombre o marca a la izquierda; a la derecha, el enlace de idioma ("Español" / "English", con `lang` en el propio enlace) y el botón compacto "Book a call" / "Agenda".

**1. Hero** (roadmap §4):

| | EN | ES |
|---|---|---|
| Titular (`a`) | From "call for pricing" to "add to cart". | De "precio por interno" a "agregar al carrito". |
| Subtítulo | I build online stores and quote systems for businesses that sell products. You see a working prototype in 5 days, before you commit to the full build. | Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ves un prototipo funcionando en 5 días, antes de comprometerte con el proyecto completo. |
| CTA principal | Book a 15-minute call | Agenda una llamada de 15 minutos |
| CTA secundario | See the Malone Road Belt case (v1) → Try the demo store (v2) | Ver el caso de Malone Road Belt (v1) → Prueba la tienda demo (v2) |
| Confianza | Built the catalog and quote system for Malone Road Belt, Kentucky. | Construí el catálogo y el cotizador de Malone Road Belt, en Kentucky. |

En modo `anonymized`, el CTA secundario y la línea de confianza cambian según [04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure).

**2. Qué resuelvo.** Tres bloques con ícono:

- **Que te encuentren:** Google y respuestas de IA.
- **Que te elijan:** catálogo claro y reseñas.
- **Que te compren o coticen:** carrito, cotizador y WhatsApp.

*Sugerencia:* una frase concreta por bloque, sin jerga técnica.

**3. Caso MRB.** Estructura:

1. Problema (antes), con capturas antes y después en escritorio y móvil.
2. Qué se construyó: catálogo, buscador por referencia OEM, tres idiomas y cotizador.
3. Resultado: la cifra de cotizaciones desde el 27-ago solo si Brian la autoriza; si no, un resultado cualitativo.
4. Testimonio de 2–3 líneas, si existe.
5. Enlace a malonebelt.com, solo en modo `named`.

**5. Cómo trabajo.** Cuatro pasos:

1. Prototipo navegable en 5 días hábiles.
2. Construcción por fases.
3. Lanzamiento.
4. Plan mensual.

Una línea aparte: "Actualización cada viernes" / "Every Friday you get an update".

**6. Servicios y precios "desde".** Tres tarjetas con nombre, para quién es, qué incluye (3–4 viñetas) y precio por mercado ([04 §8.3](./04-i18n-contenido-y-precios.md#83-formato-de-moneda)). Se agrega:

- Una nota: "Precios de referencia; el valor final depende del alcance" / "Starting prices; final quote depends on scope".
- El selector USD / COP.
- Un CTA de agenda.

El prototipo se presenta como **gratis y sin compromiso** (decisión del 6-oct; antes era pagado y descontable del proyecto).

**7. Preguntas frecuentes.** Máximo 8. *Sugerencia de preguntas*; las respuestas son tuyas:

1. ¿El dominio y el hosting quedan a mi nombre?
2. ¿Cuánto tarda el proyecto?
3. ¿Cómo son los pagos? (por ejemplo, 40 % al iniciar, 40 % con el primer avance aprobado y 20 % al publicar, según el diagnóstico §9)
4. ¿Cuántas rondas de cambios incluye?
5. ¿Qué pasa si después del prototipo no seguimos?
6. ¿Trabajas con mi plataforma actual (Shopify, WooCommerce, Wix)?
7. ¿Cómo nos comunicamos y en qué horario?
8. ¿Qué necesito tener listo (catálogo, fotos, precios)?

**8. Sobre mí.** Foto y tres líneas: ingeniero de software y líder de proyectos con más de 4 años. **Sin nombrar al empleador actual**, ni aquí ni en JSON-LD ([08 §4](./08-seo.md#4-datos-estructurados-json-ld)).

**9. Cierre.** Título y una línea, más tres acciones:

- Agenda (botón principal).
- WhatsApp (con mensaje prellenado por idioma).
- Correo `hola@alejandrodeveloper.com`.

En la v1.1 se suma el formulario debajo.

**10. Pie.** Dirección postal (la misma de los correos a EE. UU.), enlace a la política de privacidad, idioma y ©.

## 3. Sistema visual

**Tokens de color.** Paleta inicial ajustable. Los contrastes están calculados sobre blanco con la fórmula de WCAG.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | Fondo | — |
| `--color-fg` | `#111827` | Texto principal | ≈ 17,7:1 |
| `--color-muted` | `#4B5563` | Texto secundario, respuesta gris del chat | ≈ 7,6:1 (≈ 6,9:1 sobre `#F3F4F6`) |
| `--color-surface` | `#F3F4F6` | Burbujas, tarjetas, bloques | — |
| `--color-border` | `#9CA3AF` | Bordes de campos y separadores | ≈ 2,5:1 (solo decorativo; los campos del formulario usan `--color-muted` para cumplir 3:1) |
| `--color-accent` | `#1D4ED8` | Botón principal y enlaces | ≈ 6,7:1 (texto blanco sobre acento: ≈ 6,7:1) |
| `--color-success` | `#047857` | Aviso "Order received" y check | ≈ 5,5:1 |
| `--color-focus` | `#1D4ED8` | Anillo de foco de 2 px con 2 px de separación | ≥ 3:1 contra fondo y componente |

Se declaran en `globals.css` con `@theme` (Tailwind 4) para generar utilidades como `bg-accent` o `text-muted`.

**Tipografía:**

- **Fuente:** una fuente variable autoalojada con `next/font` (Inter o Geist, subconjunto `latin`, que cubre á, é, í, ó, ú y ñ).
- **Escala:**
  - H1: `clamp(2rem, 6vw, 3.5rem)` con `text-wrap: balance`.
  - H2: `clamp(1.5rem, 4vw, 2.25rem)`.
  - Cuerpo: 1 rem (16 px) con interlineado 1,6.
  - Texto pequeño: 0,875 rem.
- **Ancho de línea:** 60–75 caracteres (`max-w-prose`).
- **Integración con Tailwind 4:** `@theme inline { --font-sans: var(--font-inter); }`.

**Espaciado y forma:**

- Base de 4 px.
- Secciones con `py-16` en móvil y `py-24` en escritorio.
- Contenedor de 72 rem como máximo, con 16 px de margen lateral en móvil.
- Radios de 12–16 px en tarjetas y escenario.

**Componentes base** (`components/ui/`):

| Componente | Notas |
|---|---|
| `ButtonLink` | `<a>` con variantes `primary` (relleno de acento) y `secondary` (texto con flecha). Mínimo 44 × 44 px de área táctil (WCAG pide ≥ 24 × 24). Acepta `data-track*` y `data-cal-*` |
| `Container`, `SectionHeading` | Anchos y jerarquía consistentes; un único H1 en la página |
| `Price` | Renderiza las dos monedas con `data-only-market` ([04 §8.2](./04-i18n-contenido-y-precios.md#82-render-sin-saltos)) |
| `Icon` | Set mínimo de SVG inline (buscar, estrella, carrito, WhatsApp, correo, calendario, check, flecha), `aria-hidden` y `currentColor`. Nada de fuentes de íconos |

**Fuera de alcance en v1:** modo oscuro y animaciones fuera del hero. Las transiciones de hover y foco quedan dentro de `motion-safe:`.

## 4. Imágenes

| Imagen | Medidas | Formato y peso | Carga | `alt` |
|---|---|---|---|---|
| MRB antes y después, escritorio | 1440 × 900 | WebP o AVIF, ≤ 200 KB c/u | Diferida (bajo el pliegue) | Describe qué se ve y qué cambió, por idioma |
| MRB antes y después, móvil | 390 × 844 | WebP o AVIF, ≤ 120 KB c/u | Diferida | Ídem |
| Modo anónimo | Recortes sin logo ni nombre, o maquetas genéricas | ≤ 150 KB | Diferida | Sin nombrar al cliente |
| Retrato (Sobre mí) | 800 × 800 | WebP, ≤ 80 KB | Diferida | "Alejandro Hernández" + contexto breve |
| Póster de la demo (v2) | 1200 × 750 | WebP o AVIF, ≤ 150 KB | Diferida | Describe la tienda demo |
| OG por idioma | 1200 × 630 | PNG o JPG, ≤ 300 KB | — | `meta.ogImageAlt` |
| Ícono del sitio | SVG | ≤ 2 KB | — | — |

- **Ninguna imagen está en el primer pliegue en móvil.** El LCP es el H1, y ninguna imagen lleva `preload` (que en Next 16 reemplaza a `priority`).
- **Sin optimizador.** El export estático no incluye el optimizador de `next/image` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)), así que `next.config.ts` lleva `images: { unoptimized: true }` ([ADR-017](./14-decisiones.md#adr-017)).
  - Las imágenes se exportan ya optimizadas en F0-11, con las medidas y pesos de la tabla, usando Squoosh o `sharp`.
  - `next/image` con `unoptimized` conserva `width` y `height` (sin CLS) y la carga diferida.
- **Escritorio o móvil:** las capturas de MRB tienen versión para cada uno. Se elige con `<picture>` y `getImageProps()`, por ejemplo con `media="(min-width: 768px)"` para la de escritorio ([docs](https://nextjs.org/docs/app/api-reference/components/image)).
- **Sin `placeholder="blur"`.** Las imágenes están bajo el pliegue y tienen dimensiones fijas, así que no lo necesitan.
- **Textos alternativos:** viven en `content/{en,es}.ts` como campos obligatorios de `ImageRef`, así que una imagen sin `alt` es un error de compilación.

## 5. WhatsApp y contacto según mercado

- **WhatsApp** se ofrece en ambos mercados, pero con distinto peso:
  - **`us`:** agenda (principal) → correo → WhatsApp.
  - **`co`:** agenda → WhatsApp (destacado) → correo. En Colombia, WhatsApp es el canal real de los negocios (diagnóstico §4).
  - El orden se cambia con `data-only-market` o con `order` en CSS según `html[data-market]`. Sin JavaScript extra.
- **Enlace:** `https://wa.me/57XXXXXXXXXX?text=…`, con el número completo sin "+", espacios ni guiones, y el texto codificado ([WhatsApp](https://faq.whatsapp.com/5913398998672934/)). Mensaje prellenado:
  - EN: "Hi Alejandro, I saw your website and I'd like to talk about my store/catalog."
  - ES: "Hola Alejandro, vi tu sitio y quiero hablar de mi tienda o catálogo."
- **Decisión pendiente:** ¿mostrar el WhatsApp +57 a visitantes de EE. UU.? El número aparece al abrir el chat. Opciones:
  - Mostrarlo igual, porque WhatsApp es común en negocios hispanos de EE. UU.
  - Ocultarlo en el mercado `us`.
  - Conseguir un número de EE. UU. más adelante.

  Por defecto queda visible y en tercer lugar.
- **Correo:** `mailto:hola@alejandrodeveloper.com?subject=…` con asunto prellenado por idioma.

## 6. Responsive y layout

- **Mobile-first**, con los cortes por defecto de Tailwind (`sm` 640, `md` 768, `lg` 1024 y `xl` 1280).
- **Reflow:** el contenido funciona a 320 px de ancho y con zoom del 200 % sin scroll horizontal (WCAG 1.4.10).
- **Hero:** dos columnas desde `lg`; en móvil, el orden visual del [05 §8](./05-hero-animacion.md#8-responsive-y-orden-visual).
- **Precios:** tarjetas apiladas en móvil y 3 columnas desde `lg`.
- **Header fijo:** 48 px. `html { scroll-padding-top: 64px; }` para que los anclajes y el foco no queden tapados.

## Fuentes

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [`next/image`](https://nextjs.org/docs/app/api-reference/components/image)
- [`next/font`](https://nextjs.org/docs/app/api-reference/components/font)
- [Tailwind CSS 4: `@theme`](https://tailwindcss.com/docs/theme)
- [WhatsApp: click to chat](https://faq.whatsapp.com/5913398998672934/)

Consultadas el 3-oct-2026; imágenes con export estático, el 4-oct-2026.
