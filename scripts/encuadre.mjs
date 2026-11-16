// Encuadre de las caras en las fotos de un carrusel (contenido/carruseles/README.md, «Fotos y caras»).
// Lo usan scripts/carrusel.mjs y scripts/carrusel-animado.mjs con una página de Playwright ya cargada.
//
// 1. Detecta las caras de cada foto (face-api, en el propio navegador).
// 2. Mueve la foto dentro de su hueco (object-position) para que las caras queden enteras y lejos de los textos,
//    lo más cerca posible de donde la puso quien la maquetó. Con data-encuadre="fijo" no se mueve, solo se comprueba.
// 3. Devuelve los problemas: una cara cortada o con texto encima no se entrega.
//
// El navegador tiene que abrirse con --allow-file-access-from-files: sin eso no puede leer las fotos de la carpeta.

export const ARGUMENTOS_NAVEGADOR = ['--allow-file-access-from-files'];

const FACE_API = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/dist/face-api.js';
const MODELOS = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/';
const WASM = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.22.0/dist/';

/**
 * @param {import('playwright').Page} pagina
 * @param {{ mover?: boolean }} opciones mover = false solo comprueba
 * @returns {Promise<Array<{ imagen: number, foto: string, caras: number, posicion: string, problemas: string[],
 *   cajas: Array<{ l: number, t: number, r: number, b: number }> }>>} cajas: las caras enteras, en px de la imagen
 */
export async function encuadrar(pagina, { mover = true } = {}) {
  if (!(await pagina.evaluate(() => Boolean(window.faceapi)))) await pagina.addScriptTag({ url: FACE_API });
  return pagina.evaluate(enLaPagina, { modelos: MODELOS, wasm: WASM, mover });
}

/**
 * Comprueba en la imagen ya generada que cada cara se sigue viendo (un velo, una sombra o un adorno pueden taparla).
 * Devuelve cuántas de las caras esperadas no se reconocen: es un aviso, no un error.
 * @param {import('playwright').Page} pagina con face-api ya cargado por encuadrar()
 * @param {string} png ruta absoluta de la imagen
 * @param {Array<{ l: number, t: number, r: number, b: number }>} cajas
 */
export async function carasQueNoSeVen(pagina, png, cajas) {
  return pagina.evaluate(async ({ url, cajas }) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const halladas = await window.faceapi.detectAllFaces(img, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }));
    const centros = halladas.map(({ box }) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 }));
    return cajas.filter((c) => !centros.some((p) => p.x > c.l && p.x < c.r && p.y > c.t && p.y < c.b)).length;
  }, { url: 'file://' + png, cajas });
}

