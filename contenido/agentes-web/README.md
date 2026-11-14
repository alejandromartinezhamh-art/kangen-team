# El equipo en Claude (plan Team)

Gemma, Helena y quien entre trabajan el contenido, la marca y el diseño desde su propio Claude (web, escritorio o móvil),
con los mismos agentes que usamos aquí y sin poder tocar el código. Claude está en un plan Team: Alejandro es el
propietario de la organización y las demás son miembros.

## Quién tiene acceso a qué

| Qué | Alejandro | Resto del equipo |
|---|---|---|
| Claude (organización Team) | Propietario | Miembro |
| Agentes `guion`, `aprender`, `revisar-normas`, `plan-semanal`, `entrevista-historia` | Los sube a la organización | Les aparecen solos |
| Notion → CONTENIDO Y ANUNCIOS | Todo | Editar el Calendario, el Radar y «Propuestas para todo el equipo». De las Fichas de voz, **solo la suya** (lleva su historia personal) |
| Drive | Todo | Su carpeta `Landing Kangen <Persona>` |
| Su web | Todo | Su editor (`/editar`): textos, colores, fotos y emails |
| Documentos de Claude (ideas, carruseles, diseño) | Todo | Los que se le compartan con **Compartir**, para editar o comentar |
| GitHub y Vercel | Todo | **Nada**. Así nadie puede cambiar el código, ni ellas ni su Claude |

El agente `investigar-contenido` no va en el paquete: necesita herramientas que solo están en las sesiones con el
repositorio, así que la investigación de los lunes se sigue haciendo desde aquí.

## Subir o actualizar los agentes

1. `npm run paquete-agentes` → `dist/agentes-web/<agente>.zip`, uno por agente. Cada zip lleva el agente con una
   descripción corta (Claude admite 200 caracteres), una nota de cómo trabajar sin el repositorio y, en `repo/`, los
   documentos que cita (normas, estrategia, formatos, ganchos, aprendizajes, `design.md` de cada persona y la plantilla
   de carruseles). De la configuración de cada web solo va el dominio.
2. Súbelos a Drive → Kangen PRO TEAM → **Agentes de Claude (para subir a la organización)**, sustituyendo los anteriores.
3. Alejandro, en claude.ai → Ajustes de la organización → Skills (puede aparecer como «Plugins y skills»): quita la
   versión anterior de cada agente y sube el zip nuevo. Llega a todas sin que hagan nada.

Hay que repetirlo cada vez que cambie un agente (`.claude/skills/`) o un documento que citan. Quien lo cambie lo apunta
en Pendientes del equipo, en la pestaña de Alejandro.

## Lo que hace cada persona (una vez)

1. Aceptar la invitación a la organización que le llega por email.
2. Conectar **Notion** y **Google Drive** en Claude → Ajustes → Conectores. GitHub, no.
3. Pedirle cosas a Claude como: «Prepara el guion de la pieza CT-1», «Te doy mi opinión del carrusel: la portada me
   gusta, el texto de la 3 es demasiado largo», «Hazme el plan de la semana», «Actualiza mi ficha con esto».

## Lo que no se puede desde la web (y cómo se resuelve)

- **Escribir en el repositorio.** Lo que alguien aprende y vale para todo el equipo va a Notion → **Propuestas para
  todo el equipo** (`collection://41857db8-a618-8110-99bf-000bb8441638`). Una sesión con el repositorio lo aplica o lo
  descarta (agente `aprender`). Lo de una sola persona va directo a su ficha de voz, también desde la web.
- **Generar las imágenes de un carrusel** (`npm run carrusel`). Desde la web se deja el `carrusel.html` y la foto en su
  carpeta de Drive, con «Faltan las imágenes» en Notas de la pieza; las genera la siguiente sesión con el repositorio.
