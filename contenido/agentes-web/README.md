# El equipo en Claude (cada una con su Claude Pro)

Gemma, Helena y quien entre trabajan el contenido, la marca y el diseño desde su propio Claude (web, escritorio o móvil),
con los mismos agentes que usamos aquí y sin poder tocar el código. **No hay plan Team**: para crearlo hace falta un
email de empresa y el equipo trabaja con Gmail. Cada persona tiene su Claude Pro con su Gmail y lo paga ella.

## Quién tiene acceso a qué

| Qué | Alejandro | Resto del equipo |
|---|---|---|
| Claude | Su cuenta | Su propia cuenta Pro (sus chats son solo suyos y nadie más los ve) |
| Agentes `guion`, `aprender`, `revisar-normas`, `plan-semanal`, `estrategia-100-dias`, `entrevista-historia` | Deja los zip en Drive | Los sube cada una a su Claude |
| Notion → CONTENIDO Y ANUNCIOS | Todo | Editar el Calendario, el Radar y «Propuestas para todo el equipo». De las Fichas de voz, **solo la suya** (lleva su historia personal) |
| Drive | Todo | Su carpeta `Landing Kangen <Persona>` y, para leer, «Agentes de Claude» |
| Su web | Todo | Su editor (`/editar`): textos, colores, fotos y emails |
| Documentos y páginas de Claude (estudio, estrategia, Pendientes) | Todo | Los que se le compartan invitando a su Gmail |
| GitHub y Vercel | Todo | **Nada**. Así nadie puede cambiar el código, ni ellas ni su Claude |

El agente `investigar-contenido` no va en el paquete: necesita herramientas que solo están en las sesiones con el
repositorio, así que la investigación de los lunes se sigue haciendo desde aquí.

## Compartir algo de Claude con una persona

Desde el ordenador (en el móvil no se puede): abrir el estudio o el documento → **Compartir** → «Invite people by email»
→ su Gmail → «Can edit» → **Invite**. Le llega un email de Claude en inglés; entra con ese Gmail y pulsa «Accept and
open». Lo que se comparte así a una cuenta de fuera tiene límites (ayuda de Claude, «Share artifacts»): solo puede subir
imágenes y vídeos, y las partes de la página que usan Claude o conectores no le funcionan. En los documentos de Claude,
en cambio, puede pedirle a su propio Claude que trabaje en ellos.

## Subir o actualizar los agentes

1. `npm run paquete-agentes` → `dist/agentes-web/<agente>.zip`, uno por agente. Cada zip lleva el agente con una
   descripción corta (Claude admite 200 caracteres), una nota de cómo trabajar sin el repositorio y, en `repo/`, los
   documentos que cita (normas, estrategia, formatos, ganchos, aprendizajes, `design.md` de cada persona y la plantilla
   de carruseles). De la configuración de cada web solo va el dominio.
2. Súbelos a Drive → Kangen PRO TEAM → **Agentes de Claude (para subir a la organización)**, sustituyendo los anteriores.
   La carpeta está compartida (Lector) con el Gmail de cada persona.
3. Cada persona, en claude.ai → Ajustes → **Capacidades** → Skills: quita la versión anterior de cada agente y sube el
   zip nuevo. Quien cambie un agente lo apunta en Pendientes del equipo, en la pestaña de cada persona, y deja en la de
   Alejandro el WhatsApp ya escrito para avisarlas.

## Imágenes y vídeos con IA (Higgsfield)

Hay una sola cuenta de Higgsfield para todo el equipo, la de Alejandro, y solo se usa desde sus sesiones con el
repositorio. Las demás no necesitan cuenta: escriben lo que quieren en **Notas** de la pieza en Notion, empezando por
«Higgsfield:», y se genera en la siguiente sesión con los créditos de esa cuenta.

## Lo que hace cada persona (una vez)