/** Todo lo de aquí se ejecuta dentro del navegador. */
async function enLaPagina({ modelos, wasm, mover }) {
  const fa = window.faceapi;
  if (!fa.nets.ssdMobilenetv1.isLoaded) {
    fa.tf.setWasmPaths(wasm);
    await fa.tf.setBackend('wasm');
    await fa.tf.ready();
    await fa.nets.ssdMobilenetv1.loadFromUri(modelos);
  }

  const area = (r) => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);
  const corte = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
  const caja = (d) => ({ l: d.left, t: d.top, r: d.right, b: d.bottom });

  // Caras de una foto, en píxeles de la foto original, ampliadas para incluir frente, pelo y barbilla.
  // Se guardan por foto: en una animación se mide muchas veces la misma.
  window.__carasPorFoto ??= new Map();
  async function caras(img) {
    if (!window.__carasPorFoto.has(img.currentSrc)) window.__carasPorFoto.set(img.currentSrc, await detectar(img));
    return window.__carasPorFoto.get(img.currentSrc);
  }
  async function detectar(img) {
    const k = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(img.naturalWidth * k);
    lienzo.height = Math.round(img.naturalHeight * k);
    lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
    const halladas = await fa.detectAllFaces(lienzo, new fa.SsdMobilenetv1Options({ minConfidence: 0.45 }));
    const todas = halladas.map(({ box }) => ({
      l: (box.x - box.width * 0.15) / k,
      t: (box.y - box.height * 0.4) / k,
      r: (box.x + box.width * 1.15) / k,
      b: (box.y + box.height * 1.12) / k,
    }));
    // Solo cuentan las caras protagonistas: las de fondo, mucho más pequeñas que la mayor, no mandan.
    const mayor = Math.max(0, ...todas.map((c) => c.r - c.l));
    return todas.filter((c) => c.r - c.l >= mayor * 0.4);
  }

  // Lo que se ve de una foto: su hueco recortado por los contenedores que esconden lo que sobresale.
  function huecoVisible(img, diapositiva) {
    const estilo = getComputedStyle(img);
    const r = img.getBoundingClientRect();
    const hueco = {
      l: r.left + parseFloat(estilo.borderLeftWidth) + parseFloat(estilo.paddingLeft),
      t: r.top + parseFloat(estilo.borderTopWidth) + parseFloat(estilo.paddingTop),
      r: r.right - parseFloat(estilo.borderRightWidth) - parseFloat(estilo.paddingRight),
      b: r.bottom - parseFloat(estilo.borderBottomWidth) - parseFloat(estilo.paddingBottom),
    };
    let visible = { ...hueco };
    for (let n = img.parentElement; n; n = n.parentElement) {
      if (getComputedStyle(n).overflow !== 'visible') visible = corte(visible, caja(n.getBoundingClientRect()));
      if (n === diapositiva) break;
    }
    // Foto redonda: solo cuenta el cuadrado de dentro del círculo.
    if (parseFloat(estilo.borderTopLeftRadius) >= (hueco.r - hueco.l) * 0.4) {
      const mx = (visible.r - visible.l) * 0.15, my = (visible.b - visible.t) * 0.15;
      visible = { l: visible.l + mx, t: visible.t + my, r: visible.r - mx, b: visible.b - my };
    }
    return { hueco, visible, girada: estilo.transform !== 'none' };
  }

  // Las letras de la imagen: cada línea de texto y los botones.
  function textos(diapositiva) {
    const cajas = [];
    const recorrido = document.createTreeWalker(diapositiva, NodeFilter.SHOW_TEXT);
    for (let nodo = recorrido.nextNode(); nodo; nodo = recorrido.nextNode()) {
      if (!nodo.textContent.trim()) continue;
      const padre = nodo.parentElement;
      const e = getComputedStyle(padre);
      if (e.visibility === 'hidden' || e.display === 'none' || parseFloat(e.opacity) < 0.1) continue;
      const rango = document.createRange();
      rango.selectNodeContents(nodo);
      for (const r of rango.getClientRects()) if (r.width > 2 && r.height > 2) cajas.push(caja(r));
    }
    for (const b of diapositiva.querySelectorAll('.boton')) cajas.push(caja(b.getBoundingClientRect()));
    return cajas;
  }

  // Posición actual (la que puso quien maquetó) como fracción 0-1 de cada eje.
  function posicionActual(img) {
    const [x = '50%', y = '50%'] = getComputedStyle(img).objectPosition.split(' ');
    const fr = (v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
    return { x: fr(x), y: fr(y) };
  }

  const informe = [];
  // Cada imagen del carrusel; en un Reel o una imagen con movimiento sin <section class="slide">, el lienzo entero.
  const diapositivas = document.querySelectorAll('section.slide').length
    ? [...document.querySelectorAll('section.slide')]
    : [document.querySelector('#root') || document.body];
  for (const [n, diapositiva] of diapositivas.entries()) {
    const letras = textos(diapositiva);
    for (const img of diapositiva.querySelectorAll('img')) {
      await img.decode().catch(() => {});
      if (!img.naturalWidth) continue;
      const lista = await caras(img);
      const fila = { imagen: n + 1, foto: img.getAttribute('src'), caras: lista.length, posicion: '', problemas: [], cajas: [] };
      informe.push(fila);
      if (!lista.length) continue;

      const { hueco, visible, girada } = huecoVisible(img, diapositiva);
      const ancho = hueco.r - hueco.l, alto = hueco.b - hueco.t;
      const ajuste = getComputedStyle(img).objectFit;
      const escala = ajuste === 'cover'
        ? Math.max(ancho / img.naturalWidth, alto / img.naturalHeight)
        : Math.min(ancho / img.naturalWidth, alto / img.naturalHeight);
      const sobraX = ancho - img.naturalWidth * escala, sobraY = alto - img.naturalHeight * escala;
      const actual = posicionActual(img);

      // Dónde caen las caras en la imagen con la foto colocada en (px, py).
      const enImagen = (px, py) => lista.map((c) => ({
        l: hueco.l + sobraX * px + c.l * escala,
        t: hueco.t + sobraY * py + c.t * escala,
        r: hueco.l + sobraX * px + c.r * escala,
        b: hueco.t + sobraY * py + c.b * escala,
      }));
      const medir = (px, py) => {
        let fuera = 0, tapada = 0;
        for (const c of enImagen(px, py)) {
          const total = area(c) || 1;
          fuera = Math.max(fuera, 1 - area(corte(c, visible)) / total);
          const cubierta = letras.reduce((s, l) => s + area(corte(corte(c, visible), l)), 0);
          tapada = Math.max(tapada, Math.min(1, cubierta / total));
        }
        return { fuera, tapada };
      };

      let mejor = { px: actual.x, py: actual.y, ...medir(actual.x, actual.y) };
      const movible = mover && img.dataset.encuadre !== 'fijo' && ajuste === 'cover';
      if (movible) {
        const pasos = (sobra, eje) => (Math.abs(sobra) < 1 ? [eje] : Array.from({ length: 41 }, (_, i) => i / 40));
        let menor = Infinity;
        for (const px of pasos(sobraX, actual.x)) {
          for (const py of pasos(sobraY, actual.y)) {
            const m = medir(px, py);
            const coste = 100 * m.fuera + 40 * m.tapada + Math.hypot(px - actual.x, py - actual.y);
            if (coste < menor) { menor = coste; mejor = { px, py, ...m }; }
          }
        }
        img.style.objectPosition = `${(mejor.px * 100).toFixed(1)}% ${(mejor.py * 100).toFixed(1)}%`;
      }
      fila.posicion = `${(mejor.px * 100).toFixed(0)}% ${(mejor.py * 100).toFixed(0)}%`;
      const origen = diapositiva.getBoundingClientRect();
      fila.cajas = enImagen(mejor.px, mejor.py)
        .map((c) => corte(c, visible))
        .filter((c) => area(c) > 0)
        .map((c) => ({ l: c.l - origen.left, t: c.t - origen.top, r: c.r - origen.left, b: c.b - origen.top }));
      // Las fotos giradas (polaroid) se miden por su caja: se deja algo de margen.
      const tolerancia = girada ? 0.08 : 0.03;
      if (mejor.fuera > tolerancia) fila.problemas.push(`cara cortada (se pierde el ${Math.round(mejor.fuera * 100)} %)`);
      if (mejor.tapada > tolerancia) fila.problemas.push(`texto encima de la cara (${Math.round(mejor.tapada * 100)} %)`);
    }
  }
  return informe;
}

