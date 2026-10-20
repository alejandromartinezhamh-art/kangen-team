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

## Repositorios

- Todas las webs de Kangen (la de Alejandro y las del equipo) viven en este repositorio, `kangen-team`, y sus proyectos de Vercel se conectan a él.
- La web de headhunting de Alejandro (proyecto de Vercel `amhh`, repositorio `amhh`) es aparte: nunca va en un repositorio de Kangen ni se toca desde aquí.

## URL de las webs

Cada web se publica con el **nombre y el apellido** de la persona, nunca con la marca: proyecto de Vercel (o Cloudflare) `nombre-apellido`,
en minúsculas y sin tildes ni ñ (`gemma-ona.vercel.app`). Si ya está cogido, todo junto (`alejandromartinez.vercel.app`).
Comprueba antes que la URL está libre y, al publicar, actualiza su `README.md`, `dominio` en `config.ts` y su entrada en `PERSONAS` de `Embudo.gs`.

## Normas de comunicación

Antes de escribir cualquier texto público (webs, landings, anuncios, contenido), aplica `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md`.
