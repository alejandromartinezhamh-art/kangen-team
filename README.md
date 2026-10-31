# Equipo · webs, landings, contenido y anuncios

Un solo repositorio para todo el equipo. Cada persona tiene su web y sus landings con su propio diseño;
el mensaje, las normas, el formulario y las páginas legales son comunes.

**Enfoque:** hablamos del negocio y del cambio de estilo de vida, nunca del producto.
Lee `estrategia/` antes de crear nada.

## Estructura

```
estrategia/            Mensaje común, normas de comunicación (obligatorias) y estrategia de marketing (marketing.md)
  plantillas/          Para incorporar a alguien nuevo o replicar el sistema: guía, cuestionario en blanco, mensajes y checklist
  cuestionario-avatar/ Cuestionario de historia y avatar de cada persona del equipo
compartido/            Código común: el embudo entero (src/embudo: Instagram, cuestionario, webinar y web),
                       formulario, páginas legales, editor visual, API de leads y script de la hoja
plantilla/             Punto de partida de cada persona (no se edita para una persona concreta)
contenido/             Sistema de contenido y anuncios: formatos, ganchos, aprendizajes del equipo (ver su README)
.claude/skills/        Agentes de contenido: investigador, estratega, guionista, revisor, entrevista de historia
scripts/               Utilidades (crear persona nueva, comprobar normas, generar funciones)
equipo/
  alejandro/ anna/ gemma/ helena/ judith/ rocio/
    README.md          Ficha: estado, enlace de Drive, web, Vercel y dominio
    brief.md           Quién es, historia, público, referencias, contacto y datos legales
    design.md          Sistema de diseño completo (paleta, tipografía, componentes, tokens)
    referencias/       Capturas de webs y perfiles que gustan
    assets/            Fotos y logo elegidos y optimizados para la web (los originales, en Drive)
    contenido/         Su voz e historia (voz.md) y lo que le funciona (aprendizajes.md); el calendario está en Notion
    anuncios/          Creatividades de sus campañas; los anuncios se gestionan en Notion
    sitio/             La web (/) y sus landings (/l/<campaña>)
```

## Drive y GitHub: qué va en cada sitio

- **Drive (carpeta "Kangen PRO TEAM")**: originales pesados, fotos sin editar, vídeos, documentos de trabajo.
  Lo suben las propias personas.
- **GitHub (este repositorio)**: solo lo que la web usa, ya elegido y optimizado (JPG/WebP de 2000 px como máximo, menos de 500 KB),
  más los textos y el diseño. Cada `README.md` de persona enlaza a su carpeta de Drive.

Estructura de Drive recomendada:

```
Kangen PRO TEAM/
  (carpetas comunes)            Estrategia, contenido, presentaciones, folletos… (uso interno)
  Discovery process Andrea/     Competencia: webinar, emails, formularios. Solo para inspirarnos, nunca copiar
  Landing Kangen <Persona>/     Una por persona: Alejandro, Anna, Gemma, Helena, Judith, Rocio
    01 Fotos originales/        Todo lo que suba la persona, sin filtrar
    02 Fotos seleccionadas web/ Las elegidas para la web (se copian a assets/ del repo)
    03 Vídeos/
    04 Logo y marca/            Logo, design.md exportado, kit de Canva
    05 Contenido redes/
    06 Anuncios/
    07 Textos/                  Historia, bio, guiones
```

Nombres de archivo: `persona_tipo_descripcion_01.jpg` (p. ej. `gemma_retrato_exterior_01.jpg`).
Sin espacios ni tildes. HEIC del iPhone: exportar a JPG antes de usar en la web.

## Flujo de trabajo por persona

0. Darle de alta siguiendo `estrategia/plantillas/00 Cómo replicar el sistema.md` (carpeta de Drive, cuestionario y mensaje de bienvenida).
   En Drive, todo está también en `Kangen PRO TEAM/Templates`.

1. Rellenar `equipo/<persona>/brief.md` y subir referencias a `referencias/`.
2. Definir `design.md` y aplicar sus colores en `sitio/src/index.css` y `sitio/src/contenido.json` (colores), y el
   color de fondo en `sitio/index.html` (theme-color).
