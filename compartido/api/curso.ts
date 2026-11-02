import cursoJson from '../curso/curso.json';
import { leccionesObligatorias, type Curso } from '../src/embudo/tiposCurso';
import { consultar, reenviar } from './reenviar';

// /api/curso: el curso privado de cada web (/curso). El lead entra con su email y la contraseña que le envía el
// CRM («Dar acceso al curso»); la hoja de Google (Embudo.gs) comprueba la contraseña y apunta su progreso.
// El curso (compartido/curso/curso.json) solo sale de aquí: no va en el código de la web.
//
// Acciones (POST, JSON):
//   entrar    { email, contrasena, persona } → sesión firmada (60 días), su progreso y el curso
//   curso     { token }                       → el curso (al volver con la sesión guardada)
//   progreso  { token, leccion, hechas }      → apunta en la hoja la lección vista (y si ha terminado)
//   whatsapp  { token }                       → apunta en la hoja que ha pulsado WhatsApp al final
//   vista     { clave }                       → el curso entero para la vista previa del editor (EDITOR_CLAVE)
//
// Variables (las mismas del formulario): LEADS_WEBHOOK_URL y LEADS_WEBHOOK_SECRET. Opcionales: CURSO_SECRETO
// (firma las sesiones; si no está, se usa LEADS_WEBHOOK_SECRET) y EDITOR_CLAVE (vista previa en el editor).
//
// A la hoja no se le manda "persona" a propósito: un script sin actualizar lo trataría como un lead nuevo (y
// enviaría el email del webinar); así falla con "Persona desconocida" y no hace nada. La persona va en "equipo".

export interface EntornoCurso {
  LEADS_WEBHOOK_URL?: string;
  LEADS_WEBHOOK_SECRET?: string;
  CURSO_SECRETO?: string;
  EDITOR_CLAVE?: string;
}

const DIAS_SESION = 60;

/** Sin las ayudas para quien edita el archivo (_ayuda). */
const curso = JSON.parse(JSON.stringify(cursoJson), (k, v) => (k.startsWith('_') ? undefined : v)) as Curso;
const ids = new Set(curso.modulos.flatMap((m) => m.lecciones.map((l) => l.id)));
const obligatorias = leccionesObligatorias(curso).map((l) => l.id);

type Json = Record<string, unknown>;
const responder = (datos: Json, estado = 200) => Response.json(datos, { status: estado });
const esperar = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
const texto = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Comparación que tarda lo mismo acierte o no. */
function igual(a: string, b: string) {
  let distinto = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) distinto |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return distinto === 0;
}

const aBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
const deBase64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function firmar(secreto: string, contenido: string) {
  const clave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return aBase64(new Uint8Array(await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(contenido))));
}

/** Sesión del lead: persona de la web, id de su fila en la hoja, nombre y caducidad. */
interface Sesion {
  p: string;
  id: string;
  n: string;
  e: number;
}

async function crearSesion(secreto: string, s: Omit<Sesion, 'e'>) {
  const cuerpo = aBase64(new TextEncoder().encode(JSON.stringify({ ...s, e: Date.now() + DIAS_SESION * 86_400_000 })));
  return `${cuerpo}.${await firmar(secreto, cuerpo)}`;
}

async function leerSesion(secreto: string, token: unknown): Promise<Sesion | null> {
  if (typeof token !== 'string' || token.length > 2000) return null;
  const [cuerpo, sello] = token.split('.');
  if (!cuerpo || !sello || !igual(sello, await firmar(secreto, cuerpo))) return null;
  try {
    const s = JSON.parse(new TextDecoder().decode(deBase64(cuerpo))) as Sesion;
    return typeof s.id === 'string' && s.e > Date.now() ? s : null;
  } catch {
    return null;
  }
}

