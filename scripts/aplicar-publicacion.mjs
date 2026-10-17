// Aplica a la web una publicación hecha desde el editor visual: reemplaza src/contenido.json.
// Uso: npm run aplicar-publicacion -- <persona> <publicacion.json>
// <publicacion.json> es el documento de la colección "publicaciones" del editor (o solo su "contenido").
// Las fotos nuevas que se subieron en el editor llegan como enlaces de Claude: hay que descargarlas antes
// a public/fotos/ y poner su ruta (/fotos/…) en el JSON; si queda alguna, el script avisa y no escribe nada.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [id, archivo] = process.argv.slice(2);
const destino = join('equipo', id ?? '', 'sitio', 'src', 'contenido.json');
if (!id || !archivo || !existsSync(destino)) {
  console.error('Uso: npm run aplicar-publicacion -- <persona> <publicacion.json>');
  process.exit(1);
}

const leido = JSON.parse(readFileSync(archivo, 'utf8'));
const nuevo = leido.contenido ?? leido;
const actual = JSON.parse(readFileSync(destino, 'utf8'));

const pendientes = Object.entries(nuevo.fotos ?? {}).filter(([, ruta]) => typeof ruta !== 'string' || !ruta.startsWith('/'));
if (pendientes.length) {
  console.error('Estas fotos aún apuntan al editor; descárgalas a public/fotos/ y cambia su ruta:');
  for (const [clave, ruta] of pendientes) console.error(`  ${clave}: ${ruta}`);
  process.exit(1);
}
for (const [clave, ruta] of Object.entries(nuevo.fotos ?? {})) {
  if (!existsSync(join('equipo', id, 'sitio', 'public', ruta))) {
    console.error(`La foto "${clave}" (${ruta}) no está en equipo/${id}/sitio/public.`);
    process.exit(1);
  }
}

// Las etiquetas del editor son del repo, no de la publicación.
const resultado = { _etiquetas: actual._etiquetas, ...nuevo };
if (!resultado._etiquetas) delete resultado._etiquetas;
writeFileSync(destino, JSON.stringify(resultado, null, 2) + '\n');
console.log(`Actualizado ${destino}. Compila con "npm run build -w sitio-${id}" y sube el cambio.`);
