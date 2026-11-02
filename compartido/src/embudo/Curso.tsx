import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PieLegal } from '../Legal';
import { enEditor } from '../puente';
import { useEmbudo } from './contexto';
import Enfasis from './Enfasis';
import { Reproductor } from './VideoWebinar';
import { leccionesObligatorias, type Bloque, type Cifras, type Curso as DatosCurso, type Leccion } from './tiposCurso';

// Curso privado (/curso). El lead entra con su email y la contraseña que le envía el CRM ("Dar acceso al curso");
// /api/curso la comprueba en la hoja y devuelve las lecciones (comunes: compartido/curso/curso.json). Cada
// persona pone sus textos, su bienvenida y su vídeo en contenido.json → curso y enlaces.curso (editor → Curso).
// Estructura y guiones: estrategia/curso.md.
//
// En el editor: ?paso=0 es la pantalla de acceso y ?paso=fin el curso por dentro, con las cifras pendientes a la
// vista (solo para el equipo) gracias a la contraseña del editor.

const CLAVE_SESION = 'curso_sesion';
const CLAVE_HECHAS = 'curso_hechas';
const PORCENTAJE_VISTA = 80;

const botonLleno =
  'flex min-h-[58px] w-full items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-6 text-[13px] font-bold uppercase leading-[1.15] text-fondo no-underline transition hover:bg-[color:var(--color-texto-hover)] disabled:opacity-50';
const botonBorde =
  'flex min-h-[52px] items-center justify-between gap-4 rounded-[36px] border border-[color:var(--form-borde)] px-5 text-[12px] font-bold uppercase leading-[1.15] no-underline transition hover:bg-[color:var(--tinte-hover)]';
const campo =
  'w-full rounded-[18px] border border-[color:var(--form-borde)] bg-transparent px-4 py-3 text-base text-inherit outline-none placeholder:text-[color:var(--form-placeholder)] focus:border-texto';
const etiqueta = 'text-[11px] font-bold uppercase text-acento';
const parrafo = 'font-medium leading-relaxed text-secundario';

// useGrouping 'always': "2.120 €" (en español, por defecto, los números de 4 cifras van sin punto)
const euros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  useGrouping: 'always',
} as unknown as Intl.NumberFormatOptions);
const num = (n: number) => String(n).padStart(2, '0');

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
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    } catch {
      // sin almacenamiento: la sesión dura lo que la pestaña
    }
  },
};

