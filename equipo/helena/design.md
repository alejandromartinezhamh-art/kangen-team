# Design system · Helena

Referencia completa de la identidad visual de Helena para pasarla a cualquier herramienta
(Figma, Canva, Framer, Webflow, Lovable, editores de vídeo…).
Es **el mismo sistema que el de Alejandro** (`equipo/alejandro/design.md`): misma tipografía, misma estructura,
mismos componentes y mismos textos que el de Gemma (`equipo/gemma/design.md`). Solo cambian los colores: su paleta
oliva y terracota (`Helena_Saigi_Paleta_Oliva_Terracota.pdf`, en su carpeta de Drive → 08 Design).
La web de `sitio/` lo aplica; los colores y las letras también se pueden cambiar desde su editor (`/editar`).

**Concepto:** mediterráneo, natural, cálido y editorial, sin sombras. Titulares en grotesca apretada con una palabra en
cursiva serif y en terracota, líneas discontinuas, botones píldora numerados, tarjetas piedra y un único acento terracota
usado con mucha moderación. Toda la estructura (líneas, numeración, flechas) va en oliva: oliva para estructurar y
terracota para destacar.

---

## 1. Color

### Paleta

Cada color ocupa el mismo papel que su equivalente en la marca de Alejandro (entre paréntesis).

| Token | Nombre | Hex | RGB | Uso |
|---|---|---|---|---|
| `fondo` | Crema (Walnut) | `#f8f5ee` | 248, 245, 238 | Fondo de todo |
| `superficie` | Piedra (Bark) | `#d9d1c1` | 217, 209, 193 | Tarjetas destacadas (pasos), caja del vídeo, diapositivas alternas |
| `borde` | Arena (Cork) | `#e7e0d4` | 231, 224, 212 | Bordes de campos y tarjetas de formulario |
| `linea` | Oliva (Driftwood) | `#74806a` | 116, 128, 106 | Líneas discontinuas que separan secciones y filas. **Solo líneas, nunca texto pequeño** |
| `secundario` | Gris verde (Sand) | `#575e57` | 87, 94, 87 | Texto secundario, subtítulos, números de botón |
| `texto` | Verde noche (Cream) | `#1f2a22` | 31, 42, 34 | Texto principal y botón relleno |
| `texto-hover` | Gris verde (Cream claro) | `#575e57` | 87, 94, 87 | Hover del botón relleno |
| `acento` | Terracota oscuro (Ember) | `#9f5839` | 159, 88, 57 | Palabra de énfasis de los titulares, etiquetas pequeñas y números grandes. Máximo 1–2 por pantalla |
| `estructura` | Oliva oscuro (Sand en los números) | `#646e5b` | 100, 110, 91 | Numeración (`01`, `02 / 06`), flechas, letras de las opciones, "Desliza →" y "Guarda este post" |

Terracota oscuro y oliva oscuro son el terracota `#c47a5a` y el oliva `#74806a` de su paleta, algo más profundos para que
se lean como letra (los originales dan 3,1 : 1 y 3,8 : 1 sobre el crema). Los originales se usan en rellenos, líneas y botones:
terracota `#c47a5a` para la selección de texto, el botón terracota de las piezas (con texto blanco) y detalles decorativos.
Gris oliva `#858d80` para los placeholders del formulario, gris musgo `#646b63` para la letra pequeña de los emails y
`#b42318` para errores. Hover del botón con borde: verde noche al 5 % (`rgba(31, 42, 34, 0.05)`).

### Contraste (WCAG)

| Combinación | Ratio | Válido para |
|---|---|---|
| Verde noche sobre Crema | 13,7 : 1 | Todo |
| Crema sobre Verde noche (botón relleno) | 13,7 : 1 | Todo |
| Gris verde sobre Crema | 6,1 : 1 | Todo |
| Terracota oscuro sobre Crema | 4,9 : 1 | Todo (texto pequeño incluido) |
| Oliva oscuro sobre Crema | 4,9 : 1 | Todo (texto pequeño incluido) |
| Verde noche sobre Piedra | 9,8 : 1 | Todo |
| Gris verde sobre Piedra | 4,4 : 1 | Texto de 16 px en adelante; la letra más pequeña sobre piedra va en Verde noche |
| Terracota oscuro sobre Piedra | 3,5 : 1 | Solo texto grande (≥ 24 px o ≥ 19 px en negrita) |
| Oliva oscuro sobre Piedra | 3,5 : 1 | Solo texto grande; sobre fondo piedra la numeración pequeña va en Gris verde |
| Oliva sobre Crema | 3,8 : 1 | Líneas, flechas grandes y detalles gráficos |
| Terracota sobre Crema | 3,1 : 1 | Solo titulares grandes y rellenos |
| Blanco sobre Terracota | 3,3 : 1 | Botón terracota (13 px bold mayúsculas) |
| Gris oliva sobre Crema | 3,2 : 1 | Solo placeholders y elementos decorativos |
| Arena sobre Crema | 1,2 : 1 | Solo bordes |

