// Sube archivos a Canva con las direcciones de subida que da el conector de Canva (create-upload-url): cada dirección
// vale para un solo archivo y caduca en media hora. Escribe el id de Canva de cada archivo (mediaId de las imágenes).
//   npm run canva-subir -- <archivo>=<dirección de subida> [<archivo>=<dirección> …]
// Guía: contenido/canva/README.md.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const pares = process.argv.slice(2).map((a) => {
  const i = a.indexOf('=https://');
  if (i < 0) throw new Error(`«${a}» no es <archivo>=<dirección de subida>`);
  return [a.slice(0, i), a.slice(i + 1)];
});
if (!pares.length) {
  console.error('Uso: npm run canva-subir -- <archivo>=<dirección de subida> […]. Guía: contenido/canva/README.md');
  process.exit(1);
}

const resultado = {};
let fallos = 0;
for (const [archivo, url] of pares) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: readFileSync(archivo) });
  const texto = await r.text();
  let cuerpo;
  try { cuerpo = JSON.parse(texto); } catch { cuerpo = { error: texto }; }
  if (!r.ok) {
    fallos++;
    console.error(`✗ ${path.basename(archivo)}: ${r.status} ${cuerpo.body ?? cuerpo.error ?? texto}`);
    continue;
  }
  resultado[path.basename(archivo)] = cuerpo.mediaId ?? cuerpo.fileId ?? cuerpo;
}
console.log(JSON.stringify(resultado, null, 2));
if (fallos) process.exit(1);
