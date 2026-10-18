// GENERADO por scripts/generar-api.mjs desde compartido/api/editor.ts. No editar a mano.

// compartido/src/editor/rutas.ts
var esObjeto = (v) => !!v && typeof v === "object" && !Array.isArray(v);
function diferencias(a, b, ruta = []) {
  if (ruta.length === 1 && typeof ruta[0] === "string" && ruta[0].startsWith("_")) return [];
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length && a.every((x) => typeof x === "string")) return [ruta];
    return a.flatMap((x, i) => diferencias(x, b[i], [...ruta, i]));
  }
  if (esObjeto(a) && esObjeto(b)) {
    const claves = [.../* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)])];
    return claves.flatMap((k) => diferencias(a[k], b[k], [...ruta, k]));
  }
  return a === b ? [] : [ruta];
}

// compartido/src/fuentes.ts
var todos = [300, 400, 500, 600, 700];
var desde400 = [400, 500, 600, 700];
var FUENTES = [
  { nombre: "Inter", tipo: "sans", pesos: todos },
  { nombre: "Inter Tight", tipo: "sans", pesos: todos },
  { nombre: "DM Sans", tipo: "sans", pesos: todos },
  { nombre: "Plus Jakarta Sans", tipo: "sans", pesos: todos },
  { nombre: "Manrope", tipo: "sans", pesos: todos },
  { nombre: "Figtree", tipo: "sans", pesos: todos },
  { nombre: "Outfit", tipo: "sans", pesos: todos },
  { nombre: "Work Sans", tipo: "sans", pesos: todos },
  { nombre: "Montserrat", tipo: "sans", pesos: todos },
  { nombre: "Raleway", tipo: "sans", pesos: todos },
  { nombre: "Poppins", tipo: "sans", pesos: todos },
  { nombre: "Jost", tipo: "sans", pesos: todos },
  { nombre: "Cormorant Garamond", tipo: "serif", pesos: todos },
  { nombre: "Fraunces", tipo: "serif", pesos: todos },
  { nombre: "Newsreader", tipo: "serif", pesos: todos },
  { nombre: "Source Serif 4", tipo: "serif", pesos: todos },
  { nombre: "Lora", tipo: "serif", pesos: desde400 },
  { nombre: "Playfair Display", tipo: "serif", pesos: desde400 },
  { nombre: "EB Garamond", tipo: "serif", pesos: desde400 },
  { nombre: "DM Serif Display", tipo: "serif", pesos: [400] }
];
var fuentePorNombre = (nombre) => FUENTES.find((f) => f.nombre === nombre);

// compartido/api/validarContenido.ts
var PROTEGIDAS = /* @__PURE__ */ new Set(["tipo", "campo", "columna"]);
var MAX_TEXTO = 3e3;
var MAX_LISTA = 40;
var esObjeto2 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var esColor = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
function reglaEspecial(ruta, nuevo, actual) {
  const [grupo, clave] = ruta;
  if (esColor(actual) && !esColor(nuevo)) return "tiene que ser un color (#rrggbb)";
  if (grupo === "fuentes" && !fuentePorNombre(nuevo)) return "tipograf\xEDa no disponible";
  if (grupo === "fotos" && nuevo !== actual && !/^\/[\w-]+(\/[\w-]+)*\.(jpe?g|png|webp)$/i.test(nuevo)) {
    return "foto no v\xE1lida";
  }
  if (grupo === "enlaces") {
    if (clave === "whatsapp") return /^(\d{8,15})?$/.test(nuevo) ? "" : "solo n\xFAmeros, con prefijo (p. ej. 34600000000)";
    return nuevo === "" || /^https:\/\/[^\s<>"]+$/.test(nuevo) ? "" : "tiene que ser un enlace que empiece por https://";
  }
  return "";
}
function validarContenido(nuevo, actual) {
  const errores = [];
  const nombre = (ruta) => ruta.join(" \u203A ") || "contenido";
  const comparar = (n, a, ruta) => {
    if (errores.length >= 20) return;
    const clave = ruta[ruta.length - 1];
    if (typeof a === "string") {
      if (typeof n !== "string") return void errores.push(`${nombre(ruta)}: tiene que ser un texto`);
      if (typeof clave === "string" && PROTEGIDAS.has(clave) && n !== a) {
        return void errores.push(`${nombre(ruta)}: no se puede cambiar desde el editor`);
      }
      if (n.length > MAX_TEXTO) return void errores.push(`${nombre(ruta)}: texto demasiado largo`);
      const especial = reglaEspecial(ruta, n, a);
      if (especial) errores.push(`${nombre(ruta)}: ${especial}`);
      return;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(n)) return void errores.push(`${nombre(ruta)}: tiene que ser una lista`);
      if (a.length > 0 && a.every((x) => typeof x === "string")) {
        if (n.length < 1 || n.length > MAX_LISTA) {
          return void errores.push(`${nombre(ruta)}: tiene que tener entre 1 y ${MAX_LISTA} textos`);
        }
        n.forEach((x, i) => comparar(x, a[Math.min(i, a.length - 1)], [...ruta, i]));
        return;
      }
      if (n.length !== a.length) return void errores.push(`${nombre(ruta)}: no se pueden a\xF1adir ni quitar elementos`);
      n.forEach((x, i) => comparar(x, a[i], [...ruta, i]));
      return;
    }
    if (esObjeto2(a)) {
      if (!esObjeto2(n)) return void errores.push(`${nombre(ruta)}: formato no v\xE1lido`);
      const claves = (o) => Object.keys(o).filter((k) => !k.startsWith("_"));
      const distintas = [...claves(a).filter((k) => !(k in n)), ...claves(n).filter((k) => !(k in a))];
      if (distintas.length) return void errores.push(`${nombre(ruta)}: no se pueden a\xF1adir ni quitar apartados (${distintas.join(", ")})`);
      for (const k of claves(a)) comparar(n[k], a[k], [...ruta, k]);
      return;
    }
    if (n !== a) errores.push(`${nombre(ruta)}: no se puede cambiar desde el editor`);
  };
  comparar(nuevo, actual, []);
  return errores;
}

// compartido/api/editor.ts
var SITIO = `equipo/${"alejandro"}/sitio`;
var RUTA_CONTENIDO = `${SITIO}/src/contenido.json`;
var MAX_FOTO = 4e6;
var ErrorGitHub = class extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
  }
};
var responder = (datos, estado = 200) => Response.json(datos, { status: estado });
var esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
var esObjeto3 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
function igual(a, b) {
  let distinto = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) distinto |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return distinto === 0;
}
function desdeBase64(b64) {
  const binario = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)));
}
function github(token, repo) {
  return async (ruta, metodo = "GET", cuerpo) => {
    const res = await fetch(`https://api.github.com/repos/${repo}${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "editor-webs-equipo",
        ...cuerpo ? { "Content-Type": "application/json" } : {}
      },
      body: cuerpo ? JSON.stringify(cuerpo) : void 0
    });
    const datos = await res.json().catch(() => ({}));
    if (!res.ok) throw new ErrorGitHub(res.status, String(datos.message ?? res.statusText));
    return datos;
  };
}
function resumen(antes, despues) {
  const rutas = [...new Set(diferencias(antes, despues).map((r) => r.filter((k) => typeof k === "string").join(".")))];
  if (!rutas.length) return "sin cambios de texto";
  return rutas.slice(0, 6).join(", ") + (rutas.length > 6 ? ` y ${rutas.length - 6} m\xE1s` : "");
}
function tipoDeFoto(b64) {
  const cabeza = atob(b64.slice(0, 24));
  if (cabeza.startsWith("\xFF\xD8\xFF")) return "jpg";
  if (cabeza.startsWith("\x89PNG")) return "png";
  if (cabeza.startsWith("RIFF") && cabeza.slice(8, 12) === "WEBP") return "webp";
  return "";
}
async function POST(request) {
  const clave = process.env.EDITOR_CLAVE;
  const token = process.env.EDITOR_GITHUB_TOKEN;
  if (!clave || !token) return responder({ ok: false, error: "no-configurado" }, 503);
  const rama = process.env.EDITOR_RAMA || "main";
  const gh = github(token, process.env.EDITOR_REPO || "alejandromartinezhamh-art/kangen-team");
  let datos;
  try {
    datos = await request.json();
  } catch {
    return responder({ ok: false, error: "peticion" }, 400);
  }
  if (!igual(String(datos.clave ?? ""), clave)) {
    await esperar(800);
    return responder({ ok: false, error: "clave" }, 401);
  }
  const leerArchivo = async (ref) => {
    const r = await gh(`/contents/${RUTA_CONTENIDO}?ref=${encodeURIComponent(ref)}`);
    const texto = desdeBase64(String(r.content ?? ""));
    return { texto, sha: String(r.sha), contenido: JSON.parse(texto) };
  };
  const existe = async (ruta) => {
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
      case "leer": {
        const { contenido, sha } = await leerArchivo(rama);
        return responder({ ok: true, contenido, sha });
      }
      case "versiones": {
        const lista = await gh(
          `/commits?path=${encodeURIComponent(RUTA_CONTENIDO)}&sha=${encodeURIComponent(rama)}&per_page=15`
        );
        const versiones = lista.map((c) => {
          const commit = c.commit;
          const autor = commit.author;
          return {
            sha: String(c.sha),
            fecha: String(autor.date),
            autor: String(autor.name),
            mensaje: String(commit.message).split("\n")[0]
          };
        });
        return responder({ ok: true, versiones });
      }
      case "version": {
        const sha = String(datos.sha ?? "");
        if (!/^[0-9a-f]{40}$/.test(sha)) return responder({ ok: false, error: "peticion" }, 400);
        const { contenido } = await leerArchivo(sha);
        return responder({ ok: true, contenido });
      }
      case "foto": {
        const b64 = String(datos.datos ?? "");
        const ext = b64.length <= MAX_FOTO && /^[A-Za-z0-9+/=]+$/.test(b64) ? tipoDeFoto(b64) : "";
        if (!ext) return responder({ ok: false, error: "no-valido", detalles: ["La foto no es un JPG, PNG o WebP v\xE1lido, o pesa demasiado."] }, 400);
        const blob = await gh("/git/blobs", "POST", { content: b64, encoding: "base64" });
        const nombre = String(datos.nombre ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "foto";
        const sello = (/* @__PURE__ */ new Date()).toISOString().replace(/\D/g, "").slice(0, 14);
        return responder({ ok: true, ruta: `/fotos/${nombre}-${sello}.${ext}`, sha: String(blob.sha) });
      }
      case "publicar": {
        const nuevo = datos.contenido;
        if (!esObjeto3(nuevo) || JSON.stringify(nuevo).length > 4e5) {
          return responder({ ok: false, error: "no-valido", detalles: ["Contenido no v\xE1lido."] }, 400);
        }
        const forzar = datos.forzar === true;
        const actual = await leerArchivo(rama);
        if (!forzar && String(datos.base ?? "") !== actual.sha) return responder({ ok: false, error: "conflicto" }, 409);
        const errores = validarContenido(nuevo, actual.contenido);
        const subidas = /* @__PURE__ */ new Map();
        for (const f of Array.isArray(datos.fotos) ? datos.fotos : []) {
          if (esObjeto3(f) && /^\/fotos\/[a-z0-9-]+\.(jpg|png|webp)$/.test(String(f.ruta)) && /^[0-9a-f]{40}$/.test(String(f.sha))) {
            subidas.set(String(f.ruta), String(f.sha));
          }
        }
        const fotosAntes = actual.contenido.fotos ?? {};
        const fotosNuevas = esObjeto3(nuevo.fotos) ? nuevo.fotos : {};
        for (const [k, ruta] of Object.entries(fotosNuevas)) {
          if (typeof ruta !== "string" || ruta === fotosAntes[k] || subidas.has(ruta) || errores.length) continue;
          if (!await existe(`${SITIO}/public${ruta}`)) errores.push(`fotos \u203A ${k}: esa foto no est\xE1 en la web`);
        }
        if (errores.length) return responder({ ok: false, error: "no-valido", detalles: errores }, 400);
        const resto = Object.fromEntries(Object.entries(nuevo).filter(([k]) => !k.startsWith("_")));
        const final = { ...actual.contenido._etiquetas ? { _etiquetas: actual.contenido._etiquetas } : {}, ...resto };
        const texto = JSON.stringify(final, null, 2) + "\n";
        if (texto === actual.texto) return responder({ ok: true, sinCambios: true, contenido: final, sha: actual.sha, commit: "" });
        const blob = await gh("/git/blobs", "POST", { content: texto, encoding: "utf-8" });
        const archivos = [{ path: RUTA_CONTENIDO, sha: String(blob.sha) }];
        const usadas = new Set(Object.values(esObjeto3(final.fotos) ? final.fotos : {}));
        for (const [ruta, sha] of subidas) if (usadas.has(ruta)) archivos.push({ path: `${SITIO}/public${ruta}`, sha });
        const mensaje = `Editor (${"alejandro"}): ${resumen(actual.contenido, final)}`;
        for (let intento = 0; ; intento++) {
          const ref = await gh(`/git/ref/heads/${rama}`);
          const padre = String(ref.object.sha);
          if (intento > 0 && !forzar && (await leerArchivo(padre)).sha !== actual.sha) {
            return responder({ ok: false, error: "conflicto" }, 409);
          }
          const commitPadre = await gh(`/git/commits/${padre}`);
          const arbol = await gh("/git/trees", "POST", {
            base_tree: String(commitPadre.tree.sha),
            tree: archivos.map((a) => ({ path: a.path, mode: "100644", type: "blob", sha: a.sha }))
          });
          const commit = await gh("/git/commits", "POST", { message: mensaje, tree: arbol.sha, parents: [padre] });
          try {
            await gh(`/git/refs/heads/${rama}`, "PATCH", { sha: commit.sha });
            return responder({ ok: true, contenido: final, sha: String(blob.sha), commit: String(commit.sha) });
          } catch (e) {
            if (intento === 0 && e instanceof ErrorGitHub && e.estado === 422) continue;
            throw e;
          }
        }
      }
      default:
        return responder({ ok: false, error: "peticion" }, 400);
    }
  } catch (e) {
    if (!(e instanceof ErrorGitHub)) throw e;
    console.error("GitHub respondi\xF3", e.estado, e.message);
    const error = e.estado === 404 && datos.accion === "leer" ? "sin-contenido" : "github";
    return responder({ ok: false, error }, 502);
  }
}
export {
  POST
};
