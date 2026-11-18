# Sistema de contenido y anuncios

Cómo funciona el día a día de `estrategia/marketing.md`: dónde está cada cosa y qué hace cada agente.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Estrategia, normas, mensaje y cliente ideal | `estrategia/marketing.md`, `normas-comunicacion.md`, `mensaje.md`, `icp.md` |
| Perfil de cada red y plan de 100 días (el método) | `estrategia/perfil-y-100-dias.md` |
| Formatos y banco de ganchos | `contenido/formatos.md`, `contenido/ganchos.md` |
| Lo aprendido (todo el equipo) | `contenido/aprendizajes-equipo.md` |
| Plantilla de carruseles | `contenido/carruseles/` (`npm run carrusel`) |
| Vídeos con su voz o con textos en pantalla | `contenido/videos/` (`npm run video`) |
| Publicar, palabra clave y métricas (Zernio) | `contenido/publicar/` (`npm run publicar`) |
| La historia de cada persona (fuente) | Drive → `Landing Kangen <Persona>` → `Cuestionario historia y avatar - <Persona>.docx` |
| Su voz, su historia y su persona ideal (lo que leen los agentes) | Notion → CONTENIDO Y ANUNCIOS → **Fichas de voz** |
| Lo aprendido de cada persona | Datos: `equipo/<persona>/contenido/aprendizajes.md` · Opiniones sobre su voz: su ficha de voz, sección «Feedback y aprendizajes» |
| Calendario, radar y anuncios (aprobar aquí) | Notion → ENAGIC KANGEN - AGUA → **CONTENIDO Y ANUNCIOS** |
| Vídeos | Drive → `Landing Kangen <Persona>/05 Contenido redes/` → `Brutos`, `Editados`, `Publicados` |
| Instrucciones de los agentes | `.claude/skills/<agente>/SKILL.md` |
| El equipo en Claude (plan Team): accesos y paquete de agentes | `contenido/agentes-web/README.md` (`npm run paquete-agentes`) |

### Notion (para los agentes)

| Base | Fuente de datos |
|---|---|
| Calendario de contenido | `collection://da1053df-19d6-4cfc-8547-c77f511392ae` |
| Radar de referencias | `collection://ca35d60d-116e-4405-a39a-4c21cfc9c4d7` |
| Anuncios | `collection://782cf162-312e-435a-8b04-26d329e839a5` |
| Fichas de voz | `collection://8fdf7563-98ef-41e5-8899-19349d98657d` |
| Propuestas para todo el equipo | `collection://41857db8-a618-8110-99bf-000bb8441638` |

Página: https://app.notion.com/p/40a57db8a61881cabe44ec0a24cde244

## Antes de nada: la ficha de voz

Sin la historia real de la persona, los guiones suenan genéricos. Por eso:

1. Cada persona rellena su **cuestionario de historia y avatar** en Drive (escrito o con notas de voz transcritas), o
   hace la entrevista con Claude («entrevístame para mi historia»), que es el mismo cuestionario en conversación.
2. Un agente pasa las respuestas a su **ficha de voz** en Notion, separando lo que se puede contar en público de lo que
   no (salud, producto, cifras, familia), y apunta en **Faltan** lo que queda.
3. **Mínimo para publicar**: bloques 0 (enfoque), 1, 2, 7 y 9 → Estado «Lista para guiones». Sin eso, el estratega no
   prepara la semana.

**El repositorio es público**: ninguna historia, cuestionario relleno, dato de salud o de familia, ni datos de leads se
guardan aquí.

## La semana

0. **Una vez por persona**: `estrategia-100-dias` define su perfil (presentación, fijadas, destacadas) y sus 100
   primeras piezas en orden, con **Día** y **Fase** en el Calendario, y le deja en Drive la lista de su primera grabación.
1. **Lunes**: `investigar-contenido` → `plan-semanal`, que toma las 7 piezas siguientes de su plan (y usa `guion` para
   cada una). Calendario listo en Notion.
2. **Sesión de grabación** (1 hora): la persona graba los guiones y sube los vídeos a `Brutos`.
3. Editor → `revisar-normas` → la pieza queda **Para aprobar**.
4. **La persona aprueba** en Notion (Estado → Aprobado). Nada se publica ni se gasta sin eso.
5. **Publicador**: en la siguiente sesión con el repositorio, lo aprobado se programa en Zernio a su hora
   (`npm run publicar`, Estado → Programado) y Zernio lo publica. **Analista**, cada día. **Domingo**: informe y
   aprendizajes.

## Cada opinión mejora el sistema

Cualquiera (Alejandro, la propia persona, otra del equipo) puede decir qué le gusta y qué no de una idea o de una pieza:
en el chat, en un comentario o en la columna «Tu comentario» del documento de ideas, o en la propiedad **Feedback** de
la pieza en el Calendario. Cada vez, el agente `aprender`:

1. Convierte la opinión en una regla y la apunta: lo de una persona, en su ficha de voz (sección «Feedback y
   aprendizajes», privada); lo que vale para todos, en `contenido/aprendizajes-equipo.md` o en la norma que toque.
2. Rehace la pieza (v2, v3…) y revisa las demás piezas de esa persona que aún no se han aprobado.
3. Cuando la pieza se aprueba o se publica, compara la versión final con la «Propuesta de Claude» que deja `guion` en
   la página y aprende de lo que cambió. Marca **Aprendido**.

`plan-semanal`, `guion` y `revisar-normas` leen esas reglas antes de escribir o revisar.

## Agentes

| Agente | Instrucciones | Estado |
|---|---|---|
| Entrevista de historia | `.claude/skills/entrevista-historia` | Listo |
| Investigador | `.claude/skills/investigar-contenido` | Listo |
| Estratega de perfil (100 días) | `.claude/skills/estrategia-100-dias` | Listo |
| Estratega | `.claude/skills/plan-semanal` | Listo |
| Guionista | `.claude/skills/guion` | Listo |
| Revisor | `.claude/skills/revisar-normas` | Listo |
| Aprendizaje | `.claude/skills/aprender` | Listo |
| Editor (vídeos y carruseles) | `.claude/skills/editor-video` · Carruseles: `contenido/carruseles/` | Listo (solo en sesiones con el repositorio) |
| Publicador | `npm run publicar` (Zernio) · `contenido/publicar/README.md` | Listo (solo en sesiones con el repositorio): falta la cuenta de Zernio y conectar las redes de cada persona |
| Analista | — | Fase 2: las métricas salen de `npm run publicar -- metricas`; falta la hoja de leads de cada persona |
| Anuncios | — | Fase 3: necesita la cuenta publicitaria y piezas que ya traigan leads cualificados |

Para usarlos: en Claude Code, pide por ejemplo «prepara el plan de la semana de Alejandro» o «entrevístame para mi
historia». El resto del equipo los usa desde su propio Claude, sin acceso al código: `contenido/agentes-web/README.md`. Las tareas programadas de los lunes y los domingos se activan cuando el piloto esté en marcha.

## Seguimiento de cada pieza

Cada pieza del calendario tiene un **Código** (`CT-123`). Todo enlace que lleve a la web lo incluye:
`https://<su-web>/l/instagram?c=CT-123`. El código llega a la columna **Origen** de la hoja de leads
(`cuestionario-instagram:CT-123`), y así el analista sabe qué pieza trajo a cada lead y si llegó a ser cualificado.
