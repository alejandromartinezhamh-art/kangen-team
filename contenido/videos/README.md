# Vídeos con voz o con textos

Para las piezas en las que la persona no habla a cámara: **su voz** (una nota de voz) o **textos en pantalla** sobre sus
clips y sus fotos, con el gancho arriba y los subtítulos siguiendo la voz palabra a palabra, con sus colores
(`equipo/<persona>/design.md`). Se montan con `npm run video`, que usa [HyperFrames](https://hyperframes.heygen.com)
(HTML → MP4, libre y gratuito) y `ffmpeg`.

## Reglas

- **La voz es la de la persona**, grabada por ella. Una voz de ordenador o clonada solo sirve para una maqueta
  (`"vozDePrueba": true` le pone un aviso encima) y nunca se publica: las redes obligan a etiquetar la voz generada con
  IA y nuestro contenido va de contarlo tal cual.
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
- **Los clips**: en vertical, en 1080p a 30 fps y de 5 a 8 segundos cada uno. Si un archivo pesa más de lo que una
  sesión en la nube recoge de Drive de una vez (unos 10 MB), no es un bloqueo: quien lo tiene en el ordenador lo sube a
  Drive, o lo baja al ordenador y lo sube desde ahí. Se trabaja con el archivo tal cual.

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

## Cómo se hace uno

1. El guion y los planos están en la pieza del Calendario de Notion (los escribe `guion`).
2. Baja de `Brutos` la voz y los clips a una carpeta de trabajo y escribe `pieza.json`.
3. `npm run video -- <carpeta> --planos` → `planos.jpg`: cada fila es un clip y cada imagen, un segundo. Elige qué clips
   y qué trozo (`desde`) usar mirándolo, y avisa si hay alguno oscuro o movido.
4. **Voz con tropiezos o muy larga**: `npm run video -- <carpeta> --cortar` (ver «Cortar la voz», abajo). **Para el OK del
   guion cortado** antes de seguir.
5. `npm run video -- <carpeta> --storyboard` → `storyboard.png` y `storyboard.txt`: un fotograma por momento del vídeo, con
   su texto y lo que se oye. Es lo barato para cambiar de idea: **para el OK** antes de renderizar.
6. `npm run video -- <carpeta>` → `renders/v1.mp4` (1080 × 1920), `renders/v1-hoja.png` con cinco fotogramas y
   `transcripcion.json`. Cada render es una versión nueva (`v2`, `v3`…): no se pisa ninguna. La primera vez instala el
   navegador de render y el reconocimiento de voz (unos minutos).
7. Mira la hoja y lee los subtítulos que imprime. Si una palabra está mal escrita, corrígela en `transcripcion.json` y
   vuelve a ejecutar (sale una versión nueva).
8. **Entrega**. Un vídeo suele pesar más de lo que una sesión en la nube sube a Drive de una vez (unos 3 MB). Si pesa
   más, quien lo tiene en el ordenador lo sube a `Editados` (o lo baja al ordenador y lo sube desde ahí); también puede
   enviarse en el chat. En un ordenador con la carpeta de Drive sincronizada, se copia directamente. En la pieza:
   **Estado** = Editado.

## Cortar la voz (`--cortar`)

Quita muletillas, titubeos, repeticiones y pausas largas, y se queda con la mejor toma de cada línea. La voz es la de la
persona: cortar es editar, no generar nada.

- `guion-bruto.txt`: la toma entera por líneas (`L01`, `L02`…), con su tiempo. Léela y decide qué quitar.
- `cortes.json`: lo que se quita, por código de línea o por segundos de la voz bruta. Ejemplo:
  `{"quitar": ["L02", "L03", [12.4, 13.9]]}`.
- Al volver a ejecutar: `voz-cortada.m4a` (con un fundido de 15 ms en cada corte), `guion-cortado.txt` y una comprobación.
  La comprobación transcribe la voz cortada y la compara palabra a palabra con la toma bruta: avisa de lo que se pierde
  y de lo que aparece de nuevo. Sin avisos, la voz está bien cortada.
- Después, en `pieza.json`: `"voz": "voz-cortada.m4a"`. Se escucha entera antes de montar.
- `cortes.json` y los guiones se guardan con la pieza, en la carpeta de trabajo, nunca en el repositorio.

## Medir referencias (`npm run medir`)

Antes de diseñar una pieza con un vídeo de referencia (del Radar, nunca para volver a publicarlo), se mide con números:

`npm run medir -- <archivo.mp4> [carpeta]` → `medidas-<archivo>.json`, con formato, cortes (y cuántos por cada 10 s),
plano medio, primer corte, cortes en los dos primeros segundos, luz media y volumen (LUFS). No guarda el vídeo.

Lo que se mira a mano (subtítulos, composición, textos en pantalla) va en el campo `a_mano` del mismo JSON. Lo que se
repite en varias referencias se convierte en regla con `aprender`.

## En el estudio

Cada vídeo también se monta en el **estudio** de la persona (`contenido/estudio/README.md`): planos en orden, el trozo
de cada clip (deslizando), el texto de cada plano, cuánto dura, el gancho y su nota de voz (m4a del iPhone o de
WhatsApp; las de WhatsApp se preparan solas en el navegador). Se ve en marcha con su voz y avisa si un texto no da tiempo
a leerse o si un clip se acaba antes. Lo que guarda es lo mismo que `pieza.json`: `npm run estudio -- preparar` lo
escribe y `npm run video` lo monta, con subtítulos.

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
