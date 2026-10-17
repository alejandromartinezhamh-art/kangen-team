import { Formulario, PieLegal } from '@equipo/compartido';
import { persona, webinar } from '../config';
import VideoWebinar from '../componentes/VideoWebinar';

export default function Webinar() {
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
        <VideoWebinar />

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
