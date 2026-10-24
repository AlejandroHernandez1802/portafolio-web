# 06 · Secciones y UI

La página tiene 10 secciones (roadmap §5) más el header. Todas son Server Components; la interactividad se reduce a 4 islas de cliente pequeñas ([03 §5](./03-arquitectura.md#5-componentes-de-servidor-y-de-cliente)).

La UI usa Tailwind 4 con los tokens del sistema visual "plano técnico" (§3, [ADR-019](./14-decisiones.md#adr-019)), dos familias tipográficas (Archivo variable e IBM Plex Mono), íconos SVG inline y `<details>` nativo para las preguntas frecuentes. No hay librería de componentes ([ADR-015](./14-decisiones.md#adr-015)).

---

## 1. Mapa de secciones

| # | Sección | Ancla | Componente | Tipo | Contenido (`SiteContent`) | Eventos | Versión |
|---|---|---|---|---|---|---|---|
| — | Header fijo | — | `Header` | Servidor | `nav` | `book_call_click` (`header`) | v1 |
| 1 | Hero con hook | `#inicio` | `Hero` + `HeroHeadline` + `HookStage` | Servidor (CSS) | `hero` | `book_call_click` (`hero`); `demo_open` (`stage`, v2) | v1 |
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

**Índice visible.** El recuadro mono de cada encabezado (`SectionHeading index`) numera las secciones en el orden en pantalla, sin contar el hero: Qué resuelvo 01, Caso 02, Cómo trabajo 03, Precios 04, Preguntas 05, Sobre mí 06 y Cierre 07. No coincide con la columna # de esta tabla. Cuando llegue la demo (v2), se renumeran las secciones que quedan después de ella.

## 2. Contenido por sección

Los textos base vienen del roadmap. Lo marcado como *sugerencia* es un punto de partida editable.

**Header.** El nombre en tipografía a la izquierda (no hay logo), con el descriptor desde 640 px; a la derecha, el enlace de idioma ("Español" / "English", con `lang` en el propio enlace) y el botón compacto "Book a call" / "Agenda".

**1. Hero** (roadmap §4):

| | EN | ES |
|---|---|---|
| Titular (`a`) | From “call for pricing” to “add to cart”. | De “precio por interno” a “agregar al carrito”. |
| Subtítulo | I build online stores and quote systems for businesses that sell products. You see a working prototype in 5 days, before you commit to the full build. | Construyo tiendas y catálogos con cotizador para negocios que venden productos. Ves un prototipo funcionando en 5 días, antes de comprometerte con el proyecto completo. |
| CTA principal | Book a 15-minute call | Agenda una llamada de 15 minutos |
| CTA secundario | See the Malone Road Belt case (v1) → Try the demo store (v2) | Ver el caso de Malone Road Belt (v1) → Prueba la tienda demo (v2) |
| Confianza | Built the catalog and quote system for Malone Road Belt, Kentucky. | Construí el catálogo y el cotizador de Malone Road Belt, en Kentucky. |

En modo `anonymized`, el CTA secundario y la línea de confianza cambian según [04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure).

El titular usa comillas tipográficas “ ”: `HeroHeadline` tacha la primera frase entre comillas y marca la segunda con el resaltador ([05 §3](./05-hero-animacion.md#3-guion--línea-de-tiempo-técnica)). Las variantes `b` y `c` no tienen dos frases entre comillas y se ven como texto plano.

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

**6. Servicios y precios "desde".** Tres planes, en una tabla con reglas, con nombre, para quién es, qué incluye (3–4 viñetas) y precio por mercado ([04 §8.3](./04-i18n-contenido-y-precios.md#83-formato-de-moneda)). Se agrega:

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

**8. Sobre mí.** Foto y tres líneas: ingeniero de software y líder de proyectos con más de 4 años. **Sin nombrar al empleador actual**, ni aquí ni en JSON-LD ([08 §4](./08-seo.md#4-datos-estructurados-json-ld)). Mientras no exista el retrato (F0-11), `publicFileExists()` omite la imagen y las líneas ocupan todo el ancho, como una tabla con reglas.

**9. Cierre.** Título y una línea, más tres acciones:

- Agenda (botón principal, amarillo sol con ícono de calendario).
- WhatsApp (con mensaje prellenado por idioma). Solo aparece cuando `whatsappHref()` devuelve un enlace: mientras el número sea el marcador (F0-13), no se muestra.
- Correo `hola@alejandrodeveloper.com`.

En la v1.1 se suma el formulario debajo.

**10. Pie.** Dirección postal (la misma de los correos a EE. UU.), enlace a la política de privacidad, idioma y ©.

## 3. Sistema visual

El sistema visual se llama **"el plano técnico"**. Lo define el design system de la carpeta `Design system/`, en la raíz del proyecto y fuera del repositorio ([readme](../../Design%20system/readme.md)): tokens, fundamentos, componentes de muestra y un UI kit por sección. Se adoptó el 24-oct-2026 ([ADR-019](./14-decisiones.md#adr-019)).

El design system es la referencia visual; el código es la fuente de verdad. Los tokens viven en `src/app/globals.css` y los componentes en `src/components/`. Las clases `ah-*` y los JSX del design system no se copian: se reescriben con utilidades de Tailwind.

**Concepto.** Los clientes son proveedores que viven entre catálogos, referencias OEM, cotizaciones y planos. El sitio se viste como un plano bien impreso:

- Papel crema.
- Tinta azul marino.
- Cobalto para toda acción.
- Un marcador amarillo sol para lo importante.

Lo memorable es el hero: el H1 tacha “precio por interno” y marca “agregar al carrito” al ritmo de la animación ([05 §3](./05-hero-animacion.md#3-guion--línea-de-tiempo-técnica)).

### 3.1 Color

Los tokens se declaran en `:root` (así los leen también los CSS de cada componente) y pasan a Tailwind con `@theme inline` como `--color-*`. Generan utilidades como `bg-paper-1`, `text-ink-2`, `border-ink-1`, `bg-accent-500` o `text-sun-400`.

La paleta de Tailwind se reemplaza entera (`--color-*: initial`): no hay grises, rojos ni naranjas. Solo queda `white`, para el texto sobre cobalto. Los contrastes son sobre `paper-1`, salvo que se indique otro fondo.

| Grupo | Token | Valor | Uso | Contraste |
|---|---|---|---|---|
| Papel | `paper-0` | `#FFFDF8` | Tarjetas elevadas, plan recomendado, ficha del escenario | — |
| | `paper-1` | `#FAF6EE` | Página | — |
| | `paper-2` | `#F2E7CF` | Arena: banda hundida, panel "Antes", brillo del hero | — |
| | `paper-3` | `#E1D7C3` | Líneas finas, burbuja gris del chat | Decorativa |
| | `sand-50` | `#F8F1E1` | Final del degradado arena | — |
| Tinta | `ink-1` | `#15192B` | Texto, reglas y anillo de foco | 16,2:1 |
| | `ink-2` | `#4A5069` | Texto secundario y bordes de campos | 7,4:1 (6,5:1 sobre `paper-2`, 6,2:1 sobre `accent-100`, 5,6:1 sobre `paper-3`) |
| | `ink-3` | `#687090` | Etiquetas e índices, **solo sobre `paper-0` y `paper-1`** | 4,5:1 (sobre `paper-2` baja a 4:1) |
| | `ink-4` | `#232A4A` | Hover del botón `ink` | — |
| Sobre azul profundo | `on-ink-1` | `#EEF0FA` | Texto | 14,1:1 sobre `deep` |
| | `on-ink-2` | `#A9B0D6` | Texto secundario | 7,5:1 sobre `deep` |
| | `on-ink-line` | `#2A3570` | Reglas | Decorativa |
| Cobalto | `accent-50` | `#EEF1FB` | Banda de preguntas, fondo del escenario | — |
| | `accent-100` | `#DCE3FA` | Chips, brillo del hero, hover de botones con contorno | — |
| | `accent-500` | `#2742B8` | Botones, insignia del carrito, bordes de chips y del selector, banda de cierre. **Siempre con texto blanco** | Blanco encima: 8,2:1. Como texto: 7,6:1 |
| | `accent-600` | `#1F3597` | Hover; final del degradado de cierre | Blanco encima: 10,4:1 |
| | `accent-700` | `#182A78` | Cobalto como texto sobre papel | 11,9:1 |
| | `deep` | `#141C4F` | Bandas oscuras: proceso, pie, panel "Después" | — |
| Sol | `sun-400` | `#FFD43B` | Marcador del H1, numerales e índices sobre `deep`, botón principal del cierre, selección de texto. Lleva texto en tinta y nunca es texto sobre papel | Tinta encima: 12,2:1. Sobre `deep`: 11,3:1 |
| | `sun-300` | `#FFE37A` | Hover del botón sol | — |
| Éxito | `ok-600` | `#176B4B` | Checks y "Pedido recibido" | 6,0:1 |
| | `ok-100` | `#DBF1E6` | Fondo de éxito (disponible, hoy sin uso) | — |

- **Proporción aproximada:** 75 % papel, 15 % tinta y azul profundo, 8 % cobalto y 2 % sol.
- **Degradados:** son suaves y siempre entre vecinos de la paleta.
- **Otros tokens de `:root`:**
  - Ancho de Archivo: `--stretch-*`.
  - Cuadrícula de plano: `--grid-line`, `--grid-size` (24 px) y `--grid-size-lg` (32 px).
  - Header: `--header-h`, `--header-bg` y `--header-blur`.

### 3.2 Tipografía

Hay dos familias, autoalojadas con `next/font` en `src/lib/fonts.ts`. Ninguna pide nada a Google en tiempo de ejecución.

| Familia | Archivo | Carga | Uso |
|---|---|---|---|
| **Archivo** (`font-sans`, `--font-archivo`) | Variable, recortada a lo que usa el sistema: pesos 400–800 y eje de ancho `wdth` de 62 a 100 %; subconjunto `latin` (cubre á, é, í, ó, ú, ñ, ¿, ¡ y “ ”); sin cursiva. Un `woff2` de 60 KB en `src/fonts/`, frente a los 90 KB del archivo completo de Google | `next/font/local`, precargada, con `display: 'swap'` y un respaldo ajustado por rol de ancho ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)) | Todo: display, títulos y cuerpo |
| **IBM Plex Mono** (`font-mono`, `--font-plex-mono`) | Solo 500, `latin`: todo lo mono va en ese peso, también el selector de moneda y el escenario | `next/font/google`, sin precarga, con `display: 'swap'` | Solo datos: índices, etiquetas de precio, referencias, "Antes / Después", chips |

**Respaldo mientras carga Archivo.** `globals.css` define tres caras sobre Arial (Roboto en Android): `Archivo Fallback` para el 100 % (los valores que calcula `next/font`), `Archivo Display Fallback` para el 62 % (`size-adjust: 76.5%`) y `Archivo Heading Fallback` para el 75 % (`88%`). `stretch-display` y `stretch-heading` eligen la suya. Con eso el H1 no cambia de líneas cuando llega la fuente ([05 §6](./05-hero-animacion.md#6-guardas-de-rendimiento)). Si cambia el titular, el tamaño del H1 o la fuente, hay que volver a medir: el H1 con los `woff2` bloqueados debe tener la misma altura que con Archivo, de 320 a 1440 px y en ambos idiomas.

**Cómo regenerar Archivo.** El archivo es el `woff2` latin de Google Fonts (v25), recortado con fontTools. fontTools se instala aparte, en un entorno temporal; no es dependencia del proyecto:

1. Descargar el CSS de `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900` con el user agent de un Chrome actual y bajar el `woff2` del bloque `/* latin */`.
2. `pip install fonttools brotli` y `fonttools varLib.instancer <latin>.woff2 wdth=62:100 wght=400:800 -o src/fonts/archivo-latin-wdth62-100-wght400-800.woff2`.
3. Si se necesita otro peso o ancho, se amplía el rango y se actualizan `weight` y `font-stretch` en `src/lib/fonts.ts`.

La licencia es la OFL 1.1, sin nombre reservado, y va junto al archivo (`src/fonts/OFL.txt`).

**Eje de ancho por rol.** Las utilidades `stretch-*` están en `globals.css`, porque `font-stretch-*` de Tailwind no tiene el paso de 87,5 %.

| Utilidad | Ancho | Uso |
|---|---|---|
| `stretch-display` | 62 % | H1, numerales de "Cómo trabajo", precios, título del cierre |
| `stretch-heading` | 75 % | H2 y títulos de la política y del 404 |
| `stretch-title` | 87,5 % | Nombre en el header, nombres de plan, citas |
| `stretch-body` | 100 % | Cuerpo |

**Escala.** Son tokens `--text-*` de `@theme`. Cada uno trae interlineado, espaciado y peso, y las utilidades `leading-*`, `tracking-*` y `font-*` los pueden sobrescribir. Estos son los valores del 24-oct; la fuente de verdad es `globals.css`.

| Utilidad | Tamaño | Interlineado | Peso | Uso |
|---|---|---|---|---|
| `text-display` | `clamp(2.5rem, 9.2vw, 8.5rem)` | 0,95 | 800 | H1: 40 px como mínimo y dos líneas a lo ancho del contenedor |
| `text-h2-xl` | `clamp(2.75rem, 8vw, 6.5rem)` | 0,95 | 800 | Título del cierre |
| `text-h2` | `clamp(2rem, 4.6vw, 3.5rem)` | 0,98 | 800 | H2 de sección |
| `text-h3` | 1,25 rem | 1,2 | 700 | H3 |
| `text-numeral` | `clamp(3.5rem, 7vw, 5.5rem)` | 0,85 | 800 | Numerales 01–04 del proceso |
| `text-price` | `clamp(2rem, 3.2vw, 2.75rem)` | 1 | 800 | Precios |
| `text-lead` | `clamp(1.0625rem, 1.5vw, 1.25rem)` | 1,5 | — | Subtítulo del hero, resúmenes, Sobre mí, cierre |
| `label-mono` | 0,75 rem, mayúsculas, +0,08 em | 1 | 500 | Etiquetas de datos |
| Cuerpo (`body`) | 1 rem | 1,6 | 400 | — |

- **Ajuste de líneas:** `text-wrap: balance` en `h1`–`h3` y en las etiquetas de los botones, y `pretty` en `p` y `li`. Así no quedan palabras solas en la última línea.
- **Ancho de línea:** entre 46 y 65 caracteres, según el bloque.
- **Números:** `tabular-nums` en precios y numerales.

### 3.3 Espaciado, layout y bandas

- **Base de 4 px.**
- **Contenedor:** 72 rem como máximo, con 16 px de margen lateral (24 px desde 640).
- **Secciones:** 64 px de padding vertical (96 px desde 1024). Del título al contenido hay 40 px.
- **Header fijo:** 48 px, con `scroll-padding-top: 64px` en `html`.
- **Cortes:** mobile first, con los de Tailwind (§6).

Cada sección elige una banda con el `tone` de `Section`. Las bandas de color son degradados suaves, no bloques planos:

| `tone` | Superficie | Dónde |
|---|---|---|
| `paper` (por defecto) | Papel crema | Hero (con `backdrop="grid"`), Caso, Precios, Sobre mí |
| `sunken` | Degradado arena (`paper-2` → `sand-50`) | Qué resuelvo |
| `tint` | Degradado cobalto claro (`accent-100` → `accent-50`) | Preguntas frecuentes |
| `raised` | `paper-0` | Disponible, hoy sin uso |
| `ink` | Azul profundo (`deep`) | Cómo trabajo. El pie usa la misma superficie fuera de `Section` |
| `accent` | Degradado cobalto (`accent-500` → `accent-600`). **Una sola por página** | Cierre |

- **Fondo de plano** (`backdrop="grid"`, solo el hero, en `ui/section.css`):
  - Una cuadrícula cobalto de 32 px al 10 %.
  - Debajo, un brillo cobalto arriba a la izquierda y uno arena abajo a la derecha.
  - Una máscara lo desvanece hacia el final de la banda.
  - Va detrás del contenido y no se mueve.
- **Escenario del hero:** repite la cuadrícula a 24 px sobre `accent-50`, con un marco de tinta y marcas de esquina ([05 §5](./05-hero-animacion.md#5-estructura-del-componente)).
- **Sin imágenes de fondo:** no hay fotos de stock, texturas ni grano. Los fondos son degradados CSS, no archivos, así que no compiten con el H1 por el LCP.

**Mapa visual por sección:**

| Sección | Banda | Índice | Patrón |
|---|---|---|---|
| Header | Papel translúcido | — | Nombre al 87,5 %, línea fina debajo, botón compacto cobalto |
| Hero | `paper` + cuadrícula | — | H1 a todo el ancho; texto y escenario debajo ([05 §2](./05-hero-animacion.md#2-composición-y-wireframes)) |
| Qué resuelvo | `sunken` | 01 | Bloques en `paper-0` con regla superior cobalto de 2 px; ícono sol sobre un cuadro cobalto de 44 px |
| Caso | `paper` | 02 | Paneles enfrentados con borde de tinta: "Antes" en arena con flechas, "Después" en azul profundo con checks sol. Una flecha cobalto redonda en la costura. "Qué se construyó" como chips. El testimonio lleva una regla de tinta encima |
| Cómo trabajo | `ink` | 03 | Cada paso cuelga de una regla con un nodo sol y un numeral gigante sol al 62 %. La línea semanal va en un recuadro con ícono de calendario |
| Precios | `paper` | 04 | Nota y selector USD / COP en una barra. Tabla de planes con bordes de tinta compartidos y bloque de precio entre dos reglas. El plan recomendado va en `paper-0` con una franja cobalto de 6 px |
| Preguntas | `tint` | 05 | Filas con regla de tinta, número mono y flecha que gira 90° al abrir |
| Sobre mí | `paper` | 06 | Líneas en `text-lead` bajo una regla de tinta, separadas por líneas finas. Retrato con marco de tinta si existe |
| Cierre | `accent` | 07 | Título enorme en blanco; botón sol de agenda y botones de contorno blancos |
| Pie | Azul profundo | — | Texto de 14 px en `on-ink-2`; enlaces subrayados en el color del texto (7,5:1), que pasan a sol. `on-ink-line` no sirve para el subrayado: da 1,4:1 y los enlaces se confunden con el © |

### 3.4 Reglas, bordes, sombras y radios

- **Reglas de tinta de 1 px.** Dan la estructura: encabezados de sección, filas de las preguntas, tabla de precios y bloque de precio, paneles del caso, marco del escenario y Sobre mí.
- **Líneas finas `paper-3`.** Separan sin pesar: header, línea de confianza del hero y filas de Sobre mí.
- **Sin bordes de color a la izquierda.** Ninguna tarjeta los lleva. Lo único de color es la regla superior cobalto de Qué resuelvo y la franja del plan recomendado. El testimonio lleva una regla de tinta encima, no una barra lateral.
- **Página plana.** Solo tiene sombra lo que flota dentro del escenario: `shadow-1` en la burbuja del cliente y `shadow-2` en la ficha y el aviso. También los botones presionados (`shadow-press`).
- **Esquinas rectas por defecto:**
  - 0 en tarjetas, bandas, paneles, capturas y retrato.
  - 2 px en chips y en las opciones del selector.
  - 4 px en botones y en el marco del selector.
- **Lo redondeado es solo la interfaz dibujada dentro del escenario:**
  - Ficha: 8 px.
  - Burbujas: 16 px.
  - Carrito e insignia: píldora.
  - Fuera del escenario, solo la flecha redonda del caso.
- **Translucidez:** solo en el header, con papel al ~90 % y un desenfoque de 8 px.

### 3.5 Movimiento, estados y foco

- **Un solo momento coreografiado:** el hook de 4,2 s, con el tachado y el marcador del H1 sincronizados ([05](./05-hero-animacion.md)).
  - Curva `--ease-out`, `cubic-bezier(.2, .7, .2, 1)`, sin rebotes ni resortes.
  - Sin animaciones al hacer scroll.
- **Hover:**
  - Botón `primary`: oscurece a `accent-600`.
  - Botón `sun`: aclara a `sun-300`.
  - Botones con contorno: se rellenan de `accent-100` (de blanco al 12 % en la banda de cierre).
  - Enlaces: subrayado cobalto de 2 px que pasa al color del texto.
  - Flechas: se desplazan 3 px.
  - Preguntas: se subraya la pregunta.
  - Pie: el subrayado pasa a sol.
- **Presionado:** el botón baja 1 px y muestra una sombra interior. No se encoge.
- **Transiciones:** de 120 ms en colores y de 200 ms en flechas y en el giro de la flecha de las preguntas. Solo corren con `motion-safe:`.
- **Foco:** `:focus-visible` con un anillo de tinta de 2 px separado 2 px (16:1 sobre papel).
  - En las bandas azules el anillo es amarillo sol: proceso, cierre y pie, que llevan la clase `on-ink`. Da 11,3:1 sobre `deep` y 5,8:1 sobre `accent-500`.
  - Cumple 2.4.7 y 1.4.11.
- **Selección de texto:** sol con texto en tinta.

### 3.6 Íconos y marca

- **Íconos:**
  - Set mínimo de 8 SVG inline en `ui/Icon.tsx`: buscar, estrella, carrito, WhatsApp, correo, calendario, check y flecha.
  - Cuadrícula de 24 px, trazo de 2 px, `currentColor` y `aria-hidden`.
  - Nada de fuentes de íconos, PNG ni emoji.
  - Las flechas son siempre el ícono, nunca el carácter "→".
- **Marca:** sin logo. Es el nombre en Archivo 800 al 87,5 % de ancho, con el descriptor en `ink-2`.

### 3.7 Componentes base

| Componente | Notas |
|---|---|
| `ButtonLink` (`ui/`) | Un `<a>` real con `variant`:<ul><li>`primary`: cobalto con texto blanco.</li><li>`secondary`: enlace con subrayado cobalto y flecha.</li><li>`outline`: contorno cobalto; blanco en la banda de cierre, con la variante `on-accent:`.</li><li>`sun`: sol con texto en tinta; es el botón principal sobre la banda cobalto.</li><li>`ink`, `light` y `outlineLight`: para bandas oscuras; hoy sin uso.</li></ul>`size` puede ser `md` (48 px de alto) o `sm` (36 px, solo en el header). Con `iconStart` e `iconEnd` se agregan íconos: `secondary` termina en flecha por defecto, y `null` la quita. Acepta `data-track*` y `data-cal-*` |
| `BookCallLink` (`booking/`) | `ButtonLink` conectado a Cal.com ([07 §2](./07-integraciones.md#2-agenda-con-calcom)). Acepta `variant`, `size`, `iconStart` e `iconEnd`: primario con flecha en el hero y en precios, sol con calendario en el cierre |
| `Container` | 72 rem con 16 o 24 px de margen |
| `Section` (`ui/Container.tsx`) | `<section>` con `id`, `aria-labelledby="{id}-title"` y el ritmo vertical. `tone` y `backdrop` siguen §3.3. `containerClassName` recibe la rejilla interna |
| `SectionHeading` | H2 con `id="{id}-title"`; hay un único H1 en la página. `index` dibuja el recuadro mono ("01") con la regla de tinta, oculto para lectores de pantalla. Ese recuadro también se exporta solo, como `SectionIndex`, que el 404 usa con "404". `tone`: `default`, `inverse` (sobre `deep`, con índice sol) o `accent` (cierre). `size`: `md`, o `xl` solo en el cierre |
| `Price` | Renderiza las dos monedas con `data-only-market` ([04 §8.2](./04-i18n-contenido-y-precios.md#82-render-sin-saltos)). Cada una tiene una etiqueta mono ("Desde"), el importe en `text-price` al 62 % y el periodo mono ("/ mes"). `reserveLabel` reserva la línea de la etiqueta para que los importes queden alineados en la tabla |
| `Chip` | Etiqueta de pieza, mono en mayúsculas con borde cobalto. `tone`: `default`, `ink` o `accent`; `accent` va como máximo una vez por vista. Con `as="li"` se usa dentro de listas. No es interactiva |
| `Icon` | §3.6 |
| `HeroHeadline` (`hero/`) | El H1 del hero. Es un Server Component. Con dos frases entre comillas tipográficas, tacha la primera y marca la segunda; con menos, es texto plano ([05 §4](./05-hero-animacion.md#4-implementación-el-estado-final-primero)) |
| `HookStage` (`hero/`) | El escenario animado ([05 §5](./05-hero-animacion.md#5-estructura-del-componente)) |
| `MarketToggle` (`market/`) | Control segmentado: un marco cobalto, y la opción elegida se rellena de cobalto con texto mono blanco. Usa `aria-pressed` ([04 §8.4](./04-i18n-contenido-y-precios.md#84-script-inline-300-b)) |

- **Patrones de tarjeta sin componente propio.** El design system define FeatureCard, StepCard, PlanCard, CompareCard, Testimonial y FaqItem. En el código son marcado dentro de cada sección, porque cada uno se usa en un solo lugar.
- **CSS fuera de las utilidades.** Primero van las utilidades de Tailwind. Hay CSS propio, junto a su componente, solo para lo que las utilidades no expresan bien:
  - `hero/hook.css`: escenario y keyframes.
  - `hero/headline.css`: decoraciones del H1.
  - `ui/section.css`: fondo de plano.
  - Las clases siguen BEM con prefijo por componente: `hook__*`, `headline__*`, `section--grid`.
  - En `globals.css` están las utilidades propias (`stretch-*`, `label-mono`) y la variante `on-accent:`.
- **Páginas secundarias:**
  - Política de privacidad: título condensado, fecha en mono y secciones con regla de tinta e índice mono.
  - 404: dos columnas, inglés con H1 y español con H2. Cada una tiene el recuadro índice "404", un título condensado y un botón primario hacia su inicio.

**Fuera de alcance en v1:** el modo oscuro y las animaciones fuera del hero. Las transiciones de hover y foco no cuentan como animación.

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

- **Ninguna imagen está en el primer pliegue en móvil.** El LCP es texto (el H1 o, en teléfonos, el subtítulo), y ninguna imagen lleva `preload` (que en Next 16 reemplaza a `priority`).
- **Sin optimizador.** El export estático no incluye el optimizador de `next/image` ([Next.js](https://nextjs.org/docs/app/guides/static-exports)), así que `next.config.ts` lleva `images: { unoptimized: true }` ([ADR-017](./14-decisiones.md#adr-017)).
  - Las imágenes se exportan ya optimizadas en F0-11, con las medidas y pesos de la tabla, usando Squoosh o `sharp`.
  - `next/image` con `unoptimized` conserva `width` y `height` (sin CLS) y la carga diferida.
- **Escritorio o móvil:** las capturas de MRB tienen versión para cada uno. Se elige con `<picture>` y `getImageProps()`, por ejemplo con `media="(min-width: 768px)"` para la de escritorio ([docs](https://nextjs.org/docs/app/api-reference/components/image)).
- **Sin `placeholder="blur"`.** Las imágenes están bajo el pliegue y tienen dimensiones fijas, así que no lo necesitan.
- **Presentación** (§3.4):
  - Las capturas del caso tienen esquinas rectas y un borde fino: `paper-3` en "Antes" y `on-ink-line` en "Después". Color natural, sin filtros ni duotonos.
  - El retrato va en una columna de 240 px con marco de tinta de 1 px.
- **Archivos que faltan:** si un archivo no existe en `public/`, `publicFileExists()` lo omite y el layout se reacomoda. El sitio nunca muestra los recuadros rayados con nombre y medidas que usa el UI kit para las imágenes pendientes.
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
- **Hero:** en móvil, H1 → escenario → texto. Desde `lg`, el H1 ocupa todo el contenedor, y debajo van el texto a la izquierda y el escenario a la derecha ([05 §8](./05-hero-animacion.md#8-responsive-y-orden-visual)).
- **Qué resuelvo:** bloques apilados y 3 columnas desde `md`.
- **Caso:** paneles apilados en móvil. Desde `md` van lado a lado, sin espacio entre ellos y con un borde compartido. La flecha cobalto va en la costura, y ese lado de cada panel tiene 48 px de padding para que la flecha no toque el texto.
- **Cómo trabajo:** 1, 2 y 4 columnas (móvil, `md` y `lg`).
- **Precios:**
  - En móvil, los planes se apilan y la barra de nota y selector se parte en dos líneas.
  - Desde `lg`, la tabla tiene 3 columnas. Cada plan es un `subgrid` de 5 filas (índice, nombre, descripción, precio y lista), así que nombres, precios y listas quedan alineados.
- **Preguntas frecuentes:** desde `lg`, 5/7 columnas, con el título fijo (`sticky`) a 80 px del borde superior: el alto del header más 32 px.
- **Sobre mí:** con retrato, columna de 240 px desde `md`. Sin retrato, las líneas ocupan todo el ancho.
- **Header fijo:** 48 px. `html { scroll-padding-top: 64px; }` para que los anclajes y el foco no queden tapados.

## Fuentes

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [`next/image`](https://nextjs.org/docs/app/api-reference/components/image)
- [`next/font`](https://nextjs.org/docs/app/api-reference/components/font)
- [Tailwind CSS 4: `@theme`](https://tailwindcss.com/docs/theme)
- [WhatsApp: click to chat](https://faq.whatsapp.com/5913398998672934/)
- [Design system "plano técnico"](../../Design%20system/readme.md) (carpeta local, fuera del repositorio)
- [Archivo](https://fonts.google.com/specimen/Archivo) e [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) en Google Fonts

Consultadas el 3-oct-2026; imágenes con export estático, el 4-oct-2026; sistema visual, el 24-oct-2026.
