import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { persona } from '../config';
import { cuestionario } from '../cuestionario';
import Enfasis from '../componentes/Enfasis';

// Cuestionario previo al webinar, una pregunta por pantalla. Al terminar guarda el lead
// (/api/lead → hoja de Google), y la hoja le envía el enlace del webinar por email.

const { preguntas } = cuestionario;
const total = preguntas.length;
const num = (i: number) => String(i).padStart(2, '0');
const sinAsteriscos = (t: string) => t.replaceAll('*', '');

const botonLleno =
  'flex min-h-[58px] w-full items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-6 text-[13px] font-bold uppercase leading-[1.15] text-fondo transition hover:bg-[#fff6ea] disabled:opacity-60';
const botonBorde =
  'flex min-h-[58px] w-full items-center justify-between gap-4 rounded-[22.5px] border px-6 text-left text-[13px] font-bold uppercase leading-[1.15] transition hover:bg-[rgba(255,237,215,.06)]';
const campo =
  'w-full rounded-[18px] border border-[color:var(--form-borde)] bg-transparent px-4 py-3 text-base text-inherit outline-none placeholder:text-[color:var(--form-placeholder)] focus:border-texto';

function nuevoId() {
  return (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36))
    .replaceAll('-', '')
    .slice(0, 12);
}

type Estado = 'respondiendo' | 'enviando' | 'error' | 'enviado';

