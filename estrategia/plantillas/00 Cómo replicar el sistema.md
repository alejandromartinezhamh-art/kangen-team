# Cómo replicar el sistema

Guía para incorporar a una persona nueva al equipo y para montar este mismo sistema (web + landings + contenido + anuncios) con otro grupo.

Todo lo que se usa está en la carpeta **Templates** de Drive (`Kangen PRO TEAM/Templates`) y en `estrategia/plantillas/` del repositorio.

## Qué hay en Templates

| Archivo | Para qué sirve |
|---|---|
| 00 Cómo replicar el sistema | Esta guía |
| 01 Cuestionario historia y avatar (plantilla) | El cuestionario en blanco que rellena cada persona nueva |
| 02 Mensajes de WhatsApp | Textos listos para copiar: bienvenida, envío del cuestionario, recordatorio |
| 03 Checklist persona nueva | Lista de pasos para no olvidar nada |
| Landing Kangen NOMBRE (estructura de carpetas) | Las 8 subcarpetas que tiene que tener cada persona en Drive |

## El sistema en 5 fases

1. **Alta**: carpeta en Drive y carpeta en el repositorio.
2. **Material**: la persona rellena el cuestionario y sube fotos y vídeos.
3. **Estrategia**: con el cuestionario se definen su avatar, su enfoque (madre/padre, autónomo, sostenibilidad…) y su mensaje.
4. **Web y landings**: brief, diseño, textos y publicación.
5. **Contenido y anuncios**: guiones e ideas sacadas de su historia, siempre llevando a su landing.

Regla de oro: **solo se avanza con lo que la persona entrega.** Si no hay cuestionario, no hay web.

## Fase 1 · Alta de una persona nueva

### En Drive
1. Dentro de `Kangen PRO TEAM`, crea la carpeta `Landing Kangen <Nombre>`.
2. Crea dentro las 8 subcarpetas (copia los nombres de la carpeta de estructura de Templates):
   `01 Fotos originales`, `02 Fotos seleccionadas web`, `03 Vídeos`, `04 Logo y marca`, `05 Contenido redes`, `06 Anuncios`, `07 Textos`, `08 Design`.
3. Haz una copia de `01 Cuestionario historia y avatar (plantilla)` (clic derecho → Hacer una copia), muévela a su carpeta y renómbrala `Cuestionario historia y avatar - <Nombre>`.
4. Comparte la carpeta con la persona como **Editor**.

### En el repositorio
1. `npm run nueva-persona -- "<Nombre>" <proyecto>.vercel.app`: crea `equipo/<nombre>/` a partir de `plantilla/`, con su web (embudo y editor) lista para personalizar.
2. Pon en `equipo/<nombre>/README.md` el enlace a su carpeta de Drive.

### Mensaje
Envía el **mensaje de bienvenida** de `02 Mensajes de WhatsApp`.

## Fase 2 · Material

- La persona rellena el cuestionario: lo mejor es por audio y transcrito, 60-90 minutos.
- Sube fotos a `01 Fotos originales` y vídeos a `03 Vídeos`.
- No se persigue a nadie: un único recordatorio a la semana (mensaje de recordatorio) y ya está.

## Fase 3 · Estrategia (con el cuestionario relleno)

Del cuestionario se saca:

| Bloque del cuestionario | Qué se define |
|---|---|
| 0 · Enfoque | Su nicho o "puerta de entrada" |
| 2 · El dolor + 7 · Persona ideal | El avatar: a quién le habla, con sus frases literales |
| 3-4 · Descubrimiento y camino | Su historia (camino del héroe) |
| 5 · Método | Sección "Cómo trabajamos" |
| 6 · Resultados | Antes / después (nunca cifras de dinero) |
| 8 · Objeciones | Preguntas frecuentes y textos junto al formulario |
| 9 · Voz | Tono de los textos |
| 12 · Cierre | Titular y llamada a la acción |

Resultado: `equipo/<nombre>/brief.md` completo.

## Fase 4 · Web y landings