async function api(cuerpo: object): Promise<{ estado: number; datos: Record<string, unknown> }> {
  try {
    const res = await fetch('/api/curso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    return { estado: res.status, datos: ((await res.json().catch(() => ({}))) as Record<string, unknown>) ?? {} };
  } catch {
    return { estado: 0, datos: {} };
  }
}

type Fase =
  | { fase: 'cargando' }
  | { fase: 'acceso' }
  | { fase: 'dentro'; curso: DatosCurso; nombre: string; token: string };

export default function Curso() {
  const { persona, contenido } = useEmbudo();
  const t = contenido.curso;
  const [params, setParams] = useSearchParams();
  const editor = enEditor();
  const [fase, setFase] = useState<Fase>({ fase: 'cargando' });
  const [hechas, setHechas] = useState<string[]>(() => (editor ? [] : (almacen.leer<string[]>(CLAVE_HECHAS) ?? [])));
  const [avisoEditor, setAvisoEditor] = useState('');

  // Al abrir: en el editor, la pantalla que toque; si no, la sesión guardada o la pantalla de acceso.
  useEffect(() => {
    let vivo = true;
    (async () => {
      if (editor) {
        if (params.get('paso') !== 'fin') return setFase({ fase: 'acceso' });
        const clave = almacen.leer<string>(`editor_clave_${persona.id}`) ?? '';
        const r = await api({ accion: 'vista', clave });
        if (!vivo) return;
        if (r.datos.ok && r.datos.curso) {
          return setFase({ fase: 'dentro', curso: r.datos.curso as DatosCurso, nombre: String(r.datos.nombre), token: '' });
        }
        setAvisoEditor('Para ver el curso por dentro, la web tiene que estar publicada y tú, dentro del editor con tu contraseña.');
        return setFase({ fase: 'acceso' });
      }
      const sesion = almacen.leer<{ token: string }>(CLAVE_SESION);
      if (!sesion?.token) return setFase({ fase: 'acceso' });
      const r = await api({ accion: 'curso', token: sesion.token });
      if (!vivo) return;
      if (r.datos.ok && r.datos.curso) {
        setFase({ fase: 'dentro', curso: r.datos.curso as DatosCurso, nombre: String(r.datos.nombre ?? ''), token: sesion.token });
      } else {
        if (r.estado === 401) almacen.poner(CLAVE_SESION, null);
        setFase({ fase: 'acceso' });
      }
    })();
    return () => {
      vivo = false;
    };
    // Solo al abrir la página (y al cambiar de pantalla en el editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor ? params.get('paso') : '']);

  const entrar = useCallback(
    async (email: string, contrasena: string): Promise<'ok' | 'acceso' | 'tecnico'> => {
      const r = await api({ accion: 'entrar', email, contrasena, persona: persona.id });
      if (!r.datos.ok || !r.datos.curso) return r.estado === 400 || r.estado === 401 ? 'acceso' : 'tecnico';
      const token = String(r.datos.token);
      const deLaHoja = Array.isArray(r.datos.hechas) ? (r.datos.hechas as string[]) : [];
      almacen.poner(CLAVE_SESION, { token });
      almacen.poner(CLAVE_HECHAS, deLaHoja);
      setHechas(deLaHoja);
      setFase({ fase: 'dentro', curso: r.datos.curso as DatosCurso, nombre: String(r.datos.nombre ?? ''), token });
      return 'ok';
    },
    [persona.id],
  );

  const salir = () => {
    almacen.poner(CLAVE_SESION, null);
    almacen.poner(CLAVE_HECHAS, null);
    setHechas([]);
    setParams({});
    setFase({ fase: 'acceso' });
  };

  return (
    <>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-[18px] pt-[18px] text-xs font-bold uppercase sm:px-8">
        <Link to="/" className="no-underline">
          {contenido.general.marca}
        </Link>
        <span className="flex items-center gap-4 text-secundario">
          <span>{t.barra}</span>
          {fase.fase === 'dentro' && !editor && (
            <button type="button" onClick={salir} className="font-bold uppercase underline-offset-4 hover:underline">
              {t.salir}
            </button>
          )}
        </span>
      </div>

      {fase.fase === 'cargando' ? (
        <main className="mx-auto min-h-[60vh] max-w-6xl px-[18px] pt-20 sm:px-8" aria-busy="true" />
      ) : fase.fase === 'acceso' ? (
        <Acceso entrar={entrar} avisoEditor={avisoEditor} />
      ) : (
        <Dentro
          curso={fase.curso}
          nombre={fase.nombre}
          token={fase.token}
          hechas={hechas}
          setHechas={setHechas}
          params={params}
          setParams={setParams}
        />
      )}

      <p className="mx-auto mt-6 max-w-6xl px-[18px] text-[11px] font-medium uppercase leading-relaxed text-secundario sm:px-8">
        {t.aviso}
      </p>
      <PieLegal persona={persona} />
    </>
  );
}

// ---------- Acceso ----------

function Acceso({
  entrar,
  avisoEditor,
}: {
  entrar: (email: string, contrasena: string) => Promise<'ok' | 'acceso' | 'tecnico'>;
  avisoEditor: string;
}) {
  const { persona, contenido } = useEmbudo();
  const t = contenido.curso;
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [estado, setEstado] = useState<'nada' | 'entrando' | 'acceso' | 'tecnico'>('nada');
  const olvido = persona.whatsapp ? `https://wa.me/${persona.whatsapp}?text=${encodeURIComponent(t.mensajeOlvido)}` : '';

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (enEditor()) return;
    setEstado('entrando');
    const r = await entrar(email.trim(), contrasena.trim());
    if (r !== 'ok') setEstado(r);
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-[18px] pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <header>
        <p className={`mb-3 ${etiqueta}`}>{t.accesoEtiqueta}</p>
        <h1 className="text-[clamp(2.2rem,8vw,4.2rem)] font-bold leading-[0.9] [text-wrap:balance]">
          <Enfasis texto={t.accesoTitulo} />
        </h1>
        <p className={`mt-6 max-w-xl sm:text-lg ${parrafo}`}>{t.accesoTexto}</p>
        {avisoEditor && <p className="mt-6 max-w-xl text-sm font-bold text-acento">{avisoEditor}</p>}
      </header>
      <form onSubmit={enviar} className="space-y-4 lg:pt-6">
        <label className="block">
          <span className={`mb-2 block ${etiqueta}`}>{t.campoEmail}</span>
          <input
            type="email"
            required
            autoComplete="email"
            className={campo}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={`mb-2 block ${etiqueta}`}>{t.campoContrasena}</span>
          <input
            type="text"
            required
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={campo}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </label>
        <button type="submit" className={`${botonLleno} mt-2`} disabled={estado === 'entrando'}>
          <span>{estado === 'entrando' ? t.entrando : t.boton}</span>
          <span className="text-[11px] opacity-60">→</span>
        </button>
        {(estado === 'acceso' || estado === 'tecnico') && (
          <p className="text-sm font-semibold text-[color:var(--color-error)]" role="alert">
            {estado === 'acceso' ? t.errorAcceso : t.errorTecnico}
          </p>
        )}
        {olvido ? (
          <a href={olvido} target="_blank" rel="noopener" className="block pt-2 text-sm font-medium text-secundario underline">
            {t.olvido}
          </a>
        ) : (
          <p className="pt-2 text-sm font-medium text-secundario">{t.olvido}</p>
        )}
      </form>
    </main>
  );
}

// ---------- Dentro del curso ----------

interface PropsDentro {
  curso: DatosCurso;
  nombre: string;
  token: string;
  hechas: string[];
  setHechas: (h: string[]) => void;
  params: URLSearchParams;
  setParams: (p: URLSearchParams) => void;
}

function Dentro({ curso, nombre, token, hechas, setHechas, params, setParams }: PropsDentro) {
  const { contenido } = useEmbudo();
  const t = contenido.curso;
  const todas = useMemo(
    () => curso.modulos.flatMap((m, im) => m.lecciones.map((l, il) => ({ leccion: l, modulo: m, numero: `${im + 1}.${il + 1}` }))),
    [curso],
  );
  const obligatorias = useMemo(() => leccionesObligatorias(curso).map((l) => l.id), [curso]);
  const vistas = obligatorias.filter((id) => hechas.includes(id)).length;
  const actual = todas.findIndex((x) => x.leccion.id === params.get('leccion'));

  // Lección vista: se guarda aquí y se apunta en la hoja (en el editor no se apunta nada).
  const hechasRef = useRef(hechas);
  hechasRef.current = hechas;
  const marcar = useCallback(
    (id: string) => {
      if (hechasRef.current.includes(id)) return;
      const nuevas = [...hechasRef.current, id];
      setHechas(nuevas);
      if (!token) return;
      almacen.poner(CLAVE_HECHAS, nuevas);
      void api({ accion: 'progreso', token, leccion: id, hechas: nuevas });
    },
    [token, setHechas],
  );

  const ir = (id: string | null) => {
    const p = new URLSearchParams(params);
    if (id) p.set('leccion', id);
    else p.delete('leccion');
    setParams(p);
    window.scrollTo({ top: 0 });
  };

  if (actual === -1) {
    const siguiente = todas.find((x) => !x.leccion.opcional && !hechas.includes(x.leccion.id)) ?? todas[0];
    return (
      <main className="mx-auto max-w-6xl px-[18px] sm:px-8">
        <header className="pb-10 pt-14 sm:pt-20">
          <p className={`mb-3 ${etiqueta}`}>{t.etiqueta}</p>
          {nombre && <p className="mb-3 text-lg font-bold">{t.saludo.replace('{nombre}', nombre)}</p>}
          <h1 className="max-w-4xl text-[clamp(2.2rem,8vw,4.6rem)] font-bold leading-[0.9] [text-wrap:balance]">
            <Enfasis texto={t.titulo} />
          </h1>
          <p className={`mt-6 max-w-2xl sm:text-lg ${parrafo}`}>{t.texto}</p>
        </header>

        <Progreso vistas={vistas} total={obligatorias.length} texto={t.progreso} />
        {siguiente && (
          <button type="button" className={`${botonLleno} mt-8 sm:max-w-md`} onClick={() => ir(siguiente.leccion.id)}>
            <span>{vistas ? t.seguir : t.empezar}</span>
            <span className="text-[11px] opacity-60">→</span>
          </button>
        )}

        <hr className="my-14 border-0 border-t border-dashed border-linea" />

        <div className="space-y-12 pb-10">
          {curso.modulos.map((m, im) => (
            <section key={m.id}>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase text-acento">
                <span>{num(im + 1)}</span>
                <span className="h-px w-8 bg-acento" aria-hidden="true" />
                <span>{m.titulo}</span>
              </p>
              <ul className="divide-y divide-dashed divide-[color:var(--color-linea)] border-y border-dashed border-linea">
                {m.lecciones.map((l, il) => {
                  const hecha = hechas.includes(l.id);
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => ir(l.id)}
                        className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-[color:var(--tinte-hover)]"
                      >
                        <span className="w-10 flex-none text-[11px] font-bold text-secundario">
                          {im + 1}.{il + 1}
                        </span>
                        <span className="flex-1 font-bold leading-snug">{l.titulo}</span>
                        <span className="flex-none text-[11px] font-bold uppercase text-secundario">
                          {hecha ? `✓ ${t.hecha}` : l.duracion}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
    );
  }

  const { leccion, modulo, numero } = todas[actual];
  const anterior = todas[actual - 1];
  const siguiente = todas[actual + 1];
  return (
    <main className="mx-auto max-w-4xl px-[18px] sm:px-8">
      <button type="button" onClick={() => ir(null)} className="mt-10 text-[11px] font-bold uppercase text-secundario hover:underline">
        ← {t.todas}
      </button>
      <LeccionVista
        key={leccion.id}
        leccion={leccion}
        etiquetaModulo={`${numero} · ${modulo.titulo}`}
        curso={curso}
        token={token}
        marcar={marcar}
      />
      <nav className="mt-14 grid gap-3 pb-6 sm:grid-cols-2">
        {anterior ? (
          <button type="button" className={botonBorde} onClick={() => ir(anterior.leccion.id)}>
            <span className="text-[11px] opacity-60">←</span>
            <span className="flex-1 text-right">{t.anterior}</span>
          </button>
        ) : (
          <span />
        )}
        {siguiente ? (
          <button
            type="button"
            className={botonLleno}
            onClick={() => {
              marcar(leccion.id);
              ir(siguiente.leccion.id);
            }}
          >
            <span>{t.siguiente}</span>
            <span className="text-[11px] opacity-60">→</span>
          </button>
        ) : (
          <button type="button" className={botonLleno} onClick={() => (marcar(leccion.id), ir(null))}>
            <span>{t.todas}</span>
            <span className="text-[11px] opacity-60">→</span>
          </button>
        )}
      </nav>
    </main>
  );
}

function Progreso({ vistas, total, texto }: { vistas: number; total: number; texto: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] font-bold uppercase text-secundario">
      <span className="flex-none">
        {vistas} / {total} {texto}
      </span>
      <div className="h-[2px] flex-1 bg-[color:var(--form-borde)]" aria-hidden="true">
        <div className="h-full bg-acento transition-[width] duration-500" style={{ width: `${total ? (vistas / total) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

function LeccionVista({
  leccion,
  etiquetaModulo,
  curso,
  token,
  marcar,
}: {
  leccion: Leccion;
  etiquetaModulo: string;
  curso: DatosCurso;
  token: string;
  marcar: (id: string) => void;
}) {
  const { persona, contenido } = useEmbudo();
  const t = contenido.curso;
  const video = leccion.tipo === 'bienvenida' ? contenido.enlaces.curso.trim() : leccion.video.trim();
  const texto = leccion.tipo === 'bienvenida' ? t.bienvenidaTexto : leccion.texto;

  // El final cuenta como visto al llegar; las demás, al ver casi todo el vídeo o al pasar a la siguiente.
  useEffect(() => {
    if (leccion.tipo === 'final') marcar(leccion.id);
  }, [leccion, marcar]);
  const onProgreso = useCallback(
    (p: number) => {
      if (p >= PORCENTAJE_VISTA) marcar(leccion.id);
    },
    [leccion.id, marcar],
  );

  const whatsapp = persona.whatsapp ? `https://wa.me/${persona.whatsapp}?text=${encodeURIComponent(t.mensajeWhatsapp)}` : '';

  return (
    <article>
      <header className="pb-8 pt-6">
        <p className={`mb-3 ${etiqueta}`}>{etiquetaModulo}</p>
        <h1 className="text-[clamp(2rem,7vw,3.6rem)] font-bold leading-[0.95] [text-wrap:balance]">
          {leccion.tipo === 'final' ? <Enfasis texto={t.finalTitulo} /> : leccion.titulo}
        </h1>
      </header>

      {video ? (
        <Reproductor url={video} titulo={leccion.titulo} onProgreso={onProgreso} />
      ) : leccion.tipo === undefined && !leccion.opcional ? (
        <p className="rounded-[18px] border border-dashed border-linea px-5 py-4 text-sm font-semibold text-secundario">
          {t.enPreparacion}
        </p>
      ) : null}

      <div className="mt-4 max-w-2xl sm:text-lg">
        <Texto lineas={texto} />
        {leccion.tipo === 'final' && <p className={`mt-4 ${parrafo}`}>{t.finalTexto}</p>}
      </div>

      {leccion.bloques?.map((b, i) => (
        <div key={i} className="mt-10">
          <BloqueVista bloque={b} cifras={curso.cifras} />
        </div>
      ))}

      {leccion.tipo === 'final' && whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener"
          onClick={() => {
            if (token) void api({ accion: 'whatsapp', token });
          }}
          className={`${botonLleno} mt-10 sm:max-w-md`}
        >
          <span>{t.finalBoton}</span>
          <span className="text-[11px] opacity-60">→</span>
        </a>
      )}
    </article>
  );
}

// ---------- Textos y bloques ----------

function Rico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/\*\*([^*]+)\*\*/).map((parte, i) =>
        i % 2 ? (
          <b key={i} className="font-bold text-texto">
            {parte}
          </b>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}

/** Párrafos; las líneas seguidas que empiezan por '- ' forman una lista. */
function Texto({ lineas }: { lineas: string[] }) {
  const grupos: (string | string[])[] = [];
  for (const l of lineas) {
    const ultimo = grupos[grupos.length - 1];
    if (l.startsWith('- ')) {
      if (Array.isArray(ultimo)) ultimo.push(l.slice(2));
      else grupos.push([l.slice(2)]);
    } else grupos.push(l);
  }
  return (
    <>
      {grupos.map((g, i) =>
        Array.isArray(g) ? (
          <ul key={i} className="mt-4 space-y-2">
            {g.map((x, j) => (
              <li key={j} className={`flex gap-3 ${parrafo}`}>
                <span className="text-acento" aria-hidden="true">
                  —
                </span>
                <span>
                  <Rico texto={x} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className={`mt-4 ${parrafo}`}>
            <Rico texto={g} />
          </p>
        ),
      )}
    </>
  );
}

function Nota({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[18px] border border-dashed border-linea px-5 py-4 text-sm font-semibold leading-relaxed text-secundario">
      {children}
    </p>
  );
}

/** Solo en el editor: estas cifras aún no las ve el lead. */
function Pendiente({ visible }: { visible: boolean }) {
  if (!visible || !enEditor()) return null;
  return (
    <p className="mb-3 rounded-[12px] bg-acento px-4 py-2 text-xs font-bold text-fondo">
      Solo lo ves tú, en el editor: cifras pendientes de confirmar o de aprobar. El lead todavía no las ve (estrategia/curso.md).
    </p>
  );
}

function Tabla({ columnas, filas }: { columnas: string[]; filas: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-[18px] border border-[color:var(--form-borde)]">
      <table className={`w-full border-collapse text-left text-sm ${columnas.length > 3 ? 'min-w-[560px]' : ''}`}>
        <thead>
          <tr className="border-b border-[color:var(--form-borde)]">
            {columnas.map((c) => (
              <th key={c} className="px-4 py-3 text-[11px] font-bold uppercase text-acento">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className="border-b border-dashed border-linea last:border-0">
              {f.map((c, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-bold' : 'font-medium text-secundario'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BloqueVista({ bloque, cifras }: { bloque: Bloque; cifras: Cifras }) {
  const comisiones = cifras.paquetes.some((p) => p.precio !== null && p.comisionInicial !== null);
  switch (bloque.tipo) {
    case 'rangos':
      return cifras.rangos.length ? (
        <>
          <Pendiente visible={!cifras.confirmadas} />
          <Tabla
            columnas={['Rango', 'Ventas acumuladas', 'Puntos por venta']}
            filas={cifras.rangos.map((r) => [r.rango, r.ventas, String(r.puntos)])}
          />
        </>
      ) : (
        <Nota>{cifras.sinRangos}</Nota>
      );

    case 'paquetes': {
      const conPrecio = cifras.paquetes.some((p) => p.precio !== null);
      const conRango = cifras.paquetes.some((p) => p.rango);
      const filas = cifras.paquetes.map((p) => [
        p.nombre,
        p.incluye,
        ...(conRango ? [p.rango] : []),
        ...(conPrecio
          ? [
              p.precio === null ? '—' : euros.format(p.precio),
              p.precio === null ? '—' : euros.format(p.precio * (1 + cifras.iva / 100)),
            ]
          : []),
      ]);
      return (
        <>
          <Pendiente visible={(conPrecio || conRango) && !cifras.confirmadas} />
          <Tabla
            columnas={['Opción', 'Qué incluye', ...(conRango ? ['Empiezas en'] : []), ...(conPrecio ? ['Precio sin IVA', `Con IVA (${cifras.iva} %)`] : [])]}
            filas={filas}
          />
          {!conPrecio && (
            <div className="mt-4">
              <Nota>{cifras.sinPrecio}</Nota>
            </div>
          )}
        </>
      );
    }

    case 'calculadora':
      return comisiones ? (
        <>
          <Pendiente visible={!(cifras.confirmadas && cifras.comisionesAprobadas)} />
          <Calculadora cifras={cifras} />
        </>
      ) : (
        <Nota>{cifras.sinComisiones}</Nota>
      );

    case 'enlaces':
      return (
        <ul className="space-y-3">
          {bloque.enlaces.map((e) => (
            <li key={e.url}>
              <a href={e.url} target="_blank" rel="noopener" className={botonBorde}>
                <span>{e.texto}</span>
                <span className="text-[11px] opacity-60">↗</span>
              </a>
            </li>
          ))}
        </ul>
      );
  }
}

/** ¿En qué venta recuperas la inversión? Suma la comisión de tu compra y la de cada venta del mismo paquete. */
function Calculadora({ cifras }: { cifras: Cifras }) {
  const opciones = cifras.paquetes.filter((p) => p.precio !== null && p.comisionInicial !== null);
  const [id, setId] = useState(opciones[0]?.id ?? '');
  const [conIva, setConIva] = useState(true);
  const p = opciones.find((x) => x.id === id) ?? opciones[0];
  if (!p || p.precio === null || p.comisionInicial === null) return null;

  const inversion = Math.round(p.precio * (conIva ? 1 + cifras.iva / 100 : 1));
  let acumulado = 0;
  let recuperada = -1;
  const filas = [p.comisionInicial, ...p.comisiones].map((comision, i) => {
    acumulado += comision;
    if (recuperada === -1 && acumulado >= inversion) recuperada = i;
    return [i === 0 ? 'Tu propia compra' : `Venta ${i}`, euros.format(comision), euros.format(acumulado)];
  });

  return (
    <div className="rounded-[22.5px] border border-[color:var(--form-borde)] p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
        <label className="block">
          <span className={`mb-2 block ${etiqueta}`}>Con qué empiezas</span>
          <select className={campo} value={p.id} onChange={(e) => setId(e.target.value)}>
            {opciones.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 pb-3 text-sm font-semibold text-secundario">
          <input type="checkbox" checked={conIva} onChange={(e) => setConIva(e.target.checked)} className="accent-[var(--color-texto)]" />
          Contar el IVA ({cifras.iva} %): como particular no lo recuperas
        </label>
      </div>

      <p className="mt-6 text-lg font-bold">
        Inversión: {euros.format(inversion)} · empiezas en {p.rango}
      </p>
      <div className="mt-4">
        <Tabla columnas={['', 'Comisión', 'Acumulado']} filas={filas.map((f, i) => (i === recuperada ? f.map((c, j) => <b key={j}>{c}</b>) : f))} />
      </div>
      <p className="mt-4 text-lg font-bold">
        {recuperada > 0
          ? `Se recupera lo invertido en la venta ${recuperada}, si cada persona elige lo mismo que tú.`
          : `Con las ${p.comisiones.length} ventas de la tabla todavía no se recupera lo invertido.`}
      </p>
      <p className="mt-4 text-sm font-semibold leading-relaxed text-secundario">{cifras.aviso}</p>
      {cifras.fuente && <p className="mt-2 text-xs font-medium text-secundario">{cifras.fuente}</p>}
    </div>
  );
}
