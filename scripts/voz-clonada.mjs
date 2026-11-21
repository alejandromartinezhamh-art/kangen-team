// Voz clonada: la voz de un vídeo dicha con la voz de la persona, a partir de una muestra suya y siempre con su
// permiso (lo da ella en su estudio). Usa Qwen3-TTS (Apache 2.0) en la propia sesión de Claude, sin tarjeta gráfica:
// tarda unas 4 veces lo que dura la voz. Cada vídeo con voz clonada lleva la etiqueta de IA de cada red.
//   npm run voz-clonada -- <muestra (m4a, webm, wav…)> <texto.txt> <salida.wav> [--grande]
// La muestra y la voz generada van fuera del repositorio (es público). Guía: contenido/videos/README.md → «Voz clonada».
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HYPERFRAMES = 'hyperframes@0.9.52';
const raiz = path.resolve(import.meta.dirname, '..');
const ENTORNO = path.join(os.homedir(), '.cache', 'kangen-voz', 'venv');
const PYTHON = path.join(ENTORNO, 'bin', 'python');
const MODELOS = { normal: 'Qwen/Qwen3-TTS-12Hz-0.6B-Base', grande: 'Qwen/Qwen3-TTS-12Hz-1.7B-Base' };
const entorno = { ...process.env, DO_NOT_TRACK: '1', HYPERFRAMES_SKIP_SKILLS: '1', HF_HUB_DISABLE_TELEMETRY: '1' };

const ffmpeg = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
const duracion = (archivo) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', archivo], { encoding: 'utf8' }).trim());

