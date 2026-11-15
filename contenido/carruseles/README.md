# Carruseles

Todos los carruseles salen de `plantilla.html`, con la identidad de cada persona (`equipo/<persona>/design.md`): sus
colores, sus letras y una palabra en cursiva de color en cada titular. **El sistema es constante, la composición no**:
cada imagen tiene un diseño distinto y el carrusel lleva varias fotos reales suyas, para que no se vea estático.

## Reglas (aprendidas con el carrusel CT-1 de Gemma)

- **Al menos 4 composiciones distintas** por carrusel y **nunca dos iguales seguidas**.
- **Al menos 3 fotos reales** de la persona, distintas entre sí. Nada de IA salvo que se marque con su etiqueta.
- **Un hilo visual** que cruce todas las imágenes: el camino de puntos, que sale de una imagen a la misma altura a la que
  entra en la siguiente. Empieza con un punto en la portada y termina en el cierre.
- Fondos alternos (claro, de color, foto) y como mucho una nota a mano por imagen.
- Una idea por imagen y como mucho 25 palabras.

## Composiciones de la plantilla

| Composición | Para qué | Foto |
|---|---|---|
| `portada` | Portada: foto a sangre y titular abajo, con «desliza» a mano | Sí, a sangre |
| `polaroid` | Un recuerdo o un momento («los primeros meses») | Sí, girada con pie a mano |
| `lista` | Algo que se acaba, se repite o se comprueba (lista tachada o checklist) | No |
| `grafica` | Subidas y bajadas, antes y después: el propio camino dibuja la curva | No |
| `partida` | Una idea con cara: foto arriba, texto abajo | Sí, media imagen |
| `semana` | Tiempo, rutina o pasos (calendario, pasos numerados) | Pequeña y redonda |
| `cita` | La frase importante sobre una foto, con velo oscuro | Sí, a sangre |
| `cierre` | Pregunta final, botón «Enlace en mi perfil» y «guárdalo para luego» | Redonda |

Si una idea pide algo que no está (un antes y después, una comparación, un número grande), se crea la composición
nueva en la plantilla con las mismas letras y colores, y se añade aquí.

## Cómo se hace uno

1. El texto de cada imagen está en la pieza del Calendario de Notion, con su **composición** y su **foto** (lo escribe
   el agente `guion`).
2. Copia `plantilla.html` a una carpeta de trabajo **fuera del repositorio** (es público: ni fotos ni historias aquí) con
   el nombre `carrusel.html`, y pon al lado las fotos de la persona con los nombres que usa cada imagen
   (`foto-portada.jpg`, `foto-2.jpg`…).
3. Cambia los colores de `:root` por los de su `design.md`, el nombre de la barra y los textos. Quita las composiciones
   que no uses, repite las que necesites y ajusta la numeración (`02 / 08`) y las alturas del camino.
4. `npm run carrusel -- <carpeta>` → `01.png`, `02.png`… (1080 × 1350) y `hoja.png` con todas juntas.
5. Mira `hoja.png` (¿hay variedad? ¿se ve el camino seguido?) y una imagen a tamaño real antes de darlo por bueno.
6. Sube los PNG y el `carrusel.html` a Drive → `Landing Kangen <Persona>/05 Contenido redes/Editados/CT-<código>
   <título> (v1)` y pon la carpeta en **Archivo** de la pieza.

## Imágenes con movimiento

Un carrusel puede llevar **una o dos imágenes con movimiento** (un vídeo corto de 5 a 7 segundos en lugar de una imagen
quieta). Se usan cuando el movimiento cuenta la idea, no para adornar:

| Qué se mueve | Para qué |
|---|---|
| Una bola que recorre el camino mientras se dibuja | Subidas y bajadas, un recorrido, pasos |
| El titular entrando palabra a palabra sobre un vídeo real de la persona | La frase importante, con ella o su día de fondo |
| Una lista que se va marcando o tachando | Lo que se cumple, lo que se descarta |

Cómo se hace:

1. Copia `plantilla-animada.html` a una carpeta de trabajo fuera del repositorio con el nombre `index.html`, con los
   colores de la persona, y pon dentro la imagen del carrusel que quieres animar (el mismo HTML que en `carrusel.html`).
2. Las animaciones van en la línea de tiempo `tl` de GSAP. Para dibujar una línea de puntos poco a poco, una máscara con
   el mismo trazado y `strokeDasharray: largo + ' ' + largo`. Para un vídeo de fondo, recórtalo antes a 1080 × 1350 con
   `ffmpeg` y ponlo como `<video class="fondo clip" muted data-start="0" data-duration="6">`.
3. `npm run carrusel-animado -- <carpeta>` → `animada.mp4`. Mira varios fotogramas antes de darlo por bueno.
4. Instagram y Facebook admiten mezclar imágenes y vídeos en un carrusel; TikTok, en modo fotos, no. Guarda siempre
   también la imagen quieta: es la que va a TikTok.

Cada versión nueva (v2, v3…) va en su propia carpeta. Lo que se aprenda de las opiniones sobre el diseño se apunta con
el agente `aprender` y, si vale para todos, se cambia aquí y en la plantilla.
