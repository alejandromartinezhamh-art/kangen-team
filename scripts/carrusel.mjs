// Genera las imágenes de un carrusel: npm run carrusel -- <carpeta>
// La carpeta tiene un carrusel.html hecho desde contenido/carruseles/plantilla.html (y su foto.jpg). Guarda cada
// <section class="slide"> como 01.png, 02.png… a 1080 × 1350 y una hoja.png con todas juntas para revisarlas.
// Necesita Playwright con Chromium (ya instalado en las sesiones de Claude en la nube).
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const carpeta = process.argv[2] && path.resolve(process.argv[2]);
const archivo = carpeta && path.join(carpeta, 'carrusel.html');
if (!archivo || !existsSync(archivo)) {
  console.error('Uso: npm run carrusel -- <carpeta con carrusel.html>');
  process.exit(1);
}

const { chromium } = createRequire(import.meta.url)('playwright');
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 1400 } });
await pagina.goto('file://' + archivo);
await pagina.evaluate(() => document.fonts.ready);
await pagina.waitForTimeout(300);

const faltan = await pagina.evaluate(() =>
  ['Inter Tight', 'DM Serif Display', 'Caveat'].filter(
    (f) => !document.fonts.check(`40px "${f}"`) && !document.fonts.check(`italic 40px "${f}"`),
  ),
);
if (faltan.length) console.warn(`Aviso: no se han cargado las letras ${faltan.join(', ')} (¿sin conexión?)`);

const diapositivas = await pagina.$$('section.slide');
for (const [i, d] of diapositivas.entries()) {
  await d.screenshot({ path: path.join(carpeta, `${String(i + 1).padStart(2, '0')}.png`) });
}

// Hoja de contacto: todas las imágenes en filas de 4, a un tercio de su tamaño.
await pagina.addStyleTag({
  content: `body { display: grid; grid-template-columns: repeat(4, 1080px); gap: 40px; padding: 40px;
    width: max-content; zoom: .3; } .slide { margin: 0; }`,
});
await (await pagina.$('body')).screenshot({ path: path.join(carpeta, 'hoja.png') });

console.log(`${diapositivas.length} imágenes y hoja.png en ${carpeta}`);
await navegador.close();
