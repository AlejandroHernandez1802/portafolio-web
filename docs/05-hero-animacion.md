# 05 · Hero y animación del hook A

El hook A es una animación de 4,2 s hecha solo con CSS sobre HTML y SVG renderizados en el servidor. Pesa 0 KB de JavaScript y menos de 15 KB en total, frente al límite de 50 KB del roadmap.

El principio de diseño es **"el estado final primero"**: el CSS base pinta la escena terminada y las animaciones solo la hacen *entrar*. Si la animación falla, si el visitante pide reducir movimiento o si el CSS de animación no carga, se ve el estado final sin hacer nada extra.

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

**Escritorio (≥ 1024 px).** El texto ocupa la izquierda y el escenario la derecha. El aviso final queda junto al titular.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Alejandro Hernández · Online stores            ES   [Book a call] │ header fijo
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  From "call for pricing"                 ┌────────────────────┐  │
│  to "add to cart".              (H1)     │  chat → ficha →    │  │
│                                          │  carrito (1)       │  │
│  I build online stores and quote         │                    │  │
│  systems for businesses that sell…       └────────────────────┘  │
│                                          ✓ Order received ·      │
│  [ Book a 15-minute call ]  See the case →   Delivery Thursday   │
│  Built the catalog and quote system for a U.S. industrial…       │
└──────────────────────────────────────────────────────────────────┘
```

**Móvil (375 × 667).** Entre la barra de Safari y el navegador interno de Gmail quedan ~550 px visibles. Por eso el header fijo lleva siempre el CTA compacto, y el escenario va entre el H1 y el subtítulo, con 200 px como máximo.

```text
┌───────────────────────────────┐
│ AH · Online stores  ES [Book] │ 48 px, fijo
├───────────────────────────────┤
│ From "call for pricing"       │
│ to "add to cart".             │ H1 (32–36 px, text-wrap: balance)
│ ┌───────────────────────────┐ │
│ │ chat → ficha → pedido     │ │ escenario ≤ 200 px (espacio reservado)
│ └───────────────────────────┘ │
│ I build online stores and     │ subtítulo
│ quote systems for…            │
│ [ Book a 15-minute call ]     │ CTA principal
│ See the case →                │ CTA secundario
└───────────────────────────────┘
```

## 3. Guion → línea de tiempo técnica

| Tiempo | Qué pasa (roadmap) | Elemento | Animación | Retraso / duración |
|---|---|---|---|---|
| 0,0–1,0 s | Burbuja del cliente: "Hi, how much for…?" / "Hola, ¿precio del bulto de…?" | `.hook__msg--in` | Entra con `opacity` + `translateY(8px)`, se mantiene y sale con el morph | 0 / 2.200 ms |
| 1,0–1,8 s | Respuesta típica en gris: "Call for pricing" / "Precio por interno" | `.hook__msg--out` | Igual que la anterior | 1.000 / 1.200 ms |
| 1,8–3,0 s | La burbuja se transforma en ficha: foto, precio visible y selector de cantidad | `.hook__card` | Entra con `clip-path: inset(...)` + `scale(.92)` + `opacity` mientras las burbujas salen (fundido cruzado) | 1.800 / 800 ms |
| | | `.hook__price`, `.hook__qty` | Entran con `opacity` + `translateY(4px)` | 2.400 y 2.600 / 300 ms |
| 3,0–3,6 s | Un cursor toca "Agregar al carrito" y el carrito marca "1" | `.hook__cursor` | Viaja con `translate`, "presiona" con `scale(.9)` y se desvanece | 3.000 / 700 ms |
| | | `.hook__btn` | Pulsación con `scale(.96)` | 3.300 / 200 ms |
| | | `.hook__badge` | Aparece con `scale(0 → 1)` | 3.400 / 250 ms |
| 3,6–4,2 s | "Order received · Delivery Thursday" / "Pedido recibido · Entrega el jueves" queda fijo | `.hook__toast` | Entra con `opacity` + `translateY(8px)` | 3.600 / 500 ms |

Fin de la secuencia: ≈ 4,1–4,2 s. Ningún elemento repite.

## 4. Implementación: el estado final primero

Las reglas que hacen funcionar el patrón:

1. **El CSS base es el estado final.** Ficha visible, precio y cantidad visibles, carrito con "1", aviso visible. Las burbujas y el cursor quedan ocultos (`opacity: 0`), porque al final de la historia ya no están.
2. **Cada animación declara solo el estado inicial**, o una secuencia que **termina igual que la base**.
3. **Siempre `animation-fill-mode: both`.** Durante el retraso se aplica el estado inicial (oculto) y al terminar se conserva el último fotograma, que coincide con la base.
4. **Solo se animan `transform`, `opacity` y `clip-path`.** Nada de `width`, `height`, `top` o `margin`, que provocan relayout y CLS.

```css
/* src/components/hero/hook.css (extracto ilustrativo) */
.hook { position: relative; aspect-ratio: 4 / 3; contain: layout paint; }
.hook > * { position: absolute; } /* nada empuja a nada */

