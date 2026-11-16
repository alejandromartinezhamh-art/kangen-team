// Vídeo vertical con la voz de la persona (o con textos en pantalla): npm run video -- <carpeta> [--planos]
// La carpeta de trabajo va fuera del repositorio (es público): lleva pieza.json, la voz y los clips o fotos.
// Pasos: limpia la voz, la transcribe palabra a palabra, recorta cada clip a 1080 × 1920 y monta una composición de
// HyperFrames (HTML → MP4) con el gancho arriba y los subtítulos al ritmo de la voz, con los colores de la persona.
// Con --planos solo hace planos.jpg: un fotograma por segundo de cada clip, para elegir qué trozo usar antes de montar.
// Cada texto en pantalla dura al menos lo que se tarda en leerlo, y las fotos se recortan alrededor de la cara.
// Guía y formato de pieza.json: contenido/videos/README.md.
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { carasEnFotos } from './encuadre.mjs';

const HYPERFRAMES = 'hyperframes@0.9.52';
const ANCHO = 1080;
const ALTO = 1920;
const raiz = path.resolve(import.meta.dirname, '..');

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (!carpeta || !existsSync(path.join(carpeta, 'pieza.json'))) {
  console.error('Uso: npm run video -- <carpeta con pieza.json>. Formato: contenido/videos/README.md');
  process.exit(1);
}
if (carpeta.startsWith(raiz + path.sep)) {
  console.error('La carpeta de trabajo tiene que estar fuera del repositorio: es público y ahí no van fotos, voces ni historias.');
  process.exit(1);
}

const pieza = JSON.parse(readFileSync(path.join(carpeta, 'pieza.json'), 'utf8'));
const obra = path.join(carpeta, 'obra');
const entorno = { ...process.env, DO_NOT_TRACK: '1', HYPERFRAMES_SKIP_SKILLS: '1' };

// ---------- Utilidades
function hf(args, { cwd = obra, salida = 'inherit' } = {}) {
  const r = spawnSync('npx', ['--yes', HYPERFRAMES, ...args], { cwd, env: entorno, encoding: 'utf8', stdio: ['ignore', salida, 'inherit'] });
  if (r.status !== 0) throw new Error(`hyperframes ${args[0]} ha fallado`);
  return r.stdout ?? '';
}
const ffmpeg = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
const duracion = (archivo) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', archivo], { encoding: 'utf8' }).trim());
const r2 = (n) => Math.round(n * 100) / 100;
// Lo que se tarda en leer un texto en pantalla: unas 3 palabras por segundo y nunca menos de 2 segundos, quieto.
// Es la misma cuenta que usa la comprobación de scripts/carrusel-animado.mjs.
const palabrasDe = (texto) => texto.replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
const lectura = (texto) => r2(Math.max(2, 0.7 + palabrasDe(texto) / 3));
const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// «Otra *manera*» → la palabra entre asteriscos va en cursiva y con el color de énfasis, como en las webs.
const conEnfasis = (t) => escapar(t).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const aclarar = (hex, parte) => {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return '#' + n.map((c) => Math.round(c + (255 - c) * parte).toString(16).padStart(2, '0')).join('');
};

// ---------- Colores de la persona (equipo/<persona>/design.md)
function colores(persona) {
  const base = { superficie: '#d9d9d9', acento: '#c0392b', estructura: '#333333' };
  const archivo = path.join(raiz, 'equipo', persona ?? '', 'design.md');
  if (!persona || !existsSync(archivo)) return { ...base, acentoClaro: aclarar(base.acento, 0.45) };
  const texto = readFileSync(archivo, 'utf8');
  for (const [, nombre, hex] of texto.matchAll(/\|\s*`([\w-]+)`\s*\|[^|\n]*\|\s*`(#[0-9a-fA-F]{6})`/g)) base[nombre] = hex;
  const claro = texto.match(/claro\s+`(#[0-9a-fA-F]{6})`/i)?.[1];
  return { ...base, acentoClaro: claro ?? aclarar(base.acento, 0.45) };
}
const color = { ...colores(pieza.persona), ...(pieza.colores ?? {}) };

