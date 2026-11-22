# Carruseles

Todos los carruseles salen de `plantilla.html`, con la identidad de cada persona (`equipo/<persona>/design.md`): sus
colores, sus letras y una palabra en cursiva de color en cada titular. **La identidad es constante; el estilo, la
composición, el tamaño y el largo cambian** con lo que se cuenta, para que no se parezcan unos a otros.

## Reglas

Aprendidas de las opiniones de Alejandro sobre los carruseles de Gemma (14 y 16 de noviembre de 2026):

- **El largo lo marca el contenido**, no un número fijo: 3 imágenes para una idea con giro, 5 para una lista corta o
  un antes y después, de 7 a 10 para una historia o una guía. Una idea por imagen y como mucho 25 palabras.
- **Un estilo por carrusel, distinto de los tres anteriores de esa persona** (propiedad **Estilo visual** de la pieza
  en el Calendario de Notion). Y dentro, **al menos 4 composiciones distintas** y nunca dos iguales seguidas.
- **El tamaño se adapta**: los titulares llevan `class="ajustar"` y crecen o encogen hasta llenar su hueco. Una frase
  corta va enorme; nada de dejar media imagen vacía (el contenido sin foto va en `<div class="centro">`).
- **Dibujos que señalan**: flechas, círculos, subrayados, rotulador, cinta o pegatinas, como mucho dos por imagen y
  siempre apuntando a algo (una palabra, una foto, la siguiente imagen). El **círculo**, solo en palabras de la primera
  línea del titular: debajo de otra línea la pisa y parece tachada (ahí, subrayado).
- **Al menos 3 fotos reales** de la persona, distintas entre sí (en el estilo tipográfico, 1 o 2). Nada de IA salvo
  que se marque con su etiqueta.
- **Cada idea, con su imagen** (20 de noviembre: «me pones 4 cositas y se queda muy justo»). Si el texto habla de un
  sitio, un momento o una cosa (la oficina a las 9, el bus de vuelta, la mañana sin ganas), la imagen lo enseña. Si la
  persona no tiene esa foto, se crea con IA (abajo, «Imágenes de contexto con IA»). Como mucho dos imágenes seguidas
  sin foto.
- **Las caras, enteras y sin texto encima.** `npm run carrusel` coloca cada foto sola y no deja entregar si una cara
  queda cortada o tapada. Si la foto no cabe en esa composición, se cambia de composición o de foto: nunca se fuerza.
- **Revisión a tamaño real**: además de `hoja.png`, se mira cada imagen entera. En miniatura no se ven los cortes.

## Los cuatro estilos

Una clase en `<body>` cambia el carrusel entero: fondos, letras, listas, burbujas, tarjetas y botones.

| Estilo | Cómo se ve | Para qué |
|---|---|---|
| `album` | Papel con grano, fotos con cinta, polaroids, letra a mano, flechas y garabatos | Diario, momentos, construir en público |
| `revista` | Blanco, serif grande, líneas finas, sin cajas de color, mucho aire | Reflexiones, mentalidad, frases que se guardan |
| `tipografico` | Bloques de color planos y titulares enormes en mayúsculas, casi sin foto | Ideas directas, listas, «¿te suena?» |
| `documental` | Oscuro, la foto manda y el texto va corto, como un subtítulo | Su día real, una tarde, un antes y después |

## Composiciones

Cada imagen es una `<section class="slide …">`. La plantilla trae un ejemplo de cada una: se copian las que hagan
falta y se borra el resto. Las clases de fondo `lila`, `coral`, `tinta`, `violeta` y `sobre-foto` cambian los colores
de todo lo que hay dentro.