.hook [data-anim] {
  animation-duration: var(--d, 300ms);
  animation-delay: var(--t, 0ms);
  animation-timing-function: cubic-bezier(.2, .7, .2, 1);
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

## 5. Estructura del componente

`src/components/hero/HookStage.tsx` es un **Server Component** que recibe `content.hero.stage` y no usa hooks ni estado:

```tsx
<a href={demoStore ? demoUrl : '#caso'} className="hook" aria-hidden="true" tabIndex={-1}
   title={stage.linkTitle}
   data-track={demoStore ? 'demo_open' : undefined} data-track-location="stage">
  <p data-anim className="hook__msg hook__msg--in" style={{ '--t': '0ms', '--d': '2200ms' }}>
    {stage.customerMessage}
  </p>
  <p data-anim className="hook__msg hook__msg--out" style={{ '--t': '1000ms', '--d': '1200ms' }}>
    {stage.businessReply}
  </p>
  <div data-anim className="hook__card" style={{ '--t': '1800ms', '--d': '800ms' }}>
    <ProductIllustration />          {/* SVG inline ≤ 3 KB; nada de <img> */}
    <p className="hook__brand">{stage.product.brand}</p>
    <p className="hook__name">{stage.product.name}</p>
    <p data-anim className="hook__price" style={{ '--t': '2400ms' }}>{/* precio por mercado */}</p>
    <p data-anim className="hook__qty" style={{ '--t': '2600ms' }}>{stage.product.qtyLabel} 20</p>
    <span data-anim className="hook__btn" style={{ '--t': '3300ms', '--d': '200ms' }}>{stage.addToCart}</span>
  </div>
  <CartIcon><span data-anim className="hook__badge" style={{ '--t': '3400ms', '--d': '250ms' }}>1</span></CartIcon>
  <CursorIcon data-anim className="hook__cursor" style={{ '--t': '3000ms', '--d': '700ms' }} />
  <p data-anim className="hook__toast" style={{ '--t': '3600ms', '--d': '500ms' }}>{stage.orderReceived}</p>
</a>
```

- **Textos del escenario:** salen de `content/{en,es}.ts`. El escenario se ve en el idioma de la página.
- **Precio de la ficha:** usa las dos monedas con `data-only-market` ([04 §8.2](./04-i18n-contenido-y-precios.md#82-render-sin-saltos)), así coincide con la sección de precios.
- **Destino del clic:** el escenario es clicable porque la gente intentará tocar el "Add to cart" falso. En la v1 lleva a `#caso`; en la v2, a la demo.

## 6. Guardas de rendimiento

| Riesgo | Guarda | Cómo se verifica |
|---|---|---|
| **LCP tardío.** Un elemento con `opacity: 0` que aparece después puede registrarse como LCP en el repintado; animar el titular desde 0 puede incluso dar `NO_LCP` ([DebugBear](https://www.debugbear.com/blog/opacity-animation-poor-lcp), [Chromium](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_08_lcp.md)) | H1, subtítulo y CTAs **nunca** se animan y son visibles desde el primer pintado. Todo texto del escenario mide ≤ 16 px y ocupa mucho menos área que el H1, incluido "Order received". No hay `<img>`, `<image>` SVG ni `background-image` en el escenario (los trazos SVG inline no compiten por el LCP) | DevTools → Performance → el elemento LCP es el `<h1>` en `/en` y `/es`, en móvil |
| **CLS** | `aspect-ratio` y alto máximo reservados; hijos en `position: absolute`; `contain: layout paint`; solo `transform`, `opacity` y `clip-path` | CLS ≤ 0,02 en PSI; panel *Layout Shifts* vacío |
| **CLS por la fuente** | Una fuente variable con `next/font` y `adjustFontFallback`; `text-wrap: balance` en el H1. Si el H1 salta de línea al cambiar de fuente a 375 px, usar `display: 'optional'` | Grabar la carga con la red en *Slow 4G* |
| **Peso** | `hook.css` ≤ 6 KB y SVG inline ≤ 8 KB: total ≤ 15 KB sin comprimir (límite del roadmap: 50 KB) | Inspeccionar el HTML y el CSS del build |
| **Hilo principal** | `transform` y `opacity` corren en el compositor. `clip-path` solo se usa en el morph (800 ms) | TBT ≈ 0 en PSI |

## 7. Accesibilidad

- **Escenario decorativo para lectores de pantalla.** Lleva `aria-hidden="true"` y `tabIndex={-1}`. El mensaje completo ya está en el H1 y el subtítulo, y su destino es el mismo del CTA secundario, así que los usuarios de teclado no pierden nada. Esto también evita que el orden del foco contradiga el orden visual en móvil (§8). `stage.linkTitle` se usa como `title` (tooltip para mouse).
- **Reducir movimiento:** sin animaciones, con el estado final visible (§4).
- **Pausa no requerida:** WCAG 2.2.2 pide un control de pausa para movimiento automático de más de 5 s; este dura 4,2 s y no se repite.
- **Contraste:** el gris de "Call for pricing" debe cumplir 4,5:1 sobre el fondo de la burbuja. Por ejemplo, `#4B5563` sobre `#F3F4F6` da ≈ 6,9:1 ([06 §3](./06-secciones-y-ui.md#3-sistema-visual)).
- **Sin destellos:** nada parpadea más de 3 veces por segundo (WCAG 2.3.1).

## 8. Responsive y orden visual

- **Orden del DOM:** H1 → subtítulo → CTAs → línea de confianza → escenario. Es el orden de lectura y de foco.
- **Orden visual en móvil:** H1 → escenario → subtítulo → CTAs. Se logra con CSS Grid y `order` solo en el escenario, que no es enfocable (§7).
- **Escritorio:** dos columnas; el escenario a la derecha con `aspect-ratio: 4 / 3`.
- **Móvil:** escenario a todo el ancho, con alto máximo de 200 px. Dentro, todo se escala con `transform`, nunca cambiando medidas.
- **Header fijo:** 48 px, siempre con el CTA compacto. `scroll-padding-top: 64px` en `html` evita que el foco o los anclajes queden tapados (WCAG 2.4.11).

## 9. Fallos y degradación

| Situación | Resultado |
|---|---|
| Sin JavaScript | La animación funciona igual (es CSS) |
| "Reducir movimiento" activado | Estado final estático |
| CSS de animación sin cargar o navegador antiguo | Estado final estático |
| Sin CSS (caso extremo) | HTML legible: titular, textos del escenario como párrafos y enlaces |
| Pestaña en segundo plano al cargar | El navegador puede pausar o completar la animación; al volver se ve el estado final o el final de la secuencia |

## 10. Pruebas

- **Manual, v1:**
  - Chrome, Safari (iPhone real) y Firefox.
  - DevTools → *Rendering* → *Emulate CSS prefers-reduced-motion*.
  - DevTools → *Performance*: confirmar que el elemento LCP es el H1.
  - Grabar en *Slow 4G* para revisar el CLS.
- **Automática, v1.1, Playwright:**
  - Captura con `reducedMotion: 'reduce'`, y otra con movimiento normal después de 5 s.
  - **Ambas deben ser iguales.** Si difieren, se rompió el patrón de estado final primero.
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

Consultadas el 3-oct-2026.