// ---------- Preparar las herramientas (la primera vez tarda unos minutos)
function preparar() {
  hf(['telemetry', 'disable'], { cwd: carpeta, salida: 'ignore' });
  hf(['browser', 'ensure'], { cwd: carpeta, salida: 'ignore' });
  if (pieza.voz && !/parakeet\S*\s+installed/.test(hf(['models', 'list'], { cwd: carpeta, salida: 'pipe' }))) {
    console.log('Instalando el reconocimiento de voz (solo la primera vez)…');
    hf(['models', 'install', 'parakeet'], { cwd: carpeta });
  }
}

// ---------- Subtítulos: agrupa las palabras en frases cortas
function frases(palabras) {
  const lista = [];
  let actual = [];
  const cerrar = () => {
    if (actual.length) lista.push(actual);
    actual = [];
  };
  palabras.forEach((p, i) => {
    const anterior = palabras[i - 1];
    const letras = actual.reduce((n, x) => n + x.text.length + 1, 0);
    if (anterior && (actual.length >= 4 || letras + p.text.length > 22 || /[.,;:?!…]$/.test(anterior.text) || p.start - anterior.end > 0.5)) cerrar();
    actual.push(p);
  });
  cerrar();
  return lista.map((f, i) => {
    const inicio = f[0].start;
    const siguiente = lista[i + 1]?.[0].start ?? Infinity;
    return { palabras: f, inicio, fin: Math.max(inicio + 0.3, Math.min(siguiente, f.at(-1).end + 0.35)) };
  });
}

// ---------- Revisar los clips antes de montar: un fotograma por segundo de cada uno, y avisos de luz y nitidez
function revisarClips(lista) {
  const filas = [];
  lista.filter((m) => /\.(mov|mp4|m4v|webm)$/i.test(m.archivo)).forEach((m, i) => {
    const origen = path.join(carpeta, m.archivo);
    const fila = path.join(carpeta, `.plano-${i}.jpg`);
    ffmpeg(['-i', origen, '-vf', 'fps=1,scale=240:426:force_original_aspect_ratio=decrease,pad=240:426:-1:-1:color=black,tile=8x1', '-frames:v', '1', fila]);
    filas.push({ fila, archivo: m.archivo, segundos: Math.floor(duracion(origen)) });
    const datos = execFileSync('ffmpeg', ['-v', 'error', '-i', origen, '-vf', 'fps=2,scale=320:-2,blurdetect=block_width=32:block_height=32,signalstats,metadata=print:file=-', '-f', 'null', '-'], { encoding: 'utf8' });
    const luz = [...datos.matchAll(/YAVG=([\d.]+)/g)].map((x) => Number(x[1]));
    const borroso = [...datos.matchAll(/lavfi\.blur=([\d.]+)/g)].map((x) => Number(x[1])).sort((a, b) => a - b);
    const media = luz.reduce((s, x) => s + x, 0) / (luz.length || 1);
    if (media < 50) console.warn(`Aviso: ${m.archivo} está oscuro (luz media ${Math.round(media)} de 255).`);
    if (borroso[Math.floor(borroso.length / 2)] > 8) console.warn(`Aviso: ${m.archivo} parece movido o desenfocado.`);
  });
  if (!filas.length) return;
  ffmpeg([...filas.flatMap((f) => ['-i', f.fila]), '-filter_complex', filas.length > 1 ? `vstack=inputs=${filas.length}` : 'null', path.join(carpeta, 'planos.jpg')]);
  filas.forEach((f) => rmSync(f.fila));
  console.log('planos.jpg: cada fila es un clip y cada imagen, un segundo (de 0 a 7):');
  filas.forEach((f, i) => console.log(`  Fila ${i + 1}: ${f.archivo} (${f.segundos} s)`));
  console.log('Mira que cada plano enseñe lo que dice su texto: nada de suelo, pies, techo, movidos ni caras de otros.');
}

// ---------- Montaje
revisarClips(pieza.medios.map((m) => (typeof m === 'string' ? { archivo: m } : m)));
if (process.argv.includes('--planos')) process.exit(0);
preparar();
rmSync(obra, { recursive: true, force: true });
hf(['init', 'obra', '--example', 'blank', '--resolution', 'portrait', '--non-interactive', '--skip-skills'], { cwd: carpeta, salida: 'ignore' });
mkdirSync(path.join(obra, 'medios'), { recursive: true });
mkdirSync(path.join(obra, 'audio'), { recursive: true });

