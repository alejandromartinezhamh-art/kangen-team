// Genera las imágenes de un carrusel: npm run carrusel -- <carpeta> [--sin-encuadre]
// La carpeta tiene un carrusel.html hecho desde contenido/carruseles/plantilla.html y sus fotos. Guarda cada
// <section class="slide"> como 01.png, 02.png… a 1080 × 1350 y una hoja.png con todas juntas para revisarlas.
// Antes coloca cada foto para que las caras queden enteras y sin texto encima (scripts/encuadre.mjs). Si alguna cara
// queda cortada o tapada, lo dice y termina con error: ese carrusel no se entrega así.
// Necesita Playwright con Chromium (ya instalado en las sesiones de Claude en la nube) y conexión (letras y detector).
import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { ARGUMENTOS_NAVEGADOR, carasQueNoSeVen, encuadrar } from './encuadre.mjs';

const carpeta = process.argv[2] && path.resolve(process.argv[2]);
const archivo = carpeta && path.join(carpeta, 'carrusel.html');
if (!archivo || !existsSync(archivo)) {
  console.error('Uso: npm run carrusel -- <carpeta con carrusel.html> [--sin-encuadre]');
  process.exit(1);
}
const conEncuadre = !process.argv.includes('--sin-encuadre');

const { chromium } = createRequire(import.meta.url)('playwright');
const navegador = await chromium.launch({ args: ARGUMENTOS_NAVEGADOR });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 1400 } });
await pagina.goto('file://' + archivo);
// Las tres letras de la plantilla, con los pesos que usa: se esperan antes de hacer nada.
const LETRAS = ['700 40px "Inter Tight"', 'italic 40px "DM Serif Display"', '700 40px "Caveat"'];
const faltan = await pagina.evaluate(async (letras) => {
  await Promise.all(letras.map((f) => document.fonts.load(f).catch(() => [])));
  await document.fonts.ready;
  return letras.filter((f) => !document.fonts.check(f)).map((f) => f.split('"')[1]);
}, LETRAS);
await pagina.evaluate(() => window.ajustarTitulares?.()); // titulares al tamaño de su hueco, con las letras ya cargadas
await pagina.waitForTimeout(300);
if (faltan.length) console.warn(`Aviso: no se han cargado las letras ${faltan.join(', ')} (¿sin conexión?)`);

let problemas = 0;
let informe = [];
if (conEncuadre) {
  informe = await encuadrar(pagina);
  writeFileSync(path.join(carpeta, 'encuadre.json'), JSON.stringify(informe, null, 2));
  for (const f of informe.filter((f) => f.caras)) {
    const estado = f.problemas.length ? `✗ ${f.problemas.join('; ')}` : '✓';
    console.log(`Imagen ${String(f.imagen).padStart(2, '0')} · ${f.foto} · ${f.caras} cara(s) · ${f.posicion} · ${estado}`);
    problemas += f.problemas.length;
  }
}

const diapositivas = await pagina.$$('section.slide');
for (const [i, d] of diapositivas.entries()) {
  const png = path.join(carpeta, `${String(i + 1).padStart(2, '0')}.png`);
  await d.screenshot({ path: png });
  // En la imagen ya hecha, cada cara se tiene que seguir reconociendo (un velo o una sombra pueden taparla).
  const cajas = informe.filter((f) => f.imagen === i + 1 && !f.problemas.length).flatMap((f) => f.cajas);
  if (cajas.length) {
    const ocultas = await carasQueNoSeVen(pagina, png, cajas);
    if (ocultas) console.warn(`Aviso: imagen ${String(i + 1).padStart(2, '0')}: ${ocultas} cara(s) se ven poco en el resultado (velo, sombra o adorno encima). Míralo.`);
  }
}

// Hoja de contacto: todas las imágenes en filas de 4, a un tercio de su tamaño.
await pagina.addStyleTag({
  content: `body { display: grid; grid-template-columns: repeat(4, 1080px); gap: 40px; padding: 40px;
    width: max-content; zoom: .3; } .slide { margin: 0; }`,
});
await (await pagina.$('body')).screenshot({ path: path.join(carpeta, 'hoja.png') });

console.log(`${diapositivas.length} imágenes y hoja.png en ${carpeta}`);
await navegador.close();
if (problemas) {
  console.error(`\n${problemas} problema(s) de encuadre: cambia la foto, la composición o el sitio del texto antes de entregarlo.`);
  process.exit(2);
}