| Composición | Para qué | Foto |
|---|---|---|
| `portada-foto` | Portada clásica: foto a sangre y titular abajo | Sí, a sangre |
| `portada-tipo` | Portada de frase: titular enorme y su foto como pegatina redonda | Pequeña y redonda |
| `portada-collage` | Portada de día a día: 2 o 3 fotos con cinta | Dos o tres |
| `portada-revista` | Portada de revista: su nombre de cabecera y una pregunta | Sí, a sangre |
| `partida` | Una idea con cara: foto arriba, texto abajo | Media imagen |
| `cita` | La frase importante sobre una foto, con velo oscuro | Sí, a sangre |
| `polaroid` | Un recuerdo o un momento, con pie a mano | Girada |
| `collage` | Una tarde, una rutina: fotos sueltas con notas | Dos o tres |
| `mitad` | Antes (arriba, en gris) y ahora (abajo) | Dos |
| `lista` | Lo que se repite, se cumple o se descarta | No |
| `grafica` | Subidas y bajadas: el camino de puntos dibuja la curva | No |
| `numero` | Una cifra enorme (años, días, horas; **nunca dinero**) | No |
| `chat` | Lo que te dices por dentro, en burbujas (nunca mensajes inventados de otras personas) | No |
| `nota` | Hoja de libreta o pósit escrito a mano | No |
| `mito` | Lo que se cree, tachado, y lo que es, a mano | No |
| `pregunta` | Una pregunta con una interrogación gigante detrás | No |
| `pasos` | Tres pasos unidos | No |
| `dos` | Dos columnas: sí y no, antes y ahora | No |
| `semana` | Una semana o una rutina | No |
| `cierre` / `cierre-tipo` | Pregunta final y botón; con foto redonda o solo letra | Opcional |

Si una idea pide algo que no está, se crea la composición en la plantilla con las mismas variables y se añade aquí.

## Adornos

| Clase | Qué es |
|---|---|
| `<svg class="flecha abs"><use href="#flecha-curva"/></svg>` | Flecha a mano (`flecha-curva`, `flecha-bucle`, `flecha-recta`). Se coloca con `style="left; top; width; rotate"` |
| `<span class="circulo">` | Círculo dibujado alrededor de una palabra |
| `<span class="subrayado">` | Subrayado ondulado |
| `<span class="rotulador">` | Rotulador detrás de las palabras (`lila-r` para lila) |
| `<div class="cinta">` | Cinta adhesiva para pegar fotos o notas (`coral-c` para coral) |
| `<div class="pegatina">` | Pegatina redonda con dos o tres palabras (`lila-p`, `violeta-p`) |
| `<svg class="destellos"><use href="#destellos"/></svg>` | Tres estrellitas |
| `<div class="mano abs">` | Nota escrita a mano |
| `<div class="sello-ia">Imagen creada con IA</div>` | Sello de una imagen hecha o cambiada con IA: va siempre en la imagen que la lleva, pequeño, abajo a la derecha (se mueve con `style`) |

Los dibujos toman el color de la imagen solos (claros sobre fondo oscuro).

## Cómo se hace uno

Claude hace cada carrusel con esta plantilla y lo **pasa a Canva** separado en capas (`contenido/canva/README.md`):
allí la persona, o Alejandro, cambia lo que quiera (textos, letras, colores, tamaños, recortes y fotos) y lo aprueba en
Notion. Lo de abajo es cómo se hace la propuesta, en una sesión con el repositorio:

1. El texto de cada imagen está en la pieza del Calendario de Notion, con su **estilo**, su **composición** y su
   **foto** (lo escribe el agente `guion`).
2. Copia `plantilla.html` a una carpeta de trabajo **fuera del repositorio** (es público: ni fotos ni historias aquí) con
   el nombre `carrusel.html`, y pon al lado las fotos de la persona.
3. Cambia los colores de `:root` por los de su `design.md`, el estilo de `<body>`, el nombre de la barra y los textos.
   Quita las composiciones que no uses y ajusta la numeración (`02 / 05`).
4. `npm run carrusel -- <carpeta>` → `01.png`, `02.png`… (1080 × 1350), `hoja.png` y `encuadre.json`. Antes de hacer las
   imágenes, coloca cada foto según sus caras y lo cuenta («Imagen 03 · foto-2.jpg · 1 cara(s) · ✓»). Si dice «cara
   cortada» o «texto encima de la cara», no se entrega: cambia la composición, la foto o el sitio del texto. Con
   `data-encuadre="fijo"` en una foto se respeta el `object-position` que pongas (y se comprueba igual).
5. Mira `hoja.png` (¿hay variedad?, ¿algún hueco vacío?) y **cada imagen a tamaño real**.
6. Sube los PNG y el `carrusel.html` a Drive → `Landing Kangen <Persona>/05 Contenido redes/Editados/CT-<código>
   <título> (v1)` y pon la carpeta en **Archivo** de la pieza.
