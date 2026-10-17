import { webinar } from '../config';

// Convierte el enlace del vídeo en algo reproducible: YouTube (sin cookies), Vimeo o archivo .mp4.
function Reproductor({ url }: { url: string }) {
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  const marco = 'absolute inset-0 h-full w-full border-0';

  if (yt) {
    return (
      <iframe
        className={marco}
        src={`https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`}
        title={webinar.titulo.replaceAll('*', '')}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  if (vm) {
    return (
      <iframe
        className={marco}
        src={`https://player.vimeo.com/video/${vm[1]}${vm[2] ? `?h=${vm[2]}` : ''}`}
        title={webinar.titulo.replaceAll('*', '')}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <video className={marco} src={url} controls playsInline preload="metadata" />;
}

// Vídeo del webinar (config.ts → webinar.video) o aviso de 'muy pronto' si aún no hay enlace.
export default function VideoWebinar() {
  const url = webinar.video.trim();
  return (
    <div className="relative aspect-video overflow-hidden rounded-[22.5px] border border-[color:var(--form-borde)] bg-superficie">
      {url ? (
        <Reproductor url={url} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-[11px] font-bold uppercase text-acento">Muy pronto</span>
          <p className="titular text-xl font-bold sm:text-3xl">El vídeo estará disponible en breve</p>
          <p className="text-sm font-medium text-secundario">Déjame tus datos abajo y te aviso en cuanto esté.</p>
        </div>
      )}
    </div>
  );
}
