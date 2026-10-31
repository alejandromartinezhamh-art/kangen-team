# Sistema de contenido y anuncios

Cómo funciona el día a día de `estrategia/marketing.md`: dónde está cada cosa y qué hace cada agente.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Estrategia, normas y mensaje | `estrategia/marketing.md`, `normas-comunicacion.md`, `mensaje.md` |
| Formatos y banco de ganchos | `contenido/formatos.md`, `contenido/ganchos.md` |
| Lo aprendido (todo el equipo) | `contenido/aprendizajes-equipo.md` |
| La voz y la historia de cada persona | `equipo/<persona>/contenido/voz.md` |
| Lo aprendido de cada persona | `equipo/<persona>/contenido/aprendizajes.md` |
| Calendario, radar y anuncios (aprobar aquí) | Notion → ENAGIC KANGEN - AGUA → **CONTENIDO Y ANUNCIOS** |
| Vídeos | Drive → `Landing Kangen <Persona>/05 Contenido redes/` → `Brutos`, `Editados`, `Publicados` |
| Instrucciones de los agentes | `.claude/skills/<agente>/SKILL.md` |

### Notion (para los agentes)

| Base | Fuente de datos |
|---|---|
| Calendario de contenido | `collection://da1053df-19d6-4cfc-8547-c77f511392ae` |
| Radar de referencias | `collection://ca35d60d-116e-4405-a39a-4c21cfc9c4d7` |
| Anuncios | `collection://782cf162-312e-435a-8b04-26d329e839a5` |

Página: https://app.notion.com/p/40a57db8a61881cabe44ec0a24cde244

## La semana

1. **Lunes**: `investigar-contenido` → `plan-semanal` (que usa `guion` para cada pieza). Calendario listo en Notion.
2. **Sesión de grabación** (1 hora): la persona graba los guiones y sube los vídeos a `Brutos`.
3. Editor → `revisar-normas` → la pieza queda **Para aprobar**.
4. **La persona aprueba** en Notion (Estado → Aprobado). Nada se publica ni se gasta sin eso.
5. Publicador y analista, cada día. **Domingo**: informe y aprendizajes.

## Agentes

| Agente | Instrucciones | Estado |
|---|---|---|
| Entrevista de historia | `.claude/skills/entrevista-historia` | Listo |
| Investigador | `.claude/skills/investigar-contenido` | Listo |
| Estratega | `.claude/skills/plan-semanal` | Listo |
| Guionista | `.claude/skills/guion` | Listo |
| Revisor | `.claude/skills/revisar-normas` | Listo |
| Editor (HyperFrames y carruseles) | — | Fase 1: plantillas de vídeo y carrusel |
| Publicador | — | Fase 2: necesita las apps de Meta, YouTube y TikTok |
| Analista | — | Fase 2: necesita las apps y la hoja de leads de cada persona |
| Anuncios | — | Fase 3: necesita la respuesta de Enagic y la cuenta publicitaria |

Para usarlos: en Claude Code, pide por ejemplo «prepara el plan de la semana de Alejandro» o «entrevístame para mi
historia». Las tareas programadas de los lunes y los domingos se activan cuando el piloto esté en marcha.

## Seguimiento de cada pieza

Cada pieza del calendario tiene un **Código** (`CT-123`). Todo enlace que lleve a la web lo incluye:
`https://<su-web>/l/instagram?c=CT-123`. El código llega a la columna **Origen** de la hoja de leads
(`cuestionario-instagram:CT-123`), y así el analista sabe qué pieza trajo a cada lead y si llegó a ser cualificado.