// 1. La voz: mono, sin graves de fondo, con algo menos de ruido y al volumen de las redes (-14 LUFS).
let durVoz = 0;
let cues = [];
if (pieza.voz) {
  ffmpeg(['-i', path.join(carpeta, pieza.voz), '-vn', '-ac', '1', '-ar', '48000', '-af', 'highpass=f=80,afftdn=nf=-25,loudnorm=I=-14:TP=-1.5:LRA=11', path.join(obra, 'audio/voz.wav')]);
  durVoz = duracion(path.join(obra, 'audio/voz.wav'));
  hf(['transcribe', 'audio/voz.wav', '--engine', 'auto', '--model', 'small', '--language', pieza.idioma ?? 'es', '--json'], { salida: 'pipe' });
  const transcripcion = path.join(obra, 'audio/transcript.json');
  // Si hay una transcripción corregida a mano al lado de pieza.json, manda esa.
  if (existsSync(path.join(carpeta, 'transcripcion.json'))) copyFileSync(path.join(carpeta, 'transcripcion.json'), transcripcion);
  else copyFileSync(transcripcion, path.join(carpeta, 'transcripcion.json'));
  cues = frases(JSON.parse(readFileSync(transcripcion, 'utf8')));
}

// 2. El tiempo de cada clip: los que traen «segundos» lo respetan; el resto se reparte lo que dura la voz.
//    Un clip con texto dura al menos lo que se tarda en leerlo (sin voz se alarga; con voz, se avisa).
const medios = pieza.medios.map((m) => (typeof m === 'string' ? { archivo: m } : { ...m }));
for (const m of medios.filter((m) => m.texto)) {
  const minimo = r2(lectura(m.texto) + 0.3);
  if (!pieza.voz && (m.segundos ?? 0) < minimo) m.segundos = minimo;
  else if (pieza.voz && m.segundos && m.segundos < minimo) console.warn(`Aviso: «${m.texto}» dura ${m.segundos} s y necesita ${minimo} s para leerse.`);
}
const fijos = medios.reduce((n, m) => n + (m.segundos ?? 0), 0);
const libres = medios.filter((m) => !m.segundos).length;
const total = pieza.voz ? durVoz + 0.8 : fijos + libres * 3;
const reparto = libres ? Math.max(1.5, (total - fijos) / libres) : 0;
let t = 0;
medios.forEach((m, i) => {
  m.inicio = r2(t);
  m.dura = r2(i === medios.length - 1 ? Math.max(1, total - t) : (m.segundos ?? reparto));
  t += m.dura;
});

// 3. Cada clip, recortado a vertical y sin sonido; las fotos, algo más grandes para poder acercarlas despacio y
//    recortadas alrededor de la cara (si la hay), para que no se corte ni al acercarse.
const fotos = medios.filter((m) => !/\.(mov|mp4|m4v|webm)$/i.test(m.archivo));
const carasFotos = fotos.length ? await carasEnFotos(fotos.map((m) => path.join(carpeta, m.archivo))) : [];
fotos.forEach((m, i) => (m.medidas = carasFotos[i]));
function recorteFoto(m) {
  const W = ANCHO * 1.25, H = ALTO * 1.25;
  const { ancho, alto, caras } = m.medidas;
  const k = Math.max(W / ancho, H / alto);
  const sobraX = ancho * k - W, sobraY = alto * k - H;
  if (!caras.length) return { x: sobraX / 2, y: sobraY / 2, origen: '50% 45%' };
  const c = { l: Math.min(...caras.map((x) => x.l)) * k, r: Math.max(...caras.map((x) => x.r)) * k, t: Math.min(...caras.map((x) => x.t)) * k, b: Math.max(...caras.map((x) => x.b)) * k };
  // La cara, centrada en horizontal y a un tercio de altura (debajo del gancho y lejos de los subtítulos).
  const x = Math.min(sobraX, Math.max(0, (c.l + c.r) / 2 - W / 2));
  const y = Math.min(sobraY, Math.max(0, (c.t + c.b) / 2 - H * 0.36));
  const origen = `${(((c.l + c.r) / 2 - x) / W * 100).toFixed(1)}% ${(((c.t + c.b) / 2 - y) / H * 100).toFixed(1)}%`;
  if (c.r - c.l > W || c.b - c.t > H * 0.6) console.warn(`Aviso: en ${m.archivo} la cara es muy grande para el vídeo; mira la hoja.`);
  return { x, y, origen };
}
medios.forEach((m, i) => {
  const origen = path.join(carpeta, m.archivo);
  const numero = String(i + 1).padStart(2, '0');
  m.video = /\.(mov|mp4|m4v|webm)$/i.test(m.archivo);
  if (m.video) {
    const disponible = Math.max(0.5, duracion(origen) - (m.desde ?? 0));
    const lento = Math.min(1.5, Math.max(1, m.dura / disponible)); // si el clip es corto, se ralentiza un poco…
    const falta = Math.max(0, m.dura - disponible * lento); // …y si aún falta, se queda en la última imagen
    const filtro = [`scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase`, `crop=${ANCHO}:${ALTO}`, 'fps=30', 'setsar=1', `setpts=${lento}*PTS`];
    if (falta > 0) filtro.push(`tpad=stop_mode=clone:stop_duration=${r2(falta + 0.2)}`);
    m.src = `medios/${numero}.mp4`;
    ffmpeg(['-ss', String(m.desde ?? 0), '-i', origen, '-t', String(m.dura + 0.2), '-vf', filtro.join(','), '-an', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(obra, m.src)]);
  } else {
    m.src = `medios/${numero}.jpg`;
    const { x, y, origen: centro } = recorteFoto(m);
    m.origen = centro;
    ffmpeg(['-i', origen, '-vf', `scale=${ANCHO * 1.25}:${ALTO * 1.25}:force_original_aspect_ratio=increase,crop=${ANCHO * 1.25}:${ALTO * 1.25}:${Math.round(x)}:${Math.round(y)}`, '-q:v', '2', path.join(obra, m.src)]);
  }
});
if (pieza.musica) copyFileSync(path.join(carpeta, pieza.musica), path.join(obra, 'audio', 'musica' + path.extname(pieza.musica)));

