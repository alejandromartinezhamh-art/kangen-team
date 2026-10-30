# Design system · Alejandro

Referencia completa de la identidad visual de Alejandro para pasarla a cualquier herramienta
(Figma, Canva, Framer, Webflow, Lovable, editores de vídeo…).
La fuente original es su página de enlaces ("Alejandro — enlaces"); la web de `sitio/` la aplica.

**Concepto:** oscuro cálido, editorial, sin sombras. Titulares en grotesca apretada con una palabra en cursiva serif y en naranja, líneas discontinuas,
botones píldora numerados y un único acento naranja usado con mucha moderación.

---

## 1. Color

### Paleta

| Token | Nombre | Hex | RGB | Uso |
|---|---|---|---|---|
| `fondo` | Walnut | `#100904` | 16, 9, 4 | Fondo de todo. Nunca negro puro. |
| `superficie` | Bark | `#382416` | 56, 36, 22 | Tarjetas destacadas (pasos), botón relleno alternativo |
| `borde-suave` | Cork | `#40372e` | 64, 55, 46 | Bordes de campos y tarjetas de formulario |
| `linea` | Driftwood | `#6c5f51` | 108, 95, 81 | Líneas discontinuas, placeholders. **No para texto pequeño** |
| `secundario` | Sand | `#cdb69c` | 205, 182, 156 | Texto secundario, subtítulos, números de botón |
| `texto` | Cream | `#ffedd7` | 255, 237, 215 | Texto principal y botón relleno |
| `texto-hover` | Cream claro | `#fff6ea` | 255, 246, 234 | Hover del botón relleno |
| `acento` | Ember | `#dc5000` | 220, 80, 0 | Palabra de énfasis de los titulares, etiquetas pequeñas y números grandes. Máximo 1–2 por pantalla |

Hover del botón con borde: `rgba(255, 237, 215, 0.06)` (crema al 6 %).

### Contraste (WCAG)

| Combinación | Ratio | Válido para |
|---|---|---|
| Cream sobre Walnut | 17,3 : 1 | Todo |
| Walnut sobre Cream (botón relleno) | 17,3 : 1 | Todo |
| Sand sobre Walnut | 10,1 : 1 | Todo |
| Ember sobre Walnut | 4,9 : 1 | Todo (texto pequeño incluido) |
| Cream sobre Bark | 12,8 : 1 | Todo |
| Sand sobre Bark | 7,5 : 1 | Todo |
| Ember sobre Bark | 3,6 : 1 | Solo texto grande (≥ 24 px o ≥ 19 px en negrita) |
| Driftwood sobre Walnut | 3,2 : 1 | Solo líneas y elementos decorativos |
| Cork sobre Walnut | 1,7 : 1 | Solo bordes |

### Degradado sobre la foto

```
Móvil (foto a sangre que se funde con el fondo):
linear-gradient(to bottom,
  rgba(16,9,4,.35) 0%, transparent 18%, transparent 58%,
  rgba(16,9,4,.75) 82%, #100904 100%)

Escritorio (foto en tarjeta):
linear-gradient(to bottom, transparent 60%, rgba(16,9,4,.55) 100%)
```

---

## 2. Tipografía

