# Design system · Gemma

Referencia completa de la identidad visual de Gemma para pasarla a cualquier herramienta
(Figma, Canva, Framer, Webflow, Lovable, editores de vídeo…).
La fuente es su web (`sitio/src/index.css`, `embudo.css` y `contenido.json`), que sale de la carpeta de Drive
`Landing Kangen Gemma / 08 Design`. Ejemplo de otro sistema completo: `equipo/alejandro/design.md`.

**Concepto:** claro, tranquilo y con mucho aire. Titulares muy finos en negro con una palabra en coral,
fotos de exterior con esquinas redondeadas, etiquetas pequeñas muy espaciadas con un punto coral y botones negros y lila en píldora.

---

## 1. Color

| Token | Nombre | Hex | Uso |
|---|---|---|---|
| `eggshell` | Eggshell | `#fdfcfc` | Fondo de toda la página y de las piezas de redes |
| `taupe` | Taupe | `#f5f3f1` | Fondo suave: frase grande, webinar, contacto, cierre de carrusel |
| `stone` | Stone | `#ebe8e4` | Líneas, bordes y separadores. **Nunca texto** |
| `ink` | Ink | `#000000` | Titulares, texto fuerte y botón principal |
| `graphite` | Graphite | `#44403b` | Etiquetas pequeñas, listas, texto oscuro secundario |
| `smoke` | Smoke | `#777169` | Párrafos y la parte suave (énfasis) de los titulares |
| `ash` | Ash | `#a59f97` | Notas legales y detalles muy suaves (ver contraste) |
| `coral` | Coral | `#ffa174` | Relleno: punto de las etiquetas, etiqueta píldora, anillos, progreso. **Nunca como letra sobre claro** |
| `coral-deep` | Coral oscuro | `#af562c` | Letra: la palabra destacada del titular y los números grandes |
| `lila` | Lila | `#d0c7ff` | Relleno: botón secundario, bandas y bloques de color, fondo de fotos. **Nunca como letra sobre claro** |
| `lila-deep` | Lila oscuro | `#6952e0` | Letra: enlaces dentro del texto y enlace subrayado |

También: `#ff8f5c` (hover coral), `#beb2ff` (hover del botón lila), `#ffffff` para campos del cuestionario
y textos sobre foto, `#e5e5e5` para el borde del botón claro y `#b42318` para errores.

### Coral y lila: dos tonos de cada uno

Coral y lila son muy claros: como letra sobre el fondo de Gemma no se leen (1,9 : 1 y 1,5 : 1). Por eso cada uno tiene
un tono claro para rellenar, con letra negra encima, y un tono oscuro (mismo matiz) para usar como letra.

- **El toque en la letra es coral:** la palabra marcada (`*así*`) va en Coral oscuro, una o dos palabras por titular.
  En titulares largos de varias líneas, la segunda mitad puede seguir en Smoke.
- **El toque en los botones es lila:** botón principal Ink, botón secundario Lila con letra Ink. Nunca dos botones lila juntos.
- **Etiqueta píldora:** "WEBINAR GRATUITO" en píldora Coral o "GUARDA ESTE POST" en píldora Lila, con letra Ink. Una por pieza.
- **Como mucho dos toques por pieza** (por ejemplo, la palabra coral y un botón lila). El punto de las etiquetas no cuenta.
- Sobre un bloque Lila, la palabra en Coral oscuro solo en titulares (3,2 : 1); los párrafos van en Graphite.
- Sobre fondo Ink (oscuro), Coral y Lila sí funcionan como letra (10,6 : 1 y 13,3 : 1).
- En redes, una pieza de 1080 px se ve en el móvil a un tercio: el texto de apoyo de 34 px se lee como uno de 12 px
  y necesita 4,5 : 1. Solo los titulares (76 px o más) cuentan como texto grande.

### Contraste (WCAG)

