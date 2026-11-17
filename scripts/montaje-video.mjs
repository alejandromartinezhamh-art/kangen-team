// Cuentas comunes del montaje de vídeo. Las usan scripts/video.mjs (el vídeo final) y el estudio
// (contenido/estudio/estudio.html, que las recibe al montarse con `npm run estudio -- pagina`): así lo que se ve y se
// oye en el estudio es lo que sale. Sin import ni nada de Node, porque el estudio las copia tal cual en la página.
// Guía: contenido/videos/README.md.

// ---------- Letras
// Tamaño de los subtítulos y altura a la que van, en un vídeo de 1080 × 1920. Nada de texto en los 250 px de arriba
// ni en los 420 de abajo: ahí van los botones de cada red.
export const TAMANOS_SUBTITULOS = { s: 64, m: 80, l: 96 };
export const ALTURAS_SUBTITULOS = { abajo: 1270, centro: 1040 };

const hexDe = (c) => (typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c.toLowerCase() : null);
// Un color de la persona solo sirve para resaltar palabras sobre el vídeo si es claro (una paleta oscura no se lee).
const claro = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0) > 0.45;
const primeroClaro = (...cs) => cs.map(hexDe).find((c) => c && claro(c)) ?? null;

// El estilo de las letras con lo que falte puesto: letra (todos los textos), resalte (la palabra que se está
// diciendo), enfasis (la palabra entre *asteriscos*), fondo (caja de color detrás de los textos; '' sin caja),
// tamano y posicion (solo los subtítulos) y subtitulos (false los quita). base trae los colores de la persona.
export function estiloVideo(estilo = {}, base = {}) {
  estilo ??= {};
  return {
    letra: hexDe(estilo.letra) ?? '#ffffff',
    resalte: hexDe(estilo.resalte) ?? primeroClaro(base.resalte, base.enfasis) ?? '#d0c7ff',
    enfasis: hexDe(estilo.enfasis) ?? primeroClaro(base.enfasis) ?? '#ffa174',
    fondo: hexDe(estilo.fondo) ?? '',
    tamano: TAMANOS_SUBTITULOS[estilo.tamano] ? estilo.tamano : 'm',
    posicion: ALTURAS_SUBTITULOS[estilo.posicion] ? estilo.posicion : 'abajo',
    subtitulos: estilo.subtitulos !== false,
  };
}

// Los estilos de los textos del vídeo (gancho, rótulos y subtítulos). prefijo limita las reglas a una parte de la
// página (el estudio usa '.pantalla '). Cada texto lleva dentro un <span class="linea"> para la caja de color.
export function cssTextosVideo(e, prefijo = '') {
  const p = prefijo;
  const caja = e.fondo
    ? `background: ${e.fondo}; padding: .04em .3em; border-radius: .22em; -webkit-box-decoration-break: clone; box-decoration-break: clone;`
    : '';
  return `
  ${p}.texto { position: absolute; left: 90px; right: 90px; z-index: 3; text-align: center; font-weight: 800; letter-spacing: -0.02em; color: ${e.letra};
    text-shadow: ${e.fondo ? 'none' : '0 4px 28px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)'}; }
  ${p}.texto em { font-family: 'DM Serif Display', serif; font-style: italic; font-weight: 400; letter-spacing: 0; color: ${e.enfasis}; }
  ${p}.texto .linea { ${caja} }
  ${p}.gancho { top: 290px; font-size: 88px; line-height: ${e.fondo ? 1.24 : 1.04}; }
  ${p}.rotulo { top: 660px; font-size: 104px; line-height: ${e.fondo ? 1.22 : 1.04}; }
  ${p}.cue { top: ${ALTURAS_SUBTITULOS[e.posicion]}px; font-size: ${TAMANOS_SUBTITULOS[e.tamano]}px; line-height: ${e.fondo ? 1.32 : 1.1}; }
  ${p}.cue .linea span { display: inline-block; margin: 0 .1em; }`;
}

// ---------- Ritmo
// La velocidad acelera o frena la voz sin cambiarle el tono (y, sin voz, lo que dura cada plano sin tiempo fijo).
export const VELOCIDAD = { min: 0.8, max: 1.5 };
export const velocidadDe = (v) => Math.min(VELOCIDAD.max, Math.max(VELOCIDAD.min, Number(v) || 1));

// ---------- Recortes de la voz
// Una pausa de más de `larga` segundos se deja en 2 × `margen`. Una frase quitada deja `corte` a cada lado.
export const PAUSA = { larga: 0.6, margen: 0.15, corte: 0.12, final: 0.25 };
const r3 = (n) => Math.round(n * 1000) / 1000;

