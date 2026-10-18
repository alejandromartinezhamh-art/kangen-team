import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Contenido } from '../puente';
import { FUENTES, pilaFuente, urlFuentes } from '../fuentes';
import { htmlEmail, type TextosEmail } from '../email';
import { api, ErrorApi, type Version } from './api';
import { esFotoNueva, reducirFoto } from './fotos';
import { conValor, diferencias, esColor, etiqueta, huella, leer, NOMBRES_SECCION, textosDe, type Ruta } from './rutas';
import { ESTILOS_PAGINA, fotoEn, mapaCampos, marcar, textoEn } from './seleccion';
import './editor.css';

// Editor visual de cada web (/editar). La persona toca un texto de su página para cambiarlo, cambia
// colores, letras, fotos y enlaces en "Diseño", y con "Publicar" sus cambios llegan a la web en 1-2 minutos
// (commit en GitHub vía /api/editor → Vercel vuelve a publicar). Solo cambia contenido.json y fotos:
// el formulario, la hoja de Google y los emails siguen funcionando igual.

export interface PaginaEditor {
  nombre: string;
  /** Dirección de la página en la web */
  ruta?: string;
  /** Secciones de contenido.json que pinta la página */
  secciones: string[];
  /** Número de pasos (cuestionario): el editor enseña un selector de paso */
  pasos?: number;
  /** Vista previa de los emails (contenido.json → email) */
  email?: boolean;
}

interface Props {
  /** El "persona" de config.ts */
  id: string;
  nombre: string;
  contenido: Contenido;
  paginas: PaginaEditor[];
}

type Dispositivo = 'movil' | 'ordenador';
type Panel = null | 'diseno' | 'textos' | 'versiones' | 'publicar';
interface Edicion {
  rutas: Ruta[];
  valor: string;
  x: number;
  y: number;
  ancho: number;
}
type Publicacion =
  | { estado: 'nada' }
  | { estado: 'publicando'; paso: string }
  | { estado: 'esperando'; contenido: Contenido }
  | { estado: 'en-web' }
  | { estado: 'error'; mensaje: string; detalles?: string[]; conflicto?: boolean };

const ANCHO_ORDENADOR = 1280;
const ANCHO_MOVIL = 390;
const NOMBRE_EJEMPLO = 'Laura';

const almacen = {
  leer<T>(k: string): T | null {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
    }
  },
  poner(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  },
  quitar(k: string) {
    try {
      localStorage.removeItem(k);
    } catch {
      // sin almacenamiento: nada que borrar
    }
  },
};

const fecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const etiquetas = (c: Contenido) => (c._etiquetas ?? {}) as Record<string, Record<string, string | string[]>>;
const nombreDe = (c: Contenido, grupo: string, clave: string) => [etiquetas(c)[grupo]?.[clave] ?? clave].flat() as string[];

/** Contenido que ve la página: las fotos recién publicadas se enseñan desde el navegador hasta que estén en la web. */
function paraVista(c: Contenido, locales: Map<string, string>): Contenido {
  if (!locales.size || !c.fotos) return c;
  const fotos = Object.fromEntries(Object.entries(c.fotos).map(([k, v]) => [k, locales.get(v) ?? v]));
  return { ...c, fotos };
}

