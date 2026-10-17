import { Formulario, PieLegal } from '@equipo/compartido';
import { persona, webinar } from '../config';

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
        title={webinar.titulo}
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
        title={webinar.titulo}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <video className={marco} src={url} controls playsInline preload="metadata" />;
}

export default function Webinar() {
  const url = webinar.video.trim();

  return (
    <>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-[18px] pt-[18px] text-xs font-bold uppercase sm:px-8">
        <a href="/" className="no-underline">{persona.nombre}</a>
        <span className="text-secundario">Webinar</span>
      </div>

      <header className="mx-auto max-w-6xl px-[18px] pb-10 pt-14 sm:px-8 sm:pt-20">
        <p className="mb-3 text-[11px] font-bold uppercase text-acento">{webinar.subtitulo}</p>
        <h1 className="max-w-4xl text-[clamp(2.2rem,8vw,4.6rem)] font-extrabold uppercase leading-[0.88]">
          {webinar.titulo}
        </h1>
        <p className="mt-6 max-w-2xl font-medium leading-relaxed text-secundario sm:text-lg">
          Te cuento cómo estoy construyendo algo propio, a mi ritmo y con un equipo que me acompaña. Míralo con calma
          y, si te resuena, al final me dejas tus datos y lo hablamos.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-[18px] sm:px-8">
        <div className="relative aspect-video overflow-hidden rounded-[22.5px] border border-[color:var(--form-borde)] bg-superficie">
          {url ? (
            <Reproductor url={url} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-[11px] font-bold uppercase text-acento">Muy pronto</span>
              <p className="text-xl font-extrabold uppercase sm:text-3xl">El vídeo estará disponible en breve</p>
              <p className="text-sm font-medium text-secundario">Déjame tus datos abajo y te aviso en cuanto esté.</p>
            </div>
          )}
        </div>

        <hr className="my-16 border-0 border-t border-dashed border-linea sm:my-24" />

        <section className="grid gap-10 pb-20 lg:grid-cols-[1fr_1.2fr] lg:items-start sm:pb-28">
          <div>
            <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase text-acento">
              <span>01</span>
              <span className="h-px w-8 bg-acento" aria-hidden="true" />
              <span>Siguiente paso</span>
            </p>
            <h2 className="text-[clamp(1.6rem,7.5vw,3rem)] font-extrabold uppercase leading-[0.9]">¿Te ha resonado?</h2>
            <p className="mt-6 font-medium leading-relaxed text-secundario">
              Si quieres saber cómo empezar, déjame tus datos y te escribo personalmente. Una charla de 20 minutos, sin
              compromiso.
            </p>
          </div>
          <div>
            <Formulario persona={persona} origen="webinar" textoBoton="Quiero hablar contigo" />
            <p className="mt-6 text-[11px] font-medium uppercase leading-relaxed text-secundario">
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
