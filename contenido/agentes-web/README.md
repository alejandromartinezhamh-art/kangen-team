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

1. Tener Claude Pro con su Gmail.
2. Descargar los zip de «Agentes de Claude» y subirlos en Claude → Ajustes → Capacidades → Skills.
3. Conectar **Notion** y **Google Drive** en Claude → Ajustes → Conectores. GitHub, no.
4. Aceptar los emails de Claude con su estudio y su estrategia.
5. Pedirle cosas a Claude como: «Prepara el guion de la pieza CT-1», «Te doy mi opinión del carrusel: la portada me
   gusta, el texto de la 3 es demasiado largo», «Hazme el plan de la semana», «Actualiza mi ficha con esto».

## Lo que no se puede desde la web (y cómo se resuelve)

- **Escribir en el repositorio.** Lo que alguien aprende y vale para todo el equipo va a Notion → **Propuestas para
  todo el equipo** (`collection://41857db8-a618-8110-99bf-000bb8441638`). Una sesión con el repositorio lo aplica o lo
  descarta (agente `aprender`). Lo de una sola persona va directo a su ficha de voz, también desde la web.
- **Generar las imágenes de un carrusel** (`npm run carrusel`). Desde la web se deja el `carrusel.html` y la foto en su
  carpeta de Drive, con «Faltan las imágenes» en Notas de la pieza; las genera la siguiente sesión con el repositorio.
