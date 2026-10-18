// Genera las funciones de Vercel de cada persona y de la plantilla, empaquetando compartido/api/ en
// archivos sueltos sin imports: Vercel no compila TypeScript importado desde otros paquetes del repositorio.
//   sitio/api/lead.js    formulario y cuestionario → hoja de Google
//   sitio/api/editor.js  editor visual (/editar): lee y publica contenido.json de esa persona
// Uso: npm run generar-api   (ejecutar tras cambiar compartido/api/)
import { build } from 'esbuild';
import { readdirSync, rmSync, existsSync } from 'node:fs';

// '.' = raíz del repositorio: el proyecto de Vercel 'kangen' compila desde ahí la web de Alejandro (vercel.json).
const destinos = [
  { dir: '.', persona: 'alejandro' },
  // nueva-persona.mjs cambia __ID__ por la persona al copiar la plantilla.
  { dir: 'plantilla/sitio', persona: '__ID__' },
  ...readdirSync('equipo').map((p) => ({ dir: `equipo/${p}/sitio`, persona: p })),
];

for (const { dir, persona } of destinos) {
  const viejo = `${dir}/api/lead.ts`;
  if (existsSync(viejo)) rmSync(viejo);
  for (const nombre of ['lead', 'editor']) {
    await build({
      entryPoints: [`compartido/api/${nombre}.ts`],
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      outfile: `${dir}/api/${nombre}.js`,
      define: { __PERSONA__: JSON.stringify(persona) },
      banner: { js: `// GENERADO por scripts/generar-api.mjs desde compartido/api/${nombre}.ts. No editar a mano.` },
      logLevel: 'warning',
    });
    console.log(`${dir}/api/${nombre}.js`);
  }
}