1. `brief.md` completo → `design.md` (colores, tipografías, estilo, a partir de sus referencias).
2. Fotos elegidas a `02 Fotos seleccionadas web` y optimizadas a `assets/` del repositorio (JPG/WebP, máx. 2000 px, < 500 KB).
3. `npm run nueva-persona -- "<Nombre>" <proyecto>.vercel.app` ya le deja la web completa con el embudo y el editor: las páginas son las mismas para todo el equipo (`compartido/src/embudo`) y no se copian ni se tocan por persona.
4. Lo suyo va en `equipo/<nombre>/sitio/`: textos, colores, letras, fotos, enlaces y emails en `src/contenido.json` (nunca escritos en el código: así se pueden editar); nombre, dominio, email y datos legales en `src/config.ts`; colores de partida en `src/index.css` y el color de fondo en `index.html` (theme-color); fotos `foto.jpg` (retrato) y `foto-email.jpg` (cuadrada, para la firma) en `public/`.
5. Publicar en Vercel (ver README del repositorio): un proyecto por persona, Root Directory `equipo/<nombre>/sitio`. El nombre del proyecto y el dominio, con su nombre y sin la marca (p. ej. `gemma-ona.vercel.app`). Su web principal (`/`) se publica cuando los textos están revisados con las normas (`webPublicada` en `src/App.tsx`); hasta entonces la raíz lleva a `/l/instagram`. Activa también *Analytics → Enable* en el proyecto para ver las visitas (sin cookies).
6. **Editor visual**: en su proyecto de Vercel, `EDITOR_GITHUB_TOKEN` (el token del equipo) y `EDITOR_CLAVE` (una contraseña para ella). Envíale el mensaje *Tu editor* de `02 Mensajes de WhatsApp` con `https://<su-web>/editar` y la contraseña. Desde ahí cambia ella sola textos, colores, letras, fotos, el vídeo y los emails, y publica. Detalle en el README del repositorio ("Editor visual").
7. **Embudo de Instagram**: bio → `/l/instagram` (un solo botón) → `/cuestionario` (preguntas en `src/contenido.json`, cada una con su columna fija en la hoja) → email con el webinar → `/webinar` (el botón de WhatsApp sale al ver el 80 %). Los leads se guardan en una hoja de Google de su carpeta de Drive, con el script de `compartido/apps-script/`, y se gestionan en su CRM. Para montarlo: `compartido/apps-script/README.md` → "Otra persona del equipo" (ejemplos hechos: Gemma y Helena).
   - Necesitas de ella: una foto para la página de Instagram y la firma del email, su WhatsApp y el vídeo del webinar (estos los puede poner o cambiar ella desde su editor).
   - Los textos del email del webinar y del recordatorio se cambian en su editor (`/editar` → Emails).
   - Mejor que instale el script con su propia cuenta de Google: así los emails salen de su Gmail y las respuestas le llegan a ella.

Estructura de la landing (en este orden):
1. Titular con el dolor de su avatar (sus palabras).
2. "¿Te pasa esto?": 3-5 frases de su día a día de antes.
3. Mi historia: antes → momento de quiebre → descubrimiento → camino.
4. Cómo trabajamos: 3-5 pasos, tiempo real, acompañamiento.
5. Qué ha cambiado: antes / después en tiempo, familia y confianza.
6. Preguntas frecuentes: las 4 grandes objeciones respondidas.
7. Formulario: "¿Quieres saber cómo trabajamos? Lo hablamos sin compromiso."

## Fase 5 · Contenido y anuncios

Todo está en `estrategia/marketing.md` (la estrategia) y `contenido/README.md` (el día a día). Para una persona nueva:

1. **Su historia y su voz**: en Claude Code, «entrevístame para mi historia» (agente `entrevista-historia`), o con su
   cuestionario de historia y avatar. Queda en `equipo/<nombre>/contenido/voz.md`.
2. **Drive**: dentro de `05 Contenido redes`, las carpetas `Brutos`, `Editados` y `Publicados`.
3. **Notion → CONTENIDO Y ANUNCIOS**: añadir su nombre a la opción «Persona» si no está, y filtrar el calendario por ella.
4. **Su semana**: el lunes, «prepara el plan de la semana de <nombre>» (agentes investigador, estratega, guionista y
   revisor). Graba en una sesión de 1 hora y aprueba las piezas en Notion. Nada se publica sin su aprobación.
5. **Seguimiento**: cada pieza tiene un código (`CT-123`) que va en los enlaces (`/l/instagram?c=CT-123`) y llega a su
   hoja de leads.
6. **Anuncios**: solo cuando haya piezas con leads cualificados, desde su propia cuenta publicitaria, y nunca sin la
   respuesta por escrito de Enagic.

## Normas (siempre)

- Se habla del negocio y del cambio de estilo de vida, **nunca del producto**.
- **Nada de cifras de ingresos**, promesas económicas, lujo como gancho ni afirmaciones de salud.
- No usar la marca en dominios, nombres de página, logos ni anuncios sin autorización.
- No presentarlo como oferta de empleo.
- Siempre en primera persona, dejando claro que los resultados dependen de cada persona.
- Enagic: nada de salud (tampoco en testimonios) ni ingresos; el material de marketing y la publicidad pagada necesitan su visto bueno por escrito.
- TikTok prohíbe anunciar el multinivel y limita ese contenido: allí, solo estilo de vida y crecimiento personal.
- Contenido realista generado con IA: con la etiqueta de IA de cada red.

Detalle completo en `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md`.

## Replicar el sistema con otro equipo

1. Duplica el repositorio (o crea uno nuevo desde él) y vacía `equipo/`.
2. Revisa `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md` para el nuevo equipo.
3. En Drive, crea la carpeta raíz del equipo y copia dentro la carpeta `Templates` entera.
4. Da de alta a cada persona con la Fase 1.
