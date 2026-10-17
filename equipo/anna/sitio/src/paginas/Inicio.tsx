import { Formulario, PieLegal } from '@equipo/compartido';
import { persona, textos } from '../config';

const pasos = [
  { titulo: 'Rellenas el formulario', texto: 'Solo tus datos básicos, sin compromiso.' },
  { titulo: 'Hablamos 20 minutos', texto: 'Te cuento cómo trabajamos y resuelvo tus dudas.' },
  { titulo: 'Decides con calma', texto: 'Sin presión. Si encaja contigo, empezamos juntos.' },
];

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
          Quiero saber cómo funciona
        </a>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">¿Te suena esto?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {textos.dolores.map((d) => (
            <p key={d} className="rounded-2xl bg-white/70 p-6 shadow-sm">{d}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Lo que encontrarás aquí</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {textos.pilares.map((p) => (
            <div key={p.titulo} className="rounded-2xl border border-black/5 bg-white/70 p-6">
              <h3 className="text-xl font-semibold text-primario">{p.titulo}</h3>
              <p className="mt-2 opacity-80">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-6 text-3xl font-bold">Mi historia</h2>
        <div className="space-y-4 text-lg leading-relaxed opacity-90">
          {textos.historia.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Cómo empezamos</h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="rounded-2xl bg-white/70 p-6 text-center">
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
        <h2 className="mb-2 text-center text-3xl font-bold">¿Lo hablamos?</h2>
        <p className="mb-8 text-center opacity-80">Déjame tus datos y te escribo personalmente.</p>
        <Formulario persona={persona} origen="inicio" />
        <p className="mt-6 text-center text-xs opacity-60">
          Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada persona.
        </p>
      </section>

      <PieLegal persona={persona} />
    </>
  );
}
