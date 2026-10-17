// Prepara el editor visual de la web de una persona en .editores/<id>/, listo para publicarlo
// como artifact en Claude (index.html + la web compilada + sus fotos).
// Uso: npm run editor -- gemma
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const id = process.argv[2];
const sitio = join('equipo', id ?? '', 'sitio');
if (!id || !existsSync(sitio)) {
  console.error('Uso: npm run editor -- <persona>   (p. ej. gemma)');
  process.exit(1);
}
const rutaContenido = join(sitio, 'src', 'contenido.json');
if (!existsSync(rutaContenido)) {
  console.error(`${rutaContenido} no existe: la web tiene que sacar sus textos, colores y fotos de ese archivo.`);
  process.exit(1);
}

// La web compilada con rutas relativas, para que funcione dentro del editor.
const compilada = join(sitio, 'dist-editor');
execSync('npx vite build --base ./ --outDir dist-editor --emptyOutDir --logLevel warn', { cwd: sitio, stdio: 'inherit' });

const html = readFileSync(join(compilada, 'index.html'), 'utf8');
const js = html.match(/<script[^>]+src="\.\/([^"]+\.js)"/)?.[1];
const css = html.match(/<link[^>]+href="\.\/([^"]+\.css)"/)?.[1];
if (!js || !css) {
  console.error('No encuentro el JS o el CSS de la web compilada.');
  process.exit(1);
}
const fuentes = (html.match(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>/g) ?? []).join('\n');
const nombre = readFileSync(join(sitio, 'src', 'config.ts'), 'utf8').match(/nombre:\s*'([^']+)'/)?.[1] ?? id;
const contenido = JSON.parse(readFileSync(rutaContenido, 'utf8'));

const salida = join('.editores', id);
rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });
cpSync(compilada, salida, { recursive: true });
rmSync(join(salida, 'index.html'));
rmSync(compilada, { recursive: true, force: true });

const plantilla = readFileSync(join('compartido', 'editor', 'editor.html'), 'utf8');
const web = JSON.stringify({ id, nombre, contenido }).replace(/</g, '\\u003c');
writeFileSync(
  join(salida, 'index.html'),
  plantilla
    .replaceAll('__NOMBRE__', nombre)
    .replace('<!--FUENTES-->', fuentes)
    .replace('__CSS__', css)
    .replace('__JS__', js)
    .replace('/*WEB*/null', web),
);

const archivos = [];
(function listar(dir) {
  for (const f of readdirSync(dir)) {
    const ruta = join(dir, f);
    if (statSync(ruta).isDirectory()) listar(ruta);
    else if (!f.startsWith('.') && (f !== 'index.html' || dir !== salida)) archivos.push(relative(salida, ruta));
  }
})(salida);

console.log(`Editor de ${nombre} listo en ${salida}/`);
console.log('Archivos para publicar junto a index.html:');
console.log(JSON.stringify(Object.fromEntries(archivos.map((a) => [a, join(salida, a)])), null, 2));
