// Comprobaciones rápidas antes de publicar (también las pasa GitHub en cada cambio: .github/workflows/comprobar.yml).
//   - Textos públicos (contenido.json, index.html y páginas comunes) sin nada de lo que prohíbe
//     estrategia/normas-comunicacion.md: marcas, cifras de dinero, promesas, salud, empleo.
//   - El curso privado (compartido/curso/curso.json): puede nombrar la empresa y dar cifras oficiales, pero nunca
//     salud, promesas ni empleo; lecciones bien formadas, y avisa de lo pendiente (vídeos, cifras sin confirmar).
//   - El script de la hoja (compartido/apps-script/Embudo.gs) sin errores de sintaxis.
//   - Cada web con embudo tiene sus fotos y su entrada en PERSONAS del script (si no, solo avisa).
// Uso: npm run comprobar
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const errores = [];
const avisos = [];

// ---------- Normas de comunicación ----------

const PROHIBIDO = [
  [/\b(kangen|enagic)\b/i, 'marca (Kangen / Enagic)'],
  [/\d[\d.,]*\s*(€|euros?\b|k€)/i, 'cifra de dinero'],
  [/(€|\$)\s*\d/, 'cifra de dinero'],
  [/hazte ric|sin esfuerzo|dinero f[aá]cil|libertad financiera|ingresos pasivos|trabaja (solo )?1 hora/i, 'promesa económica'],
  [/\b(alcalin\w*|ioniza\w*|antioxidante\w*|cur(a|ar|ación)\b|enfermedad\w*|hidrógeno|detox\w*|desintoxica\w*|alivia\w*|sistema inmun\w*)/i, 'afirmación de salud o producto'],
  [/buscamos personal|contratamos|oferta de trabajo|puesto de trabajo|se busca(n)? (personas|gente)/i, 'parece una oferta de empleo'],
];

function textosDe(valor, ruta = []) {
  if (typeof valor === 'string') return [[ruta.join('.'), valor]];
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosDe(v, [...ruta, i]));
  if (valor && typeof valor === 'object') {
    // _etiquetas son las ayudas del editor, no se publican
    return Object.entries(valor).flatMap(([k, v]) => (k.startsWith('_') ? [] : textosDe(v, [...ruta, k])));
  }
  return [];
}

function revisar(archivo, textos, reglas = PROHIBIDO) {
  for (const [donde, texto] of textos) {
    for (const [patron, motivo] of reglas) {
      const m = texto.match(patron);
      if (m) errores.push(`${archivo}${donde ? ` → ${donde}` : ''}: ${motivo} («${m[0]}»)`);
    }
  }
}

const webs = [
  ...readdirSync('equipo').map((p) => ({ id: p, dir: join('equipo', p, 'sitio') })),
  { id: null, dir: join('plantilla', 'sitio') },
].filter((w) => existsSync(w.dir));

for (const { dir } of webs) {
  const ruta = join(dir, 'src', 'contenido.json');
  if (existsSync(ruta)) revisar(ruta, textosDe(JSON.parse(readFileSync(ruta, 'utf8'))));
  const html = join(dir, 'index.html');
  if (existsSync(html)) {
    const visible = [...readFileSync(html, 'utf8').matchAll(/<title>([^<]*)<\/title>|content="([^"]*)"/g)].map((m) => ['', m[1] ?? m[2]]);
    revisar(html, visible);
  }
}

function archivos(dir, ext) {
  return readdirSync(dir).flatMap((e) => {
    const r = join(dir, e);
    return statSync(r).isDirectory() ? archivos(r, ext) : r.endsWith(ext) ? [r] : [];
  });
}
// Textos escritos en las páginas comunes (entre etiquetas o entre comillas)
for (const f of archivos(join('compartido', 'src'), '.tsx')) {
  const codigo = readFileSync(f, 'utf8');
  const textos = [...codigo.matchAll(/>([^<>{}]{3,})<|'([^'\n]{8,})'/g)].map((m) => ['', m[1] ?? m[2]]);
  revisar(f, textos);
}

// ---------- Curso privado ----------
// Lo ve el lead después de la primera llamada, con acceso. Puede hablar de la empresa, del producto (qué es y para
// qué se usa) y de cifras oficiales; nunca de salud, promesas de ingresos ni empleo (estrategia/curso.md).

