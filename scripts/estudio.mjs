// Estudio de contenido dentro de Claude (contenido/estudio/README.md).
//
//   npm run estudio -- pagina [salida.html] [--nombre Gemma]
//     Monta la página del estudio (dist/estudio.html) a partir de contenido/estudio/estudio.html y de la plantilla de
//     carruseles: sus estilos, sus dibujos y una muestra de cada composición. Así el estudio enseña cada imagen igual
//     que saldrá, y cualquier cambio en la plantilla llega al estudio al volver a montarlo y publicarlo.
//
//   npm run estudio -- caras <carpeta con fotos>
//     Busca las caras de cada foto (las mismas cuentas que npm run carrusel) y escribe caras.json en la carpeta, para
//     dar de alta las fotos en el estudio con sus caras.
//
//   npm run estudio -- preparar <pieza.json exportada> <carpeta de trabajo>
//     Convierte una pieza del estudio en lo que usan las herramientas de siempre: carrusel.html (npm run carrusel) o
//     pieza.json (npm run video, con transcripcion.json si la voz ya tiene subtítulos). Los archivos del estudio (fotos,
//     clips y voz) tienen que estar ya en la carpeta, cada uno con su id como nombre (<id>.jpg, <id>.mp4…). La carpeta
//     va fuera del repositorio: es público.
//
//   npm run estudio -- devolver <pieza.json exportada> <carpeta de trabajo> [--resultado <id>] [--drive <enlace>]
//     Después de npm run video: escribe para-el-estudio.json con la pieza al día (los subtítulos de su voz, para que
//     los pueda corregir y quitar frases desde el estudio; y, si se dan, el vídeo subido y el enlace de Drive). Se
//     guarda en el estudio con ArtifactData (update con file_path).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const PLANTILLA = path.join(raiz, 'contenido/carruseles/plantilla.html');
const PAGINA = path.join(raiz, 'contenido/estudio/estudio.html');
// Las cuentas del montaje de vídeo (velocidad, recortes de la voz, subtítulos y letras): las mismas que scripts/video.mjs.
const MONTAJE = path.join(raiz, 'scripts/montaje-video.mjs');
const [orden, ...args] = process.argv.slice(2);

const leerPlantilla = () => {
  const html = readFileSync(PLANTILLA, 'utf8');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const simbolos = html.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];
  const guion = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Cada muestra: <!-- N nombre --> seguido de su <section class="slide …">…</section>
  const muestras = [...html.matchAll(/<!-- \d+ ([\w-]+) -->\s*(<section[\s\S]*?<\/section>)/g)].map(([, nombre, seccion]) => ({
    nombre,
    html: seccion.replace('<section ', `<section data-composicion="${nombre}" `),
  }));
  return { html, css, simbolos, guion, muestras };
};

// Los estilos de la plantilla, encerrados en .lienzo: en la plantilla mandan sobre la página entera (body, :root);
// en el estudio, solo sobre cada imagen.
function encerrarCss(css) {
  const salida = [];
  let i = 0;
  while (i < css.length) {
    const abre = css.indexOf('{', i);
    if (abre < 0) break;
    let nivel = 1, j = abre + 1;
    while (j < css.length && nivel) {
      if (css[j] === '{') nivel++;
      else if (css[j] === '}') nivel--;
      j++;
    }
    const selector = css.slice(i, abre).replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const bloque = css.slice(abre, j);
    i = j;
    if (!selector) continue;
    const nuevos = selector.split(',').map((s) => s.trim()).filter(Boolean).flatMap((s) => {
      if (s === ':root' || s === 'body' || s === 'html') return ['.lienzo'];
      if (s === '*') return ['.lienzo', '.lienzo *'];
      if (/^body\./.test(s)) return [s.replace(/^body\./, '.lienzo.')];
      return ['.lienzo ' + s];
    });
    salida.push(`${[...new Set(nuevos)].join(', ')} ${bloque}`);
  }
  return salida.join('\n');
}

