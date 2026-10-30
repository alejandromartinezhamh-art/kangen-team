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
1. `npm run nueva-persona -- "<Nombre>"`: crea `equipo/<nombre>/` a partir de `plantilla/`.
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
3. Textos, colores, letras, fotos y enlaces en `sitio/src/contenido.json` (nunca escritos en los componentes: así se pueden editar); portada en `sitio/src/paginas/Inicio.tsx`.
4. Una landing por campaña o enfoque en `sitio/src/landings/`.
5. Publicar (Cloudflare o Vercel, ver README del repositorio). El nombre del proyecto y el dominio, con su nombre y sin la marca (p. ej. `gemma-ona.vercel.app`).
6. **Editor visual**: en su proyecto de Vercel, `EDITOR_GITHUB_TOKEN` (el token del equipo) y `EDITOR_CLAVE` (una contraseña para ella). Envíale el mensaje *Tu editor* de `02 Mensajes de WhatsApp` con `https://<su-web>/editar` y la contraseña. Desde ahí cambia ella sola textos, colores, letras, fotos, el vídeo y los emails, y publica. Detalle en el README del repositorio ("Editor visual").
7. Embudo de Instagram (opcional): bio → `/l/instagram` (un solo botón) → `/cuestionario` (preguntas en `sitio/src/contenido.json`, cada una con su columna fija en la hoja) → email con el webinar → `/webinar` (el botón de WhatsApp sale al ver el 80 %). Los leads se guardan en una hoja de Google de su carpeta de Drive, con el script de `compartido/apps-script/`, y se gestionan en su CRM. Para montarlo a otra persona: `compartido/apps-script/README.md` → "Otra persona del equipo" (ejemplo hecho: Gemma, la misma web y el mismo embudo que Alejandro, con sus colores en `equipo/gemma/sitio/src/contenido.json` → `colores`).
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

- Cada respuesta del cuestionario es una idea de publicación (especialmente los bloques 2, 4, 6 y 8).
- Una ficha por campaña en `anuncios/` y el mismo mensaje en anuncio y landing.

## Normas (siempre)

- Se habla del negocio y del cambio de estilo de vida, **nunca del producto**.
- **Nada de cifras de ingresos**, promesas económicas, lujo como gancho ni afirmaciones de salud.
- No usar la marca en dominios, nombres de página, logos ni anuncios sin autorización.
- No presentarlo como oferta de empleo.
- Siempre en primera persona, dejando claro que los resultados dependen de cada persona.

Detalle completo en `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md`.

## Replicar el sistema con otro equipo

1. Duplica el repositorio (o crea uno nuevo desde él) y vacía `equipo/`.
2. Revisa `estrategia/mensaje.md` y `estrategia/normas-comunicacion.md` para el nuevo equipo.
3. En Drive, crea la carpeta raíz del equipo y copia dentro la carpeta `Templates` entera.
4. Da de alta a cada persona con la Fase 1.