Estilo editorial: una grotesca apretada con interlineado muy cerrado, más una palabra de énfasis en cursiva serif y en Ember.
Titulares en frases normales (no en mayúsculas); las mayúsculas quedan para botones, etiquetas y barra superior.

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Principal | [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) | 400–800 | Titulares, textos, botones, etiquetas |
| Énfasis | [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) Italic | 400 | 1–2 palabras dentro de un titular (*manera*, *empecé*), en Ember |
| Notas a mano (solo redes) | [Caveat](https://fonts.google.com/specimen/Caveat) | 500–700 | Anotaciones con flecha en carruseles |

Alternativas si no están disponibles: Inter → system-ui; Georgia italic.
Las fuentes originales de las referencias son de pago (tipo Helvetica Now Display y una serif editorial);
estas son las equivalentes gratuitas de Google Fonts.

| Estilo | Tamaño | Peso | Interlineado | Espaciado | Mayúsculas | Uso |
|---|---|---|---|---|---|---|
| Display | 38–83 px (`clamp(2.4rem, 9vw, 5.2rem)`) | 700 | 0,90 | −0,045 em | No | Titular de portada |
| H2 | 30–48 px (`clamp(1.9rem, 9vw, 3rem)`) | 700 | 0,92 | −0,045 em | No | Títulos de sección |
| Énfasis | igual que su titular | 400 cursiva | igual | −0,02 em | No | Palabra en DM Serif Display Italic, color Ember |
| Lista grande | 20 px móvil / 30 px escritorio | 600 | 1,25 | −0,045 em | No | "¿Te suena?" |
| H3 | 16–18 px | 700 | 1,3 | −0,045 em | No | Títulos de tarjeta |
| Cuerpo | 16–18 px | 500 | 1,625 | 0 | No | Párrafos (en Sand) |
| Botón | 13 px | 700 | 1,15 | 0 | Sí | Botones píldora |
| Barra | 12 px | 700 | 1 | 0 | Sí | Nombre y subtítulo superiores |
| Etiqueta | 11 px | 700 | 1 | 0 | Sí | Etiquetas en Ember, numeración |
| Vertical | 10 px | 700 | 1 | 0 | Sí | Etiqueta vertical sobre la foto (opacidad 75 %) |

En los textos de `sitio/src/config.ts`, la palabra de énfasis se marca entre asteriscos: `Otra *manera* de ganarse la vida`.
La palabra va en Ember y sola: sin subrayado, recuadro ni ningún otro adorno.

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
| Línea separadora | 1 px discontinua (dashed), Driftwood | Entre secciones y filas de listas |
| Borde de tarjeta | 1 px sólido, Cream | Tarjetas de pilares y botón con borde |
| Sombras | Ninguna | |

---

## 5. Componentes

**Botón principal (relleno):** fondo Cream, texto Walnut, radio 36 px, 13 px bold mayúsculas, texto a la izquierda y número `01` a la derecha (11 px, opacidad 60 %). Hover: `#fff6ea`.

**Botón secundario (borde):** transparente, borde 1 px Cream, radio 22,5 px, número en Sand. Hover: crema al 6 %.

**Etiqueta de sección:** `01 —— ¿TE SUENA?` en 11 px bold Ember, con una raya de 32 × 1 px entre el número y el texto.

**Lista numerada:** filas separadas por líneas discontinuas, número 11 px Sand y texto grande en mayúsculas.

**Tarjeta de pilar:** borde Cream, radio 22,5 px, título en mayúsculas y número a la derecha, descripción en Sand.

**Tarjeta de paso:** fondo Bark sin borde, número grande en Ember (36 px, 800), título y texto.

**Formulario:** contenedor transparente con borde Cork, campos transparentes con borde Cork y radio 18 px, placeholder Driftwood, botón como el principal.

**Foco (accesibilidad):** contorno de 1 px discontinuo en Cream, separado 4 px.

---

## 6. Fotografía

- Retrato en estudio tipo pódcast, luz cálida, plantas y madera. Archivo: `assets/foto.jpg` (960 × 960).
- Tratamiento: `sepia(.06) saturate(1.02) contrast(1.12) brightness(.94)`.
- Encuadre: centrado horizontal, foco vertical al 35 % (cara en el tercio superior).
- Proporción: 1 : 1,02 en móvil, 4 : 5 en escritorio.
- Etiqueta vertical "ALEJANDRO — 01" a la derecha, girada 90°.

---

## 7. Tono y movimiento

- Titulares en frases normales con una palabra de énfasis en cursiva y en Ember; mayúsculas solo en botones, etiquetas y barra; frases normales en párrafos.
- Sin emojis en la interfaz. Sin cifras de dinero (ver `estrategia/normas-comunicacion.md`).
- Transiciones de 0,2 s solo en color de fondo y borde. Se desactivan con `prefers-reduced-motion`.

---

## 8. Exportación

### Variables CSS

```css
:root {
  --walnut: #100904;
  --bark: #382416;
  --cork: #40372e;
  --driftwood: #6c5f51;
  --sand: #cdb69c;
  --cream: #ffedd7;
  --cream-hover: #fff6ea;
  --ember: #dc5000;
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

### Tokens (JSON, formato Design Tokens / Tokens Studio para Figma)

```json
{
  "color": {
    "walnut":     { "$type": "color", "$value": "#100904" },
    "bark":       { "$type": "color", "$value": "#382416" },
    "cork":       { "$type": "color", "$value": "#40372e" },
    "driftwood":  { "$type": "color", "$value": "#6c5f51" },
    "sand":       { "$type": "color", "$value": "#cdb69c" },
    "cream":      { "$type": "color", "$value": "#ffedd7" },
    "creamHover": { "$type": "color", "$value": "#fff6ea" },
    "ember":      { "$type": "color", "$value": "#dc5000" }
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

- Colores: `#100904`, `#382416`, `#cdb69c`, `#ffedd7`, `#dc5000`
- Títulos: Inter Tight Bold, espaciado −4 %, frases normales · Énfasis: DM Serif Display Italic en `#dc5000` · Etiquetas: Inter Tight Bold, mayúsculas · Texto: Inter Tight Medium · Notas: Caveat
