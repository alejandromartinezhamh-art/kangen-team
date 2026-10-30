# Design system · Gemma

Referencia completa de la identidad visual de Gemma para pasarla a cualquier herramienta
(Figma, Canva, Framer, Webflow, Lovable, editores de vídeo…).
Es **el mismo sistema que el de Alejandro** (`equipo/alejandro/design.md`): misma tipografía, misma estructura,
mismos componentes y mismos textos. Solo cambian los colores: fondo claro, superficie lila y acento coral.
La web de `sitio/` lo aplica; los colores y las letras también se pueden cambiar desde su editor (`/editar`).

**Concepto:** claro, editorial, sin sombras. Titulares en grotesca apretada con una palabra en cursiva serif y en coral,
líneas discontinuas, botones píldora numerados, tarjetas lila y un único acento coral usado con mucha moderación.
Toda la estructura (líneas, numeración, flechas) va en lila.

---

## 1. Color

### Paleta

Cada color ocupa el mismo papel que su equivalente en la marca de Alejandro (entre paréntesis).

| Token | Nombre | Hex | RGB | Uso |
|---|---|---|---|---|
| `fondo` | Eggshell (Walnut) | `#fdfcfc` | 253, 252, 252 | Fondo de todo |
| `superficie` | Lila (Bark) | `#d0c7ff` | 208, 199, 255 | Tarjetas destacadas (pasos), caja del vídeo, diapositivas alternas |
| `borde` | Stone (Cork) | `#ebe8e4` | 235, 232, 228 | Bordes de campos y tarjetas de formulario |
| `linea` | Lila (Driftwood) | `#d0c7ff` | 208, 199, 255 | Líneas discontinuas que separan secciones y filas. **Solo líneas, nunca texto** |
| `secundario` | Graphite (Sand) | `#44403b` | 68, 64, 59 | Texto secundario, subtítulos, números de botón |
| `texto` | Ink (Cream) | `#000000` | 0, 0, 0 | Texto principal y botón relleno |
| `texto-hover` | Graphite (Cream claro) | `#44403b` | 68, 64, 59 | Hover del botón relleno |
| `acento` | Coral oscuro (Ember) | `#af562c` | 175, 86, 44 | Palabra de énfasis de los titulares, etiquetas pequeñas y números grandes. Máximo 1–2 por pantalla |
| `estructura` | Lila oscuro (Sand en los números) | `#6952e0` | 105, 82, 224 | Numeración (`01`, `02 / 06`), flechas, letras de las opciones, "Desliza →" y "Guarda este post" |

También: coral claro `#ffa174` solo para la selección de texto y detalles decorativos (nunca como letra sobre el fondo: 1,9 : 1).
Ash `#a59f97` para los placeholders del formulario y `#b42318` para errores. Hover del botón con borde: negro al 5 % (`rgba(0, 0, 0, 0.05)`).

### Contraste (WCAG)

| Combinación | Ratio | Válido para |
|---|---|---|
| Ink sobre Eggshell | 20,5 : 1 | Todo |
| Eggshell sobre Ink (botón relleno) | 20,5 : 1 | Todo |
| Graphite sobre Eggshell | 10,0 : 1 | Todo |
| Coral oscuro sobre Eggshell | 4,9 : 1 | Todo (texto pequeño incluido) |
| Lila oscuro sobre Eggshell | 5,3 : 1 | Todo (texto pequeño incluido) |
| Ink sobre Lila | 13,3 : 1 | Todo |
| Graphite sobre Lila | 6,5 : 1 | Todo |
| Coral oscuro sobre Lila | 3,2 : 1 | Solo texto grande (≥ 24 px o ≥ 19 px en negrita) |
| Lila oscuro sobre Lila | 3,4 : 1 | Solo texto grande; sobre fondo lila la numeración pequeña va en Graphite |
| Lila sobre Eggshell | 1,5 : 1 | Solo líneas |
| Ash sobre Eggshell | 2,6 : 1 | Solo placeholders y elementos decorativos |
| Stone sobre Eggshell | 1,2 : 1 | Solo bordes |

### Degradado sobre la foto

```
Móvil (foto a sangre que se funde con el fondo):
linear-gradient(to bottom,
  rgba(253,252,252,.35) 0%, transparent 18%, transparent 58%,
  rgba(253,252,252,.75) 82%, #fdfcfc 100%)

Escritorio (foto en tarjeta):
linear-gradient(to bottom, transparent 60%, rgba(253,252,252,.55) 100%)
```

---

## 2. Tipografía

