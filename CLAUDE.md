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
   al que todavía no ha contestado), un contenido o una decisión. Nunca se queda solo en el chat o en un email.
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
A quién le hablamos: `estrategia/icp.md`. El contenido y los anuncios hablan de negocio, de cambiar de vida, de
alternativas y de invertir en uno mismo; nunca de Enagic, del producto ni del agua (eso llega en el webinar o en la
conversación), así que no necesitan aprobación de Enagic. Nada se publica ni se gasta en anuncios sin la aprobación de la
persona en Notion.

## Datos personales

El repositorio es **público**. La historia de cada persona (cuestionario de Drive y ficha de voz en Notion), su salud,
su familia, los datos de los leads y las claves nunca se escriben aquí.
