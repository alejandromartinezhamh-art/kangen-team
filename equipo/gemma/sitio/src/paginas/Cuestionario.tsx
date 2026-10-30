import { Fragment, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CampoTelefono, enEditor } from '@equipo/compartido';
import { embudo, persona } from '../config';
import { cuestionario, type Campo, type Paso } from '../cuestionario';
import Enfasis from '../componentes/Enfasis';

// Cuestionario previo al webinar, una pantalla por paso (cuestionario.ts). Al enviar guarda el
// lead (/api/lead → hoja de Google), y la hoja le envía el enlace del webinar por email.
// Textos: contenido.json → cuestionario. Mismo diseño que el de Alejandro.

const { pasos } = cuestionario;
// Pasos que cuentan en "03 / 08": todo menos las pantallas de solo texto
const numerados = pasos.map((p, i) => (p.tipo === 'info' ? 0 : pasos.slice(0, i + 1).filter((q) => q.tipo !== 'info').length));
const totalNumerados = Math.max(...numerados);
const num = (i: number) => String(i).padStart(2, '0');
const sinAsteriscos = (t: string) => t.replaceAll('*', '');

const botonLleno =
  'flex min-h-[58px] w-full items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-6 text-[13px] font-bold uppercase leading-[1.15] text-fondo no-underline transition hover:bg-[color:var(--color-texto-hover)] disabled:opacity-50';
const botonBorde =
  'flex min-h-[58px] w-full items-center justify-between gap-4 rounded-[22.5px] border px-6 py-3 text-left text-[13px] font-bold uppercase leading-[1.25] transition hover:bg-[rgba(0,0,0,.05)]';
const campo =
  'w-full rounded-[18px] border border-[color:var(--form-borde)] bg-transparent px-4 py-3 text-base text-inherit outline-none placeholder:text-[color:var(--form-placeholder)] focus:border-texto';
const titular = 'titular text-[clamp(1.9rem,8.5vw,3rem)] font-bold leading-[0.95] [text-wrap:balance]';

const tipoCampo: Record<Campo, { type: string; autoComplete: string; inputMode?: 'tel' | 'email' }> = {
  nombre: { type: 'text', autoComplete: 'name' },
  instagram: { type: 'text', autoComplete: 'off' },
  telefono: { type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
  email: { type: 'email', autoComplete: 'email', inputMode: 'email' },
};

/** Párrafo con **negritas** */
function Rico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/\*\*([^*]+)\*\*/).map((parte, i) =>
        i % 2 ? <b key={i} className="font-bold text-texto">{parte}</b> : <Fragment key={i}>{parte}</Fragment>,
      )}
    </>
  );
}