| Combinación | Ratio | Válido para |
|---|---|---|
| Ink sobre Eggshell | 20,5 : 1 | Todo |
| Graphite sobre Eggshell | 10,0 : 1 | Todo |
| Smoke sobre Eggshell | 4,7 : 1 | Todo |
| Smoke sobre Taupe | 4,4 : 1 | Solo texto grande (≥ 24 px). En párrafos sobre taupe, usa Graphite |
| Graphite sobre Lila | 6,5 : 1 | Todo |
| Smoke sobre Lila | 3,1 : 1 | Solo texto grande |
| Ash sobre Eggshell | 2,6 : 1 | No llega al mínimo de texto. La web lo usa en notas de 11 px; en piezas nuevas usa Smoke |
| Ink sobre Coral | 10,6 : 1 | Todo (etiquetas y botones coral) |
| Ink sobre Lila | 13,3 : 1 | Todo (botón y bloques lila) |
| Graphite sobre Coral | 5,2 : 1 | Todo |
| Coral oscuro sobre Eggshell | 4,9 : 1 | Todo |
| Coral oscuro sobre Taupe | 4,5 : 1 | Todo |
| Coral oscuro sobre White | 5,0 : 1 | Todo |
| Coral oscuro sobre Lila | 3,2 : 1 | Solo titulares |
| Lila oscuro sobre Eggshell | 5,3 : 1 | Todo |
| Lila oscuro sobre Taupe | 4,9 : 1 | Todo |
| Coral sobre Ink | 10,6 : 1 | Todo (fondo oscuro) |
| Lila sobre Ink | 13,3 : 1 | Todo (fondo oscuro) |
| Coral sobre Eggshell | 1,9 : 1 | Nunca para texto, solo relleno y decoración |
| Lila sobre Eggshell | 1,5 : 1 | Nunca para texto, solo relleno y decoración |

### Degradados sobre la foto

```
Foto con texto abajo:   linear-gradient(0deg, rgba(5,12,12,.33), transparent 37%)
Portada (además):       linear-gradient(90deg, rgba(20,21,17,.07), transparent 50%)
Vivir bien:             linear-gradient(0deg, rgba(20,25,20,.28), transparent 55%)
```

---

