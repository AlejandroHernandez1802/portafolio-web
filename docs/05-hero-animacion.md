# 05 · Hero y animación del hook A

El hook A es una animación de 4,2 s hecha solo con CSS sobre HTML y SVG renderizados en el servidor. Pesa 0 KB de JavaScript y menos de 15 KB en total, frente al límite de 50 KB del roadmap.

El principio de diseño es **"el estado final primero"**: el CSS base pinta la escena terminada y las animaciones solo la hacen *entrar*. Si la animación falla, si el visitante pide reducir movimiento o si el CSS de animación no carga, se ve el estado final sin hacer nada extra.

Desde el rediseño del 24-oct ([ADR-019](./14-decisiones.md#adr-019)), el H1 también participa en la secuencia y sigue las mismas reglas:

- Tacha la frase vieja a 1,2 s, mientras se ve "Precio por interno".
- Marca la frase nueva con amarillo sol a 3,3 s, cuando el cursor presiona "Agregar al carrito".

El aspecto del escenario y del titular sigue el sistema visual de [06 §3](./06-secciones-y-ui.md#3-sistema-visual).

---

## 1. Objetivo y reglas

Del roadmap (§4):

- **Contenido:** la animación cuenta, sin leer un párrafo, el paso de "precio por interno" a "agregar al carrito".
- **Una sola reproducción** al cargar, sin bucle.
- **Reducir movimiento:** con "reducir movimiento" activado se muestra directamente el estado final.
- **Peso:** SVG, CSS o Framer Motion; menos de 50 KB y sin video.
- **Producto y marca ficticios**, nunca una empresa real.
- **Titular independiente:** se lee aunque la animación no cargue.

## 2. Composición y wireframes

**Escritorio (≥ 1024 px).** El H1 ocupa todo el ancho del contenedor, sobre el fondo de plano. Debajo van el texto a la izquierda y el escenario a la derecha. El aviso final queda dentro del escenario.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Alejandro Hernández · Online stores       Español  [Book a call] │ header fijo, 48 px
├──────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░ cuadrícula de plano ░░░░░░░░░░░░░░░░░░░░░░ │
│  From “call for pricing”                                         │ H1 a todo el ancho
│  to “add to cart”.                                               │ (tachado y marcador)
│                                                                  │
│  I build online stores and quote      ┌──────────────────────┐   │
│  systems for businesses that sell…    │ chat → ficha →       │   │
│                                       │ carrito (1)          │   │ escenario (360 px)
│  [ Book a 15-minute call → ]          │                      │   │
│  See the case →                       │ ✓ Order received ·   │   │
│  ──────────────────────────────       │   Delivery Thursday  │   │
│  ✓ Built the catalog and quote        └──────────────────────┘   │ línea de confianza
│    system for a U.S. industrial…                                 │
└──────────────────────────────────────────────────────────────────┘
```

**Móvil (375 × 667).** Entre la barra de Safari y el navegador interno de Gmail quedan ~550 px visibles. Por eso el header fijo lleva siempre el CTA compacto, y el escenario va entre el H1 y el subtítulo, con 200 px de alto.

```text
┌───────────────────────────────┐
│ Alejandro H…  Español [Book]  │ 48 px, fijo; sin descriptor
├───────────────────────────────┤
│ From “call for pricing”       │
│ to “add to cart”.             │ H1 (40 px mín., 2 líneas)
│ ┌───────────────────────────┐ │
│ │ chat → ficha → pedido     │ │ escenario de 200 px
│ └───────────────────────────┘ │
│ I build online stores and     │ subtítulo
│ quote systems for…            │
│ [ Book a 15-minute call → ]   │ CTA principal
│ See the case →                │ CTA secundario
│ ✓ Built the catalog and…      │ línea de confianza
└───────────────────────────────┘
```

## 3. Guion → línea de tiempo técnica

| Tiempo | Qué pasa (roadmap) | Elemento | Animación | Retraso / duración |
|---|---|---|---|---|
| 0,0–1,0 s | Burbuja del cliente: "Hi, how much for…?" / "Hola, ¿precio del bulto de…?" | `.hook__msg--in` | Entra con `opacity` + `translateY(8px)`, se mantiene y sale con el morph | 0 / 2.200 ms |
| 1,0–1,8 s | Respuesta típica en gris: "Call for pricing" / "Precio por interno" | `.hook__msg--out` | Igual que la anterior | 1.000 / 1.200 ms |
| | En el H1, la frase vieja se tacha de izquierda a derecha | `.headline__strike` (un `::before` por palabra) | `transform: scaleX(0)` → trazo completo, curva lineal | 1.200 / 500 ms, repartidos entre las palabras según su largo |
| 1,8–3,0 s | La burbuja se transforma en ficha: foto, precio visible y selector de cantidad | `.hook__card` | Entra con `clip-path: inset(...)` + `scale(.92)` + `opacity` mientras las burbujas salen (fundido cruzado) | 1.800 / 800 ms |
| | | `.hook__price`, `.hook__qty` | Entran con `opacity` + `translateY(4px)` | 2.400 y 2.600 / 300 ms |
| 3,0–3,6 s | Un cursor toca "Agregar al carrito" y el carrito marca "1" | `.hook__cursor` | Viaja con `translate`, "presiona" con `scale(.9)` y se desvanece | 3.000 / 700 ms |
| | | `.hook__btn` | Pulsación con `scale(.96)` | 3.300 / 200 ms |
| | | `.hook__badge` | Aparece con `scale(0 → 1)` | 3.400 / 250 ms |
| | En el H1, la frase nueva recibe el marcador sol, a la vez que la pulsación | `.headline__mark` (un `::before` por palabra) | `transform: scaleX(0)` → marcador completo, curva lineal | 3.300 / 450 ms, repartidos igual |
| 3,6–4,2 s | "Order received · Delivery Thursday" / "Pedido recibido · Entrega el jueves" queda fijo | `.hook__toast` | Entra con `opacity` + `translateY(8px)` | 3.600 / 500 ms |

Fin de la secuencia: ≈ 4,1–4,2 s. Ningún elemento repite. Todos los tiempos, los del escenario y los del H1, viven en `src/components/hero/timeline.ts` (`TIMELINE`), que usan `HookStage` y `HeroHeadline`. El tachado se calcula a partir de la respuesta y el marcador a partir de la pulsación, así que no se desincronizan si cambia la línea de tiempo.

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
.hook { position: relative; height: 200px; overflow: hidden; contain: layout paint; } /* 300 y 360 px en sm y lg (§8) */
.hook__scene { position: absolute; width: 400px; height: 300px; transform: translate(-50%, -50%) scale(.6667); }
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

/* Reducir movimiento: sin animaciones, se ve la base (estado final) */
@media (prefers-reduced-motion: reduce) {
  .hook, .hook * { animation: none !important; }
}
```

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

`src/components/hero/HookStage.tsx` es un **Server Component** que recibe `content.hero.stage` y no usa hooks ni estado:

```tsx
<a href={demoStore ? demoUrl : '#caso'} className="hook" aria-hidden="true" tabIndex={-1}
   title={stage.linkTitle}
   data-track={demoStore ? 'demo_open' : undefined} data-track-location="stage">
  <span className="hook__corner hook__corner--tl" />  {/* marcas de registro: tl, tr, bl, br */}
  <span className="hook__scene">                      {/* 400 × 300, escalada con transform (§8) */}
    <span data-anim className="hook__msg hook__msg--in" style={at(0, 2200)}>{stage.customerMessage}</span>
    <span data-anim className="hook__msg hook__msg--out" style={at(1000, 1200)}>{stage.businessReply}</span>
    <span data-anim className="hook__card" style={at(1800, 800)}>
      <BeltIllustration />                            {/* SVG inline ≤ 3 KB; nada de <img> */}
      <span className="hook__brand">{product.brand}</span>
      <span className="hook__name">{product.name}</span>
      <span data-anim className="hook__price" style={at(2400)}>{/* precio por mercado + unidad */}</span>
      <span data-anim className="hook__qty" style={at(2600)}>{product.qtyLabel} 20</span>
      <span data-anim className="hook__btn" style={at(3300, 200)}>{stage.addToCart}</span>
    </span>
    <span className="hook__cart">
      <Icon name="cart" />
      <span data-anim className="hook__badge" style={at(3400, 250)}>1</span>
    </span>
    <Cursor />                                        {/* data-anim, at(3000, 700) */}
    <span data-anim className="hook__toast" style={at(3600, 500)}>
      <span className="hook__ok"><Icon name="check" /></span>  {/* círculo verde con check */}
      {stage.orderReceived}
    </span>
  </span>
</a>
```

- **Tiempos:** los `at()` del extracto muestran los valores de la tabla del §3; en el código salen de `TIMELINE` (`at(TIMELINE.reply)`…).
- **Textos del escenario:** salen de `content/{en,es}.ts`. El escenario se ve en el idioma de la página.
- **Precio de la ficha:** usa las dos monedas con `data-only-market` ([04 §8.2](./04-i18n-contenido-y-precios.md#82-render-sin-saltos)), así coincide con la sección de precios.
- **Destino del clic:** el escenario es clicable porque la gente intentará tocar el "Add to cart" falso. En la v1 lleva a `#caso`; en la v2, a la demo.
- **Aspecto** ([06 §3](./06-secciones-y-ui.md#3-sistema-visual)):
  - El fondo es tinte cobalto (`accent-50`) con una cuadrícula de 24 px, un marco de tinta de 1 px y cuatro marcas de esquina, como un pliego de imprenta.
  - Ficha en papel con radio de 8 px y `shadow-2`, marca en mono, precio condensado con cifras tabulares y campo de cantidad en mono.
  - Botón y insignia en cobalto.
  - Aviso en tinta oscura con un círculo verde de check.
  - Solo la interfaz dibujada dentro del escenario es redondeada.

`src/components/hero/HeroHeadline.tsx` también es un Server Component, sin `'use client'`. Recibe el titular activo y lo parte por las comillas tipográficas. La primera frase entre comillas se tacha y la segunda se marca:

```tsx
<h1 id="inicio-title" className="text-display stretch-display">
  De <span className="headline__strike">            {/* texto en ink-3 */}
    <span className="headline__word" style={{ '--t': '1200ms', '--d': '200ms' }}>“precio </span>
    <span className="headline__word" style={{ '--t': '1400ms', '--d': '100ms' }}>por </span>
    <span className="headline__word" style={{ '--t': '1500ms', '--d': '200ms' }}>interno”</span>
  </span> a <span className="headline__mark">{/* “agregar al carrito”, de 3.300 a 3.750 ms */}</span>.
</h1>
```

- **Sin dos frases entre comillas** (variantes `b` y `c`, [04 §7](./04-i18n-contenido-y-precios.md#7-variantes-del-titular)), el H1 se renderiza como texto plano, sin decoraciones.
- **Cada palabra conserva su espacio final.** Así el lector de pantalla recibe la oración como texto corrido, y el trazo cubre los espacios dentro de una misma línea.

## 6. Guardas de rendimiento

| Riesgo | Guarda | Cómo se verifica |
|---|---|---|
| **LCP tardío.** Un elemento con `opacity: 0` que aparece después puede registrarse como LCP en el repintado; animar el titular desde 0 puede incluso dar `NO_LCP` ([DebugBear](https://www.debugbear.com/blog/opacity-animation-poor-lcp), [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_08_lcp.md)) | H1, subtítulo y CTAs **nunca** se animan y son visibles desde el primer pintado. Del H1 solo entran el tachado y el marcador, que son pseudoelementos vacíos: el texto se pinta completo en el primer fotograma. Los textos del escenario ocupan mucho menos área que el H1, incluido "Order received". No hay `<img>`, `<image>` SVG ni fondos con `url()`. La cuadrícula es un degradado CSS, y los degradados no son candidatos a LCP. Los trazos SVG inline tampoco compiten. **En teléfonos el elemento LCP es el subtítulo, no el H1:** el H1 son dos líneas de 40 px al 62 % de ancho (16–23 mil px²) y el subtítulo ocupa más (30–40 mil px²), medido el 24-oct de 360 a 412 px en ambos idiomas; ya pasaba antes del rediseño. Los dos son texto estático que se pinta en el primer fotograma, así que el tiempo no cambia. Agrandar el H1 no lo resuelve de forma fiable | DevTools → Performance → el elemento LCP es el `<h1>` desde 768 px y, en teléfonos, el `<h1>` o el subtítulo. En ningún caso un elemento animado |
| **CLS** | Alto fijo del escenario en cada corte (§8). La escena se escala con `transform`, los hijos van en `position: absolute` y hay `contain: layout paint`. Las decoraciones del H1 van en `position: absolute` dentro de cada palabra. Solo se animan `transform`, `opacity` y `clip-path` | CLS ≤ 0,02 en PSI; panel *Layout Shifts* vacío |
| **CLS por la fuente** | El H1 usa Archivo al 62 % de ancho, y ninguna fuente del sistema es tan angosta: con Arial tal cual, el H1 pasa de 2 a 3 líneas (de 76 a 114 px de alto a 375–390 px, y de 224 a 336 px a 1280 px). **Guarda aplicada:** Archivo va precargada y con `display: 'swap'`, y cada rol angosto tiene su respaldo en `globals.css`: Arial (Roboto en Android) con `size-adjust` de 76,5 % para el 62 % y de 88 % para el 75 %, con `ascent-override` y `descent-override` corregidos. El respaldo ocupa las mismas líneas, así que el cambio de fuente no mueve nada. Medido el 24-oct de 280 a 1440 px en ambos idiomas: el H1 coincide en todos los anchos menos 304 px (en), y los títulos de la política y del 404, en todos menos 328 px (es). Roboto queda a ±1,5 % del ancho de Arial. **Se descartó `display: 'optional'`:** en carga en frío por debajo de ~20 Mbps la visita se quedaba toda con Arial, y el sitio es de una sola página. Plex Mono queda en `swap` y sin precarga, en un solo peso (500), porque solo aparece en etiquetas que no mueven la primera pantalla | Con los `woff2` bloqueados (DevTools → *Network* → *Block request URL*), el H1 conserva sus 2 líneas a 390 y 1280 px. En carga en frío a 9, 4 y 1,6 Mbps (24-oct), Archivo llegó siempre y el CLS fue 0; a 1,6 Mbps, 0,001 por el header |
| **Peso** | `hook.css` + `headline.css` ≤ 6 KB minificados (≈ 4,7 + 0,7 KB el 24-oct) y SVG inline ≤ 8 KB: total ≤ 15 KB sin comprimir (límite del roadmap: 50 KB) | Inspeccionar el HTML y el CSS del build |
| **Hilo principal** | `transform` y `opacity` corren en el compositor, también en las decoraciones del H1. `clip-path` solo se usa en el morph (800 ms) | TBT ≈ 0 en PSI |

## 7. Accesibilidad

- **Escenario decorativo para lectores de pantalla.** Lleva `aria-hidden="true"` y `tabIndex={-1}`. El mensaje completo ya está en el H1 y el subtítulo, y su destino es el mismo del CTA secundario, así que los usuarios de teclado no pierden nada. Esto también evita que el orden del foco contradiga el orden visual en móvil (§8). `stage.linkTitle` se usa como `title` (tooltip para mouse).
- **Reducir movimiento:** sin animaciones, con el estado final visible (§4).
- **Pausa no requerida:** WCAG 2.2.2 pide un control de pausa para movimiento automático de más de 5 s; este dura 4,2 s y no se repite.
- **Contraste** ([06 §3.1](./06-secciones-y-ui.md#31-color)):
  - La respuesta gris "Call for pricing" usa `ink-2` `#4A5069` sobre `paper-3` `#E1D7C3`: 5,6:1, por encima del 4,5:1 exigido.
  - La frase tachada del H1 va en `ink-3`: 4,5:1 sobre papel, cuando el texto grande pide 3:1. El trazo de tinta va detrás de las letras, así que la frase sigue legible.
  - El marcador sol queda detrás de texto en tinta: 12,2:1.
- **Nombre accesible del H1:** las decoraciones son pseudoelementos vacíos, así que se lee la oración completa, "De “precio por interno” a “agregar al carrito”.". Se verificó en el árbol de accesibilidad de Chrome. Si se cambia el marcado, hay que revisar que Chrome no una las palabras ("precioporinterno"); eso pasó en una versión que no conservaba los espacios.
- **Sin destellos:** nada parpadea más de 3 veces por segundo (WCAG 2.3.1).

## 8. Responsive y orden visual

- **Orden del DOM:** H1 → subtítulo → CTAs → línea de confianza → escenario. Es el orden de lectura y de foco.
- **Orden visual en móvil:** H1 → escenario → subtítulo → CTAs → línea de confianza. Se logra con `grid-template-areas` (`h1`, `stage`, `copy`), sin `order`. El escenario no es enfocable (§7).
- **Escritorio (≥ 1024 px):** el H1 ocupa las dos columnas. Debajo van el texto a la izquierda y el escenario a la derecha (`'h1 h1' 'copy stage'`).
- **Alto del escenario.** La escena se dibuja a 400 × 300 y se escala con `transform`, nunca cambiando medidas:

  | Ancho | Alto del escenario | Escala de la escena |
  |---|---|---|
  | < 640 px | 200 px (presupuesto móvil) | 0,67× |
  | 640–1023 px | 300 px | 1× |
  | ≥ 1024 px | 360 px | 1,2× |

- **H1:** mide 40 px como mínimo (`text-display`). La variante `a` cabe en 2 líneas desde 320 px en ambos idiomas, y usa 3 líneas a 280 px. Las frases decoradas pueden partirse en dos líneas; por eso el trazo va en cada palabra (§4).
- **Header fijo:** 48 px, siempre con el CTA compacto. `scroll-padding-top: 64px` en `html` evita que el foco o los anclajes queden tapados (WCAG 2.4.11).

## 9. Fallos y degradación

| Situación | Resultado |
|---|---|
| Sin JavaScript | La animación funciona igual (es CSS) |
| "Reducir movimiento" activado | Estado final estático |
| CSS de animación sin cargar o navegador antiguo | Estado final estático |
| Sin CSS (caso extremo) | HTML legible: titular, textos del escenario y enlaces |
| Archivo llega tarde o no llega | Mientras tanto se ve el respaldo ajustado (Arial o Roboto, más pequeña), con las mismas líneas en el H1. Cuando llega Archivo cambia el dibujo de las letras, no el layout. La siguiente visita ya la tiene en caché |
| Pestaña en segundo plano al cargar | El navegador puede pausar o completar la animación; al volver se ve el estado final o el final de la secuencia |

## 10. Pruebas

- **Manual, v1:**
  - Chrome, Safari (iPhone real) y Firefox.
  - DevTools → *Rendering* → *Emulate CSS prefers-reduced-motion*.
  - DevTools → *Performance*: confirmar que el elemento LCP es el H1 o, en teléfonos, el subtítulo, y que no está animado.
  - Grabar en *Slow 4G* para revisar el CLS.
  - El tachado y el marcador del H1 en Chrome, Safari y Firefox, a 320 px, 390 px y en escritorio, en ambos idiomas. Al 24-oct solo se probaron en Chrome.
- **Automática, v1.1, Playwright:**
  - Captura con `reducedMotion: 'reduce'`, y otra con movimiento normal después de 5 s.
  - **Ambas deben coincidir, con una tolerancia pequeña** (por ejemplo, `maxDiffPixels: 50`). El antialiasing de las decoraciones del H1 deja unos 27 píxeles distintos (medido el 24-oct). Una diferencia mayor indica que se rompió el patrón de estado final primero.
  - Un test que verifica que el `<h1>` es visible en el primer fotograma (sin `opacity: 0`).

## 11. Corte por tiempo

- **Presupuesto:** 2 h para la secuencia completa (tarea F1-02 del [plan](./13-plan-de-implementacion.md)).
- **Si a las 1,5 h no está lista,** se elimina el paso del cursor y del carrito (3,0–3,6 s) y se publica la versión mínima: chat → ficha → aviso de pedido. El guion sigue entendiéndose y el resto se agrega en la v1.1.

## 12. Producto y marca ficticios

- **Producto del nicho.** Un producto genérico del nicho industrial y B2B, como una correa en V B48, un rodamiento 6204 o una manguera hidráulica. Encaja mejor con MRB que un producto de consumo.
- **Texto de la burbuja.** El roadmap sugiere "¿precio del bulto de…?"; se puede cambiar por "¿precio de la correa B48?" si el producto es industrial. En inglés, "Hi, how much for 20 V-belts?".
- **Marca.** Inventa un nombre (por ejemplo, "Norvale Supply") y **verifica** que no exista: búsqueda en Google, [USPTO](https://tmsearch.uspto.gov/) y [SIC](https://www.sic.gov.co/) para marcas en Colombia. Sin logos ni colores de marcas reales.
- **Precio.** Plausible para el producto, por ejemplo "$14.90 / unit" y su equivalente en COP. Se muestra con `data-only-market` (§5).

## Fuentes

- [DebugBear: animaciones de opacidad y LCP](https://www.debugbear.com/blog/opacity-animation-poor-lcp)
- [Chromium: cambios de LCP en M86](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_08_lcp.md)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Motion: tamaño del bundle](https://motion.dev/docs/react-reduce-bundle-size) (alternativa descartada)
- [web.dev: qué elementos cuentan para el LCP](https://web.dev/articles/lcp) (las imágenes de fondo con `url()` cuentan; los degradados, no)

Consultadas el 3-oct-2026; web.dev, el 24-oct-2026.
