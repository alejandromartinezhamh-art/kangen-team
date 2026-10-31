// Crea equipo/<id>/ a partir de plantilla/: su carpeta y su web con el embudo completo (Instagram → cuestionario →
// email → webinar), el editor (/editar) y las páginas legales. Pasos siguientes: estrategia/plantillas/.
// Uso: npm run nueva-persona -- "Rocío"                       (web en rocio.vercel.app)
//      npm run nueva-persona -- "Rocío" rocio-garcia.vercel.app  (con el dominio que tendrá su proyecto de Vercel)
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

const dominio = process.argv[3] || `${id}.vercel.app`;
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
      if (/__(ID|NOMBRE|DOMINIO)__/.test(contenido)) {
        writeFileSync(ruta, contenido.replaceAll('__ID__', id).replaceAll('__NOMBRE__', nombre).replaceAll('__DOMINIO__', dominio));
      }
    }
  }
}
sustituir(destino);

// Sus funciones de Vercel (formulario y editor), con su nombre dentro.
execSync('node scripts/generar-api.mjs', { stdio: 'inherit' });

console.log(`Creado ${destino} (web: https://${dominio}).`);
console.log(`Siguiente: "npm install" en la raíz, rellenar ${destino}/brief.md y seguir estrategia/plantillas/03 Checklist persona nueva.md.`);