/** El curso que ve el lead: sin las cifras que aún no se pueden enseñar (ver cifras en curso.json). */
function cursoParaLead(): Curso {
  const c = curso.cifras;
  const comisiones = c.confirmadas && c.comisionesAprobadas;
  return {
    ...curso,
    cifras: {
      ...c,
      rangos: c.confirmadas ? c.rangos : [],
      paquetes: c.paquetes.map((p) => ({
        ...p,
        precio: c.confirmadas ? p.precio : null,
        rango: c.confirmadas ? p.rango : '',
        comisionInicial: comisiones ? p.comisionInicial : null,
        comisiones: comisiones ? p.comisiones : [],
      })),
    },
  };
}

export async function manejarCurso(request: Request, env: EntornoCurso): Promise<Response> {
  let datos: Json;
  try {
    datos = (await request.json()) as Json;
  } catch {
    return responder({ ok: false, error: 'peticion' }, 400);
  }

  if (datos.accion === 'vista') {
    if (!env.EDITOR_CLAVE || !igual(texto(datos.clave), env.EDITOR_CLAVE)) {
      await esperar(800);
      return responder({ ok: false, error: 'clave' }, 401);
    }
    return responder({ ok: true, nombre: 'Laura', hechas: [], curso });
  }

  const destino = env.LEADS_WEBHOOK_URL;
  const secreto = env.CURSO_SECRETO || env.LEADS_WEBHOOK_SECRET;
  if (!destino || !secreto) return responder({ ok: false, error: 'no-configurado' }, 503);

  if (datos.accion === 'entrar') {
    const email = texto(datos.email).toLowerCase();
    const contrasena = texto(datos.contrasena, 100);
    const persona = texto(datos.persona, 40);
    if (!/^\S+@\S+\.\S+$/.test(email) || contrasena.length < 4) return responder({ ok: false, error: 'acceso' }, 400);
    const r = await consultar(destino, env.LEADS_WEBHOOK_SECRET, { tipo: 'curso_entrar', equipo: persona, email, contrasena });
    if (!r) return responder({ ok: false, error: 'hoja' }, 502);
    if (r.ok !== true) {
      if (String(r.error ?? '').includes('Persona desconocida')) {
        console.error('El script de la hoja no tiene el curso: hay que actualizarlo (Embudo.gs, nueva versión)');
        return responder({ ok: false, error: 'no-configurado' }, 503);
      }
      await esperar(800);
      return responder({ ok: false, error: 'acceso' }, 401);
    }
    const sesion = { p: persona, id: String(r.id), n: String(r.nombre ?? '').trim().split(/\s+/)[0] ?? '' };
    const hechas = Array.isArray(r.hechas) ? r.hechas.filter((x): x is string => typeof x === 'string' && ids.has(x)) : [];
    return responder({ ok: true, token: await crearSesion(secreto, sesion), nombre: sesion.n, hechas, curso: cursoParaLead() });
  }

  const sesion = await leerSesion(secreto, datos.token);
  if (!sesion) return responder({ ok: false, error: 'sesion' }, 401);

  switch (datos.accion) {
    case 'curso':
      return responder({ ok: true, nombre: sesion.n, curso: cursoParaLead() });

    case 'progreso': {
      const leccion = texto(datos.leccion, 60);
      if (!ids.has(leccion)) return responder({ ok: false, error: 'peticion' }, 400);
      const hechas = new Set(Array.isArray(datos.hechas) ? datos.hechas : []);
      hechas.add(leccion);
      const terminado = obligatorias.every((id) => hechas.has(id));
      const ok = await reenviar(destino, env.LEADS_WEBHOOK_SECRET, {
        tipo: 'curso_progreso',
        equipo: sesion.p,
        id: sesion.id,
        leccion,
        total: obligatorias.length,
        terminado,
      });
      return responder({ ok });
    }

    case 'whatsapp': {
      const ok = await reenviar(destino, env.LEADS_WEBHOOK_SECRET, { tipo: 'curso_whatsapp', equipo: sesion.p, id: sesion.id });
      return responder({ ok });
    }

    default:
      return responder({ ok: false, error: 'peticion' }, 400);
  }
}

// Vercel
export async function POST(request: Request): Promise<Response> {
  return manejarCurso(request, process.env as EntornoCurso);
}