export default function Cuestionario() {
  const [params] = useSearchParams();
  const origen = ['cuestionario', params.get('o')].filter(Boolean).join('-');
  // 0 = portada, 1..total = preguntas, total + 1 = datos de contacto
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [estado, setEstado] = useState<Estado>('respondiendo');
  const [id] = useState(nuevoId);

  const responder = (i: number, valor: string) => setRespuestas((r) => ({ ...r, [i]: valor }));
  const siguiente = () => setPaso((p) => Math.min(p + 1, total + 1));
  const atras = () => setPaso((p) => Math.max(p - 1, 0));

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    setEstado('enviando');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datos,
          id,
          persona: persona.id,
          origen,
          consentimiento: datos.consentimiento === 'on',
          respuestas: Object.fromEntries(preguntas.map((p, i) => [sinAsteriscos(p.texto), respuestas[i + 1] ?? ''])),
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

  const pregunta = paso >= 1 && paso <= total ? preguntas[paso - 1] : undefined;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[560px] flex-col px-[18px]">
      <div className="flex items-center justify-between pb-4 pt-[18px] text-xs font-bold uppercase leading-none">
        {paso > 0 && estado !== 'enviado' ? (
          <button type="button" onClick={atras} className="uppercase">
            ← Atrás
          </button>
        ) : (
          <Link to="/" className="no-underline">
            {persona.nombre}
          </Link>
        )}
        <span className="text-secundario">
          {estado === 'enviado' ? 'Hecho' : paso === 0 ? 'Webinar gratuito' : paso <= total ? `${num(paso)} / ${num(total)}` : 'Último paso'}
        </span>
      </div>
      <div className="h-[2px] bg-[color:var(--form-borde)]" aria-hidden="true">
        <div
          className="h-full bg-acento transition-[width] duration-300"
          style={{ width: `${estado === 'enviado' ? 100 : (paso / (total + 1)) * 100}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col justify-center py-10">
        {estado === 'enviado' ? (
          <section>
            <h1 className="text-[clamp(2rem,9vw,3.2rem)] font-bold leading-[0.92]">
              <Enfasis texto={cuestionario.gracias.titulo} />
            </h1>
            <p className="mt-5 font-medium leading-relaxed text-secundario">{cuestionario.gracias.texto}</p>
            <Link to={`/webinar?l=${id}`} className={`${botonLleno} mt-8 no-underline`}>
              <span>{cuestionario.gracias.boton}</span>
              <span className="text-[11px] opacity-60">→</span>
            </Link>
          </section>
        ) : paso === 0 ? (
          <section>
            <h1 className="text-[clamp(2.2rem,10vw,3.6rem)] font-bold leading-[0.9] [text-wrap:balance]">
              <Enfasis texto={cuestionario.titulo} />
            </h1>
            <p className="mt-5 font-medium leading-relaxed text-secundario">{cuestionario.entradilla}</p>
            <button type="button" onClick={siguiente} className={`${botonLleno} mt-8`}>
              <span>{cuestionario.boton}</span>
              <span className="text-[11px] opacity-60">→</span>
            </button>
          </section>
        ) : pregunta ? (
          <section key={paso}>
            <h1 className="text-[clamp(1.8rem,8vw,2.8rem)] font-bold leading-[0.95]">
              <Enfasis texto={pregunta.texto} />
            </h1>
            {pregunta.ayuda && <p className="mt-4 font-medium text-secundario">{pregunta.ayuda}</p>}
            {pregunta.tipo === 'opciones' ? (
              <div className="mt-8 flex flex-col gap-3" role="radiogroup">
                {pregunta.opciones?.map((o, i) => {
                  const elegida = respuestas[paso] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      role="radio"
                      aria-checked={elegida}
                      onClick={() => {
                        responder(paso, o);
                        setTimeout(siguiente, 180);
                      }}
                      className={`${botonBorde} ${elegida ? 'border-texto bg-[rgba(255,237,215,.08)]' : 'border-[color:var(--form-borde)]'}`}
                    >
                      <span>{o}</span>
                      <span className="flex-none text-[11px] text-secundario">{String.fromCharCode(65 + i)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <form
                className="mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  siguiente();
                }}
              >
                <textarea
                  rows={3}
                  className={campo}
                  value={respuestas[paso] ?? ''}
                  onChange={(e) => responder(paso, e.target.value)}
                  required={!pregunta.opcional}
                  placeholder="Escribe aquí tu respuesta"
                  autoFocus
                />
                <button type="submit" className={`${botonLleno} mt-4`}>
                  <span>Siguiente</span>
                  <span className="text-[11px] opacity-60">→</span>
                </button>
              </form>
            )}
          </section>
        ) : (
          <section>
            <h1 className="text-[clamp(1.8rem,8vw,2.8rem)] font-bold leading-[0.95]">
              <Enfasis texto={cuestionario.datos.titulo} />
            </h1>
            <p className="mt-4 font-medium leading-relaxed text-secundario">{cuestionario.datos.texto}</p>
            <form onSubmit={enviar} className="mt-8 space-y-3">
              <input name="nombre" required placeholder="Nombre" className={campo} autoComplete="given-name" />
              <input name="email" type="email" required placeholder="Email" className={campo} autoComplete="email" />
              <input name="telefono" type="tel" required placeholder="WhatsApp (con prefijo, p. ej. +34)" className={campo} autoComplete="tel" />
              {/* Campo trampa para bots: las personas no lo ven */}
              <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="flex items-start gap-3 pt-2 text-sm leading-snug text-secundario">
                <input name="consentimiento" type="checkbox" required className="mt-[3px] accent-[var(--color-texto)]" />
                <span>
                  Acepto la{' '}
                  <Link to="/privacidad" className="underline">
                    política de privacidad
                  </Link>{' '}
                  y que {persona.nombre} me envíe el webinar y me contacte sobre este proyecto.
                </span>
              </label>
              <button type="submit" disabled={estado === 'enviando'} className={`${botonLleno} !mt-6`}>
                <span>{estado === 'enviando' ? 'Enviando…' : cuestionario.datos.boton}</span>
                <span className="text-[11px] opacity-60">→</span>
              </button>
              {estado === 'error' && (
                <p className="text-center text-sm text-[color:var(--color-error)]">
                  No se ha podido enviar. Revisa tu conexión e inténtalo de nuevo.
                </p>
              )}
            </form>
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