const PROHIBIDO_CURSO = [
  ...PROHIBIDO.filter(([, motivo]) => !['marca (Kangen / Enagic)', 'cifra de dinero', 'afirmación de salud o producto'].includes(motivo)),
  [/\b(antioxidante\w*|cur(a|ar|ación)\b|enfermedad\w*|hidrógeno|detox\w*|desintoxica\w*|alivia\w*|sistema inmun\w*|previene|prevenir|sana(r)?\b|salud(able)? (mejor|de hierro))/i, 'afirmación de salud'],
  [/(ganar[aá]s|vas a ganar|ingresos? (garantizad|asegurad|segur))/i, 'promesa de ingresos'],
];

const rutaCurso = join('compartido', 'curso', 'curso.json');
const curso = JSON.parse(readFileSync(rutaCurso, 'utf8'));
revisar(rutaCurso, textosDe(curso), PROHIBIDO_CURSO);
{
  const lecciones = curso.modulos.flatMap((m) => m.lecciones);
  const ids = lecciones.map((l) => l.id);
  const repetidas = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repetidas.length) errores.push(`${rutaCurso}: lecciones con el mismo id (${repetidas.join(', ')})`);
  for (const l of lecciones) {
    if (!/^[a-z0-9-]{2,60}$/.test(l.id)) errores.push(`${rutaCurso}: id no válido «${l.id}» (minúsculas, números y guiones)`);
    if (l.video && !/^https:\/\/\S+$/.test(l.video)) errores.push(`${rutaCurso} → ${l.id}: el vídeo tiene que ser un enlace https://`);
    if (!Array.isArray(l.texto)) errores.push(`${rutaCurso} → ${l.id}: "texto" tiene que ser una lista de párrafos`);
  }
  if (!lecciones.some((l) => l.tipo === 'final')) errores.push(`${rutaCurso}: falta la lección final (tipo "final", el botón de WhatsApp)`);
  if (!String(curso.cifras?.aviso ?? '').includes('no es una previsión')) {
    errores.push(`${rutaCurso}: cifras.aviso tiene que decir que no es una previsión de ingresos`);
  }
  const sinVideo = lecciones.filter((l) => !l.video && !l.tipo && !l.opcional).length;
  if (sinVideo) avisos.push(`curso: ${sinVideo} lecciones sin vídeo todavía (se lee el texto)`);
  if (!curso.cifras.confirmadas) avisos.push('curso: precios y rangos sin confirmar con la documentación oficial (el lead no los ve)');
  if (!curso.cifras.comisionesAprobadas) avisos.push('curso: comisiones y calculadora sin la aprobación por escrito de la empresa (el lead no las ve)');
}

// ---------- Script de la hoja ----------

const gs = join('compartido', 'apps-script', 'Embudo.gs');
const codigoGs = readFileSync(gs, 'utf8');
try {
  const tmp = join(mkdtempSync(join(tmpdir(), 'embudo-')), 'Embudo.js');
  writeFileSync(tmp, codigoGs);
  execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
} catch (e) {
  errores.push(`${gs}: error de sintaxis\n${String(e.stderr || e.message).trim()}`);
}
const personasGs = new Set([...codigoGs.slice(0, codigoGs.indexOf('const PERSONA ')).matchAll(/^  (\w+): \{/gm)].map((m) => m[1]));

// ---------- Cada web con embudo ----------

for (const { id, dir } of webs) {
  const ruta = join(dir, 'src', 'contenido.json');
  if (!id || !existsSync(ruta)) continue;
  const contenido = JSON.parse(readFileSync(ruta, 'utf8'));
  for (const [clave, foto] of Object.entries(contenido.fotos ?? {})) {
    if (typeof foto === 'string' && foto.startsWith('/') && !existsSync(join(dir, 'public', foto))) {
      avisos.push(`${id}: falta la foto ${foto} (fotos.${clave}) en ${dir}/public`);
    }
  }
  if (!personasGs.has(id)) avisos.push(`${id}: no está en PERSONAS de ${gs} (sus leads no se guardarían en la hoja)`);
}

for (const a of avisos) console.log(`Aviso: ${a}`);
if (errores.length) {
  for (const e of errores) console.error(`Error: ${e}`);
  console.error(`\n${errores.length} problema(s). Normas: estrategia/normas-comunicacion.md`);
  process.exit(1);
}
console.log(`Todo bien (${webs.length} webs revisadas${avisos.length ? `, ${avisos.length} aviso(s)` : ''}).`);
