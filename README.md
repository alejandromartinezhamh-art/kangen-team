# Equipo · webs, landings, contenido y anuncios

Un solo repositorio para todo el equipo. Cada persona tiene su web y sus landings con su propio diseño;
el mensaje, las normas, el formulario y las páginas legales son comunes.

**Enfoque:** hablamos del negocio y del cambio de estilo de vida, nunca del producto.
Lee `estrategia/` antes de crear nada.

## Estructura

```
estrategia/            Mensaje común y normas de comunicación (obligatorias)
  plantillas/          Para incorporar a alguien nuevo o replicar el sistema: guía, cuestionario en blanco, mensajes y checklist
  cuestionario-avatar/ Cuestionario de historia y avatar de cada persona del equipo
compartido/            Código común: formulario, páginas legales y API de leads
plantilla/             Punto de partida de cada persona (no se edita para una persona concreta)
scripts/               Utilidades (crear persona nueva)
equipo/
  alejandro/ anna/ gemma/ helena/ judith/ rocio/
    README.md          Ficha: estado, enlace de Drive, web, Vercel y dominio
    brief.md           Quién es, historia, público, referencias, contacto y datos legales
    design.md          Sistema de diseño completo (paleta, tipografía, componentes, tokens)
    referencias/       Capturas de webs y perfiles que gustan
    assets/            Fotos y logo elegidos y optimizados para la web (los originales, en Drive)
    contenido/         Ideas y guiones de publicaciones
    anuncios/          Una ficha por campaña
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
2. Definir `design.md` y aplicarlo en `sitio/src/index.css`, `sitio/tailwind.config.js` e `sitio/index.html`.
3. Textos, colores, letras, fotos y enlaces en `sitio/src/contenido.json` (lo que cambia el editor visual);
   datos legales en `sitio/src/config.ts`; diseño de la portada en `sitio/src/paginas/Inicio.tsx`.
4. Una landing por campaña en `sitio/src/landings/` y registrarla en `landings/index.ts`.
5. Activar su editor visual (abajo) y darle el enlace `/editar` y la contraseña.

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
1. Su `sitio/src/contenido.json`, `main.tsx` con `montar(App, contenido)`, la ruta `/editar` en `App.tsx`
   (con las páginas editables) y `contenidoWeb()` en `vite.config.ts`. La plantilla ya viene así; ejemplo
   completo: `equipo/gemma/sitio`.
2. Un token de GitHub (uno para todo el equipo): github.com → Settings → Developer settings →
   Fine-grained tokens → solo este repositorio → permiso **Contents: Read and write**.
3. En su proyecto de Vercel → Settings → Environment Variables (Production):
   `EDITOR_GITHUB_TOKEN` = el token y `EDITOR_CLAVE` = una contraseña larga para ella. Volver a desplegar.

Para Claude: los textos nuevos de una página van siempre en `contenido.json` (nunca escritos en el componente),
así se pueden editar. Página nueva = su sección en `contenido.json` + una línea en `paginasEditor` de `App.tsx`.

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

- **Vercel** (proyecto `kangen`): https://alejandromartinez.vercel.app — `/l/instagram` y `/webinar`
  (`kangen-ochre.vercel.app` redirige aquí, así que los enlaces antiguos siguen funcionando)
- **Cloudflare Workers** (Worker `kangen-team`, `wrangler.jsonc` en la raíz): misma web, formulario guardando en D1

### Gemma

- **Vercel** (proyecto `gemma-ona`, Root Directory `equipo/gemma/sitio`): https://gemma-ona.vercel.app — embudo de Instagram.
  Su portada (`/`) lleva a `/l/instagram` hasta revisar los textos de la web (`webPublicada` en `sitio/src/App.tsx`).
- **Editor**: https://gemma-ona.vercel.app/editar (Instagram, cuestionario, webinar, emails y su web).
  Necesita `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` en el proyecto `gemma-ona`.

## Publicación (Cloudflare Pages, recomendado)

Un proyecto de Pages por persona, todos conectados a este repositorio:

- **Directorio raíz:** `equipo/<persona>/sitio` · **Compilación:** `npm run build` · **Salida:** `dist`
- **Enlace D1:** variable `DB` → base de datos `leads-equipo` (tabla `leads`, compartida por todo el equipo)
- El formulario usa `sitio/functions/api/lead.ts` → `compartido/api/lead-cloudflare.ts`

## Publicación alternativa (Vercel)

Un proyecto de Vercel por persona, todos conectados a este repositorio:

- **Root Directory:** `equipo/<persona>/sitio`
- **Framework:** Vite
- **Variable de entorno:** `LEADS_WEBHOOK_URL`, el destino donde se guardan los leads (Google Sheets, Make, etc.)
- **Editor visual:** `EDITOR_GITHUB_TOKEN` y `EDITOR_CLAVE` (ver "Editor visual")
- **Dominio:** subdominio del dominio común (`persona.dominio.com`) o dominio propio.

Cada lead llega con `persona` y `origen` (landing) para medir qué contenido y qué anuncio funciona.

## Embudo de Instagram (cuestionario → webinar)

`/l/instagram` → `/cuestionario` → hoja de Google que guarda el lead y envía el webinar por email desde Gmail.
En Cloudflare, añade también `LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET` para que el lead llegue a la hoja además de a D1.
Instalación y uso: `compartido/apps-script/README.md`.