7. Pásalo a Canva (`contenido/canva/README.md`) y pon en **Notas** «Editar en Canva: <enlace>».

## Imágenes de contexto con IA

Para lo que la persona no puede fotografiar o no tiene: su trabajo (nunca el de verdad: ni su empresa ni su mesa), el
camino de vuelta, una mañana, una idea («la caja de cuando lo dejas todo»). Ejemplo: CT-8 de Gemma (v3), con la
oficina a las 9:00, el bus de las 18:00, la caja y el dormitorio al amanecer, junto a sus fotos reales.

- **Sin caras ni personas reconocibles**, sin marcas, logos ni texto legible. Nunca la cara de la persona hecha con IA
  ni nadie que pueda pasar por ella, por un cliente o por alguien de su familia: las caras son siempre fotos reales.
- **Lo que no puede salir** tampoco sale en IA: lujo, viajes como resultado, dinero, el producto o el agua.
- **Parece una foto de móvil**: luz natural, encuadre imperfecto, sus colores en las sombras. Nada de «foto de stock».
- **Siempre marcada**: el sello `sello-ia` en la imagen, la etiqueta de IA de cada red al publicar y la casilla
  **Etiqueta IA** de la pieza en Notion.
- **Con qué**: el generador de imágenes de **Gamma** (`generate_image`, `type: "photo"`, `sizePreset:
  "social-portrait"` para 4:5; unos 70 créditos de Gamma cada una). Se baja de su enlace y se pone al lado de las fotos
  en la carpeta de trabajo. Con **Higgsfield** con créditos, `generate_image` con `nano_banana_pro` (2k, 4:5; unos 2
  créditos), que además acepta fotos de referencia para mantener el mismo sitio en varias imágenes.
- Receta del texto para el generador (en inglés, sale mejor): `Candid smartphone photo, real textures, natural grain,
  not a 3D render, not stock.` + qué se ve y a qué hora + `Muted warm tones with soft lilac shadows. No people, no
  faces, no logos, no readable text.`

## Imágenes con movimiento

Un carrusel puede llevar **una o dos imágenes con movimiento** (un vídeo corto en lugar de una imagen quieta). Se usan
cuando el movimiento cuenta la idea, no para adornar:

| Qué se mueve | Para qué |
|---|---|
| Una bola que recorre el camino mientras se dibuja | Subidas y bajadas, un recorrido, pasos |
| Dos líneas que salen del mismo punto y una se queda abajo | Lo que das y lo que recibes, un techo |
| El titular entrando palabra a palabra sobre un vídeo real de la persona | La frase importante, con ella o su día de fondo |
| Una lista que se va marcando o tachando | Lo que se cumple, lo que se descarta |

Cómo se hace:

1. Copia `plantilla-animada.html` a una carpeta de trabajo fuera del repositorio con el nombre `index.html`, con los
   colores de la persona, y pon dentro la imagen del carrusel que quieres animar (el mismo HTML que en `carrusel.html`).
2. Las animaciones van en la línea de tiempo `tl` de GSAP. Para dibujar una línea de puntos poco a poco, una máscara con
   el mismo trazado y `strokeDasharray: largo + ' ' + largo`. Para un vídeo de fondo, recórtalo antes a 1080 × 1350 con
   `ffmpeg` y ponlo como `<video class="fondo clip" muted data-start="0" data-duration="6">`.
3. `npm run carrusel-animado -- <carpeta>` → `animada.mp4`. Antes de renderizar comprueba las caras y que **cada texto
   se quede quieto el tiempo de leerlo** (unas 3 palabras por segundo y nunca menos de 2 segundos). Si algo no cumple,
   no renderiza y dice qué arreglar. Mira varios fotogramas antes de darlo por bueno.
4. Instagram y Facebook admiten mezclar imágenes y vídeos en un carrusel; TikTok, en modo fotos, no. Guarda siempre
   también la imagen quieta: es la que va a TikTok.

Cada versión nueva (v2, v3…) va en su propia carpeta. Lo que se aprenda de las opiniones sobre el diseño se apunta con
el agente `aprender` y, si vale para todos, se cambia aquí y en la plantilla.
