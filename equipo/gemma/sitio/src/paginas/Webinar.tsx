import { PieLegal } from '@equipo/compartido';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { embudo, persona, webinar } from '../config';
import VideoWebinar from '../componentes/VideoWebinar';
import Enfasis from '../componentes/Enfasis';

// Página del webinar (el enlace del email). Textos: contenido.json → webinar. Mismo diseño que el de Alejandro.

// Id del lead: llega en el enlace del email (?l=) o se guardó al terminar el cuestionario.
function useIdLead() {
  const [params] = useSearchParams();
  const [id] = useState(() => {
    const deUrl = params.get('l') ?? '';
    if (/^[a-z0-9]{6,40}$/i.test(deUrl)) return deUrl;
    try {
      return localStorage.getItem('lead_id') ?? '';
    } catch {
      return '';
    }
  });
  return id;
}

/** Apunta un evento del lead en la hoja (abrir el webinar, verlo, pulsar WhatsApp). */
function evento(id: string, nombre: string) {
  if (!id) return;
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: 'evento', evento: nombre, id, persona: persona.id }),
    keepalive: true,
  }).catch(() => {});
}

const CLAVE_VISTO = 'webinar_visto';
const { porcentajeWhatsapp } = embudo;

export default function Webinar() {
  const id = useIdLead();
  const hayVideo = Boolean(webinar().trim());
  const [visto, setVisto] = useState(0);
  // Sin vídeo todavía, el botón sale desde el principio; con vídeo, al llegar al porcentaje (o si ya lo vio antes).
  const [desbloqueado, setDesbloqueado] = useState(() => {
    if (!hayVideo) return true;
    try {
      return localStorage.getItem(CLAVE_VISTO) === '1';
    } catch {
      return false;
    }
  });
  const avisado = useRef(desbloqueado);

  // Apunta en la hoja que ha abierto el webinar (para el recordatorio y para saber a quién escribir).
  useEffect(() => evento(id, 'webinar_abierto'), [id]);

  const onProgreso = useCallback(
    (p: number) => {
      setVisto(p);
      if (p < porcentajeWhatsapp || avisado.current) return;
      avisado.current = true;
      setDesbloqueado(true);
      try {
        localStorage.setItem(CLAVE_VISTO, '1');
      } catch {
        // sin almacenamiento: la próxima vez tendrá que llegar otra vez al porcentaje
      }
      evento(id, 'webinar_visto');
    },
    [id],
  );

  const t = embudo.webinar;
  const whatsapp = persona.whatsapp
    ? `https://wa.me/${persona.whatsapp}?text=${encodeURIComponent(t.mensajeWhatsapp)}`
    : '';

  return (
    <>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-[18px] pt-[18px] text-xs font-bold uppercase sm:px-8">
        <Link to="/" className="no-underline">{embudo.general.marca}</Link>
        <span className="text-secundario">{t.barra}</span>
      </div>

      <header className="mx-auto max-w-6xl px-[18px] pb-10 pt-14 sm:px-8 sm:pt-20">
        <p className="mb-3 text-[11px] font-bold uppercase text-acento">{t.etiqueta}</p>
        <h1 className="max-w-4xl text-[clamp(2.2rem,8vw,4.6rem)] font-bold leading-[0.9]">
          <Enfasis texto={t.titulo} />
        </h1>
        <p className="mt-6 max-w-2xl font-medium leading-relaxed text-secundario sm:text-lg">{t.texto}</p>
      </header>

      <main className="mx-auto max-w-6xl px-[18px] sm:px-8">
        <VideoWebinar onProgreso={hayVideo ? onProgreso : undefined} />

        {hayVideo && !desbloqueado && (
          <div className="mt-4 flex items-center gap-4 text-[11px] font-bold uppercase text-secundario">
            <span className="flex-none">
              {t.visto} {visto} %
            </span>
            <div className="h-[2px] flex-1 bg-[color:var(--form-borde)]" aria-hidden="true">
              <div className="h-full bg-acento transition-[width] duration-500" style={{ width: `${visto}%` }} />
            </div>
          </div>
        )}

        <hr className="my-16 border-0 border-t border-dashed border-linea sm:my-24" />

        <section className="grid gap-10 pb-20 lg:grid-cols-[1fr_1.2fr] lg:items-start sm:pb-28">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase text-acento">
              <span>01</span>
              <span className="h-px w-8 bg-acento" aria-hidden="true" />
              <span>{t.siguienteEtiqueta}</span>
            </p>
            <h2 className="text-[clamp(1.6rem,7.5vw,3rem)] font-bold leading-[0.92]">
              <Enfasis texto={t.siguienteTitulo} />
            </h2>
            <p className="mt-6 font-medium leading-relaxed text-secundario">
              {!desbloqueado ? t.textoAntes : whatsapp ? t.textoWhatsapp : t.textoSinWhatsapp}
            </p>
          </div>
          <div className="lg:pt-12">
            {desbloqueado && whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener"
                onClick={() => evento(id, 'whatsapp_clic')}
                className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-7 text-[14px] font-bold uppercase leading-[1.15] text-fondo no-underline transition hover:bg-[color:var(--color-texto-hover)]"
              >
                <span>{t.boton}</span>
                <span className="text-[11px] opacity-60">→</span>
              </a>
            ) : !desbloqueado ? (
              <div
                className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-[36px] border border-dashed border-linea px-7 text-[14px] font-bold uppercase leading-[1.15] text-secundario"
                aria-disabled="true"
              >
                <span>{t.bloqueado}</span>
                <span className="text-[11px]">{visto} %</span>
              </div>
            ) : null}
            <p className="mt-6 text-[11px] font-medium uppercase leading-relaxed text-secundario">{t.aviso}</p>
          </div>
        </section>
      </main>

      <PieLegal persona={persona} />
    </>
  );
}
