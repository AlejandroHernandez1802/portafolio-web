# 05 · Hero y animación del hook A

El hook A es una animación de 4,2 s hecha solo con CSS sobre HTML y SVG renderizados en el servidor. Pesa 0 KB de JavaScript y menos de 15 KB en total, frente al límite de 50 KB del roadmap.

El principio de diseño es **"el estado final primero"**: el CSS base pinta la escena terminada y las animaciones solo la hacen *entrar*. Si la animación falla, si el visitante pide reducir movimiento o si el CSS de animación no carga, se ve el estado final sin hacer nada extra.

**Desde la reestructuración del 24-oct** ([ADR-020](./14-decisiones.md#adr-020), [ADR-021](./14-decisiones.md#adr-021) y [ADR-023](./14-decisiones.md#adr-023)), el hero y el hook se separan:

- **El hero muestra trabajo real:** la home de MRB en un marco de navegador y su cotizador en un marco de celular (`HeroShowcase`), más una franja de 4 cifras (`FiguresStrip`).
- **El escenario del hook pasa al bloque B de Servicios** (`#servicios`). Se reproduce una vez cuando entra en vista, también solo con CSS (§4).
- **El H1 cuenta la historia solo:** tacha la frase vieja a 0,4 s y marca la nueva con amarillo sol a 1,0 s, justo después del primer pintado. Antes iba sincronizado con el escenario, a 1,2 y 3,3 s.

El aspecto del hero, del escenario y del titular sigue el sistema visual de [06 §3](./06-secciones-y-ui.md#3-sistema-visual).

---

## 1. Objetivo y reglas

Del roadmap (§4):

- **Contenido:** la animación cuenta, sin leer un párrafo, el paso de "precio por interno" a "agregar al carrito".
- **Una sola reproducción**, sin bucle. Desde la fase A empieza al entrar en vista, no al cargar.
- **Reducir movimiento:** con "reducir movimiento" activado se muestra directamente el estado final.
- **Peso:** SVG, CSS o Framer Motion; menos de 50 KB y sin video. El "sin video" vale para el hook y el H1; los clips del trabajo real llegan en la fase B ([ADR-022](./14-decisiones.md#adr-022)).
- **Producto y marca ficticios**, nunca una empresa real.
- **Titular independiente:** se lee aunque la animación no cargue.

Y de la reestructuración ([ADR-021](./14-decisiones.md#adr-021)):

- **En celular, el elemento LCP es texto,** y las imágenes van después de los CTAs.
- **Ninguna captura del hero entra con fundido** ni empieza con `opacity: 0`.

## 2. Composición y wireframes

**Escritorio (≥ 1024 px).** El H1 ocupa las 12 columnas del contenedor, sobre el fondo de plano. Debajo, el texto ocupa 5 columnas y los marcos 7. La franja de cifras cierra la banda a todo el ancho.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Alejandro Hernández  Trabajo Servicios Proceso Precios Sobre mí      │
│                                       English │ [Agenda una llamada] │ barra fija, 56 px
├──────────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░ cuadrícula de plano ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  De “precio por interno”                                             │ H1 en 12 columnas
│  a “agregar al carrito”.                                             │ (tachado y marcador)
│                                                                      │
│  Construyo tiendas y       ┌─ ○ ○ ○ ─ malonebelt.com ──────────────┐ │
│  catálogos con cotizador…  │                                       │ │
│                            │  home real de MRB (captura)           │ │ marco de navegador
│  [ Agenda una llamada → ]  │                                   ┌───┴─┐
│  Ver el caso de MRB →      │                                   │     │ marco de celular:
│  ────────────────────────  └───────────────────────────────────┤ cot.│ el cotizador
│  ✓ Trabajas directamente   ● TRABAJO REAL · MALONEBELT.COM     │     │
│    COLOMBIA, UTC−5                                             └─────┘
│ ════════════════════════════════════════════════════════════════════ │ regla de tinta
│  29 marcas OEM │ 3 idiomas      │ 5 días hábiles │ Desde US$ 3.000   │ franja de cifras
│ ════════════════════════════════════════════════════════════════════ │
└──────────────────────────────────────────────────────────────────────┘
```

- **Texto (5 columnas):** subtítulo, el botón cobalto de agenda con flecha, el enlace "Ver el caso de Malone Road Belt" y la línea de confianza.
- **Línea de confianza:** "Trabajas directamente conmigo" en seminegrita y, debajo, "Colombia, UTC−5" en mono. El texto se parte en " · ". A su izquierda va un avatar redondo de 48 px cuando existe `portrait/avatar` (R-09); mientras tanto, un check verde.
- **Marcos (7 columnas):** el navegador mide 624 px a todo el ancho del contenedor. El celular mide el 30 % de la columna: su borde superior queda a un tercio del navegador, y sobresale por debajo y un 3 % por la derecha. Detrás hay un brillo cobalto y una línea de construcción discontinua, desplazada 14 px del navegador. La leyenda va en un chip azul profundo con un punto sol, bajo el navegador a la izquierda.

**Celular (390 × 844).** El orden es el del DOM: H1 → subtítulo → CTAs → línea de confianza → franja de cifras en 2 × 2 → marco de celular. El marco de navegador no se muestra ni se descarga.

```text
┌───────────────────────────────┐
│ Alejandro Hernández  [Agenda] │
│                       [≡ Menú]│ 56 px, fijo
├───────────────────────────────┤
│ De “precio por interno”       │
│ a “agregar al carrito”.       │ H1 (40 px mín.)
│ Construyo tiendas y catálogos │ subtítulo: el elemento LCP
│ con cotizador para negocios…  │
│ [ Agenda una llamada de 15 → ]│ CTA principal
│ Ver el caso de Malone Road →  │ CTA secundario
│ ✓ Trabajas directamente…      │ línea de confianza
│ ══════════════╤══════════════ │
│ 29 marcas OEM │ 3 idiomas     │ franja 2 × 2
│ ──────────────┼────────────── │
│ 5 días háb.   │ Desde US$ …   │
│ ══════════════╧══════════════ │
├ ─ ─ ─ ─ pliegue (~823 px) ─ ─ ┤
│          ┌───────┐            │ marco de celular, máx. 16 rem,
│          │  cot. │            │ centrado, con su línea discontinua
│          └───────┘            │ y la leyenda debajo
└───────────────────────────────┘
```

El marco de celular empieza entre los 909 y los 995 px en pantallas de 280 a 412 px de ancho, y a 929 px en 430 px, con un viewport de 823 px: siempre bajo el pliegue. A 768 × 1024, el H1 ocupa unas tres veces el área visible del marco.

## 3. Guion → línea de tiempo técnica

**H1** (`HEADLINE` en `timeline.ts`), desde el primer pintado:

| Tiempo | Qué pasa | Elemento | Animación | Retraso / duración |
|---|---|---|---|---|
| 0,4–0,9 s | La frase vieja se tacha de izquierda a derecha | `.headline__strike` (un `::before` por palabra) | `transform: scaleX(0)` → trazo completo, curva lineal | 400 / 500 ms, repartidos entre las palabras según su largo |
| 1,0–1,45 s | La frase nueva recibe el marcador sol, cuando el tachado ya terminó | `.headline__mark` (un `::before` por palabra) | `transform: scaleX(0)` → marcador completo, curva lineal | 1.000 / 450 ms, repartidos igual |

**Escenario del bloque B** (`TIMELINE`), desde que empieza a reproducirse (§4):

| Tiempo | Qué pasa (roadmap) | Elemento | Animación | Retraso / duración |
|---|---|---|---|---|
| 0,0–1,0 s | Burbuja del cliente: "Hi, how much for…?" / "Hola, ¿precio de 20 correas B48?" | `.hook__msg--in` | Entra con `opacity` + `translateY(8px)`, se mantiene y sale con el morph | 0 / 2.200 ms |
| 1,0–1,8 s | Respuesta típica en gris: "Call for pricing" / "Precio por interno" | `.hook__msg--out` | Igual que la anterior | 1.000 / 1.200 ms |
| 1,8–3,0 s | La burbuja se transforma en ficha: foto, precio visible y selector de cantidad | `.hook__card` | Entra con `clip-path: inset(...)` + `scale(.92)` + `opacity` mientras las burbujas salen (fundido cruzado) | 1.800 / 800 ms |
| | | `.hook__price`, `.hook__qty` | Entran con `opacity` + `translateY(4px)` | 2.400 y 2.600 / 300 ms |
| 3,0–3,6 s | Un cursor toca "Agregar al carrito" y el carrito marca "1" | `.hook__cursor` | Viaja con `translate`, "presiona" con `scale(.9)` y se desvanece | 3.000 / 700 ms |
| | | `.hook__btn` | Pulsación con `scale(.96)` | 3.300 / 200 ms |
| | | `.hook__badge` | Aparece con `scale(0 → 1)` | 3.400 / 250 ms |
| 3,6–4,2 s | "Order received · Delivery Thursday" / "Pedido recibido · Entrega el jueves" queda fijo | `.hook__toast` | Entra con `opacity` + `translateY(8px)` | 3.600 / 500 ms |

Fin de la secuencia: ≈ 4,1–4,2 s después de empezar. Ningún elemento repite. Los tiempos viven en `src/components/hero/timeline.ts`: `HEADLINE` para el H1 y `TIMELINE` para el escenario. Desde R-06 ya no dependen uno del otro, porque el escenario dejó el hero.

## 4. Implementación: el estado final primero

Las reglas que hacen funcionar el patrón:

1. **El CSS base es el estado final.** Ficha visible, precio y cantidad visibles, carrito con "1", aviso visible. Las burbujas y el cursor quedan ocultos (`opacity: 0`), porque al final de la historia ya no están.
2. **Cada animación declara solo el estado inicial**, o una secuencia que **termina igual que la base**.
3. **Siempre `animation-fill-mode: both`.** Durante el retraso se aplica el estado inicial (oculto) y al terminar se conserva el último fotograma, que coincide con la base.
4. **Solo se animan `transform`, `opacity` y `clip-path`.** Nada de `width`, `height`, `top` o `margin`, que provocan relayout y CLS.
5. **El texto del H1 nunca se anima.** Es el elemento LCP, o compite por serlo con el subtítulo en teléfonos (§6). Solo entran sus decoraciones, que son pseudoelementos `::before` vacíos:
   - Su estado base es el trazo completo.
   - La animación solo declara el inicio, `scaleX(0)`.

```css
/* src/components/hero/hook.css (extracto ilustrativo) */
.hook {
  position: relative; aspect-ratio: 4 / 3; overflow: hidden; contain: layout paint;
  container: hook / inline-size; /* 100cqi = ancho del escenario; también el contenedor de estilo */
}
/* La escena se dibuja a 400 × 300 y se escala a lo ancho del escenario, hasta 1,25×.
   tan(atan2()) convierte la razón de dos longitudes en un número; sin soporte, queda en 0,75× */
.hook__scene {
  position: absolute; top: 50%; left: 50%; width: 400px; height: 300px;
  transform: translate(-50%, -50%) scale(0.75);
  transform: translate(-50%, -50%) scale(min(1.25, tan(atan2(100cqi, 400px))));
}
.hook__scene > * { position: absolute; } /* nada empuja a nada */

.hook [data-anim] {
  animation-duration: var(--d, 300ms);
  animation-delay: var(--t, 0ms);
  animation-timing-function: var(--ease-out); /* cubic-bezier(.2, .7, .2, 1) */
  animation-fill-mode: both;
}

/* Entrada simple: solo "from"; el "to" es el estado base (final) */
@keyframes hook-in { from { opacity: 0; transform: translateY(8px); } }
.hook__price, .hook__qty, .hook__toast { animation-name: hook-in; }

/* Burbujas: aparecen, se sostienen y salen. Terminan ocultas = base */
.hook__msg { opacity: 0; }
@keyframes hook-chat {
  0%   { opacity: 0; transform: translateY(8px); }
  15%  { opacity: 1; transform: none; }
  80%  { opacity: 1; transform: none; }
  100% { opacity: 0; transform: scale(.96); }
}
.hook__msg { animation-name: hook-chat; }

/* Morph a ficha */
@keyframes hook-card-in {
  from { opacity: 0; transform: scale(.92); clip-path: inset(30% 20% 40% 20% round 16px); }
}
.hook__card { animation-name: hook-card-in; }

/* Carrito */
@keyframes hook-pop { from { transform: scale(0); } }
.hook__badge { animation-name: hook-pop; }

/* Una vez al entrar en vista, con 0 KB de JS (ver abajo) */
@supports (animation-timeline: view()) {
  .hook { animation: hook-arm linear both; animation-timeline: view(); animation-range: entry 40% entry 80%; }
  @container hook style(--hook-state: wait) {
    .hook [data-anim] { animation-play-state: paused; }
  }
}
@keyframes hook-arm { from { --hook-state: wait; } to { --hook-state: go; } }

/* Reducir movimiento: sin animaciones, se ve la base (estado final); también cae hook-arm */
@media (prefers-reduced-motion: reduce) {
  .hook, .hook * { animation: none !important; }
}
```

**Cómo arranca al entrar en vista, sin JS.**

- Una animación ligada al scroll (`animation-timeline: view()`) cambia la variable `--hook-state` de `wait` a `go` en la mitad de su rango, cuando ~60 % del escenario ya entró en el viewport.
- Mientras la variable dice `wait`, una consulta de estilo (`@container hook style(...)`) mantiene en pausa, en 0 ms, la línea de tiempo del escenario. En pausa, cada elemento muestra su punto de partida.
- Si el visitante sale del escenario a mitad de la secuencia, se pausa y sigue al volver. Al terminar, queda en la escena final.
- **Sin animaciones ligadas al scroll o sin consultas de estilo,** la variable nunca se define o la pausa no aplica, y la secuencia corre al cargar. Termina mucho antes de que el visitante llegue a Servicios, así que ve la escena final. Es el caso de Firefox ([ADR-023](./14-decisiones.md#adr-023)).
- **Ningún ancestro del escenario puede llevar `overflow: hidden` ni `auto`.** Eso lo convierte en contenedor de scroll, y `view()` mediría contra él en vez de la página. Por eso los bloques del bento usan `overflow-clip`. Si un cambio futuro lo rompe, el escenario se reproduce al cargar: falla del lado seguro, pero se pierde el efecto.

Los tiempos se pasan como variables CSS en el JSX: `style={{ '--t': '1800ms', '--d': '800ms' }}`. Se agrega `data-anim` a cada elemento animado.

El H1 sigue el mismo patrón en `src/components/hero/headline.css`:

```css
/* src/components/hero/headline.css (extracto ilustrativo) */
.headline__word { position: relative; }
.headline__word::before { content: ''; position: absolute; transform-origin: 0 50%; }
.headline__strike > .headline__word::before { z-index: -1; height: .075em; background: var(--ink-1); } /* detrás de las letras */
.headline__mark > .headline__word::before { z-index: -1; height: .95em; background: var(--sun-400); }

/* Solo "from": la base es el trazo completo */
@keyframes headline-draw { from { transform: scaleX(0); } }
.headline__word::before { animation: headline-draw var(--d) linear var(--t) both; }

@media (prefers-reduced-motion: reduce) {
  .headline__word::before { animation: none; }
}
```

**Por qué un trazo por palabra.**

- Una decoración posicionada no puede seguir a una frase cuando esta se parte en dos líneas, y en teléfonos angostos las frases se parten.
- Cada palabra es una caja de una sola línea, así que puede llevar su propio trazo.
- El JSX reparte el retraso y la duración entre las palabras según su largo. Cada trazo empieza donde termina el anterior, y con curva lineal se lee como un solo trazo continuo.
- El UI kit anima `background-size` sobre la frase completa. Esa propiedad no está entre las permitidas (regla 4), por eso se cambió la técnica.

## 5. Estructura del componente

### 5.1 Escenario: `HookStage`

`src/components/hero/HookStage.tsx` es un **Server Component** que recibe `content.services.stage` (antes `hero.stage`) y no usa hooks ni estado. `Services` lo pone dentro del bloque B del bento, con `className` para que crezca hasta llenar el bloque:

```tsx
<a href={stageHref} className={`hook ${className}`} aria-hidden="true" tabIndex={-1}
   title={stage.linkTitle} {...track}>             {/* track: trackAttrs(stageEvent, 'stage') */}
  <span className="hook__corner hook__corner--tl" />  {/* marcas de registro: tl, tr, bl, br */}
  <span className="hook__scene">                      {/* 400 × 300, escalada con transform (§4) */}
    <span data-anim className="hook__msg hook__msg--in" style={at(TIMELINE.customer)}>{stage.customerMessage}</span>
    <span data-anim className="hook__msg hook__msg--out" style={at(TIMELINE.reply)}>{stage.businessReply}</span>
    <span data-anim className="hook__card" style={at(TIMELINE.card)}>
      <BeltIllustration />                            {/* SVG inline ≤ 3 KB; nada de <img> */}
      <span className="hook__brand">{product.brand}</span>
      <span className="hook__name">{product.name}</span>
      <span data-anim className="hook__price" style={at(TIMELINE.price)}>{/* precio por mercado + unidad */}</span>
      <span data-anim className="hook__qty" style={at(TIMELINE.qty)}>{product.qtyLabel} 20</span>
      <span data-anim className="hook__btn" style={at(TIMELINE.press)}>{stage.addToCart}</span>
    </span>
    <span className="hook__cart">
      <Icon name="cart" />
      <span data-anim className="hook__badge" style={at(TIMELINE.badge)}>1</span>
    </span>
    <Cursor />                                        {/* data-anim, at(TIMELINE.cursor) */}
    <span data-anim className="hook__toast" style={at(TIMELINE.toast)}>
      <span className="hook__ok"><Icon name="check" /></span>  {/* círculo verde con check */}
      {stage.orderReceived}
    </span>
  </span>
</a>
```

- **Tiempos:** salen de `TIMELINE` (§3).
- **Textos del escenario:** salen de `content/{en,es}.ts` → `services.stage`. El escenario se ve en el idioma de la página.
- **Precio de la ficha:** usa las dos monedas con `data-only-market` ([04 §8.2](./04-i18n-contenido-y-precios.md#82-render-sin-saltos)), así coincide con la sección de precios.
- **Destino del clic:** el escenario es clicable porque la gente intentará tocar el "Add to cart" falso. En la fase A lleva a la página del caso (`casePath`) y cuenta como `case_open` con `location: 'stage'`; en la v2, a la demo (`site.demoUrl`), como `demo_open` ([12 §3](./12-medicion-y-analitica.md#3-taxonomía-de-eventos)). Antes de ADR-020 solo saltaba a `#caso` en la misma página, así que no llevaba `data-track`.
- **Tamaño:** es una caja 4:3 que escala la escena a su propio ancho (§4), en vez de los altos fijos por corte de antes. Un bloque alto puede estirarla; la escena queda centrada.
- **Aspecto** ([06 §3](./06-secciones-y-ui.md#3-sistema-visual)):
  - El fondo es tinte cobalto (`accent-50`) con una cuadrícula de 24 px, un marco de tinta de 1 px y cuatro marcas de esquina, como un pliego de imprenta.
  - Ficha en papel con radio de 8 px y `shadow-2`, marca en mono, precio condensado con cifras tabulares y campo de cantidad en mono.
  - Botón y insignia en cobalto.
  - Aviso en tinta oscura con un círculo verde de check.
  - Solo la interfaz dibujada dentro del escenario es redondeada.

### 5.2 Titular: `HeroHeadline`

`src/components/hero/HeroHeadline.tsx` también es un Server Component, sin `'use client'`. Recibe el titular activo y lo parte por las comillas tipográficas. La primera frase entre comillas se tacha y la segunda se marca:

```tsx
<h1 id="inicio-title" className="text-display stretch-display">
  De <span className="headline__strike">            {/* texto en ink-3 */}
    <span className="headline__word" style={{ '--t': '400ms', '--d': '200ms' }}>“precio </span>
    <span className="headline__word" style={{ '--t': '600ms', '--d': '100ms' }}>por </span>
    <span className="headline__word" style={{ '--t': '700ms', '--d': '200ms' }}>interno”</span>
  </span> a <span className="headline__mark">{/* “agregar al carrito”, de 1.000 a 1.450 ms */}</span>.
</h1>
```

- **Sin dos frases entre comillas** (variantes `b` y `c`, [04 §7](./04-i18n-contenido-y-precios.md#7-variantes-del-titular)), el H1 se renderiza como texto plano, sin decoraciones.
- **Cada palabra conserva su espacio final.** Así el lector de pantalla recibe la oración como texto corrido, y el trazo cubre los espacios dentro de una misma línea.

### 5.3 Trabajo real: `HeroShowcase`

`src/components/hero/HeroShowcase.tsx` es un Server Component (0 KB de JS) con su CSS en `hero/showcase.css`. Recibe el caso destacado, sus `alts`, la leyenda (`hero.showcase.label`), el destino (la página del caso) y el `title` del enlace (`hero.secondaryCta.case`).

- **Medios:** `study.media.showcase.browser` (`mrb/home-desktop`) y `.phone` (`mrb/quote-mobile`), dentro de `DeviceFrame` ([06 §4](./06-secciones-y-ui.md#4-imágenes)). El marco de navegador muestra el dominio del cliente en la píldora de dirección.
- **Captura del navegador:** `loading="eager"`, `fetchPriority="high"` y `hideBelow={1024}`, más `preloadImage()` con `media: '(min-width: 1024px)'` y el mismo `sizes` que la imagen, para que el navegador elija el mismo archivo en los dos: `(min-width: 1152px) 624px, (min-width: 1024px) calc(58.4vw - 48px), 1px`. En escritorio puede ser el elemento LCP.
- **Captura del celular:** `eager` con `fetchPriority="low"`: en escritorio está a la vista y en celular, bajo el pliegue. En la fase B, el clip del cotizador se reproduce ahí, con esta captura como portada ([ADR-022](./14-decisiones.md#adr-022)).
- **Todo el `<figure>` es un enlace** a la página del caso, porque la gente toca las capturas. Como el escenario de antes, lleva `aria-hidden="true"` y `tabIndex={-1}`: el CTA secundario lleva al mismo lugar. Las imágenes conservan su `alt` fuera del enlace. Envía `case_open` con `location: 'hero'`.
- **Al pasar el mouse,** los marcos suben 4 px. Solo con `hover: hover` y sin "reducir movimiento".
- **Si falta una clave** del manifiesto, su marco no se dibuja. Sin ninguna, o si el caso no está en `disclosure: 'named'`, el componente no dibuja nada: las capturas identifican al cliente ([04 §6](./04-i18n-contenido-y-precios.md#6-caso-mrb-con-disclosure)).

### 5.4 Franja de cifras: `FiguresStrip`

`src/components/sections/FiguresStrip.tsx`, con su CSS en `hero/figures.css`, es un `<dl>` con `aria-label` (`hero.figures.label`): 4 celdas en fila desde 1024 px y 2 × 2 debajo, entre dos reglas de tinta y con líneas finas `paper-3` entre celdas.

| Celda | EN | ES | Origen |
|---|---|---|---|
| 1 | `{quotes}` quote requests on Malone Road Belt since Aug 27 → mientras sea `null`: `{oemBrands}` OEM brands covered on malonebelt.com | `{quotes}` solicitudes de cotización en Malone Road Belt desde el 27 de agosto → mientras sea `null`: `{oemBrands}` marcas OEM que cubre malonebelt.com | `fallback` de la celda; `REVIEW(R-08)` |
| 2 | `{languages}` languages · `{products}` products on malonebelt.com | `{languages}` idiomas · `{products}` productos en malonebelt.com | Cifras de `cases.ts` |
| 3 | 5 business days · to see your free, clickable prototype | 5 días hábiles · para ver tu prototipo navegable, gratis | Texto fijo |
| 4 | From $3,000 · for a store or catalog with quote system | Desde US$ 3.000 · por una tienda o catálogo con cotizador | `pricing.plans[1].price` con `Price`, por mercado |

- **Cada valor** es un número grande en Archivo 800 condensado, con su unidad al lado sobre la misma línea base y una banda sol estática debajo del número, sobre una etiqueta mono. Los números se ajustan al ancho de su celda con unidades de contenedor (`min(4.5rem, 28cqi)`), así que el más largo cabe en una celda de 2 × 2 a 280 px.
- **Los importes en COP** van un paso más chicos, para que "COP 3.000.000" nunca se parta.
- **Cada celda es un `subgrid` de 2 filas,** así los valores comparten línea base aunque una etiqueta ocupe más líneas.
- **Una celda cuya cifra es `null`** muestra su `fallback` en el mismo lugar o se omite: nunca queda un hueco. Cuando exista la cifra de cotizaciones, reemplaza a la de marcas OEM sin tocar el código.
- **No se anima:** las cifras son definitivas desde el primer pintado. En la fase B, la banda sol se dibuja al hacer scroll ([ADR-023](./14-decisiones.md#adr-023)).

## 6. Guardas de rendimiento

| Riesgo | Guarda | Cómo se verifica |
|---|---|---|
| **LCP tardío.** Un elemento con `opacity: 0` que aparece después puede registrarse como LCP en el repintado; animar el titular desde 0 puede incluso dar `NO_LCP` ([DebugBear](https://www.debugbear.com/blog/opacity-animation-poor-lcp), [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_08_lcp.md)) | H1, subtítulo, CTAs y cifras **nunca** se animan y son visibles desde el primer pintado. Del H1 solo entran el tachado y el marcador, que son pseudoelementos vacíos: el texto se pinta completo en el primer fotograma. La cuadrícula es un degradado CSS, y los degradados no son candidatos a LCP. **En teléfonos el elemento LCP es el subtítulo, no el H1:** el H1 son dos líneas de 40 px al 62 % de ancho (16–23 mil px²) y el subtítulo ocupa más (30–40 mil px²), medido el 24-oct de 360 a 412 px en ambos idiomas. Los dos son texto estático que se pinta en el primer fotograma | DevTools → Performance → el elemento LCP es el `<h1>` o el subtítulo en celular y tableta, y la captura del hero o el H1 en escritorio. En ningún caso un elemento animado |
| **Imágenes del hero en celular** ([ADR-021](./14-decisiones.md#adr-021)) | La captura del navegador lleva `hideBelow={1024}`: debajo de ese ancho gana un `<source>` con un GIF en blanco de 1 × 1 en `data:`, así que no se descarga, y el CSS la oculta. Su `preload` lleva `media="(min-width: 1024px)"`. El marco de celular va después de la franja de cifras, bajo el pliegue (909–995 px de 280 a 412 px de ancho, con un viewport de 823 px). Ninguna captura entra con fundido | En *Network*, a 390 px: no aparece ningún `home-desktop-*`. Lighthouse móvil: el elemento LCP es texto |
| **Imágenes del hero en escritorio** | La captura del navegador puede ser el LCP: es `eager`, con `fetchpriority="high"` y precargada con el mismo `sizes`, y tiene `width` y `height` del manifiesto. Con el marco a 624 CSS px elige el archivo de 1280 px (48 KB en AVIF) con DPR 2 y el de 640 px (19 KB) con DPR 1; el más grande, de 1600 px, pesa 65 KB, dentro del presupuesto de 80 KB | Lighthouse escritorio: LCP 0,6 s (24-oct) |
| **CLS** | El escenario es una caja 4:3; la escena se escala con `transform`, los hijos van en `position: absolute` y hay `contain: layout paint`. Los marcos de dispositivo tienen la proporción de la captura (`aspect-ratio`), así que el espacio se reserva antes de que llegue la imagen. Las decoraciones del H1 van en `position: absolute` dentro de cada palabra. Solo se animan `transform`, `opacity` y `clip-path` | CLS ≤ 0,02 en PSI; panel *Layout Shifts* vacío. Lighthouse el 24-oct: 0,003 en celular y 0 en escritorio |
| **CLS por la fuente** | El H1 usa Archivo al 62 % de ancho, y ninguna fuente del sistema es tan angosta: con Arial tal cual, el H1 pasa de 2 a 3 líneas (de 76 a 114 px de alto a 375–390 px, y de 224 a 336 px a 1280 px). **Guarda aplicada:** Archivo va precargada y con `display: 'swap'`, y cada rol angosto tiene su respaldo en `globals.css`: Arial (Roboto en Android) con `size-adjust` de 76,5 % para el 62 % y de 88 % para el 75 %, con `ascent-override` y `descent-override` corregidos. El respaldo ocupa las mismas líneas, así que el cambio de fuente no mueve nada. Medido el 24-oct de 280 a 1440 px en ambos idiomas: el H1 coincide en todos los anchos menos 304 px (en), y los títulos de la política y del 404, en todos menos 328 px (es). Roboto queda a ±1,5 % del ancho de Arial. **Se descartó `display: 'optional'`:** en carga en frío por debajo de ~20 Mbps la visita se quedaba toda con Arial. Plex Mono queda en `swap` y sin precarga, en un solo peso (500), porque solo aparece en etiquetas que no mueven la primera pantalla | Con los `woff2` bloqueados (DevTools → *Network* → *Block request URL*), el H1 conserva sus 2 líneas a 390 y 1280 px. En carga en frío a 9, 4 y 1,6 Mbps (24-oct), Archivo llegó siempre y el CLS fue 0; a 1,6 Mbps, 0,001 por el header |
| **Peso** | `hook.css` + `headline.css` ≤ 6 KB minificados y SVG inline ≤ 8 KB: total ≤ 15 KB sin comprimir (límite del roadmap: 50 KB). El CSS nuevo del hero (`showcase.css` y `figures.css`) suma ~5 KB sin comprimir | Inspeccionar el HTML y el CSS del build |
| **Hilo principal** | `transform` y `opacity` corren en el compositor, también en las decoraciones del H1. `clip-path` solo se usa en el morph (800 ms). El disparo del escenario es una animación ligada al scroll, también en el compositor | TBT ≈ 0 en PSI |

**Medido en R-11** (24-oct; Lighthouse 12.8 en local, con brotli; móvil emulado). La columna que cuenta es HTTP/2, como sirve Cloudflare ([11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento)):

| Página | LCP móvil, HTTP/2 | LCP móvil, HTTP/1.1 | Elemento LCP | LCP escritorio |
|---|---|---|---|---|
| `/es` y `/en` | **2,15 s** (FCP 1,05 s) | 2,8 s (FCP 1,4 s) | El subtítulo | 0,6 s, la captura del hero |
| Los dos casos | **2,0 s** | 2,6 s | El resumen del hero | 0,6 s, la captura del hero |

- Sobre HTTP/1.1, la simulación cobra una conexión por cada una de las 5 hojas de estilo; esa cifra no se compara con producción. La base F1-12, medida igual ese día, daba 2,6 s en la home.
- **Prueba:** con `experimental.inlineCss` de Next, el LCP móvil sobre HTTP/1.1 bajó a 2,5 s. Se revirtió: sobre HTTP/2 no hace falta y cambiar `next.config.ts` necesita un ADR.
- **La aceptación sigue siendo PSI en producción** ([ADR-016](./14-decisiones.md#adr-016)), en R-11 y después de publicar.

## 7. Accesibilidad

- **Escenario y marcos decorativos para lectores de pantalla.** El escenario lleva `aria-hidden="true"` y `tabIndex={-1}`: su mensaje ya está en el título y el texto del bloque B, y su destino es la página del caso, que ya tiene enlaces visibles. El enlace que cubre los marcos del hero sigue la misma regla, porque el CTA secundario lleva al mismo lugar; las capturas conservan su `alt`. `title` da el tooltip para mouse.
- **Reducir movimiento:** sin animaciones, con el estado final visible (§4). Tampoco suben los marcos al pasar el mouse.
- **Pausa no requerida:** WCAG 2.2.2 pide un control de pausa para movimiento automático de más de 5 s; el escenario dura 4,2 s, no se repite y arranca con el scroll del visitante.
- **Contraste** ([06 §3.1](./06-secciones-y-ui.md#31-color)):
  - La respuesta gris "Call for pricing" usa `ink-2` `#4A5069` sobre `paper-3` `#E1D7C3`: 5,6:1, por encima del 4,5:1 exigido.
  - La frase tachada del H1 va en `ink-3`: 4,5:1 sobre papel, cuando el texto grande pide 3:1. El trazo de tinta va encima de las letras, como un tachado real (25-oct; antes iba detrás); el gris de la frase y el trazo de 0,075em la mantienen legible.
  - El marcador sol queda detrás de texto en tinta: 12,2:1. La banda sol de las cifras, igual.
- **Nombre accesible del H1:** las decoraciones son pseudoelementos vacíos, así que se lee la oración completa, "De “precio por interno” a “agregar al carrito”.". Se verificó en el árbol de accesibilidad de Chrome. Si se cambia el marcado, hay que revisar que Chrome no una las palabras ("precioporinterno"); eso pasó en una versión que no conservaba los espacios.
- **Cifras:** la franja es una lista de definiciones (`<dt>` la etiqueta, `<dd>` el valor). Entre el número y su unidad hay un espacio real, para que no se lea "5días".
- **Sin destellos:** nada parpadea más de 3 veces por segundo (WCAG 2.3.1).

## 8. Responsive y orden visual

- **Orden del DOM:** H1 → subtítulo → CTAs → línea de confianza → franja de cifras → marcos. Es el orden de lectura y de foco, y en celular también el visual.
- **Escritorio (≥ 1024 px):** rejilla de 12 columnas. El H1 ocupa las 12 en la fila 1; el texto, 5 en la fila 2; los marcos, 7 en la fila 2 (de la columna 6 a la 12); y la franja de cifras, las 12 en la fila 3. Los marcos se ubican por `grid-column` y `grid-row`, sin `order`, y no son enfocables (§7).
- **Celular y tableta (< 1024 px):** una columna en el orden del DOM. Solo se ve el marco de celular, de `min(16rem, 66%)` de ancho y centrado, con su línea discontinua y la leyenda debajo.
- **Escenario (bloque B de Servicios):** en celular va segundo, después del bloque A; en tableta comparte fila con el bloque C; desde 1024 px ocupa 1 columna y 2 filas ([06 §2](./06-secciones-y-ui.md#2-contenido-por-sección)). La escena escala con el ancho del bloque hasta 1,25×.
- **H1:** mide 40 px como mínimo (`text-display`). La variante `a` cabe en 2 líneas desde 320 px en ambos idiomas, y usa 3 líneas a 280 px. Las frases decoradas pueden partirse en dos líneas; por eso el trazo va en cada palabra (§4).
- **Barra fija:** 56 px. El hero empieza con el alto de la barra más 32 px (más 64 px desde 1024). `scroll-padding-top: 72px` en `html` evita que el foco o los anclajes queden tapados (WCAG 2.4.11).
- **Sin scroll horizontal:** la sección recorta `overflow-x` (`overflow-x-clip`), así que el brillo, la línea discontinua y el celular que sobresale nunca ensanchan la página. Revisado de 280 a 1440 px en ambos idiomas.

## 9. Fallos y degradación

| Situación | Resultado |
|---|---|
| Sin JavaScript | Todo funciona igual: el H1, el escenario y su disparo son CSS, y los marcos son HTML |
| "Reducir movimiento" activado | Estado final estático en el H1 y el escenario; los marcos no suben al pasar el mouse |
| Navegador sin animaciones ligadas al scroll o sin consultas de estilo (Firefox hoy) | El escenario se reproduce al cargar y, cuando el visitante llega a Servicios, ya muestra la escena final |
| Un ancestro del escenario con `overflow: hidden` o `auto` | El escenario se reproduce al cargar: mismo resultado que la fila anterior |
| CSS de animación sin cargar o navegador antiguo | Estado final estático |
| Sin CSS (caso extremo) | HTML legible: titular, cifras, textos del escenario, imágenes y enlaces |
| Falta una captura en el manifiesto | Su marco no se dibuja y el layout se reacomoda; sin las dos, el hero queda con texto y cifras |
| Archivo llega tarde o no llega | Mientras tanto se ve el respaldo ajustado (Arial o Roboto, más pequeña), con las mismas líneas en el H1. Cuando llega Archivo cambia el dibujo de las letras, no el layout. La siguiente visita ya la tiene en caché |
| Pestaña en segundo plano al cargar | El navegador puede pausar o completar la animación; al volver se ve el estado final o el final de la secuencia |

## 10. Pruebas

- **Manual (R-11):**
  - Chrome, Safari en Mac y en iPhone real, y Firefox.
  - **Safari 26 en Mac y en iPhone es obligatorio para el escenario:** si no actualiza la consulta de estilo al hacer scroll, el escenario se queda en su punto de partida, casi vacío. Si pasa, la salida es una isla mínima (≤ 0,4 KB) que marque el escenario cuando entra en vista.
  - DevTools → *Rendering* → *Emulate CSS prefers-reduced-motion*.
  - DevTools → *Performance*: confirmar que el elemento LCP es el H1 o, en teléfonos, el subtítulo, y que no está animado.
  - *Network* a 390 px: ningún `home-desktop-*` descargado.
  - Grabar en *Slow 4G* para revisar el CLS.
  - El tachado y el marcador del H1 en Chrome, Safari y Firefox, a 320 px, 390 px y en escritorio, en ambos idiomas. Al 24-oct solo se probaron en Chrome.
  - El escenario: queda en pausa bajo el pliegue, arranca con ~60 % a la vista y termina en ~4,2 s (verificado en Chrome el 24-oct, en un arnés aislado).
- **Automática, v1.1, Playwright:**
  - Captura con `reducedMotion: 'reduce'`, y otra con movimiento normal después de 5 s, con el escenario ya en vista.
  - **Ambas deben coincidir, con una tolerancia pequeña** (por ejemplo, `maxDiffPixels: 50`). El antialiasing de las decoraciones del H1 deja unos 27 píxeles distintos (medido el 24-oct). Una diferencia mayor indica que se rompió el patrón de estado final primero.
  - Un test que verifica que el `<h1>` es visible en el primer fotograma (sin `opacity: 0`).

## 11. Corte por tiempo

- **Presupuesto:** 2 h para la secuencia completa (tarea F1-02 del [plan](./13-plan-de-implementacion.md)).
- **Si a las 1,5 h no está lista,** se elimina el paso del cursor y del carrito (3,0–3,6 s) y se publica la versión mínima: chat → ficha → aviso de pedido. El guion sigue entendiéndose y el resto se agrega en la v1.1.

## 12. Producto y marca ficticios

- **Producto del nicho.** Un producto genérico del nicho industrial y B2B, como una correa en V B48, un rodamiento 6204 o una manguera hidráulica. Encaja mejor con MRB que un producto de consumo.
- **Texto de la burbuja.** El roadmap sugiere "¿precio del bulto de…?"; hoy dice "Hola, ¿precio de 20 correas B48?". En inglés, "Hi, how much for 20 V-belts?".
- **Marca.** Inventa un nombre (por ejemplo, "Norvale Supply") y **verifica** que no exista: búsqueda en Google, [USPTO](https://tmsearch.uspto.gov/) y [SIC](https://www.sic.gov.co/) para marcas en Colombia. Sin logos ni colores de marcas reales.
- **Precio.** Plausible para el producto, por ejemplo "$14.90 / unit" y su equivalente en COP. Se muestra con `data-only-market` (§5).
- **Junto al trabajo real.** El titular habla de "agregar al carrito" al lado de las capturas de MRB, que no tiene carrito: su cotizador pide un producto con su urgencia. El titular describe lo que ofreces, no lo que hace MRB; revisa que se lea así, también en la imagen OG ([08 §3](./08-seo.md#3-imágenes-open-graph)).

## Fuentes

- [DebugBear: animaciones de opacidad y LCP](https://www.debugbear.com/blog/opacity-animation-poor-lcp)
- [Chromium: cambios de LCP en M86](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_08_lcp.md)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: `animation-timeline: view()`](https://developer.mozilla.org/docs/Web/CSS/animation-timeline/view) y [consultas de estilo de contenedor](https://developer.mozilla.org/docs/Web/CSS/CSS_containment/Container_size_and_style_queries)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Motion: tamaño del bundle](https://motion.dev/docs/react-reduce-bundle-size) (alternativa descartada)
- [web.dev: qué elementos cuentan para el LCP](https://web.dev/articles/lcp) (las imágenes de fondo con `url()` cuentan; los degradados, no)

Consultadas el 3-oct-2026; web.dev, MDN y las mediciones, el 24-oct-2026.
