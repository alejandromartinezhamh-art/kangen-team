import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ConfigPersona } from './tipos';

interface Props {
  persona: ConfigPersona;
  /** Landing o sección desde la que llega el lead, p. ej. "inicio" o "campana-octubre" */
  origen: string;
  textoBoton?: string;
  /** Campos que se envían sin que se vean, p. ej. el id del lead que llega desde el email */
  extra?: Record<string, string>;
}

type Estado = 'inicial' | 'enviando' | 'ok' | 'error';

// El aspecto se adapta a cada web con variables CSS opcionales (--form-*, --boton-*) en su index.css.
const tarjeta =
  'rounded-[var(--form-radio,1rem)] border border-[color:var(--form-borde,rgba(0,0,0,.08))] bg-[var(--form-fondo,rgba(255,255,255,.8))] p-6 sm:p-8';
const campo =
  'w-full rounded-[var(--campo-radio,0.75rem)] border border-[color:var(--form-borde,rgba(0,0,0,.1))] bg-[var(--form-campo,#fff)] px-4 py-3 text-inherit outline-none placeholder:text-[color:var(--form-placeholder,#9ca3af)] focus:border-[color:var(--color-primario)]';

export function Formulario({ persona, origen, textoBoton = 'Quiero más información', extra }: Props) {
  const [estado, setEstado] = useState<Estado>('inicial');

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
          ...extra,
          persona: persona.id,
          origen,
          consentimiento: datos.consentimiento === 'on',
        }),
      });
      setEstado(res.ok ? 'ok' : 'error');
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'ok') {
    return (
      <div className={`${tarjeta} text-center`}>
        <p className="text-xl font-semibold">¡Gracias! 🙌</p>
        <p className="mt-2 opacity-80">Te escribo en menos de 24 horas para que lo hablemos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className={`${tarjeta} space-y-4`}>
      <input name="nombre" required placeholder="Nombre" className={campo} autoComplete="name" />
      <input name="email" type="email" required placeholder="Email" className={campo} autoComplete="email" />
      <input name="telefono" type="tel" required placeholder="Teléfono (WhatsApp)" className={campo} autoComplete="tel" />
      <textarea name="mensaje" rows={3} placeholder="¿Qué te gustaría cambiar en tu día a día? (opcional)" className={campo} />
      {/* Campo trampa para bots: las personas no lo ven */}
      <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm opacity-80">
        <input name="consentimiento" type="checkbox" required className="mt-1 accent-[var(--color-primario)]" />
        <span>
          Acepto la <Link to="/privacidad" className="underline">política de privacidad</Link> y que{' '}
          {persona.nombre} me contacte sobre esta propuesta.
        </span>
      </label>
      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full rounded-[var(--boton-radio,0.75rem)] bg-[var(--boton-fondo,var(--color-primario))] px-6 py-4 font-semibold text-[color:var(--boton-texto,#fff)] [text-transform:var(--boton-mayusculas,none)] transition hover:opacity-90 disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : textoBoton}
      </button>
      {estado === 'error' && (
        <p className="text-center text-sm text-[color:var(--color-error,#dc2626)]">
          No se ha podido enviar. Inténtalo de nuevo o escríbeme a {persona.email}.
        </p>
      )}
    </form>
  );
}
