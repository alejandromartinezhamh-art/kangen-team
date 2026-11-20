# Instrucciones para Claude

## Plantillas siempre al día (obligatorio)

Las plantillas son la forma de incorporar a gente nueva y de replicar el sistema. Tienen que reflejar siempre cómo trabajamos **hoy**.

Cada vez que cambie algo del proceso (preguntas del cuestionario, mensajes, pasos de alta, estructura de carpetas, estructura de las landings, normas, scripts…), en la misma tarea:

1. Actualiza `estrategia/plantillas/` en el repositorio.
2. Actualiza la carpeta **Templates** de Drive (`Kangen PRO TEAM/Templates`, id `154ciUgPYhPW7E5XPHwMpjLB1FHdhB9SZ`) con los mismos cambios.
   Las copias listas para subir salen de `npm run plantillas-drive` (`dist/plantillas-drive/`): se suben como documento
   de Google y se manda a la papelera la versión anterior.
3. Si cambia el cuestionario, regenera también la versión en blanco (sin nombre) y sustituye `01 Cuestionario historia y avatar (plantilla)` en ambos sitios.
4. Avisa al usuario de qué plantillas has actualizado.

Contenido actual de Templates:

| Archivo | Repositorio |
|---|---|
| 00 Cómo replicar el sistema (Google Doc) | `estrategia/plantillas/00 Cómo replicar el sistema.md` |
| 01 Cuestionario historia y avatar (plantilla).docx | `estrategia/plantillas/01 Cuestionario historia y avatar (plantilla).docx` |
| 02 Mensajes de WhatsApp (Google Doc) | `estrategia/plantillas/02 Mensajes de WhatsApp.md` |
| 03 Checklist persona nueva (Google Doc) | `estrategia/plantillas/03 Checklist persona nueva.md` |
| 04 Crear cuentas de redes (Google Doc) | `estrategia/plantillas/04 Crear cuentas de redes.md` |
| Landing Kangen NOMBRE (estructura de carpetas) | Estructura descrita en la guía 00 |

## Lista de pendientes (obligatorio)