function pagina(destino = path.join(raiz, 'dist/estudio.html'), nombre = '') {
  const p = leerPlantilla();
  let html = readFileSync(PAGINA, 'utf8');
  // Un estudio por persona (sus fotos y su voz no se mezclan con las de nadie): su nombre en el título.
  if (nombre) html = html.replace('<title>Estudio de contenido</title>', `<title>Estudio de ${nombre}</title>`);
  const sustituir = (marca, valor) => {
    if (!html.includes(marca)) throw new Error(`Falta ${marca} en ${PAGINA}`);
    html = html.replace(marca, () => valor);
  };
  sustituir('/*@PLANTILLA_CSS@*/', encerrarCss(p.css));
  sustituir('<!--@SIMBOLOS@-->', p.simbolos);
  sustituir('/*@MONTAJE_VIDEO@*/', readFileSync(MONTAJE, 'utf8').replace(/^export /gm, ''));
  sustituir('/*@COMPOSICIONES@*/', `const COMPOSICIONES = ${JSON.stringify(p.muestras).replace(/<\/(script)/gi, '<\\/$1')};`);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, html);
  console.log(`${path.relative(process.cwd(), destino)} · ${p.muestras.length} composiciones · ${Math.round(html.length / 1024)} KB`);
}

async function caras(carpeta) {
  const { carasEnFotos } = await import('./encuadre.mjs');
  const fotos = readdirSync(carpeta).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const medidas = await carasEnFotos(fotos.map((f) => path.join(carpeta, f)));
  const salida = Object.fromEntries(fotos.map((f, i) => [f, {
    ancho: medidas[i].ancho,
    alto: medidas[i].alto,
    caras: medidas[i].caras.map((c) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v)]))),
  }]));
  writeFileSync(path.join(carpeta, 'caras.json'), JSON.stringify(salida, null, 2));
  for (const [f, m] of Object.entries(salida)) console.log(`${f} · ${m.ancho} × ${m.alto} · ${m.caras.length} cara(s)`);
}

function preparar(exportada, carpeta) {
  carpeta = path.resolve(carpeta);
  if (carpeta.startsWith(raiz + path.sep)) {
    console.error('La carpeta de trabajo tiene que estar fuera del repositorio: es público y ahí no van fotos ni voces.');
    process.exit(1);
  }
  // Vale la pieza tal cual la guarda ArtifactData (out_dir/piezas/<código>.json, con sus ajustes en
  // out_dir/ajustes/persona.json) o un archivo { pieza, ajustes }.
  const leido = JSON.parse(readFileSync(exportada, 'utf8'));
  const junto = path.join(path.dirname(exportada), '..', 'ajustes', 'persona.json');
  const pieza = leido.pieza ?? leido;
  const ajustes = leido.ajustes ?? (existsSync(junto) ? JSON.parse(readFileSync(junto, 'utf8')) : {});
  // Lo que viene del estudio lo ha escrito quien lo usa: fuera scripts y atributos on… antes de abrirlo en el navegador.
  const limpio = (html) => html.replace(/<(script|iframe|object|embed|link|meta|base)\b[\s\S]*?(<\/\1>|>)/gi, '').replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  pieza.slides = (pieza.slides ?? []).map(limpio);
  const archivos = existsSync(carpeta) ? readdirSync(carpeta) : [];
  const archivo = (id) => {
    const hallado = archivos.find((f) => f.startsWith(id + '.'));
    if (!hallado) throw new Error(`Falta el archivo ${id} en ${carpeta}: bájalo del estudio antes (Artifact read con path = id).`);
    return hallado;
  };

  if (pieza.formato === 'video') {
    const v = pieza.video ?? {};
    const voz = v.voz?.asset ? archivo(v.voz.asset) : null;
    const salida = {
      persona: ajustes.clave ?? pieza.persona,
      ...(v.gancho ? { gancho: v.gancho } : {}),
      ...(voz ? { voz } : {}),
      ...(v.velocidad && v.velocidad !== 1 ? { velocidad: v.velocidad } : {}),
      ...(v.estilo ? { estilo: v.estilo } : {}),
      // Los trozos de la voz que se quedan, tal cual los ha enseñado el estudio (si no, salen del recorte).
      ...(voz ? { recorte: { desde: v.voz.desde || 0, hasta: v.voz.hasta ?? null, pausas: !!v.voz.pausas } } : {}),
      ...(voz && v.voz.tramos?.length ? { tramos: v.voz.tramos } : {}),
      medios: (v.medios ?? []).map((m) => ({
        archivo: archivo(m.asset),
        ...(m.desde ? { desde: m.desde } : {}),
        ...(m.segundos ? { segundos: m.segundos } : {}),
        ...(m.texto ? { texto: m.texto } : {}),
      })),
    };
    writeFileSync(path.join(carpeta, 'pieza.json'), JSON.stringify(salida, null, 2));
    // Los subtítulos corregidos en el estudio (y las frases quitadas) mandan sobre una transcripción nueva.
    if (voz && v.voz.palabras?.length) writeFileSync(path.join(carpeta, 'transcripcion.json'), JSON.stringify({ voz, palabras: v.voz.palabras }, null, 1));
    console.log(`pieza.json listo${voz && v.voz.palabras?.length ? ' (y transcripcion.json)' : ''}: npm run video -- ${carpeta}`);
    return;
  }

  const p = leerPlantilla();
  const c = ajustes.colores ?? {};
  const nombres = { fondo: 'fondo', lila: 'lila', texto: 'texto', secundario: 'secundario', acento: 'acento',
    acentoClaro: 'acento-claro', estructura: 'estructura', borde: 'borde' };
  let html = p.html;
  // Sus colores en :root (los derivados se calculan solos).
  for (const [clave, variable] of Object.entries(nombres)) {
    if (c[clave]) html = html.replace(new RegExp(`--${variable}: #[0-9a-fA-F]{3,8};`), `--${variable}: ${c[clave]};`);
  }
  html = html.replace(/<body class="[\w-]*">/, `<body class="${pieza.estilo ?? 'album'}">`);
  // Las imágenes del estudio en lugar de las muestras, con cada foto apuntando a su archivo.
  const diapositivas = (pieza.slides ?? []).map((s) =>
    s.replace(/src="\/_blob\/([0-9a-f]{32})"/g, (_, id) => `src="${archivo(id)}"`).replace(/ data-foto="[0-9a-f]{32}"/g, ''));
  const inicio = html.indexOf('<!-- ============ Ejemplos');
  const fin = html.indexOf('<script>', inicio);
  html = `${html.slice(0, inicio)}<!-- ${pieza.codigo ?? ''} ${pieza.titulo ?? ''} (desde el estudio) -->\n\n${diapositivas.join('\n\n')}\n\n${html.slice(fin)}`;
  html = html.replace('<title>Carrusel</title>', `<title>${pieza.codigo ?? 'Carrusel'}</title>`);
  writeFileSync(path.join(carpeta, 'carrusel.html'), html);
  console.log(`carrusel.html listo (${diapositivas.length} imágenes, estilo ${pieza.estilo}): npm run carrusel -- ${carpeta}`);
}

