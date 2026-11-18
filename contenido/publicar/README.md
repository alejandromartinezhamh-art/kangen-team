# Publicar (Zernio)

El **publicador** deja programada cada pieza aprobada y la publica a su hora en Instagram, Facebook, TikTok y YouTube.
Debajo usa **Zernio** (zernio.com), que publica con las API oficiales de cada red. Así no hacen falta apps propias de
Meta, YouTube y TikTok, ni pasar la revisión de TikTok, ni Metricool. Si una red falla, Zernio lo reintenta y avisa.

Nada se programa sin la aprobación de la persona en Notion (Estado → Aprobado).

## Cuánto cuesta

Se paga por red conectada (cada Instagram, Facebook, TikTok o YouTube es una): las 2 primeras gratis, de la 3.ª a la
10.ª 6 $ al mes cada una, de la 11.ª en adelante 3 $. Instagram y TikTok de las 6 personas son 12 redes, unos 54 $ al
mes. Con las 4 redes de todas, unos 90 $. Empezamos con las 2 gratis: **Instagram y TikTok de Gemma** (su semana 1
sale el 30 de noviembre). Conectar más redes lo decide Alejandro, porque cuesta dinero.

## Una vez: la cuenta y la clave (Alejandro)

1. Crea la cuenta en <https://zernio.com/signup> → **Continuar con Google**.
2. Crea la clave de la API en <https://zernio.com/dashboard/api-keys>. No la pegues en el chat, ni en el repositorio,
   ni en Pendientes: Claude te la pide con un **formulario seguro** en la sesión, y queda guardada en el entorno de
   Claude Code (el proxy la añade sola a cada llamada a `zernio.com`). En tu ordenador, como variable `ZERNIO_API_KEY`.

## Una vez por persona: conectar sus redes

Cada persona tiene su **perfil** en Zernio con su nombre, y en él sus redes.

1. `npm run publicar -- conectar gemma instagram` (y lo mismo con `tiktok`, `facebook`, `youtube`). Crea su perfil si
   no existe y saca un **enlace**. También se puede hacer en <https://zernio.com/dashboard/connections> → la red →
   **Link**.
2. Se le manda el enlace por WhatsApp. Ella lo abre, entra con su red y pulsa **Permitir**. Nunca nos da su contraseña.
3. `npm run publicar -- cuentas gemma` comprueba que ya está.

Lo que tiene que tener cada red (`estrategia/plantillas/04 Crear cuentas de redes.md`): Instagram profesional de
**Creador**, la **página** de Facebook conectada a su Instagram, TikTok normal y su canal de YouTube.

## Programar una pieza (Claude, en una sesión con el repositorio)

Cuando una pieza está **Aprobado** en el Calendario de Notion y ya está generada (`npm run carrusel` o
`npm run video`, en su carpeta de trabajo **fuera del repositorio**):

1. Comprueba en Notion que el Estado es **Aprobado** y mira su **Fecha** (día y hora) y sus **Redes**.
2. Escribe `publicar.json` en la carpeta:

   ```json
   {
     "persona": "gemma",
     "codigo": "CT-2",
     "aprobado": "2026-11-20",
     "hora": "2026-11-30T19:30",
     "etiquetaIA": false,
     "texto": "El texto de la publicación (el del guion para Instagram)",
     "redes": {
       "instagram": { "primerComentario": "¿Y tú?" },
       "tiktok": { "texto": "Si el texto de TikTok es distinto" },
       "youtube": { "titulo": "Solo vídeos: el título del Short" },
       "facebook": {}
     }
   }
   ```

   - `hora`, en hora de Madrid. `aprobado`, la fecha en que la persona la aprobó.
   - Se publica lo que haya en la carpeta: `video.mp4` o `reel.mp4`, o si no las imágenes `01.png`, `02.png`… (o la
     lista `archivos`). Varias imágenes son un carrusel en Instagram y en Facebook, y fotos en TikTok (con música
     automática, salvo `"musica": false`).
   - En Instagram, `"colaboradores": ["usuario"]` (hasta 3) cuando sale otra persona del equipo: se publica como
     colaboración con su cuenta. `"historia": true` la publica como historia (sin texto ni pegatinas: la API de
     Instagram no deja poner enlaces ni encuestas, así que las historias con pegatina se suben a mano).
   - `etiquetaIA: true` si la propiedad **Etiqueta IA** está marcada: Instagram, TikTok (vídeos) y YouTube la ponen
     solos; las fotos de TikTok van como borrador para marcarla en la app, y Facebook no la admite por la API (se publica
     allí a mano).
