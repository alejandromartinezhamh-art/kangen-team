// Una imagen de carrusel con movimiento (MP4 de 1080 × 1350): npm run carrusel-animado -- <carpeta> [salida.mp4]
// La carpeta de trabajo (fuera del repositorio) lleva un index.html hecho a partir de
// contenido/carruseles/plantilla-animada.html y las fotos o vídeos que use. Lo renderiza HyperFrames (HTML → MP4).
// Guía: contenido/carruseles/README.md, «Imágenes con movimiento».
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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
const salida = path.resolve(process.argv[3] ?? path.join(carpeta, 'animada.mp4'));

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
