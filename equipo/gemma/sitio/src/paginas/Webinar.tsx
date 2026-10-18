import { PieLegal } from '@equipo/compartido';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { embudo, persona, webinar } from '../config';
import VideoWebinar from '../componentes/VideoWebinar';
import Enfasis from '../componentes/Enfasis';

// Página del webinar (el enlace del email). Textos: contenido.json → webinar. Estilos: embudo.css.

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
      <header className="cabecera">
        <div className="cabecera-inner">
          <Link to="/l/instagram" className="marca">
            {embudo.general.marca}
          </Link>
          <span className="kicker">{t.barra}</span>
        </div>
      </header>

      <main className="contenedor e-webinar">
        <p className="kicker e-punto">{t.etiqueta}</p>
        <h1 className="display e-webinar-titulo">
          <Enfasis texto={t.titulo} />
        </h1>
        <p className="e-webinar-texto">{t.texto}</p>

        <div className="webinar-wrap e-webinar-marco">
          <VideoWebinar onProgreso={hayVideo ? onProgreso : undefined} />
          {hayVideo && !desbloqueado && (
            <div className="e-visto">
              <span className="kicker">
                {t.visto} {visto} %
              </span>
              <div className="e-progreso" aria-hidden="true">
                <div style={{ width: `${visto}%` }} />
              </div>
            </div>
          )}
        </div>

        <section className="e-siguiente">
          <div>
            <p className="kicker e-punto">{t.siguienteEtiqueta}</p>
            <h2 className="display">
              <Enfasis texto={t.siguienteTitulo} />
            </h2>
            <p className="e-texto">{!desbloqueado ? t.textoAntes : whatsapp ? t.textoWhatsapp : t.textoSinWhatsapp}</p>
          </div>
          <div>
            {desbloqueado && whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener"
                onClick={() => evento(id, 'whatsapp_clic')}
                className="btn btn-oscuro e-boton"
              >
                <span>{t.boton}</span>
                <span className="flecha" aria-hidden="true">↗</span>
              </a>
            ) : !desbloqueado ? (
              <div className="e-bloqueado" aria-disabled="true">
                <span>{t.bloqueado}</span>
                <span>{visto} %</span>
              </div>
            ) : null}
            <p className="e-aviso">
              Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada
              persona.
            </p>
          </div>
        </section>
      </main>

      <PieLegal persona={persona} />
    </>
  );
}