/**
 * Caras de unas fotos sueltas (para los vídeos): abre un navegador, las busca y devuelve, por foto, el ancho y el alto
 * de la imagen y las caras protagonistas ya ampliadas (frente y barbilla), en píxeles de la foto.
 * @param {string[]} rutas rutas absolutas de las fotos
 * @returns {Promise<Array<{ ancho: number, alto: number, caras: Array<{ l: number, t: number, r: number, b: number }> }>>}
 */
export async function carasEnFotos(rutas) {
  const { createRequire } = await import('node:module');
  const { chromium } = createRequire(import.meta.url)('playwright');
  const navegador = await chromium.launch({ args: ARGUMENTOS_NAVEGADOR });
  try {
    const pagina = await navegador.newPage();
    // Una página local cualquiera: desde file:// el navegador puede leer las fotos sin protegerlas.
    await pagina.goto('file://' + import.meta.filename);
    await pagina.addScriptTag({ url: FACE_API });
    return await pagina.evaluate(async ({ rutas, modelos, wasm }) => {
      const fa = window.faceapi;
      fa.tf.setWasmPaths(wasm);
      await fa.tf.setBackend('wasm');
      await fa.tf.ready();
      await fa.nets.ssdMobilenetv1.loadFromUri(modelos);
      const salida = [];
      for (const ruta of rutas) {
        const img = new Image();
        img.src = 'file://' + ruta;
        await img.decode();
        const k = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight));
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(img.naturalWidth * k);
        lienzo.height = Math.round(img.naturalHeight * k);
        lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
        const halladas = await fa.detectAllFaces(lienzo, new fa.SsdMobilenetv1Options({ minConfidence: 0.45 }));
        const todas = halladas.map(({ box }) => ({
          l: (box.x - box.width * 0.15) / k, t: (box.y - box.height * 0.4) / k,
          r: (box.x + box.width * 1.15) / k, b: (box.y + box.height * 1.12) / k,
        }));
        const mayor = Math.max(0, ...todas.map((c) => c.r - c.l));
        salida.push({ ancho: img.naturalWidth, alto: img.naturalHeight, caras: todas.filter((c) => c.r - c.l >= mayor * 0.4) });
      }
      return salida;
    }, { rutas, modelos: MODELOS, wasm: WASM });
  } finally {
    await navegador.close();
  }
}