## 2. Tipografía

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Titulares | [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) | 300 (titulares), 500 (nombre) | Titulares, frases destacadas, nombre |
| Texto | [Inter](https://fonts.google.com/specimen/Inter) | 400, 500 | Párrafos, etiquetas, botones, formularios |

Titulares siempre en 300, en frases normales, nunca en negrita ni en mayúsculas.
**Énfasis:** la palabra marcada entre asteriscos en `contenido.json` (`Otra *manera* de ganarse la vida`) va en
Coral oscuro (`#af562c`). En titulares largos de varias líneas, la segunda mitad puede ir en Smoke. Ni negrita ni cursiva.
(Hoy la web la pinta en Smoke con la clase `.suave`; pasarla a Coral oscuro es cambiar esa clase.)

| Estilo | Tamaño | Peso | Interlineado | Espaciado | Mayúsculas | Uso |
|---|---|---|---|---|---|---|
| Display | 43–69 px (`clamp(45px, 4.35vw, 69px)`) | 300 | 1,075 | −0,047 em | No | Titular de portada |
| Frase grande | 46–83 px | 300 | 1,055 | −0,055 em | No | Banda taupe, una línea por idea |
| H2 | 35–68 px | 300 | 1,055 | −0,047 em | No | Títulos de sección |
| Tarjeta | 21 px | 300 | 1,3 | −0,03 em | No | Tarjetas de valores |
| Frase destacada | 18 px | 300 | 1,55 | 0 | No | Junto a un párrafo, en Graphite |
| Nombre | 22 px (17 px en enlaces) | 500 | 1 | −0,055 em | Sí | `GEMMA OÑA` |
| Cuerpo | 14–15 px | 400 | 1,75–1,85 | 0 | No | Párrafos en Smoke |
| Botón | 13 px (14 px en el embudo) | 500 | 1,2 | 0 | No | Botones píldora con flecha `↗` |
| Etiqueta | 10,5 px | 500 | 1,7 | 0,17 em | Sí | Encima de cada titular, en Graphite |
| Texto sobre foto | 9–11 px | 500 | 1,4 | 0,13–0,15 em | Sí | Frase abajo a la izquierda, nombre arriba a la derecha |

### Redes (lienzo de 1080 px)

| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| Gancho | 104 px (88 px con foto) | 300 | Post, portada de carrusel, portada de reel |
| Titular | 76 px | 300 | Diapositiva interior, story |
| Apoyo | 34 px, interlineado 1,6 | 400 | Texto en Smoke, máximo 3 líneas |
| Etiqueta | 24 px, espaciado 0,17 em | 500 | Con punto coral de 12 px; numeración `02 / 06` |
| Botón | 30 px | 500 | Píldora negra con flecha `↗` |
| Texto sobre foto | 22 px, espaciado 0,15 em | 500 | Blanco, mayúsculas |

---

## 3. Espaciado y retícula

| Token | Valor |
|---|---|
| Ancho máximo de contenido | 1280 px |
| Margen lateral | 54 px escritorio · 32 px hasta 1000 px · 20 px móvil |
| Separación entre secciones | 132–145 px escritorio · 75–85 px móvil |
| Separación entre botones y tarjetas | 12–14 px |
| Relleno de tarjetas | 30 px (20 px en móvil) |
| Cabecera | 76 px de alto (73 px en móvil) |
| Ancho máximo del embudo | 480 px (enlaces) · 560 px (cuestionario) |
| Margen en redes | 96 px |

Portada en escritorio: dos columnas (texto 46 % · foto 54 %). Historia: 43 % foto · 57 % texto.

---

## 4. Formas y líneas

| Token | Valor | Uso |
|---|---|---|
| Radio píldora | 9999 px | Botones y etiquetas sobre foto |
| Radio panel | 24 px | Fotos grandes, bloque del webinar, tarjeta de contacto |
| Radio tarjeta | 20 px | Tarjetas de valores, opciones del cuestionario, fotos medianas |
| Radio campo | 14 px (12 px en contacto) | Campos de formulario |
| Radio en redes | 40 px | Fotos y bloques en piezas de 1080 px |
| Líneas | 1 px continua en Stone | Separadores, bordes, filas de listas |
| Sombras | Solo el botón de reproducir y el diálogo | |

---

## 5. Componentes

**Botón oscuro:** fondo Ink, texto Eggshell, píldora, 46 px de alto, 13 px 500, flecha `↗` a 22 px. Hover Graphite y sube 2 px.

**Botón lila:** fondo Lila, texto Ink (13,3 : 1). Hover `#beb2ff`. Acción secundaria junto al oscuro; nunca dos juntos.

**Botón claro:** fondo Eggshell, borde `#e5e5e5`, texto Ink. Hover Stone.

**Enlace subrayado:** 13 px 500 en Lila oscuro con línea de 1 px del mismo color; la flecha se separa al pasar el ratón.
Los enlaces dentro de un párrafo también van en Lila oscuro.

**Etiqueta (kicker):** 10,5 px 500, espaciado 0,17 em, mayúsculas, Graphite. Con punto Coral de 5 px cuando abre una pieza,
o en píldora Coral o Lila con letra Ink cuando tiene que verse primero.

**Tarjeta de valor:** borde Stone, radio 20 px, frase en 21 px 300 arriba y número en 10 px Smoke abajo; tres por fila.

**Cuestionario:** campos blancos con borde Stone y radio 14 px; opciones blancas con radio 20 px y letra en círculo;
la elegida con borde Ink, fondo Taupe y letra en Coral; barra de progreso de 2 px en Coral.

**Anillos:** dos círculos de 1 px en Smoke al 20 % y 17 % con un disco Coral al 55 % dentro, cortados por la esquina
superior derecha de un bloque Taupe. Uno por pieza como mucho.

**Foco (accesibilidad):** contorno de 2 px en Graphite, separado 4 px.

---

## 6. Fotografía

- Fotos de exterior y de su día a día con luz natural: perfil al atardecer (`portada.jpg`), mirador de montaña
  (`vida.jpg`), su historia (`historia.jpg`) y trabajando en casa (`foto.jpg`). Están en `sitio/public/`.
- Siempre dentro de un bloque con esquinas redondeadas; nunca a sangre en la web.
- Tratamiento suave y algo apagado: `saturate(.63) contrast(.88) sepia(.09)` en la portada, `saturate(.65) contrast(.9)`
  en el resto y `saturate(.75) contrast(.94) sepia(.06)` en el retrato de Instagram.
- Encuadre: portada `center 40%`, vida `center 45%`, retrato `center 22%`.
- Nada de fotos de producto, de dinero ni de lujo.

---

## 7. Tono y movimiento

- Primera persona y desde la calma: "a mi ritmo", "sin prisas", "sin compromiso", "míralo con calma".
- Frases cortas, a veces sin verbo: "La montaña. La playa por la mañana. Salir con mi perra."
- Se habla del negocio y del estilo de vida, nunca del producto (ver `estrategia/normas-comunicacion.md`).
- Sin emojis en la interfaz.
- Transiciones de 0,25 s en fondo, color y desplazamiento. Se desactivan con `prefers-reduced-motion`.

---

## 8. Exportación

### Variables CSS

```css
:root {
  --color-eggshell: #fdfcfc;
  --color-taupe: #f5f3f1;
  --color-stone: #ebe8e4;
  --color-ink: #000000;
  --color-graphite: #44403b;
  --color-smoke: #777169;
  --color-ash: #a59f97;
  --color-coral: #ffa174;
  --color-coral-hover: #ff8f5c;
  --color-coral-deep: #af562c;
  --color-lila: #d0c7ff;
  --color-lila-hover: #beb2ff;
  --color-lila-deep: #6952e0;
  --fuente-titulo: 'Inter Tight', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --fuente-cuerpo: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --tracking-titular: -0.047em;
  --radius-pill: 9999px;
  --radius-panel: 24px;
  --radius-card: 20px;
  --radius-field: 14px;
  --gutter-mobile: 20px;
  --gutter-desktop: 54px;
  --content-max: 1280px;
}
```

### Tokens (JSON, formato Design Tokens / Tokens Studio para Figma)

```json
{
  "color": {
    "eggshell": { "$type": "color", "$value": "#fdfcfc" },
    "taupe":    { "$type": "color", "$value": "#f5f3f1" },
    "stone":    { "$type": "color", "$value": "#ebe8e4" },
    "ink":      { "$type": "color", "$value": "#000000" },
    "graphite": { "$type": "color", "$value": "#44403b" },
    "smoke":    { "$type": "color", "$value": "#777169" },
    "ash":      { "$type": "color", "$value": "#a59f97" },
    "coral":    { "$type": "color", "$value": "#ffa174" },
    "coralDeep": { "$type": "color", "$value": "#af562c" },
    "lila":     { "$type": "color", "$value": "#d0c7ff" },
    "lilaDeep": { "$type": "color", "$value": "#6952e0" }
  },
  "font": {
    "titulo": { "$type": "fontFamily", "$value": "Inter Tight" },
    "cuerpo": { "$type": "fontFamily", "$value": "Inter" },
    "weight": {
      "light":  { "$type": "fontWeight", "$value": 300 },
      "regular": { "$type": "fontWeight", "$value": 400 },
      "medium": { "$type": "fontWeight", "$value": 500 }
    }
  },
  "radius": {
    "pill":  { "$type": "dimension", "$value": "9999px" },
    "panel": { "$type": "dimension", "$value": "24px" },
    "card":  { "$type": "dimension", "$value": "20px" },
    "field": { "$type": "dimension", "$value": "14px" }
  },
  "space": {
    "gutterMobile":  { "$type": "dimension", "$value": "20px" },
    "gutterDesktop": { "$type": "dimension", "$value": "54px" },
    "gap":           { "$type": "dimension", "$value": "12px" },
    "contentMax":    { "$type": "dimension", "$value": "1280px" }
  }
}
```

### Para Canva / Kit de marca

- Colores: `#fdfcfc`, `#f5f3f1`, `#000000`, `#777169`, `#ffa174`, `#af562c`, `#d0c7ff`, `#6952e0`
- Títulos: Inter Tight Light (300), espaciado −5 %, frases normales, palabra destacada en `#af562c` · Etiquetas: Inter Medium,
  mayúsculas, espaciado +17 % · Texto: Inter Regular en `#777169` · Botones: píldora negra o lila (`#d0c7ff`, letra negra) con flecha ↗
- Coral `#ffa174` y lila `#d0c7ff` nunca como color de letra sobre fondo claro: solo de fondo, con letra negra encima.
