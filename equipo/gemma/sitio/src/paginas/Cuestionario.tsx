import { Fragment, useState, type ButtonHTMLAttributes, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { embudo, persona } from '../config';
import { cuestionario, type Campo, type Paso } from '../cuestionario';
import Enfasis from '../componentes/Enfasis';

// Cuestionario previo al webinar, una pantalla por paso (cuestionario.ts). Al enviar guarda el
// lead (/api/lead → hoja de Google), y la hoja le envía el enlace del webinar por email.
// Estilos: embudo.css.

const { pasos } = cuestionario;
// Pasos que cuentan en "03 / 08": todo menos las pantallas de solo texto
const numerados = pasos.map((p, i) => (p.tipo === 'info' ? 0 : pasos.slice(0, i + 1).filter((q) => q.tipo !== 'info').length));
const totalNumerados = Math.max(...numerados);
const num = (i: number) => String(i).padStart(2, '0');
const sinAsteriscos = (t: string) => t.replaceAll('*', '');

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
        i % 2 ? <b key={i}>{parte}</b> : <Fragment key={i}>{parte}</Fragment>,
      )}
    </>
  );
}

function Parrafos({ textos, lista }: { textos?: string[]; lista?: string[] }) {
  return (
    <>
      {textos?.map((t) => (
        <p key={t} className="e-texto">
          <Rico texto={t} />
        </p>
      ))}
      {lista && (
        <ul className="e-lista">
          {lista.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function Boton({ texto, ...props }: { texto: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="btn btn-oscuro e-boton">
      <span>{texto}</span>
      <span className="flecha" aria-hidden="true">→</span>
    </button>
  );
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
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [datos, setDatos] = useState<Record<Campo, string>>({ nombre: '', instagram: '', telefono: '', email: '' });
  const [estado, setEstado] = useState<Estado>('respondiendo');
  const [id] = useState(nuevoId);

  const paso: Paso = pasos[i];
  const siguiente = () => setI((n) => Math.min(n + 1, pasos.length - 1));
  const atras = () => setI((n) => Math.max(n - 1, 0));

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setEstado('enviando');
    const preguntas = pasos.flatMap((p, n) =>
      p.tipo === 'opciones' || p.tipo === 'texto' ? [[sinAsteriscos(p.texto), respuestas[n] ?? '']] : [],
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
    <div className="e-cuestionario">
      <div className="e-barra">
        {i > 0 && estado !== 'enviado' ? (
          <button type="button" onClick={atras} className="kicker">
            ← Atrás
          </button>
        ) : (
          <Link to="/l/instagram" className="marca">
            {embudo.nombreCompleto.toUpperCase()}
          </Link>
        )}
        <span className="kicker">
          {estado === 'enviado' ? 'Hecho' : numerados[i] ? `${num(numerados[i])} / ${num(totalNumerados)}` : 'Webinar gratuito'}
        </span>
      </div>
      <div className="e-progreso" aria-hidden="true">
        <div style={{ width: `${estado === 'enviado' ? 100 : (i / pasos.length) * 100}%` }} />
      </div>

      <main className="e-paso">
        {estado === 'enviado' ? (
          <section>
            <h1 className="display e-titulo">
              <Enfasis texto={cuestionario.gracias.titulo} />
            </h1>
            <p className="e-texto">{cuestionario.gracias.texto}</p>
            <div className="e-botones">
              <Link to={`/webinar?l=${id}`} className="btn btn-oscuro e-boton">
                <span>{cuestionario.gracias.boton}</span>
                <span className="flecha" aria-hidden="true">↗</span>
              </Link>
              {persona.whatsapp && (
                <a
                  href={`https://wa.me/${persona.whatsapp}?text=${encodeURIComponent(cuestionario.gracias.mensajeWhatsapp)}`}
                  target="_blank"
                  rel="noopener"
                  onClick={() => avisarClic(id)}
                  className="btn btn-claro e-boton"
                >
                  <span>{cuestionario.gracias.whatsapp}</span>
                  <span className="flecha" aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </section>
        ) : paso.tipo === 'info' ? (
          <section key={i}>
            <h1 className="display e-titulo">
              <Enfasis texto={paso.titulo} />
            </h1>
            <Parrafos textos={paso.parrafos} lista={paso.lista} />
            <Parrafos textos={paso.cierre} />
            <div className="e-botones">
              <Boton type="button" onClick={siguiente} texto={paso.boton} />
            </div>
          </section>
        ) : paso.tipo === 'campo' ? (
          <section key={i}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                siguiente();
              }}
            >
              <label htmlFor={`campo-${paso.campo}`} className="display e-titulo">
                <Enfasis texto={paso.texto} />
              </label>
              {paso.ayuda && <p className="e-texto">{paso.ayuda}</p>}
              <input
                id={`campo-${paso.campo}`}
                {...tipoCampo[paso.campo]}
                required={!paso.opcional}
                placeholder={paso.placeholder}
                value={datos[paso.campo]}
                onChange={(e) => setDatos((d) => ({ ...d, [paso.campo]: e.target.value }))}
                className="e-campo"
                autoFocus
              />
              <div className="e-botones">
                <Boton type="submit" texto="Siguiente" />
              </div>
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
              <label htmlFor="respuesta" className="display e-titulo">
                <Enfasis texto={paso.texto} />
              </label>
              {paso.ayuda && <p className="e-texto">{paso.ayuda}</p>}
              <textarea
                id="respuesta"
                rows={3}
                className="e-campo"
                value={respuestas[i] ?? ''}
                onChange={(e) => setRespuestas((r) => ({ ...r, [i]: e.target.value }))}
                required={!paso.opcional}
                placeholder="Escribe aquí tu respuesta"
                autoFocus
              />
              <div className="e-botones">
                <Boton type="submit" texto="Siguiente" />
              </div>
            </form>
          </section>
        ) : (
          <section key={i}>
            <Parrafos textos={paso.antes} lista={paso.lista} />
            <Parrafos textos={paso.despues} />
            <h1 className={`display e-titulo ${paso.antes ? 'e-separado' : ''}`}>
              <Enfasis texto={paso.texto} />
            </h1>
            <div className="e-opciones" role="radiogroup">
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
                    className="e-opcion"
                  >
                    <span>{o}</span>
                    <span className="e-letra">{String.fromCharCode(65 + n)}</span>
                  </button>
                );
              })}
            </div>
            {paso.final && (
              <form onSubmit={enviar} className="e-envio">
                {/* Campo trampa para bots: las personas no lo ven */}
                <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <label className="e-consentimiento">
                  <input name="consentimiento" type="checkbox" required />
                  <span>
                    Acepto la <Link to="/privacidad">política de privacidad</Link> y que {persona.nombre} me envíe el
                    webinar y me contacte sobre este proyecto.
                  </span>
                </label>
                <Boton
                  type="submit"
                  disabled={!respuestas[i] || estado === 'enviando'}
                  texto={estado === 'enviando' ? 'Enviando…' : cuestionario.boton}
                />
                {estado === 'error' && (
                  <p className="e-error">No se ha podido enviar. Revisa tu conexión e inténtalo de nuevo.</p>
                )}
              </form>
            )}
          </section>
        )}
      </main>

      <footer className="e-aviso">
        Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada
        persona.
      </footer>
    </div>
  );
}