// El entorno de Python con Qwen3-TTS, solo la primera vez en cada máquina (unos minutos y unos 3 GB con el modelo).
function prepararEntorno() {
  if (existsSync(PYTHON) && spawnSync(PYTHON, ['-c', 'import qwen_tts'], { stdio: 'ignore' }).status === 0) return;
  console.log('Instalando la voz clonada (solo la primera vez en esta máquina, unos minutos)…');
  const python = spawnSync('python3.12', ['--version']).status === 0 ? 'python3.12' : 'python3';
  rmSync(ENTORNO, { recursive: true, force: true });
  mkdirSync(path.dirname(ENTORNO), { recursive: true });
  const pip = (args) => {
    const r = spawnSync(path.join(ENTORNO, 'bin', 'pip'), ['install', '-q', ...args], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error('No se ha podido instalar la voz clonada (pip). Mira la salida de arriba.');
  };
  if (spawnSync(python, ['-m', 'venv', ENTORNO], { stdio: 'inherit' }).status !== 0) throw new Error('No se ha podido crear el entorno de Python.');
  pip(['--upgrade', 'pip']);
  pip(['torch', 'torchaudio', '--index-url', 'https://download.pytorch.org/whl/cpu']);
  pip(['qwen-tts']);
}

// La muestra limpia (sin graves de fondo ni ruido, al mismo volumen) y cortada en una pausa: como mucho 20 s.
function prepararMuestra(muestra, carpeta) {
  const limpia = path.join(carpeta, 'muestra-limpia.wav');
  ffmpeg(['-i', muestra, '-vn', '-ac', '1', '-ar', '24000', '-af',
    'highpass=f=80,afftdn=nf=-25,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,loudnorm=I=-18:TP=-2', limpia]);
  const total = duracion(limpia);
  if (total < 6) throw new Error(`La muestra dura ${total.toFixed(1)} s: hace falta al menos 10 segundos hablando.`);
  if (total <= 20) return limpia;
  const datos = spawnSync('ffmpeg', ['-v', 'info', '-i', limpia, '-af', 'silencedetect=n=-35dB:d=0.25', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const pausas = [...datos.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1])).filter((s) => s >= 8 && s <= 20);
  const corte = pausas.length ? Math.max(...pausas) + 0.1 : 20;
  const recortada = path.join(carpeta, 'muestra.wav');
  ffmpeg(['-i', limpia, '-t', corte.toFixed(2), recortada]);
  return recortada;
}

// Lo que dice la muestra, para que el modelo la entienda bien (Whisper de HyperFrames, como en npm run video).
export function transcribir(audio) {
  const dir = path.dirname(audio);
  const r = spawnSync('npx', ['--yes', HYPERFRAMES, 'transcribe', path.basename(audio), '--engine', 'auto', '--model', 'small', '--language', 'es', '--json'],
    { cwd: dir, env: entorno, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  const salida = path.join(dir, 'transcript.json');
  if (r.status !== 0 || !existsSync(salida)) throw new Error('No se ha podido transcribir la muestra.');
  const palabras = JSON.parse(readFileSync(salida, 'utf8'));
  rmSync(salida);
  return palabras;
}

// El texto en frases: cada una se genera aparte (sale más estable) y se unen con una pausa natural.
export function frasesDe(texto) {
  const frases = [];
  for (const parrafo of String(texto).replace(/\*/g, '').split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean)) {
    const partes = parrafo.split(/(?<=[.!?…])\s+/).map((p) => p.trim()).filter(Boolean);
    const unidas = [];
    for (const p of partes) {
      if (unidas.length && unidas.at(-1).split(/\s+/).length < 4) unidas[unidas.length - 1] += ' ' + p;
      else unidas.push(p);
    }
    unidas.forEach((f, i) => frases.push({ texto: f, pausa: i === unidas.length - 1 ? 0.6 : 0.35 }));
  }
  return frases;
}

export async function vozClonada({ muestra, texto, salida, grande = false }) {
  if (!existsSync(muestra)) throw new Error(`No encuentro la muestra: ${muestra}`);
  const frases = frasesDe(texto);
  if (!frases.length) throw new Error('No hay texto que decir.');
  const salidaAbs = path.resolve(salida);
  if (salidaAbs.startsWith(raiz + path.sep)) throw new Error('La voz va fuera del repositorio: es público.');
  const trabajo = path.join(path.dirname(salidaAbs), '.voz-clonada');
  rmSync(trabajo, { recursive: true, force: true });
  mkdirSync(trabajo, { recursive: true });
  prepararEntorno();
  const ref = prepararMuestra(muestra, trabajo);
  const textoRef = transcribir(ref).map((p) => p.text).join(' ').trim();
  if (!textoRef) throw new Error('En la muestra no se entiende ninguna palabra: hace falta una grabación hablando, sin música.');
  writeFileSync(path.join(trabajo, 'muestra.txt'), textoRef);
  writeFileSync(path.join(trabajo, 'frases.json'), JSON.stringify(frases));
  console.log(`Muestra: ${duracion(ref).toFixed(1)} s («${textoRef.slice(0, 70)}…»). Generando ${frases.length} frase(s)…`);
  const crudo = path.join(trabajo, 'voz.wav');
  const r = spawnSync(PYTHON, [path.join(raiz, 'scripts', 'voz-clonada.py'), grande ? MODELOS.grande : MODELOS.normal,
    ref, path.join(trabajo, 'muestra.txt'), path.join(trabajo, 'frases.json'), crudo], { env: entorno, stdio: 'inherit' });
  if (r.status !== 0 || !existsSync(crudo)) throw new Error('No se ha podido generar la voz.');
  copyFileSync(crudo, salidaAbs);
  rmSync(trabajo, { recursive: true, force: true });
  return { salida: salidaAbs, duracion: duracion(salidaAbs) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const args = process.argv.slice(2);
  const grande = args.includes('--grande');
  const [muestra, textoArchivo, salida] = args.filter((a) => a !== '--grande');
  if (!muestra || !textoArchivo || !salida) {
    console.error('Uso: npm run voz-clonada -- <muestra> <texto.txt> <salida.wav> [--grande]. Guía: contenido/videos/README.md');
    process.exit(1);
  }
  try {
    const r = await vozClonada({ muestra, texto: readFileSync(textoArchivo, 'utf8'), salida, grande });
    console.log(`${r.salida} (${r.duracion.toFixed(1)} s). Es voz hecha con IA: el vídeo lleva la etiqueta de IA de cada red.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