### Degradado sobre la foto

```
Móvil (foto a sangre que se funde con el fondo):
linear-gradient(to bottom,
  rgba(248,245,238,.35) 0%, transparent 18%, transparent 58%,
  rgba(248,245,238,.75) 82%, #f8f5ee 100%)

Escritorio (foto en tarjeta):
linear-gradient(to bottom, transparent 60%, rgba(248,245,238,.55) 100%)
```

---

## 2. Tipografía

Igual que Alejandro. Estilo editorial: una grotesca apretada con interlineado muy cerrado, más una palabra de énfasis en
cursiva serif y en Terracota oscuro. Titulares en frases normales (no en mayúsculas); las mayúsculas quedan para botones,
etiquetas y barra superior.

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Principal | [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) | 400–800 | Titulares, textos, botones, etiquetas |
| Énfasis | [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) Italic | 400 | 1–2 palabras dentro de un titular (*manera*, *empecé*), en Terracota oscuro |
| Notas a mano (solo redes) | [Caveat](https://fonts.google.com/specimen/Caveat) | 500–700 | Anotaciones con flecha en carruseles |

Alternativas si no están disponibles: Inter → system-ui; Georgia italic.

| Estilo | Tamaño | Peso | Interlineado | Espaciado | Mayúsculas | Uso |
|---|---|---|---|---|---|---|
| Display | 38–83 px (`clamp(2.4rem, 9vw, 5.2rem)`) | 700 | 0,90 | −0,045 em | No | Titular de portada |
| H2 | 30–48 px (`clamp(1.9rem, 9vw, 3rem)`) | 700 | 0,92 | −0,045 em | No | Títulos de sección |
| Énfasis | igual que su titular | 400 cursiva | igual | −0,02 em | No | Palabra en DM Serif Display Italic, color Terracota oscuro |
| Lista grande | 20 px móvil / 30 px escritorio | 600 | 1,25 | −0,045 em | No | "¿Te suena?" |
| H3 | 16–18 px | 700 | 1,3 | −0,045 em | No | Títulos de tarjeta |
| Cuerpo | 16–18 px | 500 | 1,625 | 0 | No | Párrafos (en Gris verde) |
| Botón | 13 px | 700 | 1,15 | 0 | Sí | Botones píldora |
| Barra | 12 px | 700 | 1 | 0 | Sí | Nombre y subtítulo superiores |
| Etiqueta | 11 px | 700 | 1 | 0 | Sí | Etiquetas en Terracota oscuro; numeración en Oliva oscuro |
| Vertical | 10 px | 700 | 1 | 0 | Sí | Etiqueta vertical sobre la foto (opacidad 75 %) |

En los textos de `sitio/src/contenido.json`, la palabra de énfasis se marca entre asteriscos: `Otra *manera* de ganarse la vida`.
La palabra va en Terracota oscuro y sola: sin subrayado, recuadro ni ningún otro adorno.

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
| Línea separadora | 1 px discontinua (dashed), Oliva | Entre secciones y filas de listas |
| Borde de tarjeta | 1 px sólido, Verde noche | Tarjetas de pilares y botón con borde |
| Sombras | Ninguna | |

---

## 5. Componentes

**Botón principal (relleno):** fondo Verde noche, texto Crema, radio 36 px, 13 px bold mayúsculas, texto a la izquierda y número `01` a la derecha (11 px, opacidad 60 %). Hover: Gris verde.

**Botón secundario (borde):** transparente, borde 1 px Verde noche, radio 22,5 px, número en Oliva oscuro. Hover: verde noche al 5 %.

**Etiqueta de sección:** `01 —— ¿TE SUENA?` en 11 px bold Terracota oscuro, con una raya de 32 × 1 px entre el número y el texto.

**Lista numerada:** filas separadas por líneas discontinuas Oliva, número 11 px Oliva oscuro y texto grande.

**Tarjeta de pilar:** borde Verde noche, radio 22,5 px, título y número a la derecha en Oliva oscuro, descripción en Gris verde.

**Tarjeta de paso:** fondo Piedra sin borde, número grande en Terracota oscuro (36 px, 800), título en Verde noche y texto en Gris verde.

**Formulario:** contenedor transparente con borde Arena, campos transparentes con borde Arena y radio 18 px, placeholder Gris oliva, botón como el principal.

**Cuestionario:** contador `01 / 07`, letras de las opciones (A, B, C…) y flechas en Oliva oscuro.

**Estructura en oliva (también en redes):** todo lo que ordena la pieza va en oliva. Las líneas discontinuas en Oliva;
la numeración (`02 / 06`), las flechas (también las dibujadas a mano), "Desliza →" y "Guarda este post" en Oliva oscuro,
porque el oliva se queda corto como letra pequeña (3,8 : 1). En una diapositiva con fondo piedra, esos textos pequeños van en Gris verde.
El terracota se queda para la palabra de énfasis, las etiquetas de sección y los números grandes.

**Foco (accesibilidad):** contorno de 1 px discontinuo en Verde noche, separado 4 px.

---

## 6. Fotografía

- Retrato con luz natural al aire libre, entre árboles (verdes que casan con el oliva). Archivo: `sitio/public/foto.jpg` (900 × 1200).
  Otras fotos suyas en `sitio/public/fotos/` (perfil riendo, Dolomitas, lago de montaña con su perro). Los originales están
  en su carpeta de Drive (01 Fotos originales).
- Tratamiento: `sepia(.06) saturate(1.02) contrast(1.12) brightness(.94)`.
- Encuadre: centrado horizontal, foco vertical al 35 % (cara en el tercio superior).
- Proporción: 1 : 1,02 en móvil, 4 : 5 en escritorio.
- Etiqueta vertical "HELENA — 01" a la derecha, girada 90°.

---

## 7. Tono y movimiento

- Igual que Alejandro: primera persona, cercano, sin promesas. Titulares en frases normales con una palabra de énfasis en cursiva y en Terracota oscuro;
  mayúsculas solo en botones, etiquetas y barra; frases normales en párrafos.
- Sin emojis en la interfaz. Sin cifras de dinero, sin producto ni marca, sin afirmaciones de salud (ver `estrategia/normas-comunicacion.md`).
- Transiciones de 0,2 s solo en color de fondo y borde. Se desactivan con `prefers-reduced-motion`.

---

## 8. Exportación

### Variables CSS

```css
:root {
  --crema: #f8f5ee;
  --piedra: #d9d1c1;
  --arena: #e7e0d4;
  --oliva: #74806a;
  --oliva-deep: #646e5b;
  --gris-oliva: #858d80;
  --gris-musgo: #646b63;
  --gris-verde: #575e57;
  --verde-noche: #1f2a22;
  --terracota-deep: #9f5839;
  --terracota: #c47a5a;
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
    "crema":         { "$type": "color", "$value": "#f8f5ee" },
    "piedra":        { "$type": "color", "$value": "#d9d1c1" },
    "arena":         { "$type": "color", "$value": "#e7e0d4" },
    "oliva":         { "$type": "color", "$value": "#74806a" },
    "olivaDeep":     { "$type": "color", "$value": "#646e5b" },
    "grisOliva":     { "$type": "color", "$value": "#858d80" },
    "grisMusgo":     { "$type": "color", "$value": "#646b63" },
    "grisVerde":     { "$type": "color", "$value": "#575e57" },
    "verdeNoche":    { "$type": "color", "$value": "#1f2a22" },
    "terracotaDeep": { "$type": "color", "$value": "#9f5839" },
    "terracota":     { "$type": "color", "$value": "#c47a5a" }
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

- Colores: `#f8f5ee`, `#d9d1c1`, `#74806a`, `#646e5b`, `#575e57`, `#1f2a22`, `#9f5839`, `#c47a5a`
- Líneas en `#74806a`; numeración, flechas y "Desliza →" en `#646e5b`
- Títulos: Inter Tight Bold, espaciado −4 %, frases normales · Énfasis: DM Serif Display Italic en `#9f5839` · Etiquetas: Inter Tight Bold, mayúsculas · Texto: Inter Tight Medium · Notas: Caveat