Cada persona tiene su propio Claude Pro con su Gmail y **una sola guía** por donde empieza siempre: «<Nombre> ·
Empieza aquí (paso a paso)», un **Google Doc en su carpeta de Drive** (el de Gemma:
<https://docs.google.com/document/d/1HssyDy5awcX6Bo8_QKNIczdgRzOtTZI-6R2DxFi9Klw/edit>). Es un documento de Google y no
una página de Claude porque no da nada por sabido: no hace falta saber qué es un artefacto ni un proyecto. Lleva:

- **Lo que vas a usar**: qué es Claude, su proyecto «Mi contenido», su kit, Notion, Canva, su estudio y su Drive, en una
  frase.
- **Prepáralo una vez**, en 9 pasos con el botón exacto: aceptar las invitaciones (Notion, Claude y Drive; qué es una
  página de Claude), conectar **Notion** y **Google Drive** en Claude → Ajustes → Conectores (GitHub, no), descargar
  los zip de «Agentes de Claude» y subirlos en Claude → Ajustes → Capacidades → Skills, crear su proyecto **«Mi
  contenido»**, pegar **las instrucciones del proyecto** (el texto entero, para copiar), añadir su kit desde Google
  Drive, comprobar que funciona, su carpeta de Canva (cómo se cambia cada cosa; conectar Canva a su Claude es
  opcional), fijar su estudio para los vídeos, y Claude, Notion y Canva en el móvil.
- **Su semana**: mirar qué toca, grabar, retocar los carruseles en Canva y los vídeos en el estudio, aprobar en Notion
  y los 15 minutos diarios.
- **Lo que le escribes a tu Claude**: tablas «Para qué / Copia esto» con todos los textos (la semana, qué grabar,
  ideas nuevas para sus 100 días y crearlas en Notion, guion, gancho, opinión, revisar, aprobar, cambiar algo en el
  estudio, pedir una imagen con IA, su ficha, su presentación, historias, contestar mensajes y el kit nuevo).
- **Si algo no va** y **sus enlaces**.

Sale de `npm run kit-claude` (abajo, «Su kit de Claude»), con el kit: se escribe en `scripts/kit-claude.mjs`, así que
un cambio en los pasos o en los textos vale para todas. Se sube **en HTML** (`<carpeta>/<Nombre> · Empieza aquí.html`,
`create_file` con `contentMimeType: text/html`): en Markdown, Google Docs rompe las tablas.

Para una persona nueva: saca su guía, apunta en su pestaña de Pendientes qué compartirle (en Notion el Calendario, el
Radar, «Propuestas para todo el equipo» y solo su ficha de voz; en Canva su carpeta de «Kangen · Carruseles»
(`contenido/canva/README.md`); en Claude su estudio y su estrategia, «Invite people by
email», «Can edit»; en Drive la carpeta de los agentes como lector y su carpeta como editora) y el WhatsApp con el
enlace a la guía (mensaje 8b). Cuando cambie un enlace o llegue una herramienta nueva para ella, se vuelve a sacar.

## Su kit de Claude

Para que su Claude sepa todo lo que sabe el equipo y no dependa de nadie, cada persona tiene un **«Kit de Claude ·
<Nombre>»**: un documento de Google en su carpeta de Drive que añade a su proyecto «Mi contenido» (Archivos → + →
Google Drive). Lleva, en un solo documento:

1. Cómo trabajamos (decide Claude, nada en «Aprobado» sin ella, su voz, las normas, aprender de cada opinión).
2. Dónde está todo: sus enlaces de Notion, Canva, estudio, estrategia, Drive, web y hoja.
3. Notion: el Calendario con todas sus columnas y valores, cómo crear una pieza nueva, su ficha, el Radar y
   «Propuestas para todo el equipo».
4. Qué hacer con cada petición («¿qué toca?», ideas nuevas, guion, opiniones, revisión, ficha, diseño, IA, aprobar).
5. Lo que se hace fuera de su Claude (imágenes finales y vídeos, publicar, Higgsfield).
6. Su estrategia (copia de su documento de estrategia).
7. Las instrucciones de los 6 agentes.
8. El conocimiento del equipo: mensaje, normas, ICP, marketing, perfil y 100 días, contenido, formatos, ganchos,
   aprendizajes, carruseles, vídeos, su `design.md` y sus aprendizajes.

Cómo se saca (en una sesión con el repositorio):

1. Sus enlaces: ArtifactData → `get` de `ajustes/persona` en su estudio → `kit.enlaces` (y `kit.estrategiaDoc`).
   Guárdalos fuera del repositorio como `{ "clave", "nombre", "enlaces", "privados": ["<carpeta>/estrategia.md"] }`.
2. Su estrategia: `read` de su documento con el conector de Claude Docs (`payload: {"kind": "view"}`; el resultado se
   guarda en un archivo) → `python3 -I scripts/doc-claude-a-md.py <ese archivo> > <carpeta>/estrategia.md`.
3. `npm run kit-claude -- <carpeta>/enlaces.json` → `<carpeta>/Kit de Claude · <Nombre>.md` y su guía
   `<carpeta>/<Nombre> · Empieza aquí.html` (fuera del repositorio). `enlaces.empiezaAqui` es el enlace de su guía.
4. Súbelos a su carpeta de Drive como documentos de Google (`create_file`; el kit con `contentMimeType: text/markdown`,
   la guía con `text/html`), manda los anteriores a la papelera y apunta los ids nuevos en
   `ajustes/persona.kit.documento` y `ajustes/persona.kit.guia` (y el enlace de la guía en `kit.enlaces.empiezaAqui`).
   La guía solo se vuelve a subir si ha cambiado; si cambia su enlace, saca otra vez el kit, que la enlaza.
5. En su pestaña de Pendientes: «En Mi contenido → Archivos, quita el kit viejo y añade el nuevo». Su Claude también
   lo detecta solo (el kit le dice que mire si hay uno más nuevo en su Drive).

Se saca de nuevo cada vez que cambia un agente o un documento que cita (lo mismo que `npm run paquete-agentes`), su
estrategia o sus enlaces.

Desde su proyecto le pide cosas a Claude con los textos de su guía («Lo que le escribes a tu Claude») o con sus
palabras: «¿Qué tengo que grabar esta semana?», «Escríbeme el guion de la pieza del día 12», «Te doy mi opinión del
carrusel: la portada me gusta, el texto de la 3 es demasiado largo», «Dame 5 ideas nuevas para los días 40 a 45».

## Lo que no se puede desde la web (y cómo se resuelve)

- **Escribir en el repositorio.** Lo que alguien aprende y vale para todo el equipo va a Notion → **Propuestas para
  todo el equipo** (`collection://41857db8-a618-8110-99bf-000bb8441638`). Una sesión con el repositorio lo aplica o lo
  descarta (agente `aprender`). Lo de una sola persona va directo a su ficha de voz, también desde la web.
- **Generar las imágenes de un carrusel** (`npm run carrusel`). Desde la web se deja el `carrusel.html` y la foto en su
  carpeta de Drive, con «Faltan las imágenes» en Notas de la pieza; las genera la siguiente sesión con el repositorio.