// Los trozos de la voz original que se quedan, en segundos: [[desde, hasta], …].
// voz: { duracion, desde, hasta, pausas, palabras: [{ text, start, end, fuera }] } (palabras con fuera: true se quitan).
// silencios: [[a, b], …] del análisis del sonido; solo se usan para las pausas cuando aún no hay palabras.
export function tramosDeVoz(voz = {}, silencios = []) {
  const dur = Number(voz.duracion) || 0;
  const ini = Math.max(0, Math.min(Number(voz.desde) || 0, dur));
  const hasta = voz.hasta == null || voz.hasta === '' ? dur : Number(voz.hasta);
  const fin = Math.max(ini, Math.min(Number.isFinite(hasta) ? hasta : dur, dur));
  const palabras = (voz.palabras || []).filter((p) => p.end > ini && p.start < fin).sort((a, b) => a.start - b.start);
  const quitar = [];
  // Frases quitadas: desde poco después de la palabra anterior que se queda hasta poco antes de la siguiente.
  for (let i = 0; i < palabras.length; i++) {
    if (!palabras[i].fuera) continue;
    let j = i;
    while (j + 1 < palabras.length && palabras[j + 1].fuera) j++;
    const antes = palabras[i - 1], despues = palabras[j + 1];
    quitar.push([
      antes ? Math.min(antes.end + PAUSA.corte, palabras[i].start) : ini,
      despues ? Math.max(despues.start - PAUSA.corte, palabras[j].end) : fin,
    ]);
    i = j;
  }
  // Pausas largas: entre palabras si ya están (lo exacto) y, si no, los silencios del sonido.
  if (voz.pausas) {
    const quedan = palabras.filter((p) => !p.fuera);
    const huecos = quedan.length
      ? [[ini, quedan[0].start], ...quedan.slice(1).map((p, k) => [quedan[k].end, p.start]), [quedan.at(-1).end, fin]]
      : silencios.map(([a, b]) => [Math.max(a, ini), Math.min(b, fin)]);
    for (const [a, b] of huecos) {
      if (b - a <= 0) continue;
      const alPrincipio = a <= ini + 0.01, alFinal = b >= fin - 0.01;
      if (alPrincipio && alFinal) continue;
      if (alPrincipio && b - a > PAUSA.margen) quitar.push([ini, b - PAUSA.margen]);
      else if (alFinal && b - a > PAUSA.final) quitar.push([a + PAUSA.final, fin]);
      else if (!alPrincipio && !alFinal && b - a > PAUSA.larga) quitar.push([a + PAUSA.margen, b - PAUSA.margen]);
    }
  }
  quitar.sort((x, y) => x[0] - y[0]);
  const tramos = [];
  let cursor = ini;
  for (const [a, b] of quitar) {
    if (b <= cursor) continue;
    if (a > cursor) tramos.push([cursor, Math.min(a, fin)]);
    cursor = Math.max(cursor, b);
  }
  if (cursor < fin) tramos.push([cursor, fin]);
  return tramos.filter(([a, b]) => b - a >= 0.05).map(([a, b]) => [r3(a), r3(b)]);
}

// De la voz original al vídeo y al revés, con los trozos que se quedan y la velocidad.
export function mapaVoz(tramos, velocidad = 1) {
  const v = velocidadDe(velocidad);
  const acum = [];
  let s = 0;
  for (const [a, b] of tramos) { acum.push(s); s += b - a; }
  return {
    tramos, velocidad: v, total: s / v,
    // Segundo del vídeo en el que suena el segundo t de la voz original (lo quitado salta al trozo siguiente).
    aVideo(t) {
      for (let i = 0; i < tramos.length; i++) {
        const [a, b] = tramos[i];
        if (t < a) return acum[i] / v;
        if (t <= b) return (acum[i] + t - a) / v;
      }
      return s / v;
    },
    seQueda: (t) => tramos.some(([a, b]) => t >= a - 1e-6 && t <= b + 1e-6),
    // Segundo de la voz original que suena en el segundo u del vídeo (null si ya ha terminado).
    aVoz(u) {
      const x = u * v;
      for (let i = 0; i < tramos.length; i++) if (x < acum[i] + tramos[i][1] - tramos[i][0]) return tramos[i][0] + x - acum[i];
      return null;
    },
  };
}

// ---------- Subtítulos
// Las palabras en frases cortas (como mucho 4 palabras o 22 letras; se corta en los signos y en las pausas de más de
// medio segundo). Devuelve las posiciones de las palabras de cada frase: [[0, 1, 2], [3, 4], …].
export function frasesDeVoz(palabras) {
  const grupos = [];
  let actual = [];
  palabras.forEach((p, i) => {
    const anterior = palabras[i - 1];
    const letras = actual.reduce((n, k) => n + String(palabras[k].text).length + 1, 0);
    if (actual.length && anterior && (actual.length >= 4 || letras + String(p.text).length > 22 || /[.,;:?!…]$/.test(anterior.text) || p.start - anterior.end > 0.5)) {
      grupos.push(actual);
      actual = [];
    }
    actual.push(i);
  });
  if (actual.length) grupos.push(actual);
  return grupos;
}

// Los subtítulos con los tiempos del vídeo: [{ inicio, fin, palabras: [{ text, a, b }] }].
export function subtitulosDeVoz(palabras, mapa) {
  const cues = [];
  for (const grupo of frasesDeVoz(palabras)) {
    const quedan = grupo.map((k) => palabras[k]).filter((p) => !p.fuera && mapa.seQueda((p.start + p.end) / 2));
    if (quedan.length) cues.push({ palabras: quedan.map((p) => ({ text: p.text, a: r3(mapa.aVideo(p.start)), b: r3(mapa.aVideo(p.end)) })) });
  }
  cues.forEach((c, i) => {
    c.inicio = c.palabras[0].a;
    const siguiente = cues[i + 1]?.palabras[0].a ?? Infinity;
    c.fin = r3(Math.max(c.inicio + 0.3, Math.min(siguiente, c.palabras.at(-1).b + 0.35)));
  });
  return cues;
}
