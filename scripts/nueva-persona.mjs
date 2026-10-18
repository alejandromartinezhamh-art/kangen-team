// Crea equipo/<id>/ a partir de plantilla/.
// Uso: npm run nueva-persona -- "Rocío"
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const nombre = process.argv[2];
if (!nombre) {
  console.error('Uso: npm run nueva-persona -- "Nombre"');
  process.exit(1);
}

const id = nombre
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const destino = join('equipo', id);
if (existsSync(destino)) {
  console.error(`Ya existe ${destino}`);
  process.exit(1);
}

cpSync('plantilla', destino, { recursive: true });

function sustituir(dir) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      sustituir(ruta);
    } else {
      const contenido = readFileSync(ruta, 'utf8');
      if (contenido.includes('__ID__') || contenido.includes('__NOMBRE__')) {
        writeFileSync(ruta, contenido.replaceAll('__ID__', id).replaceAll('__NOMBRE__', nombre));
      }
    }
  }
}
sustituir(destino);

// Sus funciones de Vercel (formulario y editor), con su nombre dentro.
execSync('node scripts/generar-api.mjs', { stdio: 'inherit' });

console.log(`Creado ${destino}. Ejecuta "npm install" en la raíz y rellena ${destino}/brief.md.`);
