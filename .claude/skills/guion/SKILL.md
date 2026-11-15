---
name: guion
description: Guionista del equipo. Escribe el guion de una pieza (vídeo o carrusel) con la voz de una persona del equipo, el texto adaptado a cada red y la llamada a la acción con su código de seguimiento. Úsala para cada pieza del Calendario de contenido en estado Idea o Guion, o cuando pidan un guion.
---

# Guion de una pieza

## Lee primero
- La pieza en el Calendario (Notion, `collection://da1053df-19d6-4cfc-8547-c77f511392ae`): pilar, formato, redes, etapa,
  gancho, referencia y su **Código** (`CT-123`).
- Su **ficha de voz** en Notion (`collection://8fdf7563-98ef-41e5-8899-19349d98657d`): sus palabras, su historia, su
  persona ideal y lo marcado con ⚠ (no se usa en público). Su sección **«Feedback y aprendizajes»** manda sobre todo
  lo demás: son las opiniones de su equipo y de ella misma sobre piezas anteriores.
- `contenido/aprendizajes-equipo.md`, `estrategia/icp.md`, `contenido/formatos.md`, `contenido/ganchos.md`,
  `estrategia/normas-comunicacion.md`.
- Si la pieza ya tiene algo en **Feedback** (una versión anterior), usa antes `aprender`: la versión nueva sale de ahí.
- La web de la persona: `equipo/<persona>/sitio/src/config.ts` (dominio).

## Vídeo (Reel / TikTok / Short)
En el cuerpo de la página de la pieza:

1. **Gancho (0-3 s)**: frase exacta a cámara + texto en pantalla.
2. **Guion**: frases cortas (menos de 12 palabras), numeradas por plano, con lo que se ve («a cámara en la cocina»,
   «plano del portátil»). 30-60 s en total (≈ 75-150 palabras).
3. **Cierre** + llamada a la acción hablada.
4. **Dónde y cómo grabar**: lugar, luz, ropa, si hace falta un plano extra del día a día. Los clips, en vertical, en
   1080p y de 5 a 8 segundos (los archivos de más de 10 MB no se pueden recoger de Drive). Si la pieza lleva **voz en
   off**, escribe el texto para leer: la persona lo graba con la grabadora del móvil y lo sube a `Brutos` con el nombre
   `CT-<código> voz`. El montaje lo hace `editor-video` (`contenido/videos/README.md`) en una sesión con el repositorio.
5. **Textos por red**:
   - Instagram y Facebook: 3-6 líneas, primera línea = gancho, «enlace en mi perfil», 3-5 hashtags temáticos (sin marca).
   - TikTok: 1-2 líneas, sin invitar al negocio ni al webinar, «más en mi perfil».
   - YouTube Shorts: título (máx. 60 caracteres) y descripción con `https://<dominio>/l/instagram?c=CT-123`.
6. **Etiqueta IA**: marca la casilla de la pieza si lleva imágenes o vídeo realistas generados con IA.

## Carrusel
1. **Texto de cada imagen** en una tabla (#, composición, foto, etiqueta, titular, texto): portada con la palabra de
   énfasis entre asteriscos, como en las webs (`Otra *manera*`), máximo 25 palabras por imagen. Estructura de
   `contenido/formatos.md`. Elige la composición de cada imagen y sus fotos con las reglas de
   `contenido/carruseles/README.md`: al menos 4 composiciones distintas, nunca dos iguales seguidas y al menos 3 fotos
   reales de la persona (de su Drive; si faltan, dilo y pide cuáles hacer).
2. **Texto de la publicación** de Instagram y Facebook.
3. **Imágenes**: copia `contenido/carruseles/plantilla.html` en una carpeta de trabajo (fuera del repositorio), pon sus
   colores de `equipo/<persona>/design.md`, los textos y su foto de portada (`foto.jpg`, una foto real de su Drive), y
   genera las imágenes con `npm run carrusel -- <carpeta>`. Mira el resultado antes de darlo por bueno.
   Si no puedes ejecutarlo (Claude en la web), deja el `carrusel.html` y la foto en la carpeta de Drive del paso 4,
   enséñalo como vista previa si puedes, y pon en **Notas** «Faltan las imágenes»: las genera la siguiente sesión con el
   repositorio.
4. Sube los PNG y el HTML a Drive → `05 Contenido redes/Editados/CT-<código> <título> (v1)` y pon esa carpeta en
   **Archivo**. Estado = Editado.

## Reglas de escritura
- Primera persona, con sus expresiones de la ficha. Si la ficha no está «Lista para guiones», avisa: el guion será
  genérico. Nunca uses lo marcado con ⚠.
- Una sola idea por pieza. Escenas concretas de su vida, no frases motivacionales.
- De qué se habla: negocio, cambiar de vida, alternativas, invertir en uno mismo, mentalidad. Nunca Enagic, el
  producto ni el agua.
- Normas: sin cifras de dinero ni rentabilidades, sin promesas, sin lujo, sin salud, sin «trabajo/empleo», sin productos
  financieros; los resultados dependen de cada persona.
- En TikTok, nunca invitar al negocio ni al webinar de forma directa.

## Al terminar
- Al final de la página, un desplegable (`<toggle heading="h3">`) «Propuesta de Claude, versión N (no tocar: sirve
  para aprender de los cambios)» con el texto tal y como lo propones. `aprender` lo compara con la versión final.
- Estado de la pieza = Guion (o Editado si ya tiene las imágenes), **Revisión** = Pendiente. Pasa la pieza por
  `revisar-normas`.
- Di a quien la pidió dónde dejar su opinión: en el chat o en la propiedad **Feedback** de la pieza.
