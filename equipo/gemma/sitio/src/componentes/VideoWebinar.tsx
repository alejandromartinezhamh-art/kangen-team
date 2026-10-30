import { useEffect, useRef } from 'react';
import { embudo, webinar } from '../config';

// Vídeo del webinar (contenido.json → enlaces.webinar): YouTube, Vimeo o archivo .mp4, o aviso de 'muy pronto'
// si aún no hay enlace. Con onProgreso informa del % visto de verdad (segundos distintos reproducidos,
// así que arrastrar la barra hasta el final no cuenta).

type Progreso = (porcentaje: number) => void;

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opciones: object) => { getCurrentTime(): number; getDuration(): number } };
    onYouTubeIframeAPIReady?: () => void;
    Vimeo?: { Player: new (el: HTMLIFrameElement) => { on(evento: string, cb: (d: { seconds: number; duration: number }) => void): void } };
  }
}

function cargarScript(src: string): Promise<void> {
  return new Promise((ok, mal) => {
    if (document.querySelector(`script[src="${src}"]`)) return ok();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => ok();
    s.onerror = () => mal(new Error(src));
    document.head.appendChild(s);
  });
}

/** Lleva la cuenta de los segundos vistos y avisa cuando cambia el porcentaje. */
function contador(onProgreso?: Progreso) {
  const vistos = new Set<number>();
  let ultimo = -1;
  return (segundo: number, duracion: number) => {
    if (!onProgreso || !(duracion > 0) || segundo < 0) return;
    vistos.add(Math.floor(segundo));
    const p = Math.min(100, Math.round((vistos.size / Math.max(1, Math.floor(duracion))) * 100));
    if (p !== ultimo) onProgreso((ultimo = p));
  };
}

const titulo = () => embudo.webinar.titulo.replaceAll('*', '');
const marco = 'absolute inset-0 h-full w-full border-0';

function YouTube({ id, onProgreso }: { id: string; onProgreso?: Progreso }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const marcar = contador(onProgreso);
    let sondeo: ReturnType<typeof setInterval> | undefined;
    let vivo = true;
    const crear = () => {
      if (!vivo || !ref.current || !window.YT) return;
      const p = new window.YT.Player(ref.current, {
        videoId: id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            clearInterval(sondeo);
            if (e.data === 1) sondeo = setInterval(() => marcar(p.getCurrentTime(), p.getDuration()), 500);
          },
        },
      });
    };
    if (window.YT?.Player) crear();
    else {
      const previo = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previo?.();
        crear();
      };
      cargarScript('https://www.youtube.com/iframe_api').catch(() => {});
    }
    return () => {
      vivo = false;
      clearInterval(sondeo);
    };
  }, [id, onProgreso]);
  return (
    <div className={marco}>
      <div ref={ref} className="h-full w-full" title={titulo()} />
    </div>
  );
}

function Vimeo({ id, hash, onProgreso }: { id: string; hash?: string; onProgreso?: Progreso }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!onProgreso) return;
    const marcar = contador(onProgreso);
    cargarScript('https://player.vimeo.com/api/player.js')
      .then(() => {
        if (!ref.current || !window.Vimeo) return;
        new window.Vimeo.Player(ref.current).on('timeupdate', (d) => marcar(d.seconds, d.duration));
      })
      .catch(() => {});
  }, [onProgreso]);
  return (
    <iframe
      ref={ref}
      className={marco}
      src={`https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`}
      title={titulo()}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

function Archivo({ url, onProgreso }: { url: string; onProgreso?: Progreso }) {
  const marcar = useRef(contador(onProgreso)).current;
  return (
    <video
      className={marco}
      src={url}
      controls
      playsInline
      preload="metadata"
      onTimeUpdate={(e) => marcar(e.currentTarget.currentTime, e.currentTarget.duration)}
    />
  );
}

export default function VideoWebinar({ onProgreso }: { onProgreso?: Progreso }) {
  const url = webinar().trim();
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  return (
    <div className="relative aspect-video overflow-hidden rounded-[22.5px] border border-[color:var(--form-borde)] bg-superficie">
      {!url ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-[11px] font-bold uppercase text-acento">{embudo.webinar.prontoEtiqueta}</span>
          <p className="titular text-xl font-bold sm:text-3xl">{embudo.webinar.prontoTitulo}</p>
          <p className="text-sm font-medium text-secundario">{embudo.webinar.prontoTexto}</p>
        </div>
      ) : yt ? (
        <YouTube id={yt[1]} onProgreso={onProgreso} />
      ) : vm ? (
        <Vimeo id={vm[1]} hash={vm[2]} onProgreso={onProgreso} />
      ) : (
        <Archivo url={url} onProgreso={onProgreso} />
      )}
    </div>
  );
}
