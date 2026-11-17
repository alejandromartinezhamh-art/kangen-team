# Estudio de contenido

Una página dentro de Claude (un artefacto) donde cada persona, y Alejandro, ven cada carrusel **tal cual saldrá** y lo
cambian sin otra herramienta:

- **Carruseles e imágenes sueltas**: tocar un texto para escribir; seleccionar palabras para la cursiva de color, el
  subrayado, el círculo o el rotulador; tocar una foto para cambiarla por otra de su galería o arrastrarla para
  encuadrarla; añadir flechas, notas a mano, pegatinas, destellos o cinta, y moverlos, girarlos o cambiarles el tamaño;
  añadir, duplicar, mover o borrar imágenes; cambiar la composición de una imagen o el estilo de todo el carrusel.
- **Vídeos**: planos (fotos o clips) en orden, el trozo de cada clip, el texto en pantalla, cuánto dura cada plano, el
  gancho y su **nota de voz** o **su voz clonada** (abajo); dónde empieza y acaba la voz y quitar sus pausas largas; la **velocidad**; los
  **subtítulos** (corregir palabras y quitar frases para acortarlo, cuando Claude ya los ha sacado de la voz); y las
  **letras**: estilos rápidos, colores, caja, tamaño y altura de los subtítulos. Se ve y se oye en marcha tal cual
  saldrá (las cuentas son las de `scripts/montaje-video.mjs`, las mismas que `npm run video`) y avisa si un texto no
  da tiempo a leerse o si un color no se lee.
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
| Alejandro | <https://claude.ai/artifact/6ybmWYoDN5UZXu4U8bFNY3> |

## Voz clonada

Para que la persona (o Alejandro, por ella) haga vídeos con su voz sin grabarlos cada vez. Detalle de la herramienta en
`contenido/videos/README.md` → «Voz clonada».

1. **Mi voz** (botón de arriba): la persona lee en voz alta el texto que aparece, sube la grabación (móvil o WhatsApp)
   y marca su permiso. Se guarda en `permisos-voz/<su id>` con `{ acepto, texto, version, fecha, muestra: { asset,
   nombre, duracion } }`. La regla del estudio (`permisos-voz` con escritura `self`) hace que **solo ella** pueda
   escribir o borrar su permiso: ni el dueño del estudio ni Claude (ArtifactData lo rechaza). Al borrarlo se borra
   también su grabación. Ojo: es una regla, no cifrado; quien puede publicar el estudio podría cambiarla, y nadie debe
   hacerlo.
2. **En un vídeo**: «Voz clonada (IA)», el texto que dice y «Generar la voz». Queda en `video.vozIA = { texto, estado:
   "pedida", pedida, por }`.
3. **Claude la genera** (abajo, «Procesar los estudios») y la deja como `video.voz = { asset, nombre: "Voz clonada",
   duracion, ia: true, palabras }`, con `vozIA.estado = "hecha"`. Desde ahí se recorta, se cambia la velocidad, se
   corrigen los subtítulos y se pulsa «Listo» como con cualquier voz. El estudio recuerda la etiqueta de IA.

## Crear el estudio de una persona nueva (Claude, en una sesión con el repositorio)

1. `npm run estudio -- pagina dist/estudio-<persona>.html --nombre <Nombre>`.
2. Publicarlo con el Artifact tool: `capabilities: { assets: {}, user: { scopes: ["profile"] }, db: { rules: [
   { path: "permisos-voz", read: "view", write: "self" }, { path: "permisos-voz/{self}", read: "view", write:
   "interact" } ] } }` y el icono `video`. Apuntar el enlace en la tabla de arriba.
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
   `src="/_blob/<id>" data-foto="<id>"`; `video` es `{ gancho, velocidad, estilo, voz: { asset, nombre, duracion, desde,
   hasta, pausas, palabras, tramos }, medios: [{ asset, desde, segundos, texto }] }`, lo mismo que `pieza.json` de
   `npm run video` (`palabras` es la transcripción, con `fuera: true` en las frases quitadas; `tramos`, los trozos de
   la voz que se quedan, los calcula el estudio).
6. En Pendientes, en la pestaña de Alejandro: compartir el estudio con esa persona como Editor.

## Procesar los estudios (Claude: la tarea programada y cada sesión con el repositorio)

En cada sesión con el repositorio (basta con pedir «procesa los estudios»), Claude hace esto en cada estudio de la tabla
de arriba. Con la tarea programada «Procesar estudios» activa (la autoriza Alejandro), se hace solo cada 2 horas, de 9 a
23 h, y nadie tiene que avisar.

**0. Qué hay pendiente**: `ArtifactData` → `list` de `piezas` con `out_dir` (y `get` de `ajustes/persona` al mismo
`out_dir`), y `npm run estudio -- pendientes <out_dir>`.

**Voces clonadas pedidas** (líneas `VOZ`):

1. `ArtifactData` → `list` de `permisos-voz` y `profiles` con sus ids: vale solo el permiso cuyo nombre coincide con el
   de la persona del estudio (`ajustes/persona`). Si no hay, `npm run estudio -- devolver … --error "Falta el permiso
   de <nombre> en «Mi voz»"` y seguir.
2. Bajar su grabación (Artifact `read` con `path` = `muestra.asset`) a la carpeta de trabajo, fuera del repositorio.
3. `npm run estudio -- voz <out_dir>/piezas/<código>.json <carpeta> --muestra <grabación>` → `voz-clonada.m4a` y
   `transcripcion.json`.
4. Subir `voz-clonada.m4a` al estudio (Artifact `asset: true`), `npm run estudio -- devolver
   <out_dir>/piezas/<código>.json <carpeta> --voz <id>` y `ArtifactData` → `update` de `piezas/<código>` con
   `file_path` = `<carpeta>/para-el-estudio.json` y su `if_version`.
5. Si la pieza tiene página en Notion, marcar **Etiqueta IA**.

**Piezas en «Listo»** (líneas `LISTO`):

1. Lo que sigue, con cada una.
2. Bajar cada archivo que use la pieza (Artifact `read` con `path` = id) a una carpeta de trabajo **fuera del
   repositorio**, cada uno con su id como nombre.
3. `npm run estudio -- preparar <out_dir>/piezas/<código>.json <carpeta>` → `carrusel.html` o `pieza.json` (con
   `vozClonada: true` si la voz es la clonada: lleva etiqueta de IA).
4. `npm run carrusel -- <carpeta>` o `npm run video -- <carpeta>`: comprueban otra vez las caras y los tiempos.
5. Subir el resultado a Drive (`Editados/CT-<código> <título> (vN)`), poner la carpeta en **Archivo** de la pieza en
   Notion y, en el estudio, `estado: "hecho"`, `drive` con el enlace y `resultado` con las imágenes o el vídeo subidos
   (`[{ asset, tipo: "imagen" | "video" }]`). En un **vídeo con voz**, además, los subtítulos: subir el vídeo al estudio
   (Artifact `asset: true`), `npm run estudio -- devolver <out_dir>/piezas/<código>.json <carpeta> --resultado <id del
   vídeo> --drive <enlace>` y ArtifactData `update` de `piezas/<código>` con `file_path` = `<carpeta>/para-el-estudio.json`
   (y su `if_version`). Así la persona puede corregir palabras y quitar frases en la siguiente vuelta.
6. Lo que se haya cambiado en el estudio respecto a la propuesta de Claude es una opinión: pasa por `aprender`.