3. Textos, colores, letras, fotos y enlaces en `sitio/src/contenido.json` (lo que cambia el editor visual);
   datos legales y dominio en `sitio/src/config.ts`. Fotos en `sitio/public/` (`foto.jpg` y `foto-email.jpg`).
4. Las páginas son las mismas para todo el equipo (`compartido/src/embudo`): no se copian ni se tocan por persona.
   Su web principal (`/`) se publica cuando sus textos están revisados: `webPublicada` en `sitio/src/App.tsx`.
5. Activar su editor visual (abajo) y darle el enlace `/editar` y la contraseña.

### Cómo está hecha cada web

Cada `equipo/<persona>/sitio/src` tiene solo sus datos:

| Archivo | Qué es |
|---|---|
| `App.tsx` | `<Embudo persona={persona} contenido={contenido} webPublicada={…} />` y nada más |
| `config.ts` | Nombre, dominio, email y datos legales |
| `contenido.json` | Todo lo que se ve: textos, colores, letras, fotos, enlaces (vídeo y WhatsApp) y emails |
| `index.css` | Colores de partida (los de `contenido.json` van por encima) |

Un arreglo o una mejora en `compartido/src/embudo` llega a todas las webs a la vez.

## Editor visual: cada persona cambia su web sin pedírselo a nadie

