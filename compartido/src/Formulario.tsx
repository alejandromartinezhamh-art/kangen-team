import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ConfigPersona } from './tipos';

interface Props {
  persona: ConfigPersona;
  /** Landing o sección desde la que llega el lead, p. ej. "inicio" o "campana-octubre" */
  origen: string;
  textoBoton?: string;
}

type Estado = 'inicial' | 'enviando' | 'ok' | 'error';

export function Formulario({ persona, origen, textoBoton = 'Quiero más información' }: Props) {
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
      <div className="rounded-2xl bg-white/80 p-8 text-center shadow-sm">
        <p className="text-xl font-semibold">¡Gracias! 🙌</p>
        <p className="mt-2 opacity-80">Te escribo en menos de 24 horas para que lo hablemos.</p>
      </div>
    );
  }

  const campo =
    'w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[var(--color-primario)]';

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-2xl bg-white/80 p-6 shadow-sm sm:p-8">
      <input name="nombre" required placeholder="Nombre" className={campo} autoComplete="name" />
      <input name="email" type="email" required placeholder="Email" className={campo} autoComplete="email" />
      <input name="telefono" type="tel" required placeholder="Teléfono (WhatsApp)" className={campo} autoComplete="tel" />
      <textarea name="mensaje" rows={3} placeholder="¿Qué te gustaría cambiar en tu día a día? (opcional)" className={campo} />
      {/* Campo trampa para bots: las personas no lo ven */}
      <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm opacity-80">
        <input name="consentimiento" type="checkbox" required className="mt-1" />
        <span>
          Acepto la <Link to="/privacidad" className="underline">política de privacidad</Link> y que{' '}
          {persona.nombre} me contacte sobre esta propuesta.
        </span>
      </label>
      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full rounded-xl bg-[var(--color-primario)] px-6 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : textoBoton}
      </button>
      {estado === 'error' && (
        <p className="text-center text-sm text-red-600">
          No se ha podido enviar. Inténtalo de nuevo o escríbeme a {persona.email}.
        </p>
      )}
    </form>
  );
}
