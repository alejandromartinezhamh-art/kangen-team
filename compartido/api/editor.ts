import { diferencias } from '../src/editor/rutas';
import { validarContenido } from './validarContenido';

// Vercel: /api/editor, la función del editor visual (/editar) de cada web.
// Lee y publica src/contenido.json de esta persona. Publicar = un commit en GitHub (rama main) con
// contenido.json y las fotos nuevas; Vercel vuelve a publicar la web sola en 1-2 minutos, y si algo
// fallara al compilar deja la versión anterior. Solo puede tocar equipo/<persona>/sitio/src/contenido.json
// y equipo/<persona>/sitio/public/fotos/: nunca el código, el formulario ni la hoja.
//
// Variables de entorno del proyecto de Vercel:
//   EDITOR_CLAVE         contraseña del editor (la que se da a la persona)
//   EDITOR_GITHUB_TOKEN  token de GitHub con permiso "Contents: read and write" en este repositorio
//   EDITOR_REPO          opcional, por defecto alejandromartinezhamh-art/kangen-team
//   EDITOR_RAMA          opcional, por defecto main

// scripts/generar-api.mjs lo sustituye por la persona de cada web al empaquetar.
declare const __PERSONA__: string;

const SITIO = `equipo/${__PERSONA__}/sitio`;
const RUTA_CONTENIDO = `${SITIO}/src/contenido.json`;
const MAX_FOTO = 4_000_000; // caracteres en base64 (unos 3 MB)

type Json = Record<string, unknown>;

class ErrorGitHub extends Error {
  constructor(
    public estado: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

const responder = (datos: Json, estado = 200) => Response.json(datos, { status: estado });
const esperar = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
const esObjeto = (v: unknown): v is Json => !!v && typeof v === 'object' && !Array.isArray(v);

/** Comparación que tarda lo mismo acierte o no (para no dar pistas de la contraseña). */
function igual(a: string, b: string) {
  let distinto = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) distinto |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return distinto === 0;
}

function desdeBase64(b64: string) {
  const binario = atob(b64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)));
}

