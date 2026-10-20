import type { Contenido } from '../puente';

// Recorrer y cambiar contenido.json por rutas (["webinar", "titulo"], ["cuestionario", "pasos", 2, "opciones", 0]…).

export type Ruta = (string | number)[];

/** Claves que el editor nunca enseña ni cambia: deciden cómo funciona la página o dónde se guarda en la hoja. */
export const PROTEGIDAS = new Set(['tipo', 'campo', 'columna']);

const esObjeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export const esColor = (v: unknown) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

export function leer(objeto: unknown, ruta: Ruta): unknown {
  return ruta.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string | number, unknown>)[k]), objeto);
}

/** Copia del contenido con `valor` en `ruta`. */
export function conValor<T extends Contenido>(contenido: T, ruta: Ruta, valor: unknown): T {
  const copia = structuredClone(contenido);
  const padre = leer(copia, ruta.slice(0, -1)) as Record<string | number, unknown>;
  padre[ruta[ruta.length - 1]] = valor;
  return copia;
}

export interface Texto {
  ruta: Ruta;
  valor: string;
}

/** Todos los textos de unas secciones, en el orden en que están en contenido.json. */
export function textosDe(contenido: Contenido, secciones: string[]): Texto[] {
  const lista: Texto[] = [];
  const recorrer = (v: unknown, ruta: Ruta) => {
    if (typeof v === 'string') lista.push({ ruta, valor: v });
    else if (Array.isArray(v)) v.forEach((x, i) => recorrer(x, [...ruta, i]));
    else if (esObjeto(v)) {
      for (const [k, x] of Object.entries(v)) if (!k.startsWith('_') && !PROTEGIDAS.has(k)) recorrer(x, [...ruta, k]);
    }
  };
  for (const s of secciones) recorrer(contenido[s], [s]);
  return lista;
}

export const NOMBRES_SECCION: Record<string, string> = {
  general: 'General',
  instagram: 'Página de Instagram',
  cuestionario: 'Cuestionario',
  webinar: 'Página del webinar',
  email: 'Emails',
  textos: 'Web',
};

const NOMBRES: Record<string, string> = {
  marca: 'Nombre de arriba',
  barra: 'Texto de arriba a la derecha',
  etiqueta: 'Etiqueta pequeña',
  titulo: 'Título',
  texto: 'Texto',
  boton: 'Botón',
  privacidad: 'Enlace a privacidad',
  fotoTexto: 'Texto sobre la foto',
  parrafos: 'Párrafo',
  lista: 'Punto',
  cierre: 'Cierre',
  antes: 'Texto antes',
  despues: 'Texto después',
  opciones: 'Respuesta',
  ayuda: 'Ayuda',
  placeholder: 'Ejemplo dentro de la casilla',
  placeholderRespuesta: 'Ejemplo dentro de la casilla',
  atras: 'Botón atrás',
  siguiente: 'Botón siguiente',
  enviando: 'Mientras se envía',
  error: 'Si falla el envío',
  gracias: 'Pantalla final',
  whatsapp: 'Botón de WhatsApp',
  mensajeWhatsapp: 'Mensaje que se escribe solo en WhatsApp',
  prontoEtiqueta: 'Sin vídeo: etiqueta',
  prontoTexto: 'Sin vídeo: texto',
  visto: 'Progreso ("Visto 40 %")',
  siguienteEtiqueta: 'Siguiente paso: etiqueta',
  siguienteTitulo: 'Siguiente paso: título',
  textoAntes: 'Antes de ver el vídeo',
  textoWhatsapp: 'Después de verlo',
  textoSinWhatsapp: 'Después de verlo (sin WhatsApp)',
  bloqueado: 'Botón bloqueado',
  webinar: 'Email del webinar',
  recordatorio: 'Recordatorio (24 h después)',
  asunto: 'Asunto',
  saludo: 'Saludo',
  despedida: 'Despedida',
  firma: 'Firma',
  pie: 'Letra pequeña del final',
  colores: 'Color',
  textoBoton: 'texto del botón',
  suave: 'texto suave',
};

const humano = (k: string) => {
  const t = k.replace(/([a-z])([A-Z0-9])/g, '$1 $2').toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Nombre legible de un texto: ["cuestionario", "pasos", 2, "opciones", 0] → "Paso 3 · Respuesta 1". */
export function etiqueta(ruta: Ruta): string {
  const partes: string[] = [];
  ruta.slice(1).forEach((k, i, resto) => {
    if (typeof k === 'number') {
      if (resto[i - 1] === 'pasos') partes[partes.length - 1] = `Paso ${k + 1}`;
      else partes[partes.length - 1] = `${partes[partes.length - 1]} ${k + 1}`;
    } else if (k === 'pasos') partes.push('Paso');
    else partes.push(NOMBRES[k] ?? humano(k));
  });
  return partes.join(' · ') || NOMBRES_SECCION[ruta[0] as string] || String(ruta[0]);
}

/** Rutas de los textos que cambian entre dos versiones (para el resumen antes de publicar). */
export function diferencias(a: unknown, b: unknown, ruta: Ruta = []): Ruta[] {
  if (ruta.length === 1 && typeof ruta[0] === 'string' && ruta[0].startsWith('_')) return [];
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length && a.every((x) => typeof x === 'string')) return [ruta];
    return a.flatMap((x, i) => diferencias(x, b[i], [...ruta, i]));
  }
  if (esObjeto(a) && esObjeto(b)) {
    const claves = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    return claves.flatMap((k) => diferencias(a[k], b[k], [...ruta, k]));
  }
  return a === b ? [] : [ruta];
}

/** Para comparar versiones sin las etiquetas del editor. */
export const huella = (c: unknown) => JSON.stringify(c, (k, v) => (k === '_etiquetas' ? undefined : v));
