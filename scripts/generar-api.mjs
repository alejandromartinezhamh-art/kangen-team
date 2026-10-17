// Genera sitio/api/lead.js (Vercel) para cada persona y para la plantilla, empaquetando
// compartido/api/lead.ts en un solo archivo sin imports: Vercel no compila TypeScript
// importado desde otros paquetes del repositorio.
// Uso: npm run generar-api   (ejecutar tras cambiar compartido/api/)
import { build } from 'esbuild';
import { readdirSync, rmSync, existsSync } from 'node:fs';

const destinos = ['plantilla/sitio', ...readdirSync('equipo').map((p) => `equipo/${p}/sitio`)];
for (const dir of destinos) {
  const viejo = `${dir}/api/lead.ts`;
  if (existsSync(viejo)) rmSync(viejo);
  await build({
    entryPoints: ['compartido/api/lead.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    outfile: `${dir}/api/lead.js`,
    banner: { js: '// GENERADO por scripts/generar-api.mjs desde compartido/api/lead.ts. No editar a mano.' },
    logLevel: 'warning',
  });
  console.log(`${dir}/api/lead.js`);
}
