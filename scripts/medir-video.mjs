// Mide un vídeo de referencia con números: npm run medir -- <archivo.mp4> [carpeta-de-salida]
// Cuenta cortes, ritmo, lo que pasa en los primeros 2 segundos, la luz y el volumen. No copia el vídeo ni su contenido:
// solo guarda medidas-<archivo>.json en la carpeta de salida (fuera del repositorio, que es público).
// Los subtítulos, la composición y el gancho se miran a mano y se apuntan en el mismo JSON (campo «a_mano»).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const archivo = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (!archivo || !existsSync(archivo)) {
  console.error('Uso: npm run medir -- <archivo.mp4> [carpeta-de-salida]');
  process.exit(1);
}
if (archivo.startsWith(raiz + path.sep)) {
  console.error('El vídeo de referencia tiene que estar fuera del repositorio: es público.');
  process.exit(1);
}
const salida = process.argv[3] ? path.resolve(process.argv[3]) : path.dirname(archivo);
mkdirSync(salida, { recursive: true });

const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;
const ffprobe = (args) => execFileSync('ffprobe', ['-v', 'error', ...args], { encoding: 'utf8' }).trim();
const ffmpegSalida = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8' });

// ---------- Formato
const duracion = Number(ffprobe(['-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', archivo]));
const [ancho, alto, velocidad] = ffprobe(['-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', archivo]).split(',');
const fps = (() => {
  const [n, d] = velocidad.split('/').map(Number);
  return r1(n / (d || 1));
})();

// ---------- Cortes: cambios de plano (cuando la imagen cambia de forma brusca)
const UMBRAL = 0.3;
const cortesInfo = ffmpegSalida(['-i', archivo, '-an', '-vf', `select='gt(scene,${UMBRAL})',showinfo`, '-f', 'null', '-']).stderr ?? '';
const instantesCorte = [...cortesInfo.matchAll(/pts_time:([\d.]+)/g)].map((m) => Number(m[1])).filter((t) => t > 0.05);
const cortes = instantesCorte.length;
const plano = duracion / (cortes + 1);
const primero = instantesCorte[0] ?? duracion;
const enDosSegundos = instantesCorte.filter((t) => t < 2).length;

// ---------- Luz media (un fotograma cada medio segundo)
const luz = ffmpegSalida(['-i', archivo, '-an', '-vf', 'fps=2,scale=320:-2,signalstats,metadata=print:file=-', '-f', 'null', '-']).stdout ?? '';
const luces = [...luz.matchAll(/YAVG=([\d.]+)/g)].map((m) => Number(m[1]));
const luzMedia = luces.length ? Math.round(luces.reduce((s, x) => s + x, 0) / luces.length) : null;

// ---------- Volumen integrado (LUFS): las redes suelen rondar −14
const sonido = ffmpegSalida(['-i', archivo, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr ?? '';
const lufsMatch = [...sonido.matchAll(/I:\s+(-?[\d.]+) LUFS/g)];
const lufs = lufsMatch.length ? Number(lufsMatch.at(-1)[1]) : null;

const medidas = {
  archivo: path.basename(archivo),
  medido: new Date().toISOString().slice(0, 10),
  formato: { duracion_s: r1(duracion), resolucion: `${ancho}x${alto}`, fps },
  ritmo: {
    cortes,
    cortes_por_10_s: r1((cortes / duracion) * 10),
    plano_medio_s: r1(plano),
    primer_corte_s: r1(primero),
    cortes_en_los_primeros_2_s: enDosSegundos,
    umbral_deteccion: UMBRAL,
  },
  luz_media: luzMedia,
  volumen_lufs: lufs === null ? null : r1(lufs),
  a_mano: {
    primeros_2_s: '',
    subtitulos_palabras_por_frase: '',
    subtitulos_tamano_y_posicion: '',
    composicion: '',
    textos_en_pantalla: '',
  },
};
const destino = path.join(salida, `medidas-${path.parse(archivo).name}.json`);
writeFileSync(destino, JSON.stringify(medidas, null, 2) + '\n');

console.log(`Formato: ${medidas.formato.resolucion}, ${medidas.formato.duracion_s} s, ${fps} fps`);
console.log(`Cortes: ${cortes} (${medidas.ritmo.cortes_por_10_s} por cada 10 s). Plano medio: ${medidas.ritmo.plano_medio_s} s`);
console.log(`Primer corte: ${medidas.ritmo.primer_corte_s} s. Cortes en los primeros 2 s: ${enDosSegundos}`);
console.log(`Luz media: ${luzMedia ?? 'sin medir'}. Volumen: ${medidas.volumen_lufs ?? 'sin audio'} LUFS`);
console.log(`Medidas en ${destino}. Lo de «a_mano» (subtítulos, composición, textos) lo mira una persona y lo apunta ahí.`);
