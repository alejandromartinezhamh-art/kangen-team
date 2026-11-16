// Una imagen de carrusel con movimiento (MP4 de 1080 × 1350) o un Reel animado (1080 × 1920):
// npm run carrusel-animado -- <carpeta> [salida.mp4] [--sin-encuadre]
// La carpeta de trabajo (fuera del repositorio) lleva un index.html hecho a partir de
// contenido/carruseles/plantilla-animada.html o de contenido/videos/plantilla-reel-animado.html, y las fotos o vídeos
// que use. El tamaño lo marca la plantilla. Lo renderiza HyperFrames (HTML → MP4).
// Guías: contenido/carruseles/README.md, «Imágenes con movimiento», y contenido/videos/README.md, «Reel animado».
// Antes de renderizar recorre la animación y comprueba dos cosas; si alguna falla, no renderiza:
// - que ninguna cara queda cortada ni con texto encima (scripts/encuadre.mjs), cada medio segundo;
// - que cada texto se queda quieto y entero el tiempo de leerlo: unas 3 palabras por segundo y nunca menos de 2 s.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { ARGUMENTOS_NAVEGADOR, encuadrar } from './encuadre.mjs';

const HYPERFRAMES = 'hyperframes@0.9.52';
const raiz = path.resolve(import.meta.dirname, '..');

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (!carpeta || !existsSync(path.join(carpeta, 'index.html'))) {
  console.error('Uso: npm run carrusel-animado -- <carpeta con index.html> [salida.mp4]');
  process.exit(1);
}
if (carpeta.startsWith(raiz + path.sep)) {
  console.error('La carpeta de trabajo tiene que estar fuera del repositorio: es público y ahí no van fotos ni vídeos de nadie.');
  process.exit(1);
}
const argumentos = process.argv.slice(3).filter((a) => !a.startsWith('--'));
const salida = path.resolve(argumentos[0] ?? path.join(carpeta, 'animada.mp4'));

// Las caras y la lectura, en toda la animación.
if (!process.argv.includes('--sin-encuadre')) {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const navegador = await chromium.launch({ args: ARGUMENTOS_NAVEGADOR });
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
  await pagina.goto('file://' + path.join(carpeta, 'index.html'));
  await pagina.evaluate(() => document.fonts.ready);
  const duracion = await pagina.evaluate(() => Number(document.querySelector('#root')?.dataset.duration) || 0);
  const problemas = new Map();
  const necesaria = await pagina.evaluate(() => window.__duracionNecesaria ?? 0);
  if (necesaria > duracion + 0.05) problemas.set(`La animación necesita ${necesaria} s: pon data-duration="${Math.ceil(necesaria)}" en #root`, []);

  // Lectura: cada décima de segundo se mira qué bloques de texto se ven enteros (todas sus letras visibles).
  const vistos = new Map();
  for (let t = 0; t <= duracion + 0.001; t += 0.1) {
    const visibles = await pagina.evaluate((t) => {
      window.__timelines?.main?.seek(t, false);
      const opacidad = (el) => {
        let o = 1;
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const e = getComputedStyle(n);
          if (e.display === 'none' || e.visibility === 'hidden') return 0;
          o *= parseFloat(e.opacity);
        }
        return o;
      };
      const bloques = [...document.querySelectorAll('h1, h2, h3, p, li, .frase, .mano, .rotulo')]
        .filter((el) => el.textContent.trim() && !el.querySelector('h1, h2, h3, p, li, .frase, .mano, .rotulo'));
      return bloques.map((el, i) => {
        const letras = [];
        const recorrido = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) if (n.textContent.trim()) letras.push(n.parentElement);
        return { i, texto: el.textContent.trim().replace(/\s+/g, ' '), visible: Math.min(...letras.map(opacidad)) >= 0.85 };
      });
    }, t);
    for (const b of visibles) {
      const v = vistos.get(b.i) ?? { texto: b.texto, racha: 0, mejor: 0 };
      v.racha = b.visible ? v.racha + 0.1 : 0;
      v.mejor = Math.max(v.mejor, v.racha);
      vistos.set(b.i, v);
    }
  }
  for (const v of vistos.values()) {
    const palabras = v.texto.split(' ').length;
    const hace = Math.max(2, 0.7 + palabras / 3);
    // Lo que está quieto hasta el final del vídeo cuenta entero: se puede pausar y en bucle se vuelve a ver.
    if (v.mejor > 0 && v.mejor + 0.05 < hace - 0.1 && v.mejor < duracion - 0.2)
      problemas.set(`«${v.texto.slice(0, 50)}» se ve entero ${v.mejor.toFixed(1)} s y necesita ${hace.toFixed(1)} s para leerse`, []);
  }

  for (let t = 0; t <= duracion; t += 0.5) {
    await pagina.evaluate((t) => { window.__timelines?.main?.seek(t, false); }, t);
    for (const f of await encuadrar(pagina, { mover: false })) {
      for (const p of f.problemas) {
        const clave = `${f.foto}: ${p.replace(/ \(.*\)$/, '')}`;
        problemas.set(clave, [...(problemas.get(clave) ?? []), t.toFixed(1)]);
      }
    }
  }
  await navegador.close();
  if (problemas.size) {
    for (const [clave, momentos] of problemas) console.error(`✗ ${clave}${momentos.length ? ` (segundos ${momentos.join(', ')})` : ''}`);
    console.error('\nNo se renderiza: arregla lo de arriba (foto, sitio del texto o tiempos) y vuelve a ejecutar.');
    process.exit(2);
  }
  console.log('Caras y tiempo de lectura: ✓');
}

const entorno = { ...process.env, DO_NOT_TRACK: '1', HYPERFRAMES_SKIP_SKILLS: '1' };
function hf(args, cwd, ver = false) {
  const r = spawnSync('npx', ['--yes', HYPERFRAMES, ...args], { cwd, env: entorno, stdio: ['ignore', ver ? 'inherit' : 'ignore', 'inherit'] });
  if (r.status !== 0) throw new Error(`hyperframes ${args[0]} ha fallado`);
}

// HyperFrames necesita su carpeta de proyecto: se crea una temporal y se copia dentro la composición con su material.
const temporal = mkdtempSync(path.join(os.tmpdir(), 'carrusel-animado-'));
try {
  hf(['telemetry', 'disable'], temporal);
  hf(['browser', 'ensure'], temporal);
  hf(['init', 'obra', '--example', 'blank', '--non-interactive', '--skip-skills'], temporal);
  const obra = path.join(temporal, 'obra');
  for (const archivo of readdirSync(carpeta)) {
    if (path.join(carpeta, archivo) === salida) continue;
    cpSync(path.join(carpeta, archivo), path.join(obra, archivo), { recursive: true });
  }
  hf(['render', '--output', salida, '--fps', '30', '--quality', 'standard'], obra, true);
} finally {
  rmSync(temporal, { recursive: true, force: true });
}
console.log(`\n${salida}`);