// 4. La composición (HTML). Zona segura: nada de texto en los 250 px de arriba ni en los 420 de abajo (botones de la red).
const durGancho = r2(Math.min(Math.max(pieza.segundosGancho ?? 3.4, pieza.gancho ? lectura(pieza.gancho) + 0.4 : 0), total));
const html = `<!doctype html>
<html lang="es" data-resolution="portrait">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${ANCHO}, height=${ALTO}" />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=DM+Serif+Display:ital@1&display=swap" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${ANCHO}px; height: ${ALTO}px; overflow: hidden; background: #000; }
  #root { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: 'Inter Tight', system-ui, sans-serif; color: #fff; }
  .medio { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .velo { position: absolute; inset: 0; z-index: 2;
    background: linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 48%, rgba(0,0,0,.62) 78%, rgba(0,0,0,.7) 100%); }
  .texto { position: absolute; left: 90px; right: 90px; z-index: 3; text-align: center; font-weight: 800; letter-spacing: -0.02em;
    text-shadow: 0 4px 28px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6); }
  .texto em { font-family: 'DM Serif Display', serif; font-style: italic; font-weight: 400; letter-spacing: 0; color: ${color.acentoClaro}; }
  .gancho { top: 290px; font-size: 88px; line-height: 1.04; }
  .rotulo { top: 660px; font-size: 104px; line-height: 1.04; }
  .cue { top: 1270px; font-size: 80px; line-height: 1.1; }
  .cue span { display: inline-block; margin: 0 .1em; }
  .prueba { position: absolute; top: 150px; right: 60px; z-index: 4; padding: 12px 22px; border-radius: 999px; background: rgba(0,0,0,.6);
    font-size: 28px; font-weight: 700; letter-spacing: .08em; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${r2(total)}" data-width="${ANCHO}" data-height="${ALTO}">
${medios
  .map((m, i) =>
    m.video
      ? `  <video id="m${i}" class="clip medio" src="${m.src}" muted playsinline data-start="${m.inicio}" data-duration="${m.dura}" data-track-index="0"></video>`
      : `  <img id="m${i}" class="clip medio" src="${m.src}" alt="" data-start="${m.inicio}" data-duration="${m.dura}" data-track-index="0" />`,
  )
  .join('\n')}
  <div class="velo"></div>
${pieza.gancho ? `  <div id="gancho" class="clip texto gancho" data-start="0" data-duration="${durGancho}" data-track-index="1">${conEnfasis(pieza.gancho)}</div>` : ''}
${medios
  .map((m, i) => (m.texto ? `  <div id="r${i}" class="clip texto rotulo" data-start="${m.inicio}" data-duration="${m.dura}" data-track-index="1">${conEnfasis(m.texto)}</div>` : ''))
  .filter(Boolean)
  .join('\n')}
${cues
  .map((c, i) => `  <div id="c${i}" class="clip texto cue" data-start="${r2(c.inicio)}" data-duration="${r2(c.fin - c.inicio)}" data-track-index="2">${c.palabras.map((p, n) => `<span id="${p.id}">${escapar(n === c.palabras.length - 1 ? p.text.replace(/[.,;:]+$/, '') : p.text)}</span>`).join('')}</div>`)
  .join('\n')}
${pieza.vozDePrueba ? '  <div class="prueba">VOZ DE PRUEBA</div>' : ''}
${pieza.voz ? `  <audio id="voz" class="clip" src="audio/voz.wav" data-start="0" data-duration="${r2(durVoz)}" data-track-index="3" data-volume="1"></audio>` : ''}
${pieza.musica ? `  <audio id="musica" class="clip" src="audio/musica${path.extname(pieza.musica)}" data-start="0" data-duration="${r2(total)}" data-track-index="4" data-volume="${pieza.voz ? 0.12 : 0.6}" data-fade-in="0.4" data-fade-out="1"></audio>` : ''}
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  const medios = ${JSON.stringify(medios.map((m, i) => ({ id: '#m' + i, inicio: m.inicio, dura: m.dura, video: m.video, texto: !!m.texto, origen: m.origen ?? '50% 45%' })))};
  const cues = ${JSON.stringify(cues.map((c, i) => ({ id: '#c' + i, inicio: r2(c.inicio), palabras: c.palabras.map((p) => ({ id: '#' + p.id, a: r2(p.start), b: r2(p.end) })) })))};
  medios.forEach((m, i) => {
    // Las fotos se acercan despacio para que no se vean quietas.
    if (!m.video) tl.fromTo(m.id, { scale: 1, transformOrigin: m.origen }, { scale: 1.1, duration: m.dura, ease: 'none' }, m.inicio);
    // El rótulo entra con calma y se queda quieto; sale un poco antes del corte para que no se monte con el siguiente.
    if (m.texto) {
      tl.fromTo('#r' + i, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, m.inicio + 0.1);
      tl.to('#r' + i, { opacity: 0, duration: 0.25, ease: 'power1.in' }, Math.max(m.inicio + 0.6, m.inicio + m.dura - 0.3));
    }
  });
  ${pieza.gancho ? `tl.fromTo('#gancho', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0.05);
  tl.to('#gancho', { opacity: 0, duration: 0.25, ease: 'power1.in' }, ${r2(durGancho - 0.25)});` : ''}
  cues.forEach((c) => {
    tl.fromTo(c.id, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power3.out' }, c.inicio);
    c.palabras.forEach((p) => {
      tl.set(p.id, { color: '${color.superficie}' }, p.a);
      tl.set(p.id, { color: '#ffffff' }, Math.max(p.b, p.a + 0.08));
    });
  });
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
</body>
</html>
`;
writeFileSync(path.join(obra, 'index.html'), html);