function documentoEmail(c: Contenido, tipo: 'webinar' | 'recordatorio') {
  const t = c.email as TextosEmail | undefined;
  if (!t?.webinar) return '<p>Esta web no tiene emails.</p>';
  const { asunto, html } = htmlEmail(t, tipo, { nombre: NOMBRE_EJEMPLO, enlace: '#', foto: c.fotos?.email ?? '' });
  const e = (s: string) => s.replace(/[&<>]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[x]!);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
body{margin:0;background:#fff;font-family:Helvetica,Arial,sans-serif;color:#222}
.cab{padding:18px 24px;border-bottom:1px solid #ececec;font-size:14px;line-height:1.7;color:#666}
.cab b{color:#111;font-weight:600}.cuerpo{padding:28px 24px 40px}
</style></head><body><div class="cab"><div>De: <b>${e(t.firma)}</b></div><div>Para: ${NOMBRE_EJEMPLO} (ejemplo)</div>
<div>Asunto: <b>${e(asunto)}</b></div></div><div class="cuerpo">${html}</div></body></html>`;
}

export default function Editor({ id, nombre, contenido: deLaWeb, paginas }: Props) {
  const claveAcceso = `editor_clave_${id}`;
  const claveBorrador = `editor_borrador_${id}`;

  // ---------- Acceso ----------
  const [clave, setClave] = useState(() => almacen.leer<string>(claveAcceso) ?? '');
  const [acceso, setAcceso] = useState<'comprobando' | 'pedir' | 'dentro' | 'solo-ver'>(clave ? 'comprobando' : 'pedir');
  const [errorAcceso, setErrorAcceso] = useState('');

  // ---------- Contenido ----------
  const [publicado, setPublicado] = useState<Contenido>(() => structuredClone(deLaWeb));
  const [shaPublicado, setShaPublicado] = useState('');
  // Versión sobre la que se hizo el borrador: si al publicar ya hay otra, /api/editor avisa en vez de pisarla.
  const [base, setBase] = useState('');
  const borradorGuardado = useRef(almacen.leer<{ contenido: Contenido; base?: string; fecha: number }>(claveBorrador));
  const [borrador, setBorrador] = useState<Contenido>(
    () => borradorGuardado.current?.contenido ?? structuredClone(deLaWeb),
  );
  const [fotosLocales, setFotosLocales] = useState<Map<string, string>>(() => new Map());
  const [sinBorradorLocal, setSinBorradorLocal] = useState(false);
  const vista = useMemo(() => paraVista(borrador, fotosLocales), [borrador, fotosLocales]);
  const cambios = useMemo(() => diferencias(publicado, borrador), [publicado, borrador]);

  // ---------- Vista ----------
  const [iPagina, setIPagina] = useState(0);
  const pagina = paginas[iPagina];
  const [paso, setPaso] = useState<number | 'fin'>(0);
  const [tipoEmail, setTipoEmail] = useState<'webinar' | 'recordatorio'>('webinar');
  const [dispositivo, setDispositivo] = useState<Dispositivo>(() => (window.innerWidth < 900 ? 'movil' : 'ordenador'));
  const [modo, setModo] = useState<'editar' | 'ver'>('editar');
  const [panel, setPanel] = useState<Panel>(null);
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [fotoFlotante, setFotoFlotante] = useState<{ clave: string; x: number; y: number } | null>(null);
  const [aviso, setAviso] = useState('');
  const [ayuda, setAyuda] = useState(() => !almacen.leer<boolean>('editor_ayuda_vista'));
  const [publicacion, setPublicacion] = useState<Publicacion>({ estado: 'nada' });
  const [lienzo, setLienzo] = useState({ ancho: 1000, alto: 700 });

  const iframe = useRef<HTMLIFrameElement>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);
  const archivo = useRef<HTMLInputElement>(null);
  const fotoPendiente = useRef('');

  const temporizadorAviso = useRef(0);
  const avisar = useCallback((texto: string) => {
    setAviso(texto);
    window.clearTimeout(temporizadorAviso.current);
    temporizadorAviso.current = window.setTimeout(() => setAviso(''), 3500);
  }, []);

  // ---------- Entrar ----------
  const cargarPublicado = useCallback(
    async (conClave: string, sustituirBorrador: boolean) => {
      const r = await api.leer(conClave);
      setPublicado(r.contenido);
      setShaPublicado(r.sha);
      if (sustituirBorrador) {
        setBorrador(r.contenido);
        setBase(r.sha);
      } else setBase(borradorGuardado.current?.base || r.sha);
      return r;
    },
    [],
  );

  const entrar = useCallback(
    async (conClave: string) => {
      setErrorAcceso('');
      try {
        await cargarPublicado(conClave, !borradorGuardado.current);
        almacen.poner(claveAcceso, conClave);
        setClave(conClave);
        setAcceso('dentro');
      } catch (e) {
        const err = e instanceof ErrorApi ? e : new ErrorApi('desconocido', 'Algo ha fallado.');
        if (err.codigo === 'clave') almacen.quitar(claveAcceso);
        setErrorAcceso(err.message);
        setAcceso('pedir');
      }
    },
    [cargarPublicado, claveAcceso],
  );

  useEffect(() => {
    if (acceso === 'comprobando') entrar(clave);
    // Solo al abrir el editor con una contraseña ya guardada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Puente con la página del iframe (compartido/src/puente.tsx) ----------
  if (!window.__EDITOR__) window.__EDITOR__ = { contenido: vista };
  useEffect(() => {
    const puente = (window.__EDITOR__ ??= { contenido: vista });
    puente.contenido = vista;
    puente.repintar?.(structuredClone(vista));
  }, [vista]);
  useEffect(() => () => void delete window.__EDITOR__, []);

  // Borrador en este navegador: si se cierra la pestaña sin publicar, no se pierde nada.
  useEffect(() => {
    if (acceso === 'comprobando') return;
    if (huella(borrador) === huella(publicado)) {
      almacen.quitar(claveBorrador);
      setSinBorradorLocal(false);
    } else setSinBorradorLocal(!almacen.poner(claveBorrador, { contenido: borrador, base, fecha: Date.now() }));
  }, [borrador, publicado, base, acceso, claveBorrador]);

  // ---------- Qué se puede tocar en la página ----------
  const campos = useMemo(
    () => mapaCampos(textosDe(borrador, pagina.secciones), pagina.email ? { nombre: NOMBRE_EJEMPLO } : {}),
    [borrador, pagina],
  );
  const fotosPorSrc = useMemo(
    () => new Map(Object.entries(vista.fotos ?? {}).map(([k, v]) => [v, k])),
    [vista],
  );
  const refs = useRef({ campos, fotosPorSrc, modo, borrador, escala: 1 });
  refs.current.campos = campos;
  refs.current.fotosPorSrc = fotosPorSrc;
  refs.current.modo = modo;
  refs.current.borrador = borrador;

  useEffect(() => {
    const doc = iframe.current?.contentDocument;
    if (doc) marcar(doc, campos, fotosPorSrc);
  }, [campos, fotosPorSrc]);

  useEffect(() => {
    iframe.current?.contentDocument?.documentElement.classList.toggle('ed-editando', modo === 'editar');
    if (modo === 'ver') {
      setEdicion(null);
      setFotoFlotante(null);
    }
  }, [modo]);

  const elegirFoto = useCallback((claveFoto: string) => {
    fotoPendiente.current = claveFoto;
    if (archivo.current) {
      archivo.current.value = '';
      archivo.current.click();
    }
  }, []);

  /** Engancha el editor a la página recién cargada en el iframe. */
  const conectar = useCallback(() => {
    const marco = iframe.current;
    const doc = marco?.contentDocument;
    if (!marco || !doc?.body) return;
    const estilo = doc.createElement('style');
    estilo.textContent = ESTILOS_PAGINA;
    doc.head.appendChild(estilo);
    doc.documentElement.classList.toggle('ed-editando', refs.current.modo === 'editar');

    let pendiente = 0;
    const remarcar = () => marcar(doc, refs.current.campos, refs.current.fotosPorSrc);
    new MutationObserver(() => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(remarcar);
    }).observe(doc.body, { childList: true, subtree: true, characterData: true });
    remarcar();

    const aPantalla = (r: DOMRect) => {
      const f = marco.getBoundingClientRect();
      const s = refs.current.escala;
      return { x: f.left + r.left * s, y: f.top + r.top * s, ancho: r.width * s, alto: r.height * s };
    };

    doc.addEventListener(
      'click',
      (e) => {
        if (refs.current.modo !== 'editar') {
          const enlace = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
          if (enlace && !enlace.href.startsWith(location.origin)) {
            e.preventDefault();
            avisar('Los enlaces a otras webs (WhatsApp, Instagram…) se abren en la web publicada.');
          }
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const t = textoEn(doc, e.clientX, e.clientY, refs.current.campos);
        if (t) {
          const rutas = refs.current.campos.get(t.texto)!;
          const p = aPantalla(t.elemento.getBoundingClientRect());
          setFotoFlotante(null);
          setEdicion({
            rutas,
            valor: String(leer(refs.current.borrador, rutas[0]) ?? ''),
            x: p.x,
            y: p.y + p.alto,
            ancho: p.ancho,
          });
          return;
        }
        const foto = fotoEn(doc, e.clientX, e.clientY);
        if (foto) elegirFoto(foto.getAttribute('data-ed-foto')!);
      },
      true,
    );
    doc.addEventListener(
      'submit',
      (e) => {
        if (refs.current.modo !== 'editar') return;
        e.preventDefault();
        e.stopPropagation();
      },
      true,
    );
    doc.addEventListener('mousemove', (e) => {
      if (refs.current.modo !== 'editar') return;
      const foto = textoEn(doc, e.clientX, e.clientY, refs.current.campos) ? null : fotoEn(doc, e.clientX, e.clientY);
      if (!foto) return setFotoFlotante((f) => (f ? null : f));
      const p = aPantalla(foto.getBoundingClientRect());
      const claveFoto = foto.getAttribute('data-ed-foto')!;
      const x = Math.round(Math.max(p.x, marco.getBoundingClientRect().left) + 14);
      const y = Math.round(Math.max(p.y, marco.getBoundingClientRect().top) + 14);
      setFotoFlotante((f) => (f && f.clave === claveFoto && f.x === x && f.y === y ? f : { clave: claveFoto, x, y }));
    });
    doc.addEventListener('scroll', () => setFotoFlotante(null), { passive: true });
  }, [avisar, elegirFoto]);

  // ---------- Tamaño de la vista previa ----------
  useEffect(() => {
    const el = lienzoRef.current;
    if (!el) return;
    const medir = () => setLienzo({ ancho: el.clientWidth, alto: el.clientHeight });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [acceso]);

  const marcoVista = useMemo(() => {
    const alto = Math.max(lienzo.alto - 24, 320);
    if (pagina.email) return { ancho: Math.min(640, lienzo.ancho - 24), alto, escala: 1 };
    if (dispositivo === 'movil') return { ancho: Math.min(ANCHO_MOVIL, lienzo.ancho - 24), alto, escala: 1 };
    const escala = Math.min(1, (lienzo.ancho - 24) / ANCHO_ORDENADOR);
    return { ancho: ANCHO_ORDENADOR, alto: alto / escala, escala };
  }, [lienzo, dispositivo, pagina.email]);
  refs.current.escala = marcoVista.escala;

  // El email se vuelve a pintar entero: con una pequeña espera para no parpadear al escribir.
  const [htmlEmailVista, setHtmlEmailVista] = useState(() => documentoEmail(vista, tipoEmail));
  useEffect(() => {
    if (!pagina.email) return;
    const t = window.setTimeout(() => setHtmlEmailVista(documentoEmail(vista, tipoEmail)), 250);
    return () => window.clearTimeout(t);
  }, [vista, tipoEmail, pagina.email]);

  const src = pagina.ruta
    ? pagina.ruta + (pagina.pasos !== undefined ? `?paso=${paso}` : '')
    : undefined;

  // ---------- Cambios ----------
  const cambiar = useCallback((rutas: Ruta[], valor: unknown) => {
    setBorrador((b) => rutas.reduce((c, r) => conValor(c, r, valor), b));
  }, []);

  const quitarDeLista = (ruta: Ruta) => {
    const lista = leer(borrador, ruta.slice(0, -1)) as string[];
    cambiar([ruta.slice(0, -1)], lista.filter((_, i) => i !== ruta[ruta.length - 1]));
  };
  const anadirALista = (ruta: Ruta) => {
    const lista = leer(borrador, ruta.slice(0, -1)) as string[];
    cambiar([ruta.slice(0, -1)], [...lista, 'Texto nuevo']);
  };

  const alElegirArchivo = async () => {
    const f = archivo.current?.files?.[0];
    const claveFoto = fotoPendiente.current;
    if (!f || !claveFoto) return;
    try {
      const datos = await reducirFoto(f);
      cambiar([['fotos', claveFoto]], datos);
      avisar('Foto cambiada. Se sube a la web al publicar.');
    } catch {
      avisar('No se ha podido abrir esa foto. Prueba con otra (JPG o PNG).');
    }
  };

  // ---------- Publicar ----------
  const publicar = async (forzar = false) => {
    setPublicacion({ estado: 'publicando', paso: 'Preparando…' });
    try {
      const contenido = structuredClone(borrador);
      const subidas: { ruta: string; sha: string }[] = [];
      const locales = new Map(fotosLocales);
      for (const [k, v] of Object.entries(contenido.fotos ?? {})) {
        if (!esFotoNueva(v)) continue;
        setPublicacion({ estado: 'publicando', paso: `Subiendo la foto «${nombreDe(borrador, 'fotos', k)[0]}»…` });
        const r = await api.foto(clave, k, v.slice(v.indexOf(',') + 1));
        subidas.push(r);
        contenido.fotos![k] = r.ruta;
        locales.set(r.ruta, v);
      }
      setPublicacion({ estado: 'publicando', paso: 'Publicando…' });
      const r = await api.publicar(clave, { contenido, base, fotos: subidas, forzar });
      setFotosLocales(locales);
      setPublicado(r.contenido);
      setBorrador(r.contenido);
      setBase(r.sha);
      setShaPublicado(r.sha);
      almacen.quitar(claveBorrador);
      setPublicacion(r.sinCambios ? { estado: 'en-web' } : { estado: 'esperando', contenido: r.contenido });
    } catch (e) {
      const err = e instanceof ErrorApi ? e : new ErrorApi('desconocido', 'Algo ha fallado. Inténtalo de nuevo.');
      if (err.codigo === 'clave') {
        almacen.quitar(claveAcceso);
        setAcceso('pedir');
      }
      setPublicacion({ estado: 'error', mensaje: err.message, detalles: err.detalles, conflicto: err.codigo === 'conflicto' });
    }
  };

  // Después de publicar: espera a que la web sirva la versión nueva (Vercel tarda 1-2 minutos).
  useEffect(() => {
    if (publicacion.estado !== 'esperando') return;
    const objetivo = JSON.stringify(publicacion.contenido);
    const inicio = Date.now();
    const t = window.setInterval(async () => {
      try {
        const res = await fetch(`/contenido.json?v=${Date.now()}`, { cache: 'no-store' });
        if (res.ok && JSON.stringify(await res.json()) === objetivo) {
          setPublicacion({ estado: 'en-web' });
          setFotosLocales(new Map());
          return;
        }
      } catch {
        // seguimos esperando
      }
      if (Date.now() - inicio > 6 * 60_000) {
        setPublicacion({
          estado: 'error',
          mensaje: 'La web está tardando más de lo normal en actualizarse. Mírala en unos minutos; si no cambia, avisa a Alejandro.',
        });
      }
    }, 5000);
    return () => window.clearInterval(t);
  }, [publicacion]);

  const cargarVersionPublicada = async () => {
    try {
      await cargarPublicado(clave, true);
      setPublicacion({ estado: 'nada' });
      setPanel(null);
      avisar('Cargada la versión publicada.');
    } catch (e) {
      avisar(e instanceof ErrorApi ? e.message : 'No se ha podido cargar.');
    }
  };

  // ---------- Pantalla de acceso ----------
  if (acceso === 'comprobando') return <div className="ed ed-entrada"><p>Abriendo el editor…</p></div>;
  if (acceso === 'pedir') {
    return (
      <Entrada
        nombre={nombre}
        error={errorAcceso}
        onEntrar={entrar}
        onSoloVer={() => {
          setErrorAcceso('');
          setAcceso('solo-ver');
        }}
      />
    );
  }

  const soloVer = acceso === 'solo-ver';
  const etiquetaCambios = cambios.length === 1 ? '1 cambio sin publicar' : `${cambios.length} cambios sin publicar`;

  return (
    <div className={`ed ${panel && panel !== 'publicar' ? 'ed-con-panel' : ''}`}>
      <header className="ed-barra">
        <div className="ed-titulo">
          <strong>Editor</strong>
          <span>{nombre}</span>
        </div>
        <label className="ed-pagina">
          <span className="ed-oculto">Página</span>
          <select
            value={iPagina}
            onChange={(e) => {
              setIPagina(Number(e.target.value));
              setPaso(0);
              setEdicion(null);
              setFotoFlotante(null);
            }}
          >
            {paginas.map((p, i) => (
              <option key={p.nombre} value={i}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        <span className={`ed-estado ${cambios.length ? 'ed-estado-pendiente' : ''}`}>
          {soloVer ? 'Solo vista previa' : cambios.length ? etiquetaCambios : 'Todo publicado'}
        </span>
        <span className="ed-hueco" />
        <div className="ed-herramientas">
          {!pagina.email && (
            <div className="ed-grupo ed-dispositivo" role="group" aria-label="Tamaño de pantalla">
              <button type="button" aria-pressed={dispositivo === 'movil'} onClick={() => setDispositivo('movil')}>
                Móvil
              </button>
              <button type="button" aria-pressed={dispositivo === 'ordenador'} onClick={() => setDispositivo('ordenador')}>
                Ordenador
              </button>
            </div>
          )}
          <button
            type="button"
            className="ed-btn"
            aria-pressed={modo === 'ver'}
            onClick={() => setModo((m) => (m === 'editar' ? 'ver' : 'editar'))}
            title="Para navegar por la página como lo haría una visita"
          >
            {modo === 'editar' ? (
              <>
                <span className="ed-largo">Probar como visita</span>
                <span className="ed-corto">Probar</span>
              </>
            ) : (
              'Volver a editar'
            )}
          </button>
          <button type="button" className="ed-btn" aria-pressed={panel === 'diseno'} onClick={() => setPanel(panel === 'diseno' ? null : 'diseno')}>
            Diseño
          </button>
          <button type="button" className="ed-btn" aria-pressed={panel === 'textos'} onClick={() => setPanel(panel === 'textos' ? null : 'textos')}>
            Textos
          </button>
          {!soloVer && (
            <button type="button" className="ed-btn" aria-pressed={panel === 'versiones'} onClick={() => setPanel(panel === 'versiones' ? null : 'versiones')}>
              Versiones
            </button>
          )}
        </div>
        <button
          type="button"
          className="ed-btn ed-principal ed-publicar"
          disabled={soloVer || (!cambios.length && publicacion.estado !== 'esperando')}
          onClick={() => setPanel('publicar')}
        >
          Publicar
        </button>
      </header>

      {(pagina.pasos !== undefined || pagina.email) && (
        <div className="ed-subbarra">
          {pagina.pasos !== undefined && (
            <>
              <button type="button" className="ed-btn" disabled={paso === 0} onClick={() => setPaso((p) => (p === 'fin' ? pagina.pasos! - 1 : Math.max(0, p - 1)))}>
                ← Anterior
              </button>
              <span>{paso === 'fin' ? 'Pantalla final (después de enviar)' : `Pantalla ${paso + 1} de ${pagina.pasos}`}</span>
              <button
                type="button"
                className="ed-btn"
                disabled={paso === 'fin'}
                onClick={() => setPaso((p) => (p === 'fin' ? p : p + 1 >= pagina.pasos! ? 'fin' : p + 1))}
              >
                Siguiente →
              </button>
            </>
          )}
          {pagina.email && (
            <div className="ed-grupo" role="group" aria-label="Email">
              <button type="button" aria-pressed={tipoEmail === 'webinar'} onClick={() => setTipoEmail('webinar')}>
                Email del webinar
              </button>
              <button type="button" aria-pressed={tipoEmail === 'recordatorio'} onClick={() => setTipoEmail('recordatorio')}>
                Recordatorio (24 h)
              </button>
            </div>
          )}
        </div>
      )}

      {(ayuda || sinBorradorLocal || (borradorGuardado.current && cambios.length > 0 && publicacion.estado === 'nada')) && (
        <div className="ed-avisos">
          {ayuda && (
            <p className="ed-nota">
              <span>
                <b>Toca cualquier texto para cambiarlo.</b> Colores, letras, fotos y vídeo, en <b>Diseño</b>. Nada se
                cambia en la web hasta que pulses <b>Publicar</b>.
              </span>
              <button
                type="button"
                className="ed-btn"
                onClick={() => {
                  setAyuda(false);
                  almacen.poner('editor_ayuda_vista', true);
                }}
              >
                Entendido
              </button>
            </p>
          )}
          {sinBorradorLocal && (
            <p className="ed-nota ed-nota-aviso">
              Este navegador no puede guardar tus cambios (las fotos ocupan mucho): publica antes de cerrar la página.
            </p>
          )}
        </div>
      )}

      <main className="ed-lienzo" ref={lienzoRef}>
        <div
          className={`ed-marco ed-marco-${pagina.email ? 'email' : dispositivo}`}
          style={{ width: marcoVista.ancho * marcoVista.escala, height: marcoVista.alto * marcoVista.escala }}
        >
          <iframe
            key={pagina.email ? `email-${tipoEmail}` : src}
            ref={iframe}
            title={`Vista previa: ${pagina.nombre}`}
            src={src}
            srcDoc={pagina.email ? htmlEmailVista : undefined}
            onLoad={conectar}
            style={{
              width: marcoVista.ancho,
              height: marcoVista.alto,
              transform: marcoVista.escala < 1 ? `scale(${marcoVista.escala})` : undefined,
            }}
          />
        </div>
      </main>

      {fotoFlotante && modo === 'editar' && (
        <button
          type="button"
          className="ed-foto-flotante"
          style={{ left: fotoFlotante.x, top: fotoFlotante.y }}
          onClick={() => elegirFoto(fotoFlotante.clave)}
        >
          Cambiar foto
        </button>
      )}

      {edicion && (
        <Ventanita
          edicion={edicion}
          email={!!pagina.email}
          onGuardar={(valor) => {
            cambiar(edicion.rutas, valor);
            setEdicion(null);
          }}
          onCerrar={() => setEdicion(null)}
        />
      )}

      {panel === 'diseno' && (
        <Lateral titulo="Diseño" onCerrar={() => setPanel(null)}>
          <PanelDiseno contenido={borrador} vista={vista} cambiar={cambiar} elegirFoto={elegirFoto} />
        </Lateral>
      )}
      {panel === 'textos' && (
        <Lateral titulo={`Textos · ${pagina.nombre}`} onCerrar={() => setPanel(null)}>
          <p className="ed-ayuda">
            Todos los textos de esta página, también los que no se ven ahora (mensajes de error, texto de WhatsApp…).
            <br />
            <code>*palabra*</code> = destacada · <code>**texto**</code> = negrita
            {pagina.email && (
              <>
                {' '}
                · <code>{'{nombre}'}</code> = nombre de la persona
              </>
            )}
          </p>
          {pagina.secciones.map((s) => (
            <section key={s} className="ed-seccion">
              <h3>{NOMBRES_SECCION[s] ?? s}</h3>
              {textosDe(borrador, [s]).map(({ ruta, valor }) => {
                const ultimo = ruta[ruta.length - 1];
                const lista = typeof ultimo === 'number' ? (leer(borrador, ruta.slice(0, -1)) as unknown[]) : null;
                const deTextos = lista?.every((x) => typeof x === 'string');
                return (
                  <div key={ruta.join('.')} className="ed-campo">
                    <span className="ed-campo-cab">
                      <span>{etiqueta(ruta)}</span>
                      {deTextos && lista!.length > 1 && (
                        <button type="button" className="ed-mini" onClick={() => quitarDeLista(ruta)}>
                          Quitar
                        </button>
                      )}
                    </span>
                    {esColor(valor) ? (
                      <input type="color" value={valor} onChange={(e) => cambiar([ruta], e.target.value)} aria-label={etiqueta(ruta)} />
                    ) : (
                      <AreaTexto valor={valor} onCambio={(v) => cambiar([ruta], v)} etiqueta={etiqueta(ruta)} />
                    )}
                    {deTextos && ultimo === lista!.length - 1 && (
                      <button type="button" className="ed-mini ed-anadir" onClick={() => anadirALista(ruta)}>
                        + Añadir
                      </button>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </Lateral>
      )}
      {panel === 'versiones' && (
        <Lateral titulo="Versiones publicadas" onCerrar={() => setPanel(null)}>
          <PanelVersiones
            clave={clave}
            onRecuperar={(c) => {
              setBorrador({ ...c, _etiquetas: publicado._etiquetas });
              setPanel(null);
              avisar('Versión cargada. Revísala y pulsa Publicar para dejarla en la web.');
            }}
          />
        </Lateral>
      )}
      {panel === 'publicar' && (
        <Dialogo onCerrar={publicacion.estado === 'publicando' ? undefined : () => setPanel(null)}>
          <PanelPublicar
            cambios={cambios}
            publicacion={publicacion}
            rutaWeb={pagina.ruta ?? '/'}
            onPublicar={publicar}
            onDescartar={() => {
              setBorrador(structuredClone(publicado));
              setBase(shaPublicado);
              setPanel(null);
              avisar('Cambios descartados.');
            }}
            onCargarPublicada={cargarVersionPublicada}
            onCerrar={() => {
              if (publicacion.estado !== 'esperando') setPublicacion({ estado: 'nada' });
              setPanel(null);
            }}
          />
        </Dialogo>
      )}

      <input ref={archivo} type="file" accept="image/*" hidden onChange={alElegirArchivo} />
      {aviso && (
        <div className="ed-toast" role="status">
          {aviso}
        </div>
      )}
      {publicacion.estado === 'esperando' && panel !== 'publicar' && (
        <button type="button" className="ed-toast ed-toast-boton" onClick={() => setPanel('publicar')}>
          Publicando… la web se actualiza en 1-2 minutos
        </button>
      )}
    </div>
  );
}

// ---------- Piezas ----------

function Entrada({
  nombre,
  error,
  onEntrar,
  onSoloVer,
}: {
  nombre: string;
  error: string;
  onEntrar: (clave: string) => Promise<void>;
  onSoloVer: () => void;
}) {
  const [clave, setClave] = useState('');
  const [entrando, setEntrando] = useState(false);
  return (
    <div className="ed ed-entrada">
      <form
        className="ed-tarjeta"
        onSubmit={async (e) => {
          e.preventDefault();
          setEntrando(true);
          await onEntrar(clave.trim());
          setEntrando(false);
        }}
      >
        <h1>Editor de la web de {nombre}</h1>
        <p>Cambia textos, colores, letras y fotos de tus páginas y publícalos tú misma.</p>
        <label className="ed-campo">
          <span>Contraseña del editor</span>
          <input type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} required autoFocus />
        </label>
        {error && <p className="ed-error">{error}</p>}
        <button type="submit" className="ed-btn ed-principal" disabled={entrando || !clave.trim()}>
          {entrando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="ed-enlace" onClick={onSoloVer}>
          Solo mirar (sin publicar)
        </button>
      </form>
    </div>
  );
}

function AreaTexto({ valor, onCambio, etiqueta }: { valor: string; onCambio: (v: string) => void; etiqueta: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [valor]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={valor}
      aria-label={etiqueta}
      onChange={(e) => onCambio(e.target.value.replace(/\s*\n\s*/g, ' '))}
    />
  );
}

function Ventanita({
  edicion,
  email,
  onGuardar,
  onCerrar,
}: {
  edicion: Edicion;
  email: boolean;
  onGuardar: (valor: string) => void;
  onCerrar: () => void;
}) {
  const [valor, setValor] = useState(edicion.valor);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const guardar = () => {
    const limpio = valor.replace(/\s*\n\s*/g, ' ').trim();
    if (limpio && limpio !== edicion.valor) onGuardar(limpio);
    else onCerrar();
  };
  const estrecho = window.innerWidth < 720;
  const ancho = Math.min(Math.max(edicion.ancho + 24, 340), window.innerWidth - 24);
  const estilo = estrecho
    ? undefined
    : {
        width: ancho,
        left: Math.max(12, Math.min(edicion.x - 12, window.innerWidth - ancho - 12)),
        top: Math.max(70, Math.min(edicion.y + 10, window.innerHeight - 240)),
      };
  return (
    <>
      <div className="ed-velo" onClick={guardar} />
      <div className={`ed-ventanita ${estrecho ? 'ed-ventanita-abajo' : ''}`} style={estilo} role="dialog" aria-label="Cambiar texto">
        {edicion.rutas.length > 1 && (
          <p className="ed-ayuda">Este texto aparece {edicion.rutas.length} veces en la página: se cambia en todas.</p>
        )}
        <textarea
          ref={ref}
          value={valor}
          rows={3}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              guardar();
            }
            if (e.key === 'Escape') onCerrar();
          }}
        />
        <div className="ed-ventanita-pie">
          <small>
            <code>*palabra*</code> destacada · <code>**texto**</code> negrita
            {email && (
              <>
                {' '}
                · <code>{'{nombre}'}</code> nombre
              </>
            )}
          </small>
          <span>
            <button type="button" className="ed-btn" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="button" className="ed-btn ed-principal" onClick={guardar}>
              Hecho
            </button>
          </span>
        </div>
      </div>
    </>
  );
}

function Lateral({ titulo, onCerrar, children }: { titulo: string; onCerrar: () => void; children: ReactNode }) {
  return (
    <aside className="ed-lateral" aria-label={titulo}>
      <div className="ed-lateral-cab">
        <h2>{titulo}</h2>
        <button type="button" className="ed-btn" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
      {children}
    </aside>
  );
}

function Dialogo({ onCerrar, children }: { onCerrar?: () => void; children: ReactNode }) {
  return (
    <div className="ed-fondo-dialogo" onClick={(e) => e.target === e.currentTarget && onCerrar?.()}>
      <div className="ed-dialogo" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

function PanelDiseno({
  contenido,
  vista,
  cambiar,
  elegirFoto,
}: {
  contenido: Contenido;
  vista: Contenido;
  cambiar: (rutas: Ruta[], valor: unknown) => void;
  elegirFoto: (clave: string) => void;
}) {
  const colores = contenido.colores ?? {};
  const fuentes = contenido.fuentes ?? {};
  const fotos = vista.fotos ?? {};
  const campos = (etiquetas(contenido).campos ?? {}) as Record<string, string>;
  const url = urlFuentes(fuentes);
  return (
    <>
      {url && <link rel="stylesheet" href={url} />}
      {Object.keys(colores).length > 0 && (
        <section className="ed-seccion">
          <h3>Colores</h3>
          {Object.entries(colores).map(([k, v]) => {
            const [nombre, detalle] = nombreDe(contenido, 'colores', k);
            return (
              <label key={k} className="ed-color">
                <input type="color" value={v} onChange={(e) => cambiar([['colores', k]], e.target.value)} />
                <span>
                  {nombre}
                  {detalle && <small>{detalle}</small>}
                </span>
                <code>{v}</code>
              </label>
            );
          })}
        </section>
      )}
      {Object.keys(fuentes).length > 0 && (
        <section className="ed-seccion">
          <h3>Letras</h3>
          {Object.entries(fuentes).map(([k, v]) => (
            <label key={k} className="ed-campo">
              <span>{nombreDe(contenido, 'fuentes', k)[0]}</span>
              <select value={v} onChange={(e) => cambiar([['fuentes', k]], e.target.value)}>
                <optgroup label="Sin remate (modernas)">
                  {FUENTES.filter((f) => f.tipo === 'sans').map((f) => (
                    <option key={f.nombre}>{f.nombre}</option>
                  ))}
                </optgroup>
                <optgroup label="Con remate (clásicas)">
                  {FUENTES.filter((f) => f.tipo === 'serif').map((f) => (
                    <option key={f.nombre}>{f.nombre}</option>
                  ))}
                </optgroup>
              </select>
              <span className="ed-muestra" style={{ fontFamily: pilaFuente(v), fontWeight: k === 'titulo' ? 300 : 400 }}>
                Otra manera de ganarse la vida
              </span>
            </label>
          ))}
        </section>
      )}
      {Object.keys(fotos).length > 0 && (
        <section className="ed-seccion">
          <h3>Fotos</h3>
          <div className="ed-fotos">
            {Object.entries(fotos).map(([k, v]) => (
              <button key={k} type="button" onClick={() => elegirFoto(k)} aria-label={`Cambiar foto: ${nombreDe(contenido, 'fotos', k)[0]}`}>
                <img src={v} alt="" />
                <span>{nombreDe(contenido, 'fotos', k)[0]}</span>
              </button>
            ))}
          </div>
          <p className="ed-ayuda">Toca una foto para cambiarla (también puedes tocarla en la página).</p>
        </section>
      )}
      {Object.keys(campos).length > 0 && (
        <section className="ed-seccion">
          <h3>Enlaces</h3>
          {Object.entries(campos).map(([ruta, nombre]) => (
            <label key={ruta} className="ed-campo">
              <span>{nombre}</span>
              <input
                value={String(leer(contenido, ruta.split('.')) ?? '')}
                onChange={(e) => cambiar([ruta.split('.')], e.target.value.trim())}
                inputMode={ruta.endsWith('whatsapp') ? 'numeric' : 'url'}
              />
            </label>
          ))}
        </section>
      )}
    </>
  );
}

function PanelVersiones({ clave, onRecuperar }: { clave: string; onRecuperar: (c: Contenido) => void }) {
  const [versiones, setVersiones] = useState<Version[] | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState('');
  useEffect(() => {
    api
      .versiones(clave)
      .then((r) => setVersiones(r.versiones))
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No se han podido cargar.'));
  }, [clave]);
  if (error) return <p className="ed-error">{error}</p>;
  if (!versiones) return <p className="ed-ayuda">Cargando…</p>;
  return (
    <>
      <p className="ed-ayuda">
        Cada vez que se publica queda una versión. Si algo no te gusta, recupera una anterior y vuelve a publicar.
      </p>
      <ul className="ed-versiones">
        {versiones.map((v, i) => (
          <li key={v.sha}>
            <span>
              {fecha.format(new Date(v.fecha))}
              {i === 0 && <em> · la que está en la web</em>}
              <small>{v.mensaje}</small>
            </span>
            {i > 0 && (
              <button
                type="button"
                className="ed-btn"
                disabled={!!cargando}
                onClick={async () => {
                  setCargando(v.sha);
                  try {
                    onRecuperar((await api.version(clave, v.sha)).contenido);
                  } catch (e) {
                    setError(e instanceof ErrorApi ? e.message : 'No se ha podido cargar.');
                  }
                  setCargando('');
                }}
              >
                {cargando === v.sha ? 'Cargando…' : 'Recuperar'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function PanelPublicar({
  cambios,
  publicacion,
  rutaWeb,
  onPublicar,
  onDescartar,
  onCargarPublicada,
  onCerrar,
}: {
  cambios: Ruta[];
  publicacion: Publicacion;
  rutaWeb: string;
  onPublicar: (forzar?: boolean) => void;
  onDescartar: () => void;
  onCargarPublicada: () => void;
  onCerrar: () => void;
}) {
  if (publicacion.estado === 'publicando') {
    return (
      <>
        <h2>Publicando…</h2>
        <p>{publicacion.paso}</p>
      </>
    );
  }
  if (publicacion.estado === 'esperando') {
    return (
      <>
        <h2>¡Publicado!</h2>
        <p>La web se está actualizando: tarda 1-2 minutos. Puedes cerrar esto y seguir editando; te avisamos aquí.</p>
        <div className="ed-acciones">
          <button type="button" className="ed-btn ed-principal" onClick={onCerrar}>
            Seguir editando
          </button>
        </div>
      </>
    );
  }
  if (publicacion.estado === 'en-web') {
    return (
      <>
        <h2>✓ Ya está en la web</h2>
        <p>Tus cambios ya se ven en la web publicada. Si no los ves, recarga la página.</p>
        <div className="ed-acciones">
          <a className="ed-btn" href={rutaWeb} target="_blank" rel="noopener">
            Ver la web
          </a>
          <button type="button" className="ed-btn ed-principal" onClick={onCerrar}>
            Seguir editando
          </button>
        </div>
      </>
    );
  }
  if (publicacion.estado === 'error') {
    return (
      <>
        <h2>No se ha publicado</h2>
        <p className="ed-error">{publicacion.mensaje}</p>
        {publicacion.detalles && publicacion.detalles.length > 0 && (
          <ul className="ed-detalles">
            {publicacion.detalles.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        {publicacion.conflicto && (
          <p>Puedes publicar tu versión igualmente (sustituye a la otra) o cargar la publicada y perder tus cambios.</p>
        )}
        <div className="ed-acciones">
          {publicacion.conflicto && (
            <button type="button" className="ed-btn" onClick={onCargarPublicada}>
              Cargar la publicada
            </button>
          )}
          <button type="button" className="ed-btn" onClick={onCerrar}>
            Cerrar
          </button>
          <button type="button" className="ed-btn ed-principal" onClick={() => onPublicar(!!publicacion.conflicto)}>
            {publicacion.conflicto ? 'Publicar la mía' : 'Reintentar'}
          </button>
        </div>
      </>
    );
  }
  const nombres = [...new Set(cambios.map((r) => `${NOMBRES_SECCION[r[0] as string] ?? etiquetaGrupo(r)} · ${etiqueta(r)}`))];
  return (
    <>
      <h2>¿Publicar los cambios?</h2>
      <p>Se verán en la web en 1-2 minutos. Siempre puedes volver a una versión anterior desde «Versiones».</p>
      <ul className="ed-detalles">
        {nombres.slice(0, 10).map((n) => (
          <li key={n}>{n}</li>
        ))}
        {nombres.length > 10 && <li>y {nombres.length - 10} más</li>}
      </ul>
      <div className="ed-acciones">
        <button type="button" className="ed-btn ed-peligro" onClick={onDescartar}>
          Descartar cambios
        </button>
        <span className="ed-hueco" />
        <button type="button" className="ed-btn" onClick={onCerrar}>
          Seguir editando
        </button>
        <button type="button" className="ed-btn ed-principal" onClick={() => onPublicar()}>
          Publicar
        </button>
      </div>
    </>
  );
}

const GRUPOS: Record<string, string> = { colores: 'Colores', fuentes: 'Letras', fotos: 'Fotos', enlaces: 'Enlaces' };
const etiquetaGrupo = (r: Ruta) => GRUPOS[r[0] as string] ?? String(r[0]);
