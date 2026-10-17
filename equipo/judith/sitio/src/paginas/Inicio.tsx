import { Formulario, PieLegal } from '@equipo/compartido';
import { persona, textos } from '../config';

// Todos los textos salen de src/contenido.json, que es lo que cambia el editor visual.
export default function Inicio() {
  return (
    <>
      <header className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:pt-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primario">{persona.nombre}</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{textos.titular}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">{textos.subtitular}</p>
        <a
          href="#contacto"
          className="mt-10 inline-block rounded-xl bg-primario px-8 py-4 font-semibold text-white transition hover:opacity-90"
        >
          {textos.cta}
        </a>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">{textos.doloresTitulo}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {textos.dolores.map((d, i) => (
            <p key={i} className="rounded-2xl bg-white/70 p-6 shadow-sm">{d}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">{textos.pilaresTitulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {textos.pilares.map((p, i) => (
            <div key={i} className="rounded-2xl border border-black/5 bg-white/70 p-6">
              <h3 className="text-xl font-semibold text-primario">{p.titulo}</h3>
              <p className="mt-2 opacity-80">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-6 text-3xl font-bold">{textos.historiaTitulo}</h2>
        <div className="space-y-4 text-lg leading-relaxed opacity-90">
          {textos.historia.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">{textos.pasosTitulo}</h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {textos.pasos.map((p, i) => (
            <li key={i} className="rounded-2xl bg-white/70 p-6 text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-acento font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-semibold">{p.titulo}</h3>
              <p className="mt-1 text-sm opacity-80">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contacto" className="mx-auto max-w-xl px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">{textos.contactoTitulo}</h2>
        <p className="mb-8 text-center opacity-80">{textos.contactoTexto}</p>
        <Formulario persona={persona} origen="inicio" />
        <p className="mt-6 text-center text-xs opacity-60">{textos.aviso}</p>
      </section>

      <PieLegal persona={persona} />
    </>
  );
}