// 5. Render y hoja de fotogramas para revisarlo de un vistazo.
const salida = path.join(carpeta, 'video.mp4');
hf(['render', '--output', salida, '--fps', '30', '--quality', 'standard']);
const instantes = [0.6, total * 0.25, total * 0.5, total * 0.75, total - 0.7].map((s) => Math.max(0, s));
instantes.forEach((s, i) => ffmpeg(['-ss', String(r2(s)), '-i', salida, '-frames:v', '1', '-vf', 'scale=360:640', path.join(obra, `f${i}.png`)]));
ffmpeg([...instantes.flatMap((_, i) => ['-i', path.join(obra, `f${i}.png`)]), '-filter_complex', `hstack=inputs=${instantes.length}`, path.join(carpeta, 'hoja.png')]);
const sobrantes = readdirSync(obra).filter((a) => /^f\d\.png$/.test(a));
sobrantes.forEach((a) => rmSync(path.join(obra, a)));

console.log(`\nvideo.mp4 (${r2(duracion(salida))} s) y hoja.png en ${carpeta}`);
if (cues.length) console.log('Subtítulos: ' + cues.map((c) => c.palabras.map((p) => p.text).join(' ')).join(' / '));
console.log('Si alguna palabra está mal escrita, corrígela en transcripcion.json y vuelve a ejecutar.');