Todo lo que tenga que hacer Alejandro o cualquier persona del equipo está en **Pendientes del equipo**
(<https://claude.ai/artifact/6TvDsNPr2Cz3mGE7Jf4SAS>, documento de Claude enlazado arriba en Notion → PAGINAS WEB), con una
pestaña por persona (Alejandro, Helena, Gemma… y una nueva para cada persona que entre). Así Alejandro hace el seguimiento
desde un solo sitio.

En cada tarea:
1. Cualquier cosa que tenga que hacer alguien apunta allí en la misma tarea, en la pestaña de esa persona, con todos los
   pasos y enlaces: un paso técnico, un dato que nos tiene que pasar, una respuesta que esperamos (por ejemplo, un email
   al que todavía no ha contestado), un contenido o una decisión que solo esa persona puede tomar. Nunca se queda solo
   en el chat o en un email.
2. Lo que depende de Alejandro cuando otra persona conteste va en la pestaña de esa persona, en «Lo que haces tú con…».
3. Marca como hecho lo que hagas tú y comprueba las tareas que ya se hayan cumplido (por ejemplo, si llega su respuesta).
4. Nunca escribas tokens, contraseñas ni claves en la lista.

Cómo se escribe cada tarea (masticada, para hacerla sin pensar):
- Empieza por el verbo en negrita y lo que tarda: **Vacía la papelera de Drive** (1 min).
- Lleva el **enlace directo** a la pantalla exacta donde se hace (la papelera, la variable de Vercel, el editor, la hoja),
  nunca «ve a Drive» o «entra en Vercel». Si un paso solo se puede hacer en una app, di dónde se pulsa.
- Si hay que escribir a alguien, un enlace de WhatsApp con el mensaje ya escrito (`https://wa.me/<número>?text=…`).
- Si tiene varios pasos, numerados y cortos: qué pulsar y qué escribir. Si me lo puede pasar a mí, dilo («escríbemelo
  aquí y lo pongo yo»).

## Decide tú (obligatorio)

Lo que Claude puede decidir, lo decide y lo ejecuta: estrategia, orden de las piezas, formatos, ganchos, diseño,
herramientas, textos. No se pregunta ni se apunta en Pendientes como «decide…» o «elige…». En el chat se dice en una
línea qué se ha decidido y por qué; si después no funciona, se cambia y se aprende (`aprender`).

Pendientes es solo para lo que únicamente puede hacer una persona: grabar, poner algo en su cuenta, aprobar su pieza,
pagar, dar un dato o un acceso, o decidir algo de su vida privada o que cueste dinero.

## Normas de comunicación

Antes de escribir cualquier texto público (webs, landings, anuncios, contenido), aplica `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md`.
`npm run comprobar` revisa los textos de las webs contra esas normas (también lo hace GitHub en cada cambio).

## Webs

Las páginas del embudo (Instagram, cuestionario, webinar y web) son las mismas para todo el equipo y viven en
`compartido/src/embudo`. Cada `equipo/<persona>/sitio` solo tiene sus datos (`config.ts`, `contenido.json`, `index.css`,
fotos). No copies páginas a una persona: cualquier cambio de diseño o de estructura se hace en `compartido` y llega a todas.
El curso privado (`/curso`, después de la primera llamada) es común: lecciones en `compartido/curso/curso.json`, guía y
normas en `estrategia/curso.md`. Tras cambiarlo, `npm run generar-api`.

## Marketing y contenido

La estrategia de contenido y anuncios está en `estrategia/marketing.md`; el día a día, en `contenido/README.md`. Los agentes
(investigador, estratega de perfil, estratega, guionista, revisor, entrevista de historia, aprendizaje) tienen sus
instrucciones en `.claude/skills/`. El perfil de cada persona (presentación, fijadas, destacadas) y sus 100 primeras
piezas en orden se definen una vez con `estrategia/perfil-y-100-dias.md` (agente `estrategia-100-dias`); la semana sale
de ese plan, no se improvisa. Los vídeos con la voz de la persona o con textos en pantalla se montan con
`npm run video` (`contenido/videos/README.md`, agente `editor-video`); la voz publicada es siempre la suya, nunca generada.
Cada persona tiene su **estudio** en Claude (`contenido/estudio/README.md`) para ver y cambiar sus carruseles y montar
sus vídeos; en cada sesión con el repositorio, genera lo que esté en «Listo» allí.
A quién le hablamos: `estrategia/icp.md`. El contenido y los anuncios hablan de negocio, de cambiar de vida, de
alternativas y de invertir en uno mismo; nunca de Enagic, del producto ni del agua (eso llega en el webinar o en la
conversación), así que no necesitan aprobación de Enagic. Nada se publica ni se gasta en anuncios sin la aprobación de la
persona en Notion.

## Cada opinión mejora el sistema (obligatorio)

Siempre que alguien (Alejandro, Gemma, Helena o quien sea) diga qué le gusta o qué no de una idea, un guion, un gancho,
un texto o un diseño (en el chat, en un comentario o en «Tu comentario» de un documento de ideas, en la propiedad
**Feedback** de una pieza o reenviado por WhatsApp), en la misma tarea:

1. Usa el agente `aprender` (`.claude/skills/aprender/SKILL.md`): la opinión se convierte en una regla en su ficha de voz
   (sección «Feedback y aprendizajes») o, si vale para todos, en `contenido/aprendizajes-equipo.md` y en la norma que
   toque (formatos, ganchos, plantilla de carruseles, instrucciones de los agentes).
2. Rehaz la pieza con una versión nueva y revisa las demás piezas de esa persona que aún no estén aprobadas.
3. Cuando una pieza pase a Aprobado o Publicado, compara la versión final con la «Propuesta de Claude» de su página y
   aprende también de eso. Marca **Aprendido**.
4. Di en el chat qué has aprendido y qué has cambiado.

En una sesión con el repositorio, aplica también las filas nuevas de Notion → «Propuestas para todo el equipo» (lo que
el equipo aprende desde Claude en la web, donde no puede escribir aquí).

## El equipo en Claude (cada una con su Claude Pro y su Gmail)

No hay plan Team: para abrirlo hace falta un email de empresa y el equipo usa Gmail. Gemma, Helena y las demás usan los
agentes desde su propio Claude Pro (lo paga cada una), sin acceso a GitHub ni a Vercel (`contenido/agentes-web/README.md`).
Alejandro les comparte su estudio, su estrategia y los documentos de Claude invitando a su Gmail («Invite people by
email», «Can edit»). Nunca les des acceso al código ni le pongas una clave a su Claude. Si cambias un agente
(`.claude/skills/`) o un documento que citan, en la misma tarea: `npm run paquete-agentes`, sube los zips a Drive →
Kangen PRO TEAM → «Agentes de Claude (para subir a la organización)» (id `1YMn-nNSC2rvmjfHGYICNFErYPYcrI7fq`)
sustituyendo los anteriores, y apunta en Pendientes, en la pestaña de cada persona, que vuelva a subirlos a su Claude
(Ajustes → Capacidades → Skills), con el WhatsApp ya escrito en la de Alejandro.

## Datos personales

El repositorio es **público**. La historia de cada persona (cuestionario de Drive y ficha de voz en Notion), su salud,
su familia, los datos de los leads y las claves nunca se escriben aquí.

## Traspaso de sesión (16 de noviembre de 2026) — estado y lo que falta

Escrito para que una sesión nueva siga sin leer la conversación anterior. Cuando las dos tareas de abajo estén hechas,
quita esta sección (las reglas ya están en `contenido/carruseles/README.md`, `contenido/videos/README.md` y
`contenido/estudio/README.md`).

### Reglas de diseño y vídeo vigentes (de las opiniones de Alejandro del 14 y 16 de noviembre)

Carruseles (`contenido/carruseles/README.md`):
- **Largo según la idea**: 3 imágenes para una idea con giro, 5 para una lista corta o un antes y después, de 7 a 10
  para una historia o una guía. Como mucho 25 palabras por imagen.
- **Un estilo por carrusel** (`album`, `revista`, `tipografico`, `documental`: clase en `<body>`), distinto del de los
  tres carruseles anteriores de esa persona; se apunta en la propiedad **Estilo visual** de la pieza en Notion.
- **Al menos 4 composiciones distintas** y nunca dos iguales seguidas. Titulares con `class="ajustar"`; lo que no lleva
  foto, en `<div class="centro">`: nada de media imagen vacía.
- **Dibujos que señalan** (flecha, círculo, subrayado, rotulador, cinta, pegatina, nota a mano): como mucho dos por
  imagen. El círculo, solo en una palabra de la primera línea del titular; si no, subrayado.
- **Al menos 3 fotos reales** distintas (en tipográfico, 1 o 2). Nada de IA sin etiqueta.
- **Caras enteras y sin texto encima**: si la foto no cabe en la composición, se cambia la foto o la composición. Una
  selfie no va en una franja estrecha (`partida`, `mitad`). Se revisa cada imagen a tamaño real.
- Textos: solo frases que salgan de su ficha de voz (nunca sentimientos inventados); nada de dinero, ingresos ni
  «libertad financiera», salud, producto, marca ni agua, ni lujo o viajes como resultado. Gemma ⚠ (nunca en público):
  salud, producto, el nombre de su empresa, su jefe, el familiar que dudó (sin nombre ni parentesco), su piso, ingresos;
  el embarazo solo si ella lo decide; nunca la cara de su hijo; su pareja no sale en fotos hasta que ella diga que puede
  (la pregunta ya está en Pendientes).

Vídeos (`contenido/videos/README.md`):
- Cada texto en pantalla se queda **quieto y entero** el tiempo de leerlo: `max(2, 0.7 + palabras / 3)` segundos.
- Cada clip se mira entero antes (`npm run video -- <carpeta> --planos`): fuera los que enseñan suelo, pies o techo,
  movidos u oscuros, caras de otras personas, matrículas, su empresa o un viaje como resultado.
- La voz publicada es siempre la suya (`vozDePrueba: true` marca una de prueba). Las fotos se recortan alrededor de la cara.

### Herramientas y cómo se usan

| Archivo | Qué hace | Uso |
|---|---|---|
| `contenido/carruseles/plantilla.html` | Plantilla de todos los carruseles: colores de la persona en `:root`, los 4 estilos, 18 composiciones de ejemplo (cada una tras `<!-- N nombre -->`), dibujos (`<symbol>` de flechas y destellos) y `ajustarTitulares()` | Se copia como `carrusel.html` a una carpeta **fuera del repositorio** con las fotos al lado; se dejan solo las imágenes que se usan |
| `scripts/carrusel.mjs` | Carga las letras, ajusta los titulares, coloca cada foto según sus caras (`scripts/encuadre.mjs`, face-api en Chromium), escribe `encuadre.json`, hace `01.png…` (1080 × 1350) y `hoja.png`. Termina con error 2 si una cara queda cortada o con texto encima | `npm run carrusel -- <carpeta> [--sin-encuadre]` |
| `scripts/carrusel-animado.mjs` | Imágenes con movimiento y Reels animados (HyperFrames): antes de renderizar comprueba caras y tiempo de lectura | `npm run carrusel-animado -- <carpeta> [salida.mp4]` |
| `scripts/video.mjs` | Vídeo vertical con su voz (transcrita, con subtítulos) o con textos sobre clips y fotos, desde `pieza.json` | `npm run video -- <carpeta> [--planos]` |
| `contenido/estudio/estudio.html` | Fuente de la página del **estudio**: ver cada carrusel tal cual saldrá y cambiar fotos (galería), encuadre (arrastrar), textos, formato, dibujos, imágenes, composición y estilo; montar vídeos (planos, trozo de cada clip, textos, tiempos, gancho y nota de voz). Avisa en directo de caras cortadas, textos que no se leen y normas | No se abre tal cual: se monta con `npm run estudio -- pagina` |
| `scripts/estudio.mjs` | `pagina [salida] --nombre <Nombre>`: monta la página con los estilos y composiciones de la plantilla. `caras <carpeta>`: escribe `caras.json`. `preparar <pieza.json> <carpeta>`: convierte una pieza del estudio (también el JSON que guarda ArtifactData con `out_dir`) en `carrusel.html` o `pieza.json` | Detalle en `contenido/estudio/README.md` |

**Estudio de Gemma**: <https://claude.ai/artifact/ELC7c2bgMHTVcdu8GJ1sZy> (privado: solo Alejandro hasta que lo comparta).
Publicado desde `dist/estudio-gemma.html` (`npm run estudio -- pagina dist/estudio-gemma.html --nombre Gemma`); desde
otra sesión, se vuelve a publicar con el Artifact tool pasando su `url` (antes, `action: "read"`). Capacidades `db` y
`assets`. Su base de datos: `ajustes/persona` (nombre y colores), `fotos/<id>` (19 fotos con sus caras y 6 clips; no se
han subido `playa-pareja` ni `glaciar` ni el clip de la caminata con caras de otras personas) y `piezas/<código>`
(estado `borrador` → `listo` → `hecho`). Probado en Chromium con una base de datos simulada (escritorio y móvil), y la
subida de voz en m4a/webm la acepta el almacén; todavía no lo ha usado una persona en claude.ai. El detector de caras de
las fotos que se suban desde el estudio se carga de jsDelivr: si claude.ai lo bloquea, la foto queda «sin comprobar» y
se completa con `npm run estudio -- caras` + ArtifactData. Hay dos archivos de prueba de audio en su almacén (ids
`9e607165…` y `856a1f7d…`); no molestan.

### Las piezas de Gemma de los días 1 a 28 que no necesitan grabación

La versión 2 de cada una (todas sin caras cortadas ni tapadas según `npm run carrusel`) está en su estudio, en
`borrador`. Las imágenes generadas solo estaban en la carpeta temporal de la sesión: se vuelven a sacar del estudio.

| Día | Código | Pieza | Formato | v1 | v2 en el estudio | Falta |
|---|---|---|---|---|---|---|
| 1 | CT-2 | Me llamo Gemma y esto es lo que estoy construyendo | Carrusel | Editado (Drive en **Archivo**) | Álbum, 6 imágenes | Aprobación → generar → Drive |
| 2 | CT-3 | Un día más · No estaba mal en mi trabajo | Clip corto | Editado (enviado en el chat) | Vídeo con los clips del café de la calle (enseñan el suelo) | Clips nuevos de Gemma del café en casa → cambiarlos en el estudio → `npm run video` |
| 5 | CT-6 | La frase · Este año me he dado permiso | Imagen | Editado | Álbum, polaroid | Aprobación → generar → Drive |
| 7 | CT-8 | No hace falta dejarlo todo para empezar algo nuevo | Carrusel | Editado | Tipográfico, 5 | Aprobación → generar → Drive |
| 9 | CT-10 | No hace falta estar mal para querer más | Carrusel | Editado | Revista, 7 | Aprobación → generar → Drive |
| 12 | CT-12 | La frase · Antes pensaba que la estabilidad era lo más seguro | Imagen | Editado | Documental, mitad | Aprobación → generar → Drive |
| 14 | CT-14 | ¿Qué estoy construyendo exactamente? | Carrusel | Editado | Documental, 8 | Aprobación → generar → Drive |
| 16 | CT-16 | El techo: mi sueldo solo sube con el IPC | Carrusel | Editado (con imagen con movimiento) | Álbum, 3 | Aprobación → generar → Drive |
| 17 | CT-17 | Lo que cuesta quedarse cinco años igual | Reel animado | Editado con la plantilla antigua: 12 textos no daba tiempo a leerlos | No va al estudio | Rehacerlo con `contenido/videos/plantilla-reel-animado.html` y `npm run carrusel-animado`, y entregarlo |
| 19 | CT-19 | La frase · La mente nos fabrica miedos | Imagen | Editado | Tipográfico, chat | Aprobación → generar → Drive |
| 21 | CT-21 | Dudas reales · ¿Y si tu pareja no lo ve? | Carrusel | Editado (usaba la foto con su pareja) | Tipográfico, 7, sin la foto de la pareja | Aprobación → generar → Drive |
| 23 | CT-23 | Fui yo la que dejé que eso se normalizara | Carrusel | Editado | Revista, 7 | Aprobación → generar → Drive |
| 26 | CT-26 | La frase · Nunca es tarde | Imagen | Editado | Revista, partida | Aprobación → generar → Drive |
| 28 | CT-28 | Dudas reales · ¿No sabrías venderlo? Yo tampoco | Carrusel | Editado | Documental, 7 | Aprobación → generar → Drive |

Son 14 filas: la lista de «15 piezas» de la sesión anterior contaba un carrusel del día 11, pero en el Calendario no hay
fila de Gemma para el día 11 (el Código pasa de 11 = día 10 a 12 = día 12). Los días 3, 4, 6, 8, 10, 13, 15, 18, 20, 22,
24, 25 y 27 necesitan que grabe (están en Guion o Idea). La semana 1 sale el **30 de noviembre**.

### Tarea 1 · Estudio dentro de Claude — lo que falta

1. **Pendientes del equipo** (<https://claude.ai/artifact/6TvDsNPr2Cz3mGE7Jf4SAS>, documento de Claude: leerlo antes de
   tocarlo). Añadir, masticado como dice «Lista de pendientes»:
   - Pestaña Alejandro: **Comparte tu estudio con Gemma** (2 min): abrir el estudio → Compartir → su cuenta de Claude
     como **Editor** (así puede subir fotos y clips). **Revisa las piezas v2 en tu estudio** (15 min): cambiar lo que no
     guste y pulsar «Listo» en cada una; primero las de la semana 1 (días 1, 2, 5 y 7). Y en la tarea que ya existe de
     volver a subir los 6 agentes (ahora cada persona en su Claude), cambiar la fecha a «16 de noviembre, 19:42» (zips
     nuevos ya en Drive → «Agentes de Claude (para subir a la organización)»).
   - Pestaña Gemma: **Graba tu café en casa y súbelo a tu estudio** (5 min): 2 o 3 clips de 5 a 8 s, en vertical, sin
     suelo ni caras de otras personas; en el estudio, vídeo del día 2 → Planos → Cambiar → Subir fotos o clips.
2. Cuando alguien lo use de verdad, mirar si algo falla en claude.ai (detector de caras, subida de voz, guardado) y
   arreglarlo en `contenido/estudio/estudio.html`, volver a montar y publicar en la misma `url`.

### Tarea 2 · Versión 2 de las piezas de Gemma — lo que falta

1. **Notion** (Calendario, `collection://da1053df-19d6-4cfc-8547-c77f511392ae`): en cada pieza de la tabla, **Estilo
   visual** (CT-2 Álbum, CT-8 Tipográfico, CT-10 Revista, CT-14 Documental, CT-16 Álbum, CT-21 Tipográfico, CT-23
   Revista, CT-28 Documental, CT-6 Álbum, CT-12 Documental, CT-19 Tipográfico, CT-26 Revista) y en **Notas** «Versión 2
   en el estudio de Gemma» con el enlace. El Estado sigue en Editado hasta que la aprueben.
2. **Generar lo aprobado** (en cada sesión, lo que esté en «Listo»): pasos en `contenido/estudio/README.md` → «Generar
   lo que está Listo». Subir los PNG a Drive → `Landing Kangen Gemma/05 Contenido redes/Editados/CT-<código> <título> (v2)`
   (el conector sube archivos de hasta unos 3 MB), poner esa carpeta en **Archivo** y en el estudio `estado: "hecho"`,
   `drive` y `resultado`. Si el documento de estrategia de Gemma en Drive enlaza las versiones 1, cambiar los enlaces.
3. **Día 17**: rehacer el Reel animado con la plantilla nueva (tabla de arriba).
4. **Día 2**: cuando lleguen sus clips del café en casa (tarea de Gemma de arriba).
5. Si se quieren imágenes con movimiento en las v2 (las v1 de los días 1, 7 y 16 tenían), hacerlas con
   `npm run carrusel-animado` a partir de la imagen ya aprobada.