function leerExportada(exportada) {
  const leido = JSON.parse(readFileSync(exportada, 'utf8'));
  return leido.pieza ?? leido;
}

function devolver(exportada, carpeta, extra) {
  carpeta = path.resolve(carpeta);
  const pieza = leerExportada(exportada);
  if (pieza.formato !== 'video') throw new Error('devolver es para vídeos: un carrusel solo necesita estado, resultado y drive.');
  const video = structuredClone(pieza.video ?? {});
  const t = path.join(carpeta, 'transcripcion.json');
  if (video.voz?.asset && existsSync(t)) {
    const leida = JSON.parse(readFileSync(t, 'utf8'));
    const palabras = Array.isArray(leida) ? leida : leida.palabras;
    video.voz.palabras = palabras.map((p) => ({ text: String(p.text), start: Number(p.start), end: Number(p.end), ...(p.fuera ? { fuera: true } : {}) }));
  }
  const datos = { video, actualizado: Date.now() };
  if (extra.resultado) Object.assign(datos, { estado: 'hecho', resultado: [{ asset: extra.resultado, tipo: 'video' }] });
  if (extra.drive) datos.drive = extra.drive;
  writeFileSync(path.join(carpeta, 'para-el-estudio.json'), JSON.stringify(datos, null, 1));
  console.log(`para-el-estudio.json listo (${video.voz?.palabras?.length ?? 0} palabras de subtítulos): ArtifactData update de piezas/${pieza.codigo} con file_path.`);
}

if (orden === 'pagina') {
  const i = args.indexOf('--nombre');
  const nombre = i >= 0 ? args.splice(i, 2)[1] : '';
  pagina(args[0] ? path.resolve(args[0]) : undefined, nombre);
}
else if (orden === 'caras' && args[0]) await caras(path.resolve(args[0]));
else if (orden === 'preparar' && args[1]) preparar(path.resolve(args[0]), args[1]);
else if (orden === 'devolver' && args[1]) {
  const valor = (bandera) => { const i = args.indexOf(bandera); return i >= 0 ? args[i + 1] : undefined; };
  devolver(path.resolve(args[0]), args[1], { resultado: valor('--resultado'), drive: valor('--drive') });
}
else {
  console.error('Uso: npm run estudio -- pagina [salida.html] [--nombre <Nombre>] | caras <carpeta> | preparar <pieza.json> <carpeta> | devolver <pieza.json> <carpeta> [--resultado <id>] [--drive <enlace>]');
  process.exit(1);
}
