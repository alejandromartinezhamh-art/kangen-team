import type { Contenido } from '../puente';

// Cliente de /api/editor (compartido/api/editor.ts), la función que lee y publica contenido.json.

export class ErrorApi extends Error {
  constructor(
    public codigo: string,
    mensaje: string,
    public detalles: string[] = [],
  ) {
    super(mensaje);
  }
}

export interface Version {
  sha: string;
  fecha: string;
  autor: string;
  mensaje: string;
}

const MENSAJES: Record<string, string> = {
  'no-configurado': 'El editor aún no está activado en esta web: faltan EDITOR_CLAVE y EDITOR_GITHUB_TOKEN en Vercel.',
  clave: 'Contraseña incorrecta.',
  conflicto: 'Alguien ha publicado otra versión mientras editabas.',
  'no-valido': 'Hay algo que no se puede guardar así.',
  github: 'GitHub no ha aceptado el cambio. Inténtalo de nuevo en un momento.',
  'sin-contenido': 'Esta web todavía no se puede editar (le falta src/contenido.json).',
};

async function llamar<T>(accion: string, clave: string, datos: Record<string, unknown> = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch('/api/editor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion, clave, ...datos }),
    });
  } catch {
    throw new ErrorApi('red', 'Sin conexión. Revisa internet e inténtalo de nuevo.');
  }
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok || !cuerpo || cuerpo.ok === false) {
    const codigo = cuerpo?.error ?? (res.status === 404 ? 'sin-api' : 'desconocido');
    const mensaje =
      MENSAJES[codigo] ??
      (codigo === 'sin-api' ? 'El editor solo publica en la web subida a Vercel.' : 'Algo ha fallado. Inténtalo de nuevo.');
    throw new ErrorApi(codigo, mensaje, cuerpo?.detalles ?? []);
  }
  return cuerpo as T;
}

export const api = {
  leer: (clave: string) => llamar<{ contenido: Contenido; sha: string }>('leer', clave),
  versiones: (clave: string) => llamar<{ versiones: Version[] }>('versiones', clave),
  version: (clave: string, sha: string) => llamar<{ contenido: Contenido }>('version', clave, { sha }),
  foto: (clave: string, nombre: string, datos: string) =>
    llamar<{ ruta: string; sha: string }>('foto', clave, { nombre, datos }),
  publicar: (
    clave: string,
    datos: { contenido: Contenido; base: string; fotos: { ruta: string; sha: string }[]; forzar?: boolean },
  ) => llamar<{ contenido: Contenido; sha: string; commit: string; sinCambios?: boolean }>('publicar', clave, datos),
};
