import type { Ruta, Texto } from './rutas';

// Qué texto de contenido.json hay debajo de cada clic. No hace falta marcar nada en las páginas:
// se compara lo que se ve con los textos de contenido.json de esa página (sin las marcas *…* y **…**,
// que solo cambian el estilo). Si un texto aparece igual en dos sitios, se cambian los dos.

export const sinMarcas = (t: string) => t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
export const normalizar = (t: string) => t.replace(/\s+/g, ' ').trim();

/** Texto visible → rutas de contenido.json que lo pintan. */
export type Campos = Map<string, Ruta[]>;

export function mapaCampos(textos: Texto[], variables: Record<string, string> = {}): Campos {
  const mapa: Campos = new Map();
  for (const { ruta, valor } of textos) {
    let visible = sinMarcas(valor);
    for (const [k, v] of Object.entries(variables)) visible = visible.replaceAll(`{${k}}`, v);
    visible = normalizar(visible);
    if (!visible || /^#[0-9a-f]{6}$/i.test(visible)) continue;
    if (!mapa.has(visible)) mapa.set(visible, []);
    mapa.get(visible)!.push(ruta);
  }
  return mapa;
}

/** Marca con data-ed los elementos que pintan un texto editable y con data-ed-foto las fotos. */
export function marcar(doc: Document, campos: Campos, fotos: Map<string, string>) {
  if (!doc.body) return;
  doc.querySelectorAll('[data-ed]').forEach((el) => el.removeAttribute('data-ed'));
  // De dentro hacia fuera: se marca el elemento más pequeño que contiene el texto entero.
  const elementos = Array.from(doc.body.querySelectorAll<HTMLElement>('*')).reverse();
  for (const el of elementos) {
    if (el.closest('script, style, svg, noscript')) continue;
    const texto = normalizar(el.textContent ?? '');
    if (!texto || !campos.has(texto)) continue;
    const yaDentro = Array.from(el.querySelectorAll('[data-ed]')).some((d) => d.getAttribute('data-ed') === texto);
    if (!yaDentro) el.setAttribute('data-ed', texto);
  }
  doc.querySelectorAll('img').forEach((img) => {
    const clave = fotos.get(img.getAttribute('src') ?? '');
    if (clave) img.setAttribute('data-ed-foto', clave);
    else img.removeAttribute('data-ed-foto');
  });
}

function textoBajo(doc: Document, x: number, y: number): Node | null {
  const d = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (d.caretPositionFromPoint) return d.caretPositionFromPoint(x, y)?.offsetNode ?? null;
  return d.caretRangeFromPoint?.(x, y)?.startContainer ?? null;
}

/** Texto editable en un punto de la página (coordenadas de la propia página). */
export function textoEn(doc: Document, x: number, y: number, campos: Campos): { texto: string; elemento: Element } | null {
  const nodo = textoBajo(doc, x, y);
  // El navegador da el texto más cercano aunque se toque fuera de él (p. ej. en una foto): solo vale si está debajo.
  const rango = doc.createRange();
  if (nodo) rango.selectNodeContents(nodo);
  const debajo = Array.from(rango.getClientRects()).some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  if (debajo && nodo?.nodeType === Node.TEXT_NODE && nodo.parentElement) {
    const texto = normalizar(nodo.nodeValue ?? '');
    if (campos.has(texto)) return { texto, elemento: nodo.parentElement };
  }
  const marcado = doc.elementFromPoint(x, y)?.closest('[data-ed]');
  const texto = marcado?.getAttribute('data-ed');
  return marcado && texto && campos.has(texto) ? { texto, elemento: marcado } : null;
}

/** Foto editable en un punto (aunque tenga encima un degradado o un texto). */
export function fotoEn(doc: Document, x: number, y: number): HTMLImageElement | null {
  // La página va en un iframe: sus elementos no son instancias de las clases de esta ventana.
  const foto = doc.elementsFromPoint(x, y).find((el) => el.tagName === 'IMG' && el.hasAttribute('data-ed-foto'));
  return (foto as HTMLImageElement | undefined) ?? null;
}

/** Estilos que el editor añade a la página para señalar lo que se puede cambiar. */
export const ESTILOS_PAGINA = `
html.ed-editando [data-ed] { cursor: text; outline-offset: 4px; border-radius: 2px; }
html.ed-editando [data-ed]:hover { outline: 1.5px dashed #ff7a3d; }
html.ed-editando [data-ed-foto] { cursor: pointer; }
html.ed-editando a, html.ed-editando button, html.ed-editando label { cursor: default; }
html.ed-editando input, html.ed-editando textarea { pointer-events: none; }
`;
