# Instrucciones para Claude

## Plantillas siempre al día (obligatorio)

Las plantillas son la forma de incorporar a gente nueva y de replicar el sistema. Tienen que reflejar siempre cómo trabajamos **hoy**.

Cada vez que cambie algo del proceso (preguntas del cuestionario, mensajes, pasos de alta, estructura de carpetas, estructura de las landings, normas, scripts…), en la misma tarea:

1. Actualiza `estrategia/plantillas/` en el repositorio.
2. Actualiza la carpeta **Templates** de Drive (`Kangen PRO TEAM/Templates`, id `154ciUgPYhPW7E5XPHwMpjLB1FHdhB9SZ`) con los mismos cambios.
3. Si cambia el cuestionario, regenera también la versión en blanco (sin nombre) y sustituye `01 Cuestionario historia y avatar (plantilla)` en ambos sitios.
4. Avisa al usuario de qué plantillas has actualizado.

Contenido actual de Templates:

| Archivo | Repositorio |
|---|---|
| 00 Cómo replicar el sistema (Google Doc) | `estrategia/plantillas/00 Cómo replicar el sistema.md` |
| 01 Cuestionario historia y avatar (plantilla).docx | `estrategia/plantillas/01 Cuestionario historia y avatar (plantilla).docx` |
| 02 Mensajes de WhatsApp (Google Doc) | `estrategia/plantillas/02 Mensajes de WhatsApp.md` |
| 03 Checklist persona nueva (Google Doc) | `estrategia/plantillas/03 Checklist persona nueva.md` |
| Landing Kangen NOMBRE (estructura de carpetas) | Estructura descrita en la guía 00 |

## Normas de comunicación

Antes de escribir cualquier texto público (webs, landings, anuncios, contenido), aplica `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md`.
`npm run comprobar` revisa los textos de las webs contra esas normas (también lo hace GitHub en cada cambio).

## Webs

Las páginas del embudo (Instagram, cuestionario, webinar y web) son las mismas para todo el equipo y viven en
`compartido/src/embudo`. Cada `equipo/<persona>/sitio` solo tiene sus datos (`config.ts`, `contenido.json`, `index.css`,
fotos). No copies páginas a una persona: cualquier cambio de diseño o de estructura se hace en `compartido` y llega a todas.

## Marketing y contenido

La estrategia de contenido y anuncios está en `estrategia/marketing.md`; el día a día, en `contenido/README.md`. Los agentes
(investigador, estratega, guionista, revisor, entrevista de historia) tienen sus instrucciones en `.claude/skills/`.
Nada se publica ni se gasta en anuncios sin la aprobación de la persona en Notion, y ningún anuncio de pago se lanza sin
la respuesta por escrito de Enagic.