3. `npm run publicar -- <carpeta>`. Antes de mandarla comprueba las normas (`scripts/normas.mjs`, las mismas de
   `npm run comprobar`), que los enlaces lleven `?c=CT-…`, que la hora no haya pasado y que la persona tenga cada red
   conectada. Sube los archivos, la programa y escribe `publicado.json`.
4. En Notion: Estado → **Programado**.
5. Después de la hora: `npm run publicar -- estado <carpeta>` da el enlace de cada red. En Notion, Estado →
   **Publicado** y los enlaces en **Publicado en**; el archivo final, a Drive → `05 Contenido redes/Publicados`.

Para probar sin publicar nada: `npm run publicar -- <carpeta> --borrador` la deja como borrador en Zernio (se ve en
<https://zernio.com/dashboard/posts-all> y no sale en ninguna red), y `npm run publicar -- borrar <carpeta>` la quita.
Mientras no se haya publicado, también se borra así una pieza programada que ya no deba salir.

## Métricas (el analista)

`npm run publicar -- metricas gemma 2026-11-30` da, de cada publicación desde esa fecha (también las que se hayan
publicado a mano): red, enlace, visualizaciones, alcance, me gusta, comentarios, compartidos y guardados. El analista
pasa las visualizaciones a la pieza de Notion (**Visualizaciones**) y lo que aprende a sus `aprendizajes.md`.

## Palabra clave (fase 3, desde el día 36)

Zernio contesta solo a quien comenta la palabra clave de la persona (`estrategia/perfil-y-100-dias.md` §5), en
Instagram y Facebook: le manda un mensaje privado con un botón al enlace `?c=CT-…` (y cuenta los clics) y, con un
flujo con espera, a los dos días «¿pudiste verlo?». En TikTok y YouTube solo puede contestar en público, así que allí no
se usa. Se monta al llegar a la fase 3 de cada persona, con los mensajes de su ficha de voz y las normas (nunca dinero,
producto ni salud por mensaje). Antes, se añade Zernio como encargado del tratamiento en la política de privacidad.

## Si falla

| Qué pasa | Qué hacer |
|---|---|
| `Zernio no reconoce la clave` | Falta la clave en el entorno: Claude la vuelve a pedir con el formulario seguro |
| `no tiene <red> conectado` | `npm run publicar -- conectar <persona> <red>` y mandarle el enlace |
| TikTok: «direct posting is at capacity» | TikTok no admite más publicaciones directas por un rato. Poner `"borrador": true` en `redes.tiktok` y repetir con `--otra-vez`: le llega a la persona a su bandeja de TikTok y la publica ella desde la app (apuntarlo en su pestaña de Pendientes) |
| Instagram: «Instagram access token expired» | Volver a conectar su Instagram (paso «conectar») |
| Una red publicada y otra no (`partial`) | `estado` dice el error de cada red. Arreglarlo y programar solo esa red con `--otra-vez` |
| Zernio deja de funcionar | Debajo están las API oficiales: se vuelve al plan de apps propias de `estrategia/marketing.md` §14 |

## Lo que no usamos de Zernio

- **WhatsApp, SMS y llamadas**: la conversación con cada persona sigue siendo suya, desde su WhatsApp.
- **Respuestas automáticas con IA** a mensajes y comentarios: contesta la persona.
- **Anuncios**: se valoran en la fase 3 de anuncios (`estrategia/marketing.md` §9), porque cobran por anuncio activo.
