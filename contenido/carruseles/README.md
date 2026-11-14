# Carruseles

Todos los carruseles salen de `plantilla.html`, con la identidad de cada persona (`equipo/<persona>/design.md`):
titulares apretados con una palabra en cursiva de color, fondo claro y de color alternos, numeración `02 / 08`,
«Desliza →», como mucho una nota a mano y una portada con su foto real.

## Cómo se hace uno

1. El texto de cada imagen está en la pieza del Calendario de Notion (lo escribe el agente `guion`).
2. Copia `plantilla.html` a una carpeta de trabajo **fuera del repositorio** (es público: ni fotos ni historias aquí) con
   el nombre `carrusel.html`, y pon al lado su foto de portada como `foto.jpg`.
3. Cambia los colores de `:root` por los de su `design.md`, el nombre de la barra y los textos. Una
   `<section class="slide">` por imagen; la palabra de énfasis va en `<em>`; alterna `class="slide lila"`.
4. `npm run carrusel -- <carpeta>` → `01.png`, `02.png`… (1080 × 1350) y `hoja.png` con todas juntas.
5. Mira `hoja.png` y una imagen a tamaño real antes de darlo por bueno.
6. Sube los PNG y el `carrusel.html` a Drive → `Landing Kangen <Persona>/05 Contenido redes/Editados/CT-<código>
   <título> (v1)` y pon la carpeta en **Archivo** de la pieza.

Cada versión nueva (v2, v3…) va en su propia carpeta. Lo que se aprenda de las opiniones sobre el diseño se apunta con
el agente `aprender` y, si vale para todos, se cambia aquí en la plantilla.
