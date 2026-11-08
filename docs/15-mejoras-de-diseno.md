# 15 · Mejoras de diseño con el skill frontend-craft

Auditoría del sitio publicado frente al skill `frontend-craft` (`.claude/skills/frontend-craft/SKILL.md`, v1.0.0, con su lista de señales de diseño genérico calibrada a noviembre de 2026). Propone mejoras concretas, priorizadas y compatibles con las reglas del proyecto: export estático, 0 KB de JS para el movimiento, sin librerías de UI y copy en `content/{en,es}.ts`.

| | |
|---|---|
| Fecha | 8 de noviembre de 2026, un día después de la publicación (F1-10) y antes de la fase B (9 al 15 de noviembre) |
| Método | Fases 0 a 3 del skill: lectura del repositorio y de los docs 05, 06, 11, 13 y 14; capturas de `alejandrodeveloper.com/es` y del caso MRB a 390 × 844, 768 × 1024 y 1440 × 900, tomadas con Chrome headless y la emulación de `scripts/lib/cdp.mjs`; búsquedas en el código contra el piso de calidad del skill |
| Estado | **En curso.** El 8-nov se hicieron D-01, D-02, D-05 y D-07 y, con el [ADR-027](./14-decisiones.md#adr-027) aprobado ese día, D-03, D-04, D-06, D-08, D-09 y D-10 (ver §6). Quedan D-11 a D-14 |

---

## Resumen

- **El sitio ya está por encima del piso de calidad del skill** en lo que más cuesta: LCP de texto en celular, respaldos de fuente sin salto de layout, contrastes calculados, foco visible, "reducir movimiento", objetivos táctiles y ningún scroll horizontal a 390 px (verificado el 8-nov: `scrollWidth` = 390). El concepto "plano técnico" sale del mundo del cliente (catálogos, referencias OEM, planos), que es justo lo que pide el skill.
- **El problema es de disciplina, no de dirección.** El sistema aplica sus recursos en todas partes, y eso los convierte en decoración: hay 37 usos de `label-mono` (etiquetas mono en mayúsculas), un índice "01–05" sobre cada sección, preguntas frecuentes y pie numerados, flechas en casi todos los enlaces y el amarillo sol en ocho lugares distintos. Son cinco de las señales que el skill marca como genéricas. Si se reservan para cuando cuentan algo, el plano vuelve a parecer un plano.
- **El trabajo real está poco presente en la home.** Fuera del hero, la sección de Trabajo muestra chips y miniaturas de 80 px; la tarjeta grande del caso solo existe en `/trabajos`. En un portafolio el contenido es el espectáculo.
- **Hay que decidir antes de R-16.** La fase B dibuja con el scroll la regla de cada H2 y el marcador bajo cada cifra: justo los elementos que esta propuesta reduce. Conviene aprobar o descartar el ADR-027 (§7) antes del 12 de noviembre.
- **Un beneficio de rendimiento probable.** Si la primera pantalla deja de usar mono, IBM Plex Mono sale de la ruta crítica, que hoy comparte con Archivo ([11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento)). Con un LCP móvil de 2,15 s frente a un límite de 2,5 s, ese margen sirve. Hay que medirlo; no está garantizado.

## 1. Qué pide el skill, en una página

El skill trabaja en cuatro fases con compuertas:

1. **Leer el contexto.** Stack, tokens existentes (nunca un segundo sistema en paralelo), tema, público, trabajo principal de la página y modo: *Persuadir*, *Operar*, *Leer* o *Exhibir*.
2. **Plan de diseño antes del código.** Dirección, paleta con roles, tipografía, espaciado, layout con wireframe, presupuesto de movimiento y tres principios. Después, la **prueba del valor por defecto**: "¿haría esto para cualquier brief parecido?". Si la respuesta es sí, se cambia.
3. **Construir** tokens → componentes → páginas, con contenido real.
4. **Verificar mirando.** Capturas a 390, 768 y 1440 px, claro y oscuro, con "reducir movimiento"; axe con `wcag22aa`; Lighthouse. Se corrigen los 3 peores problemas, como máximo en 3 pasadas, y en la última se quita un elemento decorativo que no se gane su lugar.

Al cerrar, un reporte breve y un `DESIGN.md` en la raíz para que la siguiente sesión extienda el diseño en vez de reinventarlo.

Su lista de cosas que evitar no prohíbe nada. Dice que cada recurso es legítimo si el brief lo pide, pero no como punto de partida sin examinar. **El brief siempre gana:** por eso este documento no propone cambiar la paleta ni la tipografía de [ADR-019](./14-decisiones.md#adr-019).

## 2. Lectura del sitio (fase 0)

| Hecho | Valor |
|---|---|
| Tema | Tiendas y catálogos con cotizador para pymes que venden productos |
| Público | Dueños y encargados de proveedores (industriales y de materiales) en EE. UU. y Colombia, que hoy cotizan por teléfono o WhatsApp |
| Trabajo principal | Que el visitante crea que el trabajo es real y agende la llamada de 15 minutos |
| Modo | **Persuadir** en la home y en Servicios (el diseño es el producto); **Exhibir** en Trabajo y en los casos (el trabajo es el espectáculo y el cromo se calla) |

## 3. Lo que ya funciona y no se toca

- **El H1** tacha "precio por interno" y marca "agregar al carrito". Es el único momento de máxima intensidad y cuenta la propuesta de valor sin leer el subtítulo.
- **Capturas reales en marcos dibujados en CSS**, sin fotos de stock. Datos ficticios en los formularios.
- **La página del caso**, con los resultados primero, el antes y después y "Qué construí" alternando lados. Es la página más sólida del sitio.
- **Página plana con sombras solo en los objetos** (marcos, ficha y panel del menú), radios rectos por defecto y radios redondos solo en lo dibujado. Coincide con la regla del skill de no meter todo en tarjetas iguales.
- **El piso de accesibilidad:** foco de 2 px de tinta o sol según la banda, `scroll-padding-top` por la barra fija, objetivos de ≥ 44 px, `<details>` y Popover nativos, `aria-hidden` en el cromo y `alt` obligatorios en el build.
- **El piso de rendimiento:** LCP de texto en celular, `hideBelow` para no descargar capturas de escritorio, respaldos de fuente con `size-adjust` por rol de ancho, AVIF con presupuesto por clave y 0 KB de JS para el movimiento.
- **Los hover de Tailwind 4** ya van dentro de `@media (hover: hover)`, y los de `showcase.css` y `device-frame.css` lo declaran a mano. Nada usa `transition: all` ni `outline: none`.

## 4. Hallazgos y propuestas

Cada hallazgo dice qué se vio, qué regla del skill toca y qué se propone. "ADR" significa que cambia algo decidido en [14](./14-decisiones.md).

### 4.1 Mono, índices, flechas y sol: reservarlos para cuando significan algo

**H1. Etiquetas mono en mayúsculas como disfraz de "técnico".** `label-mono` (12 px, mayúsculas, +0,08 em) aparece 37 veces: encima de cada bloque del bento ("QUE TE ELIJAN"), en las etiquetas de las cifras, en las filas de Trabajo ("QUÉ HE CONSTRUIDO", "INDUSTRIAS"), en la línea de confianza ("COLOMBIA, UTC−5"), en los chips y en los datos del caso. El skill lo nombra dos veces: *"tracked ALL-CAPS eyebrow labels above headings"* y *"monospace as a costume for 'technical'"*.

- **Propuesta:** mono solo para **datos que en el mundo del cliente se escriben en mono**: referencias OEM (`MB-8830-IC`), direcciones (`malonebelt.com`), medidas, zonas horarias y códigos. Todo lo que es una frase pasa a sans, en tipo oración.
- **Concretamente:**
  - Las etiquetas de resultado del bento ("Que te elijan") dejan de ser cejas encima del título. Pueden integrarse en el título ("Catálogo con búsqueda y filtros, para que te elijan") o ir debajo como una línea en `ink-2`. Es copy: la redacción la decides tú.
  - Las etiquetas de las cifras y los rótulos del caso ("Cliente", "Problema", "Mi papel") pasan al nuevo `text-caption` (H5).
  - Los chips de stack y de categoría dejan de ir en mayúsculas.
- ADR (cambia el uso de mono descrito en [06 §3.2](./06-secciones-y-ui.md#32-tipografía); la familia no cambia).

**H2. Índices "01–05" sobre cada sección, preguntas numeradas 01–08 y pie numerado 01–03.** Regla del skill: *numeración solo para secuencias reales*. Las secciones de la home no son pasos, las preguntas tampoco y el pie menos. Hoy el recuadro "01" es lo primero que se lee en cada sección, antes que el título.

- **Propuesta:** quitar `SectionIndex` de los encabezados y dejar solo la regla de tinta sobre el H2, que ya da el ritmo de plano. Quitar los números de las preguntas y del pie.
- **Se quedan:** los numerales de "Cómo trabajo" y los 01–04 de los pasos en Sobre mí (sí son una secuencia) y el "404".
- **Efecto secundario bueno:** desaparece la consecuencia de [ADR-019](./14-decisiones.md#adr-019) de "renumerar cuando llegue la demo".
- ADR (los índices visibles están en ADR-019 y en [06 §1](./06-secciones-y-ui.md#1-mapa-de-secciones)).

**H3. Flechas en casi todo.** El botón principal "Agenda una llamada de 15 minutos" lleva flecha, igual que cada enlace secundario, cada fila de proyecto, cada pregunta frecuente y cada viñeta del panel "Antes". El skill marca *"→ appended to buttons and links"*. Además, la flecha promete "ir a otra página", y dos de esos casos no lo cumplen:

- **La agenda abre un popup de Cal.com,** no navega. Propuesta: sin flecha, o con el ícono de calendario, como ya hace la banda de cierre.
- **Las preguntas frecuentes se despliegan.** Una flecha que gira 90° parece un enlace. Propuesta: un chevron hacia abajo o un "+" que gira 45°, con un ícono nuevo en `ui/Icon.tsx`.
- **Las viñetas del panel "Antes"** son una lista, no navegación. Propuesta: viñeta simple o un guion en `ink-3`.
- **Se quedan** en los enlaces `secondary` que llevan a otra página y en las filas de proyecto.
- Sin ADR: es un ajuste de [06 §3.6](./06-secciones-y-ui.md#36-íconos-y-marca).

**H4. El amarillo sol, diluido.** Hoy aparece en el marcador del H1, bajo cada cifra (franja del hero, tarjeta de caso y resultados), en las viñetas cuadradas del bento, en el punto de la leyenda del hero, en los nodos y numerales del proceso, en los índices del pie, en el botón del cierre, en el anillo de foco sobre azul, en la selección y en el favicon. El skill: *"One place gets the boldness; everything else stays quiet"*. Con ocho apariciones, el marcador del H1 deja de ser "lo importante".

- **Propuesta:** el sol queda solo en **el marcador del H1, el botón principal sobre cobalto, los numerales del proceso, el foco sobre azul, la selección y el favicon**.
- **Sale de:** las viñetas del bento (pasan a tinta o desaparecen con H1), el punto de la leyenda y los índices del pie (desaparecen con H2), y la banda bajo las cifras. La cifra se sostiene sola con Archivo al 62 %; si hace falta un apoyo, una regla de tinta de 2 px.
- ADR (la proporción de color de [06 §3.1](./06-secciones-y-ui.md#31-color) y el marcador de cifras de R-16 en [ADR-023](./14-decisiones.md#adr-023)).

**H5. Texto de contenido a 12 px en mayúsculas.** Las etiquetas de la franja de cifras ocupan hasta 4 líneas a 390 px ("DEL DOMINIO, EL HOSTING Y LAS CUENTAS, A TU NOMBRE"). Son frases, no rótulos. El skill: nunca texto de cuerpo bajo 14 px, nunca UI bajo 12 px; las mayúsculas con tracking se leen peor en frases largas.

- **Propuesta:** un token nuevo en `@theme static`, `--text-caption: 0.875rem` con interlineado 1,4, en Archivo 500 y `ink-2` (7,4:1 sobre papel). Va en las etiquetas de las cifras, los rótulos de datos del caso y la línea de confianza.
- `label-mono` se queda solo para lo corto (≤ 3 palabras) y para los datos de H1.
- Viene con H1; sin ADR propio.

### 4.2 Jerarquía y ritmo

**H6. Un hueco de ~190 px entre el hero y "Trabajo".** El hero termina con `lg:pb-24` y la sección siguiente empieza con `lg:py-24`: 96 + 96 px de papel vacío debajo de la franja de cifras, que a 1440 × 900 se lee como el final de la página. El skill: *"identical padding on every box flattens the page"*. Todas las secciones usan `py-16 lg:py-24`.

- **Propuesta:** espaciado por jerarquía, no uniforme:
  - el hero cierra con `lg:pb-16`, porque la regla de tinta de la franja ya marca el corte;
  - las secciones de contenido conservan 96 px;
  - las bandas de color (`sunken`, `tint`, `ink`, `accent`) pueden ir a 112–128 px, porque el cambio de superficie ya separa.
- Se hace con una prop `rhythm` en `Section` o con `className`. Sin ADR.

**H7. La sección Trabajo de la home tiene la columna izquierda vacía.** A 1440 px, la entrada y el botón "Ver todo mi trabajo" ocupan unos 500 px de alto, y la columna derecha (chips de categorías, chips de industrias y 3 filas de proyectos) unos 1.000 px. Además, las categorías repiten lo que dice Servicios dos secciones después.

- **Propuesta (modo *Exhibir*):**
  - MRB entra como `CaseCard` completa: captura grande en navegador sobre la placa de plano, resultado como título y 3 métricas. El componente ya existe en `/trabajos`.
  - Los dos demos van debajo como filas compactas con miniatura de 160 px, más grande que la de hoy.
  - Salen las filas "Qué he construido" e "Industrias". La industria de cada caso ya está en su fila.
- ADR (la composición de la sección está en [ADR-025](./14-decisiones.md#adr-025)).

**H8. "A tu nombre" aparece tres veces.** Es la cuarta cifra del hero mientras los precios están ocultos, el bloque O del bento ("Dominio, hosting y cuentas a tu nombre") y la primera pregunta frecuente. Repetirlo le quita fuerza.

- **Propuesta:** dejarlo en el bloque O (es su lugar natural, cierra el bento) y en la pregunta frecuente. La cuarta cifra del hero pasa a otro hecho, por ejemplo "1 día hábil" de respuesta, que ya está en Sobre mí.
- Es copy: lo decides tú. Sin ADR.

**H9. Cifras del hero que no le hablan a todo el público.** "29 marcas OEM que cubre malonebelt.com" y "3 idiomas · 15 productos" describen el catálogo de un cliente; a un vivero o a un distribuidor colombiano no le dicen qué ganaría. Esto es contenido de R-08, no diseño, pero el diseño lo amplifica al ponerlo a 88 px.

- **Propuesta:** cuando exista la cifra de cotizaciones, que vaya primera. Mientras tanto, considerar una franja de 3 cifras en vez de 4.
- Sin ADR; afecta `hero.figures` en `content/{en,es}.ts`.

### 4.3 Confianza

**H10. Falta una cara.** La línea de confianza dice "Trabajas directamente conmigo" con un ícono de check en lugar del avatar (R-09 sigue pendiente). Para un freelancer, el retrato es la señal de confianza más barata y más fuerte. El código ya lo soporta (`portrait/avatar`, `portrait/about`).

- **Propuesta:** subir R-09 a prioridad alta. Solo hace falta la foto en `media-raw/portrait/` y `pnpm media:images`.

### 4.4 Movimiento de la fase B

**H11. R-16 anima demasiado.** [ADR-023](./14-decisiones.md#adr-023) relajó, a tu pedido, "un solo momento coreografiado". R-16 suma cuatro revelados ligados al scroll: la regla de cada H2, el marcador bajo cada cifra, la línea de tiempo del proceso y las capturas que suben 16 px. El skill: *"Motion wallpaper: fade-and-slide-up on every section"* y *"scroll-driven effects are opt-in, never a default"*. Aquí son opt-in (lo pediste), pero dos de los cuatro no comunican nada.

- **Propuesta:**
  - **Se queda la línea de tiempo del proceso:** es una secuencia real y llenarla cuenta el avance.
  - **Se queda R-17**, las transiciones de vista entre la tarjeta y el hero del caso: dan continuidad espacial, que es el primer propósito del movimiento según el skill.
  - **Salen** las capturas que suben 16 px y la regla de cada H2.
  - **El marcador bajo las cifras** sale con H4, o queda solo en los resultados del caso, una vez por página.
  - **Orden de recorte de la fase B:** hoy es R-15, R-17 y R-16. Proponemos R-15, luego lo que queda de R-16 y R-17 al final, porque vale más que R-16.
- **Ahorro estimado:** ~0,5 h de R-16, que pueden ir a H7.
- ADR (ajusta ADR-023).

### 4.5 Piso de calidad: pendientes pequeños

**H12. Falta `theme-color` y `color-scheme`.** El skill pide `color-scheme` en `:root` y un `<meta name="theme-color">` que coincida con la página. Hoy no hay ninguno.

- **Propuesta:**
  - `color-scheme: light` en `:root` de `globals.css`: el sitio no tiene modo oscuro ([06 §3.7](./06-secciones-y-ui.md#37-componentes-base)), así que los controles nativos del formulario de la v1.1 no se pintan oscuros en un sistema en modo oscuro.
  - `export const viewport = { themeColor: '#faf6ee' }` en `app/[locale]/layout.tsx`, para que Safari en iPhone tiña su barra con el papel.
  - Antes de escribirlo, verificar la API de `viewport` en `node_modules/next/dist/docs/` (regla de AGENTS.md).
- Sin ADR. Unos 10 minutos.

**H13. Tokens solo primitivos.** Los componentes usan `paper-1`, `ink-2` o `accent-500` directamente. El skill pide tres niveles: primitivo → semántico (`--color-bg`, `--color-fg`…) → componente.

- **Recomendación: no hacerlo ahora.** La capa semántica paga sobre todo cuando hay modo oscuro u otro tema, y ambos están fuera de alcance. Si algún día entra el modo oscuro, ese es el primer paso.

**H14. Formulario de contacto (v1.1).** Es el primer componente con estados de error, carga y éxito del sitio. Que nazca con las reglas del skill, además de las de [11 §3](./11-calidad-rendimiento-y-accesibilidad.md#3-accesibilidad-wcag-22-aa):

- [ ] Una columna, etiquetas encima, *placeholders* solo como pista y terminados en "…".
- [ ] `autocomplete`, `type` e `inputmode` correctos; texto de 16 px o más en celular; `spellcheck="false"` en el correo.
- [ ] Validación al salir del campo y, cuando ya hay un error, en cada tecla. Error junto al campo con `aria-describedby` y `aria-invalid`, y el foco va al primer error al enviar.
- [ ] El botón de enviar **nunca está deshabilitado** para validar. Al enviar muestra un indicador dentro del botón (después de ~150 ms y visible al menos 300 ms) y conserva el verbo ("Enviar mensaje" → "Mensaje enviado").
- [ ] Éxito en una región `aria-live="polite"` que existe desde el inicio. Los errores del servidor, en línea, diciendo qué pasó y qué hacer, sin disculpas.
- [ ] Enter envía; ⌘/Ctrl+Enter envía desde el área de texto. Nunca se bloquea pegar.

### 4.6 Rendimiento

**H15. Plex Mono en la ruta crítica.** [11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento) explica que Plex Mono, aun sin precarga, se pide con prioridad muy alta porque la primera pantalla la usa en la línea de confianza, las etiquetas de las cifras y la leyenda de los marcos.

- **Hipótesis:** con H1 y H5, la primera pantalla queda sin mono (salvo `malonebelt.com` en la barra del marco, que puede ir en sans a ese tamaño). Plex Mono se pediría después del primer pintado y Archivo no competiría con nadie.
- **Medir antes y después** con el método de 11 §2 (HTTP/2, 3 corridas). Si el LCP baja, se documenta en 11; si no, el cambio se justifica igual por legibilidad.

### 4.7 Proceso: verificar mirando, en cada cambio de UI

**H16. No hay capturas de diseño reproducibles.** El QA de la fase A revisó anchos a mano, y Playwright y axe llegan en la v1.1. El skill pide capturas a 390, 768 y 1440 px, con "reducir movimiento", en cada cambio.

- **Propuesta:** `scripts/design-shots.mjs` y `pnpm design:shots [url]`. Reutiliza `scripts/lib/cdp.mjs`, así que no suma dependencias.
  - Toma la home, Trabajo, Servicios, Sobre mí y un caso, en ambos idiomas, a 390 × 844, 768 × 1024 y 1440 × 900, más una pasada a 390 px con `prefers-reduced-motion: reduce` (`Emulation.setEmulatedMedia`).
  - Escribe en `shots/`, que va en `.gitignore`, y avisa si `scrollWidth` > `clientWidth`.
  - **Ojo, lo aprendimos al hacer esta auditoría:** `--window-size=390,…` de Chrome headless no sirve para celular, porque Chrome no baja de ~500 px de ancho de ventana y la captura sale recortada. Hay que emular con `Emulation.setDeviceMetricsOverride`, que es lo que hace `setViewport()` de `cdp.mjs`.
- **axe sin dependencia:** `pnpm design:shots --axe` inyecta axe-core 4.10.2 desde cdnjs por CDP en cada captura y falla si encuentra violaciones. Cero violaciones esperadas. En la v1.1 pasa a `@axe-core/playwright`, como ya dice [11 §4.2](./11-calidad-rendimiento-y-accesibilidad.md#42-v11-automatizadas-en-la-ci).
  - **Lo aprendimos al implementarlo (8-nov):** `npx @axe-core/cli` no sirve aquí, porque su ChromeDriver estaba en Chrome 152 y el Chrome instalado en la 156. Inyectar axe por CDP no depende del driver.
- **Rúbrica para juzgar las capturas** (del skill):
  - ¿La jerarquía se lee en 3 segundos?
  - ¿Hay una sola acción principal por vista?
  - ¿Algo en pantalla aparece en cualquier otra página genérica?
  - ¿Hay desbordes, recortes, palabras huérfanas o bordes desalineados?
  - Máximo 3 pasadas; en la última se quita un elemento decorativo.

**H17. `DESIGN.md` y la línea en `CLAUDE.md`.** El skill pide un `DESIGN.md` en la raíz y una línea en `CLAUDE.md` para que los agentes lo usen.

- **Propuesta:** un `DESIGN.md` corto (≤ 60 líneas) que **no duplique** [06 §3](./06-secciones-y-ui.md#3-sistema-visual), que sigue siendo la fuente de verdad. Lleva:
  - la dirección en una frase;
  - los 3 principios (§5);
  - las reglas de reserva de H1 a H4 (mono, numeración, flechas y sol);
  - el enlace a 06 §3.
- **En `CLAUDE.md`:** "Para trabajo de UI usa el skill frontend-craft; verifica con `pnpm design:shots` y axe."
- **Una sola copia del skill:** hoy está dos veces, en `.claude/skills/frontend-craft` y sincronizada como `anthropic-skills:frontend-craft`, con el mismo contenido. Conviene dejar solo la del proyecto para que no se carguen las dos.

## 5. La prueba del valor por defecto

Varias decisiones del sistema coinciden con la lista del skill. Estas **se quedan** porque salen del tema, no de la costumbre:

| Decisión | Coincide con | Por qué se queda |
|---|---|---|
| Papel crema `#FAF6EE` | "Cream/off-white page" | Es el papel de un catálogo impreso, y la combinación no es la genérica (no hay serif de alto contraste ni acento terracota: es una grotesca condensada con cobalto). **No se suman más tonos cálidos:** la banda arena de Servicios es el límite |
| Marcador sol en una frase del H1 | "Accenting one word of a headline" | Es la propuesta de valor misma (tachar lo viejo, marcar lo nuevo) y es *el único* lugar de máxima intensidad. Por eso H4 libera al sol de los demás usos |
| Cuadrícula de plano en el hero | Fondos decorativos | El motivo sale de los planos y las fichas técnicas del cliente. Va en un solo lugar por página y no se mueve |
| Archivo condensada al 62 % | — | No es Inter ni `system-ui`; el ancho viene de los catálogos industriales |
| Mono para `MB-8830-IC`, `malonebelt.com` y UTC−5 | "Monospace as a costume" | Son datos que en ese mundo se escriben así. Lo que sale es el mono en frases (H1) |

Y estas **cambian** porque no pasan la prueba: índices sobre cada sección, cejas en mayúsculas, numeración de listas que no son secuencias, flechas en acciones que no navegan, el sol en todas partes y el mismo padding en todas las secciones.

## 6. Plan priorizado

| ID | Mejora | Hallazgos | Horas | ADR | Cuándo | Depende de |
|---|---|---|---|---|---|---|
| D-01 | `theme-color` y `color-scheme: light` | H12 | 0,25 | — | **Hecho 8-nov** | — |
| D-02 | `pnpm design:shots` con `cdp.mjs` + axe por CDP (`--axe`) | H16 | 1 | — | **Hecho 8-nov** | — |
| D-03 | Decidir el ADR-027 (§7) | — | — (tu revisión) | Sí | **Aprobado 8-nov** | — |
| D-04 | Reserva de mono, `text-caption`, sin índices de sección, preguntas ni pie numerados | H1, H2, H5 | 1,5 | ADR-027 | **Hecho 8-nov** | D-02, D-03 |
| D-05 | Flechas solo donde se navega; chevron en las preguntas; viñetas del "Antes" | H3 | 0,5 | — | **Hecho 8-nov** | — |
| D-06 | Sol reservado | H4 | 0,5 | ADR-027 | **Hecho 8-nov** | D-03 |
| D-07 | Ritmo vertical por jerarquía | H6 | 0,5 | — | **Hecho 8-nov** | D-02 |
| D-08 | R-16 recortado y nuevo orden de recorte de la fase B | H11 | −0,5 (ahorra) | ADR-027 | **Hecho 8-nov** (en 13 §5.2) | D-03 |
| D-09 | Trabajo en la home con la `CaseCard` de MRB | H7 | 1,5 | ADR-027 | **Hecho 8-nov** | D-03 |
| D-10 | Copy: cuarta cifra, etiquetas del bento, "a tu nombre" | H8, H9, H1 | 0,25 + tu revisión | — | **Hecho 8-nov**: cuarta cifra "1 día hábil"; las etiquetas del bento bajan bajo el título sin cambiar su texto | Tu copy |
| D-11 | Retrato (R-09) | H10 | 0,25 + la foto | — | En cuanto tengas la foto | Tu foto |
| D-12 | Medir LCP sin mono en la primera pantalla | H15 | 0,5 | — | Después de D-04 | D-04 |
| D-13 | `DESIGN.md`, línea en `CLAUDE.md` y una sola copia del skill | H17 | 0,25 | — | Al cerrar D-04 | D-04 |
| D-14 | Formulario v1.1 con el checklist de H14 | H14 | (dentro de la tarea del formulario) | — | v1.1 | — |

**Total: ~7 h**, de las que ~0,5 h salen de recortar R-16.

**Lo hecho el 8-nov:**

- **D-01:** `color-scheme: light` en `:root` y `viewport` (`themeColor: '#faf6ee'`, `colorScheme: 'light'`) en el layout y en el 404.
- **D-02:** `scripts/design-shots.mjs` y `pnpm design:shots [base] [--axe]`. 48 capturas, sin scroll horizontal; con `--axe`, 0 violaciones en las 36 vistas a 390 y 1440 px.
- **D-05:** la agenda lleva el calendario al inicio en el hero, en precios y en el menú; las preguntas llevan un chevron que se voltea; el panel "Antes" lleva guiones. Las flechas quedan en los enlaces que navegan, en la costura del antes y después y entre los pasos de "Cómo trabajo", que sí son una secuencia.
- **D-07:** padding por tono en `Section` (`RHYTHM`): papel 64 → 96 px y bandas de color 80 → 112 px. El hero cierra con 64 px, así que el hueco con "Trabajo" bajó de 192 a 160 px a 1440.
- **Con el ADR-027 aprobado (8-nov):** D-04 (mono reservado, `text-caption`, sin índices ni numeración fuera de las secuencias, chips en Archivo), D-06 (sol reservado: fuera de cifras, viñetas, leyenda, "Pruébalo", panel "Después", íconos del proceso y pie), D-08 (R-16 recortado en 13 §5.2), D-09 (Trabajo en la home con la `CaseCard` de MRB y filas de 160 px; salen las categorías y las industrias) y D-10 (cuarta cifra "1 día hábil").

**Orden recomendado:** D-01 y D-02 ya, porque no dependen de nada. Luego tu decisión sobre el ADR-027. Con el ADR aprobado, D-04 a D-08 entran en la fase B *antes* de R-16, para no animar elementos que después se quitan. D-09 puede esperar a la v1.1 si la semana no alcanza.

**Criterio de aceptación de cada D:**

- `pnpm lint`, `pnpm typecheck` y `pnpm preview` sin errores.
- `pnpm design:shots` sin scroll horizontal, revisado con la rúbrica de H16.
- axe con 0 violaciones.
- LCP móvil y CLS sin regresión frente a [11 §2](./11-calidad-rendimiento-y-accesibilidad.md#2-técnicas-de-rendimiento).
- 06 §3 actualizado en el mismo commit.

## 7. Borrador: ADR-027 · Disciplina del sistema visual

> **Aprobado el 8-nov.** La versión vigente, con lo que se implementó, está en [14 · ADR-027](./14-decisiones.md#adr-027). Este borrador queda como registro.

- **Contexto:** la auditoría del 8-nov con el skill `frontend-craft` (este doc) encontró que los recursos del "plano técnico" (mono, índices, flechas y sol) se aplican en casi todas las superficies, y que así pierden su significado y se parecen a plantillas genéricas. R-16 iba a animar dos de ellos.
- **Decisión:**
  - **Mono** solo para datos cortos que en el mundo del cliente se escriben en mono (referencias, direcciones, medidas, zonas horarias y códigos). Las frases van en sans, en tipo oración; las etiquetas descriptivas usan `text-caption` (14 px, Archivo 500, `ink-2`).
  - **Numeración** solo para secuencias reales (pasos del proceso). Fuera los índices de los encabezados de sección, de las preguntas y del pie.
  - **Sol** reservado para el marcador del H1, el botón principal sobre cobalto, los numerales del proceso, el foco sobre azul, la selección y el favicon.
  - **Trabajo en la home:** la tarjeta completa del caso destacado y filas compactas de los demás. Fuera las filas de categorías e industrias (ajusta [ADR-025](./14-decisiones.md#adr-025)).
  - **R-16** se reduce a la línea de tiempo del proceso (y, como opción, al marcador de los resultados del caso). Nuevo orden de recorte de la fase B: R-15, R-16 y R-17 (ajusta [ADR-023](./14-decisiones.md#adr-023)).
- **Alternativas descartadas:**
  - **Dejarlo como está:** el sitio sigue correcto, pero su identidad se diluye y se parece a otras plantillas.
  - **Cambiar la paleta o la tipografía:** no hace falta. La dirección es buena, y cambiarla rehace las mediciones de fuentes y LCP de ADR-019.
- **Consecuencias:**
  - Menos ruido visual y un H1 con más protagonismo.
  - Probable salida de Plex Mono de la ruta crítica (por medir).
  - ~0,5 h menos en R-16.
  - Hay que actualizar el design system de `Design system/` a mano, como dice ADR-019.

## 8. Lo que sigue necesitando a una persona

- **Tu aprobación** del ADR-027 y de los cambios de copy (H1, H8, H9).
- **Tu foto** para R-09.
- **Una pasada con VoiceOver** después de D-04: cambian los encabezados y las etiquetas de las cifras.
- **Métricas de campo:** las de este doc son de laboratorio. PSI sobre producción sigue siendo el criterio ([ADR-016](./14-decisiones.md#adr-016)).

## Fuentes

- Skill `frontend-craft` v1.0.0: `.claude/skills/frontend-craft/SKILL.md`, lista de señales calibrada a 2026-11.
- Capturas del 8-nov-2026 de `https://alejandrodeveloper.com/es` y `/es/trabajos/malone-road-belt` a 390, 768 y 1440 px (locales, no versionadas).
- [06 · Secciones y UI](./06-secciones-y-ui.md), [11 · Calidad](./11-calidad-rendimiento-y-accesibilidad.md), [13 · Plan](./13-plan-de-implementacion.md) y [14 · Decisiones](./14-decisiones.md).
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
