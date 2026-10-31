import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { urlFuentes, variablesCss } from './src/fuentes';

// Plugin de Vite común a las webs editables (las que tienen src/contenido.json):
// - mete en el HTML los colores y las tipografías de contenido.json, para que la web salga ya con ellos
//   (sin parpadeo) aunque se hayan cambiado desde el editor;
// - publica /contenido.json, que leen el editor (para saber cuándo ya está publicada una versión)
//   y /api/lead (para los textos de los emails);
// - al compilar en Vercel, añade la analítica de visitas (Vercel Web Analytics: sin cookies ni datos que
//   identifiquen a nadie). Vercel da a cada proyecto su propia ruta para el script (así no la bloquean los
//   bloqueadores de anuncios) en VERCEL_OBSERVABILITY_*; fuera de Vercel (en local, Cloudflare) no se añade.

type Etiqueta = { tag: string; attrs: Record<string, string | boolean>; children?: string; injectTo: 'head' };

/** Script de Vercel Web Analytics con la ruta de este proyecto, o nada si no se compila en Vercel. */
function analitica(): Etiqueta[] {
  const variable = (fin: string) => Object.entries(process.env).find(([k, v]) => k.endsWith(fin) && v)?.[1] ?? '';
  const absoluta = (ruta: string) => (/^(https?:)?\//.test(ruta) ? ruta : `/${ruta}`);
  let conf: Record<string, string> = {};
  try {
    conf = JSON.parse(variable('VERCEL_OBSERVABILITY_CLIENT_CONFIG') || '{}').analytics ?? {};
  } catch {
    // configuración ilegible: se usa la ruta base
  }
  const base = variable('VERCEL_OBSERVABILITY_BASEPATH');
  const src = conf.scriptSrc || (base ? `${base}/insights/script.js` : '');
  if (process.env.VERCEL) console.log(`Analítica de visitas: ${src ? absoluta(src) : 'Vercel no ha dado VERCEL_OBSERVABILITY_* (¿Web Analytics activada?)'}`);
  if (!src) return [];
  const datos: Record<string, string> = { 'data-sdkn': '@vercel/analytics/vite' };
  for (const [clave, nombre] of [['viewEndpoint', 'view-endpoint'], ['eventEndpoint', 'event-endpoint'], ['sessionEndpoint', 'session-endpoint']]) {
    if (conf[clave]) datos[`data-${nombre}`] = absoluta(conf[clave]);
  }
  if (!conf.scriptSrc && base) datos['data-endpoint'] = absoluta(`${base}/insights`);
  return [{ tag: 'script', attrs: { defer: true, src: absoluta(src), ...datos }, injectTo: 'head' }];
}

export function contenidoWeb(): Plugin {
  let raiz = process.cwd();
  const leer = () => JSON.parse(readFileSync(join(raiz, 'src', 'contenido.json'), 'utf8'));

  return {
    name: 'contenido-web',
    configResolved(config) {
      raiz = config.root;
    },
    transformIndexHtml() {
      const contenido = leer();
      const vars = Object.entries(variablesCss(contenido))
        .map(([variable, valor]) => `${variable}:${valor}`)
        .join(';');
      const url = urlFuentes(contenido.fuentes);
      return [
        ...(url
          ? [{ tag: 'link', attrs: { id: 'fuentes-contenido', rel: 'stylesheet', href: url }, injectTo: 'head' as const }]
          : []),
        // html:root gana a :root de index.css, vaya delante o detrás.
        { tag: 'style', attrs: { id: 'estilos-contenido' }, children: `html:root{${vars}}`, injectTo: 'head' as const },
        ...analitica(),
      ];
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'contenido.json', source: JSON.stringify(leer()) });
    },
    configureServer(server) {
      server.middlewares.use('/contenido.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(leer()));
      });
    },
  };
}
