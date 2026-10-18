// Crea equipo/<id>/ a partir de plantilla/.
// Uso: npm run nueva-persona -- "Rocío" "García"
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [nombre, apellido] = process.argv.slice(2);
if (!nombre || !apellido) {
  console.error('Uso: npm run nueva-persona -- "Nombre" "Apellido"');
  process.exit(1);
}

const aId = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const id = aId(nombre);
// Nombre del proyecto de Vercel y de su URL: nombre-apellido, nunca la marca (p. ej. gemma-ona.vercel.app).
const proyecto = aId(`${nombre} ${apellido}`);

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
      if (/__(ID|NOMBRE|PROYECTO)__/.test(contenido)) {
        writeFileSync(
          ruta,
          contenido.replaceAll('__ID__', id).replaceAll('__NOMBRE__', nombre).replaceAll('__PROYECTO__', proyecto),
        );
      }
    }
  }
}
sustituir(destino);

console.log(`Creado ${destino}. Ejecuta "npm install" en la raíz y rellena ${destino}/brief.md.`);
console.log(
  `Su web: proyecto de Vercel "${proyecto}" → https://${proyecto}.vercel.app ` +
    `(si está cogido, todo junto: ${proyecto.replaceAll('-', '')}.vercel.app).`,
);
