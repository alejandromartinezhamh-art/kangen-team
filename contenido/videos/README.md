# Vídeos con voz o con textos

Para las piezas en las que la persona no habla a cámara: **su voz** (una nota de voz) o **textos en pantalla** sobre sus
clips y sus fotos, con el gancho arriba y los subtítulos siguiendo la voz palabra a palabra, con sus colores
(`equipo/<persona>/design.md`). Se montan con `npm run video`, que usa [HyperFrames](https://hyperframes.heygen.com)
(HTML → MP4, libre y gratuito) y `ffmpeg`.

## Reglas

- **La voz es la de la persona**: grabada por ella o **su voz clonada**, que solo existe si ella misma ha subido su
  grabación y ha dado su permiso en su estudio (abajo, «Voz clonada»). Cada vídeo con voz clonada lleva la etiqueta de
  IA de cada red y la casilla **Etiqueta IA** de la pieza en Notion. Nunca la voz de otra persona ni una voz de
  ordenador: esas solo sirven para una maqueta (`"vozDePrueba": true` le pone un aviso encima) y no se publican. Si la
  pieza cuenta su historia, mejor con su voz grabada: se nota.
- Que no salgan caras de otras personas, matrículas, su empresa ni nada marcado ⚠ en su ficha de voz.
- El texto no ocupa los 250 px de arriba ni los 420 de abajo: ahí van los botones de cada red.
- **Cada texto, el tiempo de leerlo**: unas 3 palabras por segundo y nunca menos de 2 segundos, quieto y entero. Sin
  voz, `npm run video` alarga cada clip con texto lo que haga falta; con voz, avisa si un rótulo no da tiempo.
- **Cada clip se mira entero** antes de usarlo (`--planos`, abajo): el plano enseña lo que dice su texto. Fuera los que
  apuntan al suelo, los pies, el techo, los movidos, los oscuros y los que sacan caras de otras personas.
- **Las fotos se recortan alrededor de la cara**, para que no se corte ni al acercarse despacio.
- Música: la de la biblioteca de cada red, puesta al publicar, o una libre de derechos en `"musica"`.
- La carpeta de trabajo va **fuera del repositorio** (es público): ni voces, ni clips, ni fotos aquí.

## Lo que graba la persona

- **La voz**: con la grabadora del móvil, en un sitio sin eco, leyendo el texto de su pieza a su manera. La sube a
  Drive → `05 Contenido redes/Brutos` con el nombre `CT-<código> voz`.
- **Los clips**: en vertical, en 1080p a 30 fps y de 5 a 8 segundos cada uno. Desde una sesión en la nube solo se
  pueden recoger de Drive archivos de **menos de 10 MB**; un clip en 4K o de medio minuto no entra.

## pieza.json

```json
{
  "persona": "gemma",
  "gancho": "En un autobús en México decidí que quería *otra cosa*.",
  "voz": "voz.m4a",
  "medios": ["atardecer.mov", "horizonte.jpg", { "archivo": "cafe.mov", "desde": 1, "segundos": 4 }]
}
```

| Campo | Qué es |
|---|---|
| `persona` | De ahí salen sus colores |
| `gancho` | Texto de los primeros segundos. La palabra entre asteriscos va en cursiva y con su color de énfasis |
| `voz` | El audio. Si no hay, es un vídeo de textos: cada clip dura lo que diga `segundos` (3 si no se dice) |
| `medios` | Clips y fotos, en orden. Sin `segundos`, se reparten lo que dura la voz. `desde` recorta el principio. `texto` pone un rótulo grande mientras dura ese clip |
| `musica` | Opcional. Suena bajo la voz |
| `vozDePrueba` | `true` si la voz no es la de la persona: pone el aviso «VOZ DE PRUEBA» |
| `vozClonada` | `true` si la voz es su voz clonada: recuerda la etiqueta de IA al terminar |
| `velocidad` | Opcional, de 0.8 a 1.5 (1 si no se dice). Acelera o frena la voz **sin cambiarle el tono**; sin voz, cambia lo que dura cada plano sin `segundos` (los textos siguen quedándose lo que se tarda en leerlos) |
| `recorte` | Opcional: `{ "desde": 0.4, "hasta": 41.2, "pausas": true }`. Corta el principio y el final de la voz (en segundos de la grabación) y, con `pausas`, deja cada pausa de más de 0,6 s en 0,3 s |
| `estilo` | Opcional: `{ "letra", "resalte", "enfasis", "fondo", "tamano", "posicion", "subtitulos" }`. Colores (`#rrggbb`) de las letras, de la palabra que se está diciendo y de la palabra entre asteriscos; `fondo` pone una caja de ese color detrás de los textos; `tamano` de los subtítulos `s`, `m` o `l`; `posicion` `abajo` o `centro`; `subtitulos: false` los quita. Sin estilo: letras blancas, la palabra que se dice en su color de superficie y la de énfasis en su coral |
| `tramos` | Lo escribe el estudio: los trozos exactos de la voz que se quedan. Si está, manda sobre `recorte` |

**Quitar frases de la voz.** En `transcripcion.json` (lo escribe la primera vez que monta un vídeo con voz), cada
palabra puede llevar `"fuera": true`: se quita de la voz y de los subtítulos, con un respiro corto entre lo de antes y
lo de después. Ahí también se corrigen las palabras mal escritas. Mientras `transcripcion.json` sea de la misma voz, no
se vuelve a transcribir.

Las cuentas de todo esto (velocidad, recortes, subtítulos y estilos de las letras) están en `scripts/montaje-video.mjs`
y son las mismas que usa el estudio para enseñarlo: lo que se ve allí es lo que sale.

## Cómo se hace uno

1. El guion y los planos están en la pieza del Calendario de Notion (los escribe `guion`).
2. Baja de `Brutos` la voz y los clips a una carpeta de trabajo y escribe `pieza.json`.
3. `npm run video -- <carpeta> --planos` → `planos.jpg`: cada fila es un clip y cada imagen, un segundo. Elige qué clips
   y qué trozo (`desde`) usar mirándolo, y avisa si hay alguno oscuro o movido.
4. `npm run video -- <carpeta>` → `video.mp4` (1080 × 1920), `hoja.png` con cinco fotogramas y `transcripcion.json`. La
   primera vez instala el navegador de render y el reconocimiento de voz (unos minutos).
5. Mira `hoja.png` y lee los subtítulos que imprime. Si una palabra está mal escrita, corrígela en `transcripcion.json`
   y vuelve a ejecutar.
6. **Entrega**. Desde una sesión en la nube solo se pueden subir a Drive archivos de unos 3 MB, y un vídeo pesa más: se
   envía en el chat y quien lo recibe lo guarda en `Editados`. En un ordenador con la carpeta de Drive sincronizada, se
   copia directamente. En la pieza: **Estado** = Editado.

## En el estudio

Cada vídeo también se monta en el **estudio** de la persona (`contenido/estudio/README.md`): planos en orden, el trozo
de cada clip (deslizando), el texto de cada plano, cuánto dura, el gancho y su nota de voz (m4a del iPhone o de
WhatsApp; las de WhatsApp se preparan solas en el navegador) o **su voz clonada** (arriba). Y lo que cambia el ritmo y
el aspecto, sin pedírselo a Claude:

- **Tu voz**: dónde empieza y dónde acaba, y quitar las pausas largas.
- **Ritmo**: la velocidad (de 0,8× a 1,5×), con el tono de su voz de siempre.
- **Subtítulos**: después de que Claude monte el vídeo la primera vez, aparecen frase a frase para corregir palabras y
  quitar frases (✂) para acortarlo. Se pueden quitar del todo.
- **Letras**: cuatro estilos rápidos (Limpio, Caja oscura, Tu color, Caja blanca) y, uno a uno, el color de las letras,
  el de la palabra que se está diciendo, el de la palabra en cursiva y la caja; el tamaño y la altura de los
  subtítulos. Avisa si un color no se lee.

Se ve y se oye en marcha tal cual saldrá (la voz ya recortada y a su velocidad) y avisa si un texto no da tiempo a
leerse o si un clip se acaba antes. Lo que guarda es lo mismo que `pieza.json`: `npm run estudio -- preparar` lo
escribe (con `transcripcion.json` si ya hay subtítulos) y `npm run video` lo monta. Después,
`npm run estudio -- devolver` deja los subtítulos en el estudio para la siguiente vuelta.

## Voz clonada

Para no tener que grabar cada vídeo: Claude dice el texto del guion con la voz de la persona. Usa
[Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) (Apache 2.0, gratis, habla español) en la propia sesión de Claude en la
nube, sin tarjeta gráfica: tarda unas 4 o 5 veces lo que dura la voz (unos 3 minutos para 40 segundos).

- **Solo con su permiso**: la persona sube su grabación (unos 30 s leyendo un texto) y lo acepta en su estudio, en
  «Mi voz». El permiso solo lo puede dar o borrar ella: ni el dueño del estudio ni Claude pueden escribirlo. Antes de
  generar, Claude comprueba que quien dio el permiso es la persona del estudio.
- **Siempre con etiqueta de IA** en cada red y la casilla **Etiqueta IA** de la pieza en Notion.
- **Desde el estudio**: en un vídeo, «Voz clonada (IA)», el texto y «Generar la voz». Claude la genera en la siguiente
  vuelta y la deja como la voz del vídeo, con sus subtítulos, para recortarla, cambiar el ritmo o quitar frases.
- **A mano**: `npm run voz-clonada -- <muestra> <texto.txt> <salida.wav> [--grande]`. La primera vez en cada máquina
  instala el entorno (unos minutos, unos 3 GB). `--grande` usa el modelo de 1,7B: algo más parecido y unas 2,5 veces
  más lento. La muestra se limpia y se corta en una pausa (como mucho 20 s), y se transcribe para que el modelo la
  entienda. El texto se dice frase a frase, con medio respiro entre frases y algo más entre párrafos.
- La muestra y las voces generadas se quedan en su estudio y en la carpeta de trabajo: nunca en el repositorio.

## Reel animado (sin grabar nada)

Para las piezas que son solo una idea: texto en movimiento sobre **dos fotos reales** de la persona, con un recorrido
que se dibuja (una bolita que avanza y una frase en cada parada). No hay voz ni clips, así que se puede preparar con
semanas de adelanto.

1. Copia `contenido/videos/plantilla-reel-animado.html` como `index.html` en una carpeta de trabajo fuera del
   repositorio, con sus dos fotos (`foto-1.jpg` y `foto-2.jpg`, verticales).
2. Pon sus colores, su nombre, la serie y los textos de la pieza. La plantilla trae cinco escenas (gancho en dos partes,
   recorrido con paradas, dos ideas y la pregunta final); la forma del camino cuenta la idea (plano si nada cambia,
   hacia arriba si crece). **Los tiempos salen de los textos**: cada frase se queda el tiempo de leerla, así que con 5
   paradas dura unos 32 segundos; para uno más corto, quita paradas o una escena.
3. `npm run carrusel-animado -- <carpeta> <carpeta>/reel.mp4` (el mismo comando de las imágenes con movimiento de los
   carruseles: el tamaño lo marca la plantilla).
4. Antes de renderizar se comprueba solo que ninguna cara queda cortada o tapada y que cada texto se puede leer; si no,
   dice qué arreglar (o qué `data-duration` poner). Después, saca varios fotogramas y míralos.

Cada frase tiene que salir de su ficha de voz, como en cualquier guion. Las fotos son suyas y reales: no lleva etiqueta
de IA. La música se pone al publicar, en la aplicación de cada red.

Lo que se aprenda de las opiniones sobre los vídeos se apunta con `aprender` y, si vale para todos, se cambia aquí y en
`scripts/video.mjs`.

## Herramientas de terceros

Además de `npm run video` y `npm run carrusel-animado`, en `.claude/skills/` hay:

| Herramienta | Para qué | Cómo |
|---|---|---|
| `ffmpeg-skill` (kajisho5, MIT, v4.4.0) | Retoques sueltos que no hace `scripts/video.mjs`: recortar, pasar a 9:16, quitar silencios, normalizar el volumen a −14 LUFS, exportar por red y comprobar el resultado | `python3 .claude/skills/ffmpeg-skill/scripts/<herramienta>.py --help`; se actualiza con `npx ffmpeg-skill@<versión> --project` |
| `threejs-*` (CloudAI-X, MIT, 13 skills) | Escenas 3D en HTML (fondos de landing, imágenes con movimiento en HyperFrames) con la API actual de three.js | Se cargan solas cuando la tarea es de three.js |
| `yt-dlp` | Descargar un vídeo de referencia (del Radar) para estudiar su ritmo y sus textos. **Nunca** para volver a publicarlo ni usar trozos | `pip install yt-dlp` en cada sesión nueva (no queda instalado) |

No se instalan:
- **Whisper** (OpenAI): `scripts/video.mjs` ya transcribe con Whisper a través de `hyperframes transcribe`.
- **ghost-editor**: solo funciona en Mac con Apple silicon, manda fotogramas a Google (clave de Gemini) y no aplica nuestras
  normas de vídeo. Si alguien lo quiere en su Mac: clonar `github.com/kurbaitaev/ghost-editor` en `~/.claude/skills/` y
  seguir su `docs/INSTALL.md`; lo que salga pasa igual por las reglas de arriba.
- **awesome-claude-video-skills** (zhuyansen): es una lista de unos 180 repositorios, no una herramienta. Se consulta
  cuando haga falta algo que no tengamos.