Igual que Alejandro. Estilo editorial: una grotesca apretada con interlineado muy cerrado, más una palabra de énfasis en
cursiva serif y en Coral oscuro. Titulares en frases normales (no en mayúsculas); las mayúsculas quedan para botones,
etiquetas y barra superior.

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Principal | [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) | 400–800 | Titulares, textos, botones, etiquetas |
| Énfasis | [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) Italic | 400 | 1–2 palabras dentro de un titular (*manera*, *empecé*), en Coral oscuro |
| Notas a mano (solo redes) | [Caveat](https://fonts.google.com/specimen/Caveat) | 500–700 | Anotaciones con flecha en carruseles |

Alternativas si no están disponibles: Inter → system-ui; Georgia italic.

| Estilo | Tamaño | Peso | Interlineado | Espaciado | Mayúsculas | Uso |
|---|---|---|---|---|---|---|
| Display | 38–83 px (`clamp(2.4rem, 9vw, 5.2rem)`) | 700 | 0,90 | −0,045 em | No | Titular de portada |
| H2 | 30–48 px (`clamp(1.9rem, 9vw, 3rem)`) | 700 | 0,92 | −0,045 em | No | Títulos de sección |
| Énfasis | igual que su titular | 400 cursiva | igual | −0,02 em | No | Palabra en DM Serif Display Italic, color Coral oscuro |
| Lista grande | 20 px móvil / 30 px escritorio | 600 | 1,25 | −0,045 em | No | "¿Te suena?" |
| H3 | 16–18 px | 700 | 1,3 | −0,045 em | No | Títulos de tarjeta |
| Cuerpo | 16–18 px | 500 | 1,625 | 0 | No | Párrafos (en Graphite) |
| Botón | 13 px | 700 | 1,15 | 0 | Sí | Botones píldora |
| Barra | 12 px | 700 | 1 | 0 | Sí | Nombre y subtítulo superiores |
| Etiqueta | 11 px | 700 | 1 | 0 | Sí | Etiquetas en Coral oscuro; numeración en Lila oscuro |
| Vertical | 10 px | 700 | 1 | 0 | Sí | Etiqueta vertical sobre la foto (opacidad 75 %) |

En los textos de `sitio/src/contenido.json`, la palabra de énfasis se marca entre asteriscos: `Otra *manera* de ganarse la vida`.
La palabra va en Coral oscuro y sola: sin subrayado, recuadro ni ningún otro adorno.

---

## 3. Espaciado y retícula

| Token | Valor |
|---|---|
| Margen lateral móvil | 18 px |
| Margen lateral escritorio | 32 px |
| Ancho máximo de contenido | 1152 px |
| Ancho máximo página de enlaces | 480 px |
| Separación vertical entre secciones | 80 px móvil / 112 px escritorio |
| Separación entre botones | 12 px |
| Separación entre tarjetas | 12 px |
| Relleno interno de tarjetas | 24 px móvil / 32 px escritorio |
| Altura de botón | 54–62 px |

Portada en escritorio: dos columnas (texto 1,1 fr · foto 1 fr), alto mínimo de pantalla completa.

---

## 4. Formas y líneas

| Token | Valor | Uso |
|---|---|---|
| Radio píldora | 36 px | Botón relleno principal |
| Radio tarjeta | 22,5 px | Botón con borde, tarjetas, foto en escritorio, formulario |
| Radio campo | 18 px | Campos del formulario |
| Línea separadora | 1 px discontinua (dashed), Lila | Entre secciones y filas de listas |
| Borde de tarjeta | 1 px sólido, Ink | Tarjetas de pilares y botón con borde |
| Sombras | Ninguna | |

---

## 5. Componentes

**Botón principal (relleno):** fondo Ink, texto Eggshell, radio 36 px, 13 px bold mayúsculas, texto a la izquierda y número `01` a la derecha (11 px, opacidad 60 %). Hover: Graphite.

**Botón secundario (borde):** transparente, borde 1 px Ink, radio 22,5 px, número en Lila oscuro. Hover: negro al 5 %.

**Etiqueta de sección:** `01 —— ¿TE SUENA?` en 11 px bold Coral oscuro, con una raya de 32 × 1 px entre el número y el texto.

**Lista numerada:** filas separadas por líneas discontinuas Lila, número 11 px Lila oscuro y texto grande.

**Tarjeta de pilar:** borde Ink, radio 22,5 px, título y número a la derecha en Lila oscuro, descripción en Graphite.

**Tarjeta de paso:** fondo Lila sin borde, número grande en Coral oscuro (36 px, 800), título en Ink y texto en Graphite.

**Formulario:** contenedor transparente con borde Stone, campos transparentes con borde Stone y radio 18 px, placeholder Ash, botón como el principal.

**Cuestionario:** contador `01 / 07`, letras de las opciones (A, B, C…) y flechas en Lila oscuro.

**Estructura en lila (también en redes):** todo lo que ordena la pieza va en lila. Las líneas discontinuas en Lila;
la numeración (`02 / 06`), las flechas (también las dibujadas a mano), "Desliza →" y "Guarda este post" en Lila oscuro,
porque el lila claro no se lee como texto (1,5 : 1). En una diapositiva con fondo lila, esos textos pequeños van en Graphite.
El coral se queda para la palabra de énfasis, las etiquetas de sección y los números grandes.

**Foco (accesibilidad):** contorno de 1 px discontinuo en Ink, separado 4 px.

---

## 6. Fotografía

- Retrato con luz natural trabajando en casa (portátil, taza, plantas y madera). Archivo: `sitio/public/foto.jpg` (900 × 1198).
  Otras fotos suyas en `sitio/public/fotos/` (perfil al atardecer, mirador de montaña, historia).
- Tratamiento: `sepia(.06) saturate(1.02) contrast(1.12) brightness(.94)`.
- Encuadre: centrado horizontal, foco vertical al 35 % (cara en el tercio superior).
- Proporción: 1 : 1,02 en móvil, 4 : 5 en escritorio.
- Etiqueta vertical "GEMMA — 01" a la derecha, girada 90°.

---

## 7. Tono y movimiento

- Igual que Alejandro: primera persona, cercano, sin promesas. Titulares en frases normales con una palabra de énfasis en cursiva y en Coral oscuro;
  mayúsculas solo en botones, etiquetas y barra; frases normales en párrafos.
- Sin emojis en la interfaz. Sin cifras de dinero, sin producto ni marca, sin afirmaciones de salud (ver `estrategia/normas-comunicacion.md`).
- Transiciones de 0,2 s solo en color de fondo y borde. Se desactivan con `prefers-reduced-motion`.

---

## 8. Exportación

### Variables CSS

```css
:root {
  --eggshell: #fdfcfc;
  --lila: #d0c7ff;
  --stone: #ebe8e4;
  --ash: #a59f97;
  --graphite: #44403b;
  --ink: #000000;
  --lila-deep: #6952e0;
  --coral-deep: #af562c;
  --coral: #ffa174;
  --font: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
  --font-accent: 'DM Serif Display', Georgia, serif; /* cursiva */
  --tracking-titular: -0.045em;
  --radius-pill: 36px;
  --radius-card: 22.5px;
  --radius-field: 18px;
  --gutter-mobile: 18px;
  --gutter-desktop: 32px;
  --content-max: 1152px;
}
```

En la web, estos colores se llaman por su papel (`--color-fondo`, `--color-superficie`, `--color-borde`, `--color-linea`,
`--color-secundario`, `--color-texto`, `--color-texto-hover`, `--color-acento`, `--color-estructura`) y salen de
`contenido.json → colores`.

### Tokens (JSON, formato Design Tokens / Tokens Studio para Figma)

```json
{
  "color": {
    "eggshell":  { "$type": "color", "$value": "#fdfcfc" },
    "lila":      { "$type": "color", "$value": "#d0c7ff" },
    "lilaDeep":  { "$type": "color", "$value": "#6952e0" },
    "stone":     { "$type": "color", "$value": "#ebe8e4" },
    "ash":       { "$type": "color", "$value": "#a59f97" },
    "graphite":  { "$type": "color", "$value": "#44403b" },
    "ink":       { "$type": "color", "$value": "#000000" },
    "coralDeep": { "$type": "color", "$value": "#af562c" },
    "coral":     { "$type": "color", "$value": "#ffa174" }
  },
  "font": {
    "family": { "$type": "fontFamily", "$value": "Inter Tight" },
    "accent": { "$type": "fontFamily", "$value": "DM Serif Display" },
    "weight": {
      "regular":   { "$type": "fontWeight", "$value": 400 },
      "medium":    { "$type": "fontWeight", "$value": 500 },
      "semibold":  { "$type": "fontWeight", "$value": 600 },
      "bold":      { "$type": "fontWeight", "$value": 700 },
      "extrabold": { "$type": "fontWeight", "$value": 800 }
    }
  },
  "radius": {
    "pill":  { "$type": "dimension", "$value": "36px" },
    "card":  { "$type": "dimension", "$value": "22.5px" },
    "field": { "$type": "dimension", "$value": "18px" }
  },
  "space": {
    "gutterMobile":  { "$type": "dimension", "$value": "18px" },
    "gutterDesktop": { "$type": "dimension", "$value": "32px" },
    "gap":           { "$type": "dimension", "$value": "12px" },
    "contentMax":    { "$type": "dimension", "$value": "1152px" }
  }
}
```

### Para Canva / Kit de marca

- Colores: `#fdfcfc`, `#d0c7ff`, `#6952e0`, `#44403b`, `#000000`, `#af562c`
- Líneas en `#d0c7ff`; numeración, flechas y "Desliza →" en `#6952e0`
- Títulos: Inter Tight Bold, espaciado −4 %, frases normales · Énfasis: DM Serif Display Italic en `#af562c` · Etiquetas: Inter Tight Bold, mayúsculas · Texto: Inter Tight Medium · Notas: Caveat
