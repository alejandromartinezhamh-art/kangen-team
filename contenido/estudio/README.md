# Estudio de contenido

Una página dentro de Claude (un artefacto) donde cada persona, y Alejandro, ven cada carrusel **tal cual saldrá** y lo
cambian sin otra herramienta:

- **Carruseles e imágenes sueltas**: tocar un texto para escribir; seleccionar palabras para la cursiva de color, el
  subrayado, el círculo o el rotulador; tocar una foto para cambiarla por otra de su galería o arrastrarla para
  encuadrarla; añadir flechas, notas a mano, pegatinas, destellos o cinta, y moverlos, girarlos o cambiarles el tamaño;
  añadir, duplicar, mover o borrar imágenes; cambiar la composición de una imagen o el estilo de todo el carrusel.
- **Vídeos**: planos (fotos o clips) en orden, el trozo de cada clip, el texto en pantalla, cuánto dura cada plano, el
  gancho y su **nota de voz**. Se ve en marcha con la voz y avisa si un texto no da tiempo a leerse.
- **Avisos en directo**, con las mismas cuentas que `npm run carrusel` y `npm run video`: cara cortada o con texto
  encima (la cara se marca en rojo), más de 25 palabras, composiciones repetidas, pocas fotos, el mismo estilo que un
  carrusel reciente y palabras que no van en el contenido (dinero, salud, el producto, el agua).
- **«Listo: que Claude lo prepare»**: la pieza queda lista para que Claude la genere con las herramientas de siempre.

Lo que se ve en el estudio es lo mismo que sale: usa los estilos, las composiciones y los dibujos de
`contenido/carruseles/plantilla.html`. Cuando cambia la plantilla, se vuelve a montar y publicar el estudio.

## Uno por persona

Cada persona tiene **su propio estudio**: sus fotos, sus clips y su voz no se mezclan con los de nadie. Se comparte solo
con ella (como **Editor**, para que pueda subir fotos y clips) y con Alejandro. Nada de esto va al repositorio, que es
público: la página no lleva datos; las fotos, la voz y los textos viven en el propio estudio.

| Persona | Estudio |
|---|---|
| Gemma | <https://claude.ai/artifact/ELC7c2bgMHTVcdu8GJ1sZy> |

## Crear el estudio de una persona nueva (Claude, en una sesión con el repositorio)

1. `npm run estudio -- pagina dist/estudio-<persona>.html --nombre <Nombre>`.
2. Publicarlo con el Artifact tool: `capabilities: { db: {}, assets: {} }` y el icono `image`. Apuntar el enlace en la
   tabla de arriba.
3. **Fotos y clips**: las elegidas de su Drive (`Brutos`), nunca las que ella haya marcado como privadas, ni caras de
   niños ni de otras personas sin permiso. Las fotos, en JPG; los clips, en MP4 (H.264, sin sonido, menos de 20 MB:
   `ffmpeg -i clip.mov -an -c:v libx264 -crf 23 -vf "scale='min(1080,iw)':-2" -movflags +faststart clip.mp4`).
   `npm run estudio -- caras <carpeta>` escribe `caras.json` con las caras de cada foto.
4. Subirlas al estudio (Artifact `asset: true`, hasta 25 por llamada) y dar de alta con ArtifactData:
   - `ajustes/persona`: `{ nombre, clave, colores: { fondo, lila, texto, secundario, acento, acentoClaro, estructura, borde } }`
     (de `equipo/<persona>/design.md`).
   - `fotos/<id del archivo>`: `{ nombre, tipo: "foto", ancho, alto, caras: [{ l, t, r, b }], orden }` o
     `{ nombre, tipo: "video", duracion, orden }`.
5. Las piezas: `piezas/<código>` con `{ codigo, titulo, formato: "carrusel" | "imagen" | "video", dia, estilo, slides,
   video, nota, estado: "borrador", notion }`. `slides` es el HTML de cada `<section class="slide …">` con las fotos como
   `src="/_blob/<id>" data-foto="<id>"`; `video` es `{ gancho, voz: { asset, nombre, duracion }, medios: [{ asset, desde,
   segundos, texto }] }`, lo mismo que `pieza.json` de `npm run video`.
6. En Pendientes, en la pestaña de Alejandro: compartir el estudio con esa persona como Editor.

## Generar lo que está «Listo» (Claude, en cada sesión con el repositorio)

1. `ArtifactData` → `query` de `piezas` con `estado == "listo"` y `out_dir` (y `get` de `ajustes/persona` al mismo
   `out_dir`).
2. Bajar cada archivo que use la pieza (Artifact `read` con `path` = id) a una carpeta de trabajo **fuera del
   repositorio**, cada uno con su id como nombre.
3. `npm run estudio -- preparar <out_dir>/piezas/<código>.json <carpeta>` → `carrusel.html` o `pieza.json`.
4. `npm run carrusel -- <carpeta>` o `npm run video -- <carpeta>`: comprueban otra vez las caras y los tiempos.
5. Subir el resultado a Drive (`Editados/CT-<código> <título> (vN)`), poner la carpeta en **Archivo** de la pieza en
   Notion y, en el estudio, `estado: "hecho"`, `drive` con el enlace y `resultado` con las imágenes o el vídeo subidos
   (`[{ asset, tipo: "imagen" | "video" }]`).
6. Lo que se haya cambiado en el estudio respecto a la propuesta de Claude es una opinión: pasa por `aprender`.
7. Cuando la pieza esté **Aprobado** en Notion, se programa desde la misma carpeta: `publicar.json` y
   `npm run publicar -- <carpeta>` (`contenido/publicar/README.md`). Estado → Programado.
