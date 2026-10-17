# Equipo · webs, landings, contenido y anuncios

Un solo repositorio para todo el equipo. Cada persona tiene su web y sus landings con su propio diseño;
el mensaje, las normas, el formulario y las páginas legales son comunes.

**Enfoque:** hablamos del negocio y del cambio de estilo de vida, nunca del producto.
Lee `estrategia/` antes de crear nada.

## Estructura

```
estrategia/            Mensaje común y normas de comunicación (obligatorias)
compartido/            Código común: formulario, páginas legales y API de leads
plantilla/             Punto de partida de cada persona (no se edita para una persona concreta)
scripts/               Utilidades (crear persona nueva)
equipo/
  alejandro/ ana/ elena/ gemma/ judith/ rocio/
    brief.md           Diseño, tono, referencias, contacto y datos legales
    referencias/       Capturas de webs y perfiles que gustan
    assets/            Fotos, logo, vídeos
    contenido/         Ideas y guiones de publicaciones
    anuncios/          Una ficha por campaña
    sitio/             La web (/) y sus landings (/l/<campaña>)
```

## Flujo de trabajo por persona

1. Rellenar `equipo/<persona>/brief.md` y subir referencias a `referencias/`.
2. Aplicar colores y tipografías en `sitio/src/index.css` e `sitio/index.html`.
3. Textos y datos en `sitio/src/config.ts`; diseño de la portada en `sitio/src/paginas/Inicio.tsx`.
4. Una landing por campaña en `sitio/src/landings/` y registrarla en `landings/index.ts`.

## Desarrollo local

```bash
npm install                                   # en la raíz, una vez
npm run dev -- sitio-alejandro                # arranca la web de una persona en localhost:3000
npm run nueva-persona -- "Nombre"             # añade a alguien nuevo
```

El formulario llama a `/api/lead`, que solo existe en Vercel (o con `vercel dev`).

## Publicación (Vercel)

Un proyecto de Vercel por persona, todos conectados a este repositorio:

- **Root Directory:** `equipo/<persona>/sitio`
- **Framework:** Vite
- **Variable de entorno:** `LEADS_WEBHOOK_URL`, el destino donde se guardan los leads (Google Sheets, Make, etc.)
- **Dominio:** subdominio del dominio común (`persona.dominio.com`) o dominio propio.

Cada lead llega con `persona` y `origen` (landing) para medir qué contenido y qué anuncio funciona.
