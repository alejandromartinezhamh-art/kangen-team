// Copias de las plantillas listas para subir a Drive → Templates: npm run plantillas-drive
// Drive convierte el Markdown en un documento de Google. Antes hay que cambiar <dato> por [dato] (los < > se pierden al
// convertir) y forzar el salto de línea en las listas con emoji de los mensajes, para que cada punto quede en su línea
// al copiarlo a WhatsApp. Salida: dist/plantillas-drive/. Pasos: CLAUDE.md, «Plantillas siempre al día».
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const origen = path.join(raiz, 'estrategia', 'plantillas');
const salida = path.join(raiz, 'dist', 'plantillas-drive');

// Líneas que empiezan un punto de una lista con emoji: 1️⃣, ▪️, 👉, 🔑, 📌, ✅.
const PUNTO = /^(?:[0-9]️?⃣|▪️?|\u{1F449}|\u{1F511}|\u{1F4CC}|✅)/u;

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

for (const archivo of readdirSync(origen).filter((a) => a.endsWith('.md')).sort()) {
  const lineas = readFileSync(path.join(origen, archivo), 'utf8')
    .replace('lo que va entre <>', 'lo que va entre corchetes [ ]')
    .replace(/<([^<>\n]{1,80})>/g, '[$1]')
    .split('\n');
  const texto = lineas
    .map((linea, i) => (linea.trim() && PUNTO.test(lineas[i + 1] ?? '') ? `${linea.trimEnd()}  ` : linea))
    .join('\n');
  if (/<[^<>\n]{1,80}>/.test(texto)) throw new Error(`${archivo}: queda un <dato> sin convertir`);
  writeFileSync(path.join(salida, archivo), texto);
  console.log(archivo);
}
console.log(`\nSúbelas a Drive → Templates como documento de Google (${path.relative(raiz, salida)}/).`);