function Parrafos({ textos, lista }: { textos?: string[]; lista?: string[] }) {
  return (
    <>
      {textos?.map((t) => (
        <p key={t} className="mt-4 font-medium leading-relaxed text-secundario">
          <Rico texto={t} />
        </p>
      ))}
      {lista && (
        <ul className="mt-4 space-y-2">
          {lista.map((t) => (
            <li key={t} className="flex gap-3 font-medium leading-relaxed text-secundario">
              <span className="text-acento" aria-hidden="true">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** En el editor, ?paso=3 abre directamente ese paso y ?paso=fin la pantalla final. */
function pasoInicial(params: URLSearchParams) {
  if (!enEditor()) return 0;
  const n = Number(params.get('paso'));
  return Number.isInteger(n) && n >= 0 && n < pasos.length ? n : 0;
}

function nuevoId() {
  return (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36))
    .replaceAll('-', '')
    .slice(0, 12);
}

/** Apunta en la hoja que ha pulsado el botón de WhatsApp */
function avisarClic(id: string) {
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: 'evento', evento: 'whatsapp_clic', id, persona: persona.id }),
    keepalive: true,
  }).catch(() => {});
}

type Estado = 'respondiendo' | 'enviando' | 'error' | 'enviado';

export default function Cuestionario() {
  const [params] = useSearchParams();
  const origen = ['cuestionario', params.get('o')].filter(Boolean).join('-');
  const [i, setI] = useState(() => pasoInicial(params));
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [datos, setDatos] = useState<Record<Campo, string>>({ nombre: '', instagram: '', telefono: '', email: '' });
  const [estado, setEstado] = useState<Estado>(() =>
    enEditor() && params.get('paso') === 'fin' ? 'enviado' : 'respondiendo',
  );
  const [id] = useState(nuevoId);

  const paso: Paso = pasos[i];
  const siguiente = () => setI((n) => Math.min(n + 1, pasos.length - 1));
  const atras = () => setI((n) => Math.max(n - 1, 0));

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setEstado('enviando');
    const preguntas = pasos.flatMap((p, n) =>
      p.tipo === 'opciones' || p.tipo === 'texto' ? [[p.columna || sinAsteriscos(p.texto), respuestas[n] ?? '']] : [],
    );
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datos.nombre,
          email: datos.email,
          telefono: datos.telefono,
          web: form.web,
          id,
          persona: persona.id,
          origen,
          consentimiento: form.consentimiento === 'on',
          respuestas: Object.fromEntries([['Instagram', datos.instagram], ...preguntas]),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem('lead_id', id);
      } catch {
        // sin almacenamiento: el enlace del email lleva el id igualmente
      }
      setEstado('enviado');
    } catch {
      setEstado('error');
    }
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[560px] flex-col px-[18px]">
      <div className="flex items-center justify-between pb-4 pt-[18px] text-xs font-bold uppercase leading-none">
        {i > 0 && estado !== 'enviado' ? (
          <button type="button" onClick={atras} className="uppercase">
            {cuestionario.atras}
          </button>
        ) : (
          <Link to="/" className="no-underline">
            {embudo.general.marca}
          </Link>
        )}
        <span className="text-estructura">
          {estado === 'enviado'
            ? cuestionario.gracias.etiqueta
            : numerados[i]
              ? `${num(numerados[i])} / ${num(totalNumerados)}`
              : cuestionario.etiqueta}
        </span>
      </div>
      <div className="h-[2px] bg-[color:var(--form-borde)]" aria-hidden="true">
        <div
          className="h-full bg-acento transition-[width] duration-300"
          style={{ width: `${estado === 'enviado' ? 100 : (i / pasos.length) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col justify-center py-10">
        {estado === 'enviado' ? (
          <section>
            <h1 className={titular}>
              <Enfasis texto={cuestionario.gracias.titulo} />
            </h1>
            <p className="mt-5 font-medium leading-relaxed text-secundario">{cuestionario.gracias.texto}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to={`/webinar?l=${id}`} className={botonLleno}>
                <span>{cuestionario.gracias.boton}</span>
                <span className="text-[11px] opacity-60">→</span>
              </Link>
              {persona.whatsapp && (
                <a
                  href={`https://wa.me/${persona.whatsapp}?text=${encodeURIComponent(cuestionario.gracias.mensajeWhatsapp)}`}
                  target="_blank"
                  rel="noopener"
                  onClick={() => avisarClic(id)}
                  className={`${botonBorde} border-texto no-underline`}
                >
                  <span>{cuestionario.gracias.whatsapp}</span>
                  <span className="text-[11px] text-estructura">→</span>
                </a>
              )}
            </div>
          </section>
        ) : paso.tipo === 'info' ? (
          <section key={i}>
            <h1 className={titular}>
              <Enfasis texto={paso.titulo} />
            </h1>
            <div className="mt-2">
              <Parrafos textos={paso.parrafos} lista={paso.lista} />
              <Parrafos textos={paso.cierre} />
            </div>
            <button type="button" onClick={siguiente} className={`${botonLleno} mt-8`}>
              <span>{paso.boton}</span>
              <span className="text-[11px] opacity-60">→</span>
            </button>
          </section>
        ) : paso.tipo === 'campo' ? (
          <section key={i}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                siguiente();
              }}
            >
              <label htmlFor={`campo-${paso.campo}`} className={`block ${titular}`}>
                <Enfasis texto={paso.texto} />
              </label>
              {paso.ayuda && <p className="mt-4 font-medium leading-relaxed text-secundario">{paso.ayuda}</p>}
              {paso.campo === 'telefono' ? (
                <div className="mt-8">
                  <CampoTelefono
                    id="campo-telefono"
                    required={!paso.opcional}
                    placeholder={paso.placeholder}
                    valor={datos.telefono}
                    onCambio={(telefono) => setDatos((d) => ({ ...d, telefono }))}
                    clase={campo}
                    autoFocus
                  />
                </div>
              ) : (
                <input
                  id={`campo-${paso.campo}`}
                  {...tipoCampo[paso.campo]}
                  required={!paso.opcional}
                  placeholder={paso.placeholder}
                  value={datos[paso.campo]}
                  onChange={(e) => setDatos((d) => ({ ...d, [paso.campo]: e.target.value }))}
                  className={`${campo} mt-8`}
                  autoFocus
                />
              )}
              <button type="submit" className={`${botonLleno} mt-4`}>
                <span>{cuestionario.siguiente}</span>
                <span className="text-[11px] opacity-60">→</span>
              </button>
            </form>
          </section>
        ) : paso.tipo === 'texto' ? (
          <section key={i}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                siguiente();
              }}
            >
              <label htmlFor="respuesta" className={`block ${titular}`}>
                <Enfasis texto={paso.texto} />
              </label>
              {paso.ayuda && <p className="mt-4 font-medium text-secundario">{paso.ayuda}</p>}
              <textarea
                id="respuesta"
                rows={3}
                className={`${campo} mt-8`}
                value={respuestas[i] ?? ''}
                onChange={(e) => setRespuestas((r) => ({ ...r, [i]: e.target.value }))}
                required={!paso.opcional}
                placeholder={cuestionario.placeholderRespuesta}
                autoFocus
              />
              <button type="submit" className={`${botonLleno} mt-4`}>
                <span>{cuestionario.siguiente}</span>
                <span className="text-[11px] opacity-60">→</span>
              </button>
            </form>
          </section>
        ) : (
          <section key={i}>
            <Parrafos textos={paso.antes} lista={paso.lista} />
            <Parrafos textos={paso.despues} />
            <h1 className={`${titular} ${paso.antes ? 'mt-8' : ''}`}>
              <Enfasis texto={paso.texto} />
            </h1>
            <div className="mt-8 flex flex-col gap-3" role="radiogroup">
              {paso.opciones.map((o, n) => {
                const elegida = respuestas[i] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={elegida}
                    onClick={() => {
                      setRespuestas((r) => ({ ...r, [i]: o }));
                      if (!paso.final) setTimeout(siguiente, 180);
                    }}
                    className={`${botonBorde} ${elegida ? 'border-texto bg-[rgba(0,0,0,.04)]' : 'border-[color:var(--form-borde)]'}`}
                  >
                    <span>{o}</span>
                    <span className="flex-none text-[11px] text-estructura">{String.fromCharCode(65 + n)}</span>
                  </button>
                );
              })}
            </div>
            {paso.final && (
              <form onSubmit={enviar} className="mt-6 space-y-4">
                {/* Campo trampa para bots: las personas no lo ven */}
                <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <label className="flex items-start gap-3 text-sm leading-snug text-secundario">
                  <input name="consentimiento" type="checkbox" required className="mt-[3px] accent-[var(--color-texto)]" />
                  <span>
                    Acepto la{' '}
                    <Link to="/privacidad" className="underline">
                      política de privacidad
                    </Link>{' '}
                    y que {persona.nombre} me envíe el webinar y me contacte sobre este proyecto.
                  </span>
                </label>
                <button type="submit" disabled={!respuestas[i] || estado === 'enviando'} className={botonLleno}>
                  <span>{estado === 'enviando' ? cuestionario.enviando : cuestionario.boton}</span>
                  <span className="text-[11px] opacity-60">→</span>
                </button>
                {estado === 'error' && (
                  <p className="text-center text-sm text-[color:var(--color-error)]">{cuestionario.error}</p>
                )}
              </form>
            )}
          </section>
        )}
      </main>

      <footer className="pb-[14px] text-[10px] font-medium uppercase leading-relaxed text-secundario">
        Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada
        persona.
      </footer>
    </div>
  );
}