function github(token: string, repo: string) {
  return async (ruta: string, metodo = 'GET', cuerpo?: unknown): Promise<Json> => {
    const res = await fetch(`https://api.github.com/repos/${repo}${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'editor-webs-equipo',
        ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    const datos = (await res.json().catch(() => ({}))) as Json;
    if (!res.ok) throw new ErrorGitHub(res.status, String(datos.message ?? res.statusText));
    return datos;
  };
}

/** Resumen corto de lo que cambia, para el mensaje del commit. */
function resumen(antes: unknown, despues: unknown) {
  const rutas = [...new Set(diferencias(antes, despues).map((r) => r.filter((k) => typeof k === 'string').join('.')))];
  if (!rutas.length) return 'sin cambios de texto';
  return rutas.slice(0, 6).join(', ') + (rutas.length > 6 ? ` y ${rutas.length - 6} más` : '');
}

function tipoDeFoto(b64: string) {
  const cabeza = atob(b64.slice(0, 24));
  if (cabeza.startsWith('\xff\xd8\xff')) return 'jpg';
  if (cabeza.startsWith('\x89PNG')) return 'png';
  if (cabeza.startsWith('RIFF') && cabeza.slice(8, 12) === 'WEBP') return 'webp';
  return '';
}

export async function POST(request: Request): Promise<Response> {
  const clave = process.env.EDITOR_CLAVE;
  const token = process.env.EDITOR_GITHUB_TOKEN;
  if (!clave || !token) return responder({ ok: false, error: 'no-configurado' }, 503);
  const rama = process.env.EDITOR_RAMA || 'main';
  const gh = github(token, process.env.EDITOR_REPO || 'alejandromartinezhamh-art/kangen-team');

  let datos: Json;
  try {
    datos = (await request.json()) as Json;
  } catch {
    return responder({ ok: false, error: 'peticion' }, 400);
  }
  if (!igual(String(datos.clave ?? ''), clave)) {
    await esperar(800);
    return responder({ ok: false, error: 'clave' }, 401);
  }

  const leerArchivo = async (ref: string) => {
    const r = await gh(`/contents/${RUTA_CONTENIDO}?ref=${encodeURIComponent(ref)}`);
    const texto = desdeBase64(String(r.content ?? ''));
    return { texto, sha: String(r.sha), contenido: JSON.parse(texto) as Json };
  };
  const existe = async (ruta: string) => {
    try {
      await gh(`/contents/${ruta}?ref=${encodeURIComponent(rama)}`);
      return true;
    } catch (e) {
      if (e instanceof ErrorGitHub && e.estado === 404) return false;
      throw e;
    }
  };

  try {
    switch (datos.accion) {
      case 'leer': {
        const { contenido, sha } = await leerArchivo(rama);
        return responder({ ok: true, contenido, sha });
      }

      case 'versiones': {
        const lista = (await gh(
          `/commits?path=${encodeURIComponent(RUTA_CONTENIDO)}&sha=${encodeURIComponent(rama)}&per_page=15`,
        )) as unknown as Json[];
        const versiones = lista.map((c) => {
          const commit = c.commit as Json;
          const autor = commit.author as Json;
          return {
            sha: String(c.sha),
            fecha: String(autor.date),
            autor: String(autor.name),
            mensaje: String(commit.message).split('\n')[0],
          };
        });
        return responder({ ok: true, versiones });
      }

      case 'version': {
        const sha = String(datos.sha ?? '');
        if (!/^[0-9a-f]{40}$/.test(sha)) return responder({ ok: false, error: 'peticion' }, 400);
        const { contenido } = await leerArchivo(sha);
        return responder({ ok: true, contenido });
      }

      case 'foto': {
        const b64 = String(datos.datos ?? '');
        const ext = b64.length <= MAX_FOTO && /^[A-Za-z0-9+/=]+$/.test(b64) ? tipoDeFoto(b64) : '';
        if (!ext) return responder({ ok: false, error: 'no-valido', detalles: ['La foto no es un JPG, PNG o WebP válido, o pesa demasiado.'] }, 400);
        const blob = await gh('/git/blobs', 'POST', { content: b64, encoding: 'base64' });
        const nombre = String(datos.nombre ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'foto';
        const sello = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
        return responder({ ok: true, ruta: `/fotos/${nombre}-${sello}.${ext}`, sha: String(blob.sha) });
      }

      case 'publicar': {
        const nuevo = datos.contenido;
        if (!esObjeto(nuevo) || JSON.stringify(nuevo).length > 400_000) {
          return responder({ ok: false, error: 'no-valido', detalles: ['Contenido no válido.'] }, 400);
        }
        const forzar = datos.forzar === true;
        const actual = await leerArchivo(rama);
        if (!forzar && String(datos.base ?? '') !== actual.sha) return responder({ ok: false, error: 'conflicto' }, 409);

        const errores = validarContenido(nuevo, actual.contenido);
        // Fotos: o ya estaban, o se acaban de subir (accion "foto"), o están en el repositorio
        // (al recuperar una versión anterior).
        const subidas = new Map<string, string>();
        for (const f of Array.isArray(datos.fotos) ? datos.fotos : []) {
          if (esObjeto(f) && /^\/fotos\/[a-z0-9-]+\.(jpg|png|webp)$/.test(String(f.ruta)) && /^[0-9a-f]{40}$/.test(String(f.sha))) {
            subidas.set(String(f.ruta), String(f.sha));
          }
        }
        const fotosAntes = (actual.contenido.fotos ?? {}) as Json;
        const fotosNuevas = (esObjeto(nuevo.fotos) ? nuevo.fotos : {}) as Json;
        for (const [k, ruta] of Object.entries(fotosNuevas)) {
          if (typeof ruta !== 'string' || ruta === fotosAntes[k] || subidas.has(ruta) || errores.length) continue;
          if (!(await existe(`${SITIO}/public${ruta}`))) errores.push(`fotos › ${k}: esa foto no está en la web`);
        }
        if (errores.length) return responder({ ok: false, error: 'no-valido', detalles: errores }, 400);

        // Las etiquetas del editor (_etiquetas) son del repositorio, no de lo que llega.
        const resto = Object.fromEntries(Object.entries(nuevo).filter(([k]) => !k.startsWith('_')));
        const final: Json = { ...(actual.contenido._etiquetas ? { _etiquetas: actual.contenido._etiquetas } : {}), ...resto };
        const texto = JSON.stringify(final, null, 2) + '\n';
        if (texto === actual.texto) return responder({ ok: true, sinCambios: true, contenido: final, sha: actual.sha, commit: '' });

        const blob = await gh('/git/blobs', 'POST', { content: texto, encoding: 'utf-8' });
        const archivos = [{ path: RUTA_CONTENIDO, sha: String(blob.sha) }];
        const usadas = new Set(Object.values(esObjeto(final.fotos) ? final.fotos : {}));
        for (const [ruta, sha] of subidas) if (usadas.has(ruta)) archivos.push({ path: `${SITIO}/public${ruta}`, sha });

        const mensaje = `Editor (${__PERSONA__}): ${resumen(actual.contenido, final)}`;
        for (let intento = 0; ; intento++) {
          const ref = await gh(`/git/ref/heads/${rama}`);
          const padre = String((ref.object as Json).sha);
          if (intento > 0 && !forzar && (await leerArchivo(padre)).sha !== actual.sha) {
            return responder({ ok: false, error: 'conflicto' }, 409);
          }
          const commitPadre = await gh(`/git/commits/${padre}`);
          const arbol = await gh('/git/trees', 'POST', {
            base_tree: String((commitPadre.tree as Json).sha),
            tree: archivos.map((a) => ({ path: a.path, mode: '100644', type: 'blob', sha: a.sha })),
          });
          const commit = await gh('/git/commits', 'POST', { message: mensaje, tree: arbol.sha, parents: [padre] });
          try {
            await gh(`/git/refs/heads/${rama}`, 'PATCH', { sha: commit.sha });
            return responder({ ok: true, contenido: final, sha: String(blob.sha), commit: String(commit.sha) });
          } catch (e) {
            // Alguien ha subido otro commit a la vez: se repite una vez sobre el nuevo.
            if (intento === 0 && e instanceof ErrorGitHub && e.estado === 422) continue;
            throw e;
          }
        }
      }

      default:
        return responder({ ok: false, error: 'peticion' }, 400);
    }
  } catch (e) {
    if (!(e instanceof ErrorGitHub)) throw e;
    console.error('GitHub respondió', e.estado, e.message);
    const error = e.estado === 404 && datos.accion === 'leer' ? 'sin-contenido' : 'github';
    return responder({ ok: false, error }, 502);
  }
}
