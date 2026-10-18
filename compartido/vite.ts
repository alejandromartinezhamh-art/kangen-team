import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { urlFuentes, variablesCss } from './src/fuentes';

// Plugin de Vite común a las webs editables (las que tienen src/contenido.json):
// - mete en el HTML los colores y las tipografías de contenido.json, para que la web salga ya con ellos
//   (sin parpadeo) aunque se hayan cambiado desde el editor;
// - publica /contenido.json, que leen el editor (para saber cuándo ya está publicada una versión)
//   y /api/lead (para los textos de los emails).

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
