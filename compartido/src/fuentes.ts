// Tipografías que se pueden elegir en el editor (todas de Google Fonts). Solo estas: así cualquier
// combinación se ve bien y el enlace a Google Fonts nunca falla por pedir un grosor que no existe.
// Para añadir una: nombre exacto de Google Fonts, si es con o sin remate y los grosores que tiene.

export interface Fuente {
  nombre: string;
  tipo: 'sans' | 'serif';
  pesos: number[];
}

const todos = [300, 400, 500, 600, 700];
const desde400 = [400, 500, 600, 700];

export const FUENTES: Fuente[] = [
  { nombre: 'Inter', tipo: 'sans', pesos: todos },
  { nombre: 'Inter Tight', tipo: 'sans', pesos: todos },
  { nombre: 'DM Sans', tipo: 'sans', pesos: todos },
  { nombre: 'Plus Jakarta Sans', tipo: 'sans', pesos: todos },
  { nombre: 'Manrope', tipo: 'sans', pesos: todos },
  { nombre: 'Figtree', tipo: 'sans', pesos: todos },
  { nombre: 'Outfit', tipo: 'sans', pesos: todos },
  { nombre: 'Work Sans', tipo: 'sans', pesos: todos },
  { nombre: 'Montserrat', tipo: 'sans', pesos: todos },
  { nombre: 'Raleway', tipo: 'sans', pesos: todos },
  { nombre: 'Poppins', tipo: 'sans', pesos: todos },
  { nombre: 'Jost', tipo: 'sans', pesos: todos },
  { nombre: 'Cormorant Garamond', tipo: 'serif', pesos: todos },
  { nombre: 'Fraunces', tipo: 'serif', pesos: todos },
  { nombre: 'Newsreader', tipo: 'serif', pesos: todos },
  { nombre: 'Source Serif 4', tipo: 'serif', pesos: todos },
  { nombre: 'Lora', tipo: 'serif', pesos: desde400 },
  { nombre: 'Playfair Display', tipo: 'serif', pesos: desde400 },
  { nombre: 'EB Garamond', tipo: 'serif', pesos: desde400 },
  { nombre: 'DM Serif Display', tipo: 'serif', pesos: [400] },
];

export const fuentePorNombre = (nombre: unknown) => FUENTES.find((f) => f.nombre === nombre);

/** Valor de las variables --fuente-titulo y --fuente-cuerpo, con la fuente de respaldo de su tipo. */
export function pilaFuente(nombre: string) {
  const f = fuentePorNombre(nombre);
  if (!f) return '';
  return f.tipo === 'serif'
    ? `'${f.nombre}', Georgia, 'Times New Roman', serif`
    : `'${f.nombre}', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`;
}

/** Enlace de Google Fonts con las fuentes elegidas (vacío si no hay ninguna válida). */
export function urlFuentes(fuentes: Record<string, unknown> | undefined) {
  const elegidas = [...new Set(Object.values(fuentes ?? {}))].map(fuentePorNombre).filter((f): f is Fuente => !!f);
  if (!elegidas.length) return '';
  const familias = elegidas.map((f) => `family=${f.nombre.replace(/ /g, '+')}:wght@${f.pesos.join(';')}`);
  return `https://fonts.googleapis.com/css2?${familias.join('&')}&display=swap`;
}

/** Variables CSS de colores (--color-<nombre>) y fuentes que salen de contenido.json. Solo valores válidos. */
export function variablesCss(contenido: { colores?: unknown; fuentes?: unknown }) {
  const vars: Record<string, string> = {};
  const colores = (contenido.colores ?? {}) as Record<string, unknown>;
  for (const [nombre, valor] of Object.entries(colores)) {
    if (/^[\w-]+$/.test(nombre) && typeof valor === 'string' && /^#[0-9a-f]{3,8}$/i.test(valor)) {
      vars[`--color-${nombre}`] = valor;
    }
  }
  const fuentes = (contenido.fuentes ?? {}) as Record<string, unknown>;
  for (const [uso, nombre] of Object.entries(fuentes)) {
    const pila = typeof nombre === 'string' && /^[\w-]+$/.test(uso) ? pilaFuente(nombre) : '';
    if (pila) vars[`--fuente-${uso}`] = pila;
  }
  return vars;
}
