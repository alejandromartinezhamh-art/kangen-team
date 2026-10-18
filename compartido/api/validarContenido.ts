import { fuentePorNombre } from '../src/fuentes';

// Comprueba que un contenido.json enviado por el editor solo cambia lo que se puede cambiar.
// Regla general: misma forma que el que hay ahora en el repositorio (mismas claves, mismos tipos, mismo
// número de pasos…); solo cambian los textos, y las listas de textos pueden crecer o encoger.
// Así la web siempre compila y la hoja de Google sigue recibiendo las mismas columnas.

const PROTEGIDAS = new Set(['tipo', 'campo', 'columna']);
const MAX_TEXTO = 3000;
const MAX_LISTA = 40;

const esObjeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const esColor = (v: unknown) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

/** Reglas de los textos con formato fijo (colores, fuentes, fotos y enlaces). Devuelve el error o ''. */
function reglaEspecial(ruta: (string | number)[], nuevo: string, actual: string): string {
  const [grupo, clave] = ruta;
  if (esColor(actual) && !esColor(nuevo)) return 'tiene que ser un color (#rrggbb)';
  if (grupo === 'fuentes' && !fuentePorNombre(nuevo)) return 'tipografía no disponible';
  if (grupo === 'fotos' && nuevo !== actual && !/^\/[\w-]+(\/[\w-]+)*\.(jpe?g|png|webp)$/i.test(nuevo)) {
    return 'foto no válida';
  }
  if (grupo === 'enlaces') {
    if (clave === 'whatsapp') return /^(\d{8,15})?$/.test(nuevo) ? '' : 'solo números, con prefijo (p. ej. 34600000000)';
    return nuevo === '' || /^https:\/\/[^\s<>"]+$/.test(nuevo) ? '' : 'tiene que ser un enlace que empiece por https://';
  }
  return '';
}

export function validarContenido(nuevo: unknown, actual: unknown): string[] {
  const errores: string[] = [];
  const nombre = (ruta: (string | number)[]) => ruta.join(' › ') || 'contenido';

  const comparar = (n: unknown, a: unknown, ruta: (string | number)[]) => {
    if (errores.length >= 20) return;
    const clave = ruta[ruta.length - 1];
    if (typeof a === 'string') {
      if (typeof n !== 'string') return void errores.push(`${nombre(ruta)}: tiene que ser un texto`);
      if (typeof clave === 'string' && PROTEGIDAS.has(clave) && n !== a) {
        return void errores.push(`${nombre(ruta)}: no se puede cambiar desde el editor`);
      }
      if (n.length > MAX_TEXTO) return void errores.push(`${nombre(ruta)}: texto demasiado largo`);
      const especial = reglaEspecial(ruta, n, a);
      if (especial) errores.push(`${nombre(ruta)}: ${especial}`);
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(n)) return void errores.push(`${nombre(ruta)}: tiene que ser una lista`);
      if (a.length > 0 && a.every((x) => typeof x === 'string')) {
        if (n.length < 1 || n.length > MAX_LISTA) {
          return void errores.push(`${nombre(ruta)}: tiene que tener entre 1 y ${MAX_LISTA} textos`);
        }
        n.forEach((x, i) => comparar(x, a[Math.min(i, a.length - 1)], [...ruta, i]));
        return;
      }
      if (n.length !== a.length) return void errores.push(`${nombre(ruta)}: no se pueden añadir ni quitar elementos`);
      n.forEach((x, i) => comparar(x, a[i], [...ruta, i]));
      return;
    }
    if (esObjeto(a)) {
      if (!esObjeto(n)) return void errores.push(`${nombre(ruta)}: formato no válido`);
      const claves = (o: Record<string, unknown>) => Object.keys(o).filter((k) => !k.startsWith('_'));
      const distintas = [...claves(a).filter((k) => !(k in n)), ...claves(n).filter((k) => !(k in a))];
      if (distintas.length) return void errores.push(`${nombre(ruta)}: no se pueden añadir ni quitar apartados (${distintas.join(', ')})`);
      for (const k of claves(a)) comparar(n[k], a[k], [...ruta, k]);
      return;
    }
    // Números, sí/no y vacíos: no se cambian desde el editor.
    if (n !== a) errores.push(`${nombre(ruta)}: no se puede cambiar desde el editor`);
  };

  comparar(nuevo, actual, []);
  return errores;
}