`https://<su-web>/editar` (Gemma: https://gemma-ona.vercel.app/editar). Funciona en el móvil y en el ordenador.

- **Toca cualquier texto** de la página para cambiarlo. *palabra* = destacada, **texto** = negrita.
- **Diseño**: colores, letras (lista cerrada de Google Fonts), fotos (se reducen solas a 2000 px) y enlaces
  (vídeo del webinar, WhatsApp).
- **Textos**: todos los de la página, también los que no se ven (errores, mensaje de WhatsApp…).
- **Emails**: el del webinar y el recordatorio, con vista previa igual a lo que llega.
- Vista de **móvil y ordenador**, y **Probar como visita** para recorrer la página (el cuestionario no envía nada).
- Lo no publicado se guarda en ese navegador. **Publicar** lo deja en la web en 1-2 minutos y avisa cuando ya está.
- **Versiones**: cada publicación queda guardada; se puede recuperar cualquiera y volver a publicar.

**Por qué no se rompe nada:**
- El editor solo cambia `src/contenido.json` y `public/fotos/` de esa persona; nunca el código, el formulario,
  `/api/lead`, el script de la hoja ni la web de otra persona.
- `/api/editor` comprueba cada publicación antes de guardarla: mismas secciones y tipos que la versión actual,
  sin añadir ni quitar pasos del cuestionario, colores `#rrggbb`, letras de la lista, fotos válidas, WhatsApp
  solo con números y vídeo con `https://`. Si algo no cuadra, no publica y dice qué.
- Cada pregunta del cuestionario tiene una `columna` fija en la hoja: cambiar el texto de la pregunta no crea
  columnas nuevas. Las claves `tipo`, `campo` y `columna` no se pueden cambiar desde el editor.
- Publicar es un commit en GitHub (`Editor (<persona>): …`). Si la compilación fallara, Vercel deja la versión
  anterior. Cualquier publicación se puede deshacer desde Versiones (o con git).

**Activarlo en una web** (una vez, 5 minutos):
1. Todas las webs ya vienen preparadas (`<Embudo>` incluye `/editar`); no hay que tocar código.
2. Un token de GitHub (uno para todo el equipo): github.com → Settings → Developer settings →
   Fine-grained tokens → solo este repositorio → permiso **Contents: Read and write**.
3. En su proyecto de Vercel → Settings → Environment Variables (Production):
   `EDITOR_GITHUB_TOKEN` = el token y `EDITOR_CLAVE` = una contraseña larga para ella. Volver a desplegar.

Para Claude: los textos nuevos de una página van siempre en `contenido.json` (nunca escritos en el componente),
así se pueden editar. Texto nuevo = su clave en el tipo `ContenidoEmbudo` (`compartido/src/embudo/tipos.ts`) y en el
`contenido.json` de **todas** las webs y de `plantilla/` (si falta en alguna, no compila). Página nueva = su ruta en
`compartido/src/embudo/Embudo.tsx` y una línea en `paginasEditor` del mismo archivo.

## Desarrollo local

```bash
npm install                                   # en la raíz, una vez
npm run dev -- sitio-alejandro                # arranca la web de una persona en localhost:3000
npm run nueva-persona -- "Nombre"             # añade a alguien nuevo
npm run generar-api                           # tras cambiar compartido/api/ (formulario y editor)
```

En local, `/editar` funciona en modo "Solo mirar": publicar solo va en Vercel.

El formulario llama a `/api/lead`, que solo existe en Vercel (o con `vercel dev`).

## Publicación actual

### Alejandro

- **Vercel** (proyecto `alejandromartinez`, compila desde la raíz con `vercel.json`): https://alejandromartinez.vercel.app —
  su web (`/`), `/l/instagram`, `/cuestionario` y `/webinar`
  (`kangen-ochre.vercel.app` redirige aquí, así que los enlaces antiguos siguen funcionando)
- **Editor**: https://alejandromartinez.vercel.app/editar. Necesita `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` en el proyecto `alejandromartinez`.
- **Cloudflare Workers** (Worker `kangen-team`, `wrangler.jsonc` en la raíz): copia de la misma web, formulario guardando en D1

### Gemma

- **Vercel** (proyecto `gemma-ona`, Root Directory `equipo/gemma/sitio`): https://gemma-ona.vercel.app — embudo de Instagram.
  Su portada (`/`) lleva a `/l/instagram` hasta revisar los textos de la web (`webPublicada` en `sitio/src/App.tsx`).
- **Editor**: https://gemma-ona.vercel.app/editar (Instagram, cuestionario, webinar, emails y su web).
  Necesita `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` en el proyecto `gemma-ona`.

### Helena

- **Vercel** (proyecto `helena-saigi`, Root Directory `equipo/helena/sitio`): https://helena-saigi.vercel.app — la misma web y el
  mismo embudo que Gemma, con sus colores (oliva y terracota). Su portada (`/`) lleva a `/l/instagram` hasta que escriba «Mi historia».
- **Editor**: https://helena-saigi.vercel.app/editar. Necesita `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` en el proyecto `helena-saigi`.
- **Leads**: necesita su hoja con `Embudo.gs` (`PERSONA = 'helena'`) instalada con su cuenta de Google, y `LEADS_WEBHOOK_URL` y
  `LEADS_WEBHOOK_SECRET` en el proyecto.

## Publicación (Vercel, la que usamos)

Un proyecto de Vercel por persona, todos conectados a este repositorio (rama `main`):

- **Root Directory:** `equipo/<persona>/sitio` · **Framework:** Vite
- **Variables de entorno:** `LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET` (la URL y la clave del script de su hoja,
  ver `compartido/apps-script/README.md`); `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` (ver "Editor visual")
- **Dominio:** de momento `<proyecto>.vercel.app`; más adelante, subdominio de un dominio común o dominio propio.
- **Analítica de visitas:** en el proyecto, *Analytics → Enable* (una vez). El script lo añade solo `compartido/vite.ts`
  al compilar en Vercel, con la ruta propia del proyecto; sin cookies, así que no cambia el aviso de cookies.

Cada lead llega con `persona` y `origen` (landing) para medir qué contenido y qué anuncio funciona.

### Cloudflare (alternativa, sin usar para el equipo)

Solo la copia de la web de Alejandro (Worker `kangen-team`). Para otra persona haría falta un proyecto de Pages con
directorio raíz `equipo/<persona>/sitio`, compilación `npm run build`, salida `dist` y el enlace D1 `DB` →
`leads-equipo`; el formulario usa `sitio/functions/api/lead.ts` → `compartido/api/lead-cloudflare.ts`.

## Embudo de Instagram (cuestionario → webinar)

`/l/instagram` → `/cuestionario` → hoja de Google que guarda el lead y envía el webinar por email desde Gmail.
En Cloudflare, añade también `LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET` para que el lead llegue a la hoja además de a D1.
Instalación y uso: `compartido/apps-script/README.md`.
