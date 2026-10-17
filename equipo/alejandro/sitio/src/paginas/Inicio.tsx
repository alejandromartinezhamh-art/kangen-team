import { Formulario, PieLegal } from '@equipo/compartido';
import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { persona, textos } from '../config';

const pasos = [
  { titulo: 'Rellenas el formulario', texto: 'Solo tus datos básicos, sin compromiso.' },
  { titulo: 'Hablamos 20 minutos', texto: 'Te cuento cómo trabajamos y resuelvo tus dudas.' },
  { titulo: 'Decides con calma', texto: 'Sin presión. Si encaja contigo, empezamos juntos.' },
];

const num = (i: number) => String(i + 1).padStart(2, '0');

function Etiqueta({ n, children }: { n: string; children: string }) {
  return (
    <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase text-acento">
      <span>{n}</span>
      <span className="h-px w-8 bg-acento" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function Linea() {
  return <hr className="mx-auto max-w-6xl border-0 border-t border-dashed border-linea" />;
}

function Seccion({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-[18px] py-20 sm:px-8 sm:py-28">
      {children}
    </section>
  );
}

export default function Inicio() {
  const { hash } = useLocation();
  // Al llegar desde otra página con /#contacto, baja hasta esa sección.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      {/* Barra superior */}
      <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-[18px] pt-[18px] text-xs font-bold uppercase sm:px-8">
        <span>{persona.nombre}</span>
        <span className="text-secundario">{textos.subtitulo}</span>
      </div>

      {/* Portada: foto a sangre en móvil, dos columnas en escritorio */}
      <header className="relative mx-auto grid max-w-6xl lg:min-h-[100svh] lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:px-8">
        <div className="relative aspect-[1/1.02] overflow-hidden lg:order-2 lg:aspect-[4/5] lg:rounded-[22.5px]">
          <img
            src="/foto.jpg"
            alt={persona.nombre}
            className="absolute inset-0 h-full w-full object-cover object-[50%_35%] [filter:sepia(.06)_saturate(1.02)_contrast(1.12)_brightness(.94)]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,9,4,.35)_0%,transparent_18%,transparent_58%,rgba(16,9,4,.75)_82%,#100904_100%)] lg:bg-[linear-gradient(to_bottom,transparent_60%,rgba(16,9,4,.55)_100%)]"
            aria-hidden="true"
          />
          <span
            className="absolute right-[14px] top-[34%] origin-center translate-x-1/2 rotate-90 whitespace-nowrap text-[10px] font-bold uppercase opacity-75"
            aria-hidden="true"
          >
            {persona.nombre} — 01
          </span>
        </div>

        <div className="relative z-10 -mt-16 px-[18px] pb-16 lg:order-1 lg:mt-0 lg:px-0 lg:pb-0">
          <p className="mb-3 text-[11px] font-bold uppercase text-acento">Charla gratuita · Sin compromiso</p>
          <h1 className="text-[clamp(2.4rem,9vw,5.2rem)] font-extrabold uppercase leading-[0.88]">
            {textos.titular}
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-secundario sm:text-lg">
            {textos.entradilla}
          </p>
          <hr className="my-8 border-0 border-t border-dashed border-linea" />
          <nav className="flex flex-col gap-3 sm:max-w-md" aria-label="Acciones principales">
            <a
              href="#contacto"
              className="flex min-h-[58px] items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-6 text-[13px] font-bold uppercase text-fondo transition hover:bg-[#fff6ea]"
            >
              <span>Quiero saber cómo funciona</span>
              <span className="text-[11px] opacity-60">01</span>
            </a>
            <a
              href="#historia"
              className="flex min-h-[58px] items-center justify-between gap-4 rounded-[22.5px] border border-texto px-6 text-[13px] font-bold uppercase transition hover:bg-[rgba(255,237,215,.06)]"
            >
              <span>Construye algo propio</span>
              <span className="text-[11px] text-secundario">02</span>
            </a>
          </nav>
        </div>
      </header>

      <Linea />

      <Seccion>
        <Etiqueta n="01">¿Te suena?</Etiqueta>
        <ul>
          {textos.dolores.map((d, i) => (
            <li
              key={d}
              className="flex items-baseline gap-6 border-b border-dashed border-linea py-6 first:border-t"
            >
              <span className="text-[11px] font-bold text-secundario">{num(i)}</span>
              <span className="text-xl font-semibold uppercase leading-tight sm:text-3xl">{d}</span>
            </li>
          ))}
        </ul>
      </Seccion>

      <Linea />

      <Seccion>
        <Etiqueta n="02">Lo que encontrarás aquí</Etiqueta>
        <div className="grid gap-3 sm:grid-cols-2">
          {textos.pilares.map((p, i) => (
            <div key={p.titulo} className="rounded-[22.5px] border border-texto p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase">{p.titulo}</h3>
                <span className="text-[11px] font-bold text-secundario">{num(i)}</span>
              </div>
              <p className="mt-3 font-medium leading-relaxed text-secundario">{p.texto}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Linea />

      <Seccion id="historia">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Etiqueta n="03">Mi historia</Etiqueta>
            <h2 className="text-[clamp(1.9rem,9vw,3rem)] font-extrabold uppercase leading-[0.9]">Por qué empecé</h2>
          </div>
          <div className="space-y-5 text-lg font-medium leading-relaxed text-secundario">
            {textos.historia.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </div>
        </div>
      </Seccion>

      <Linea />

      <Seccion>
        <Etiqueta n="04">Cómo empezamos</Etiqueta>
        <ol className="grid gap-3 sm:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="rounded-[22.5px] bg-superficie p-6 sm:p-8">
              <span className="text-4xl font-extrabold text-acento">{num(i)}</span>
              <h3 className="mt-6 text-base font-bold uppercase">{p.titulo}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-secundario">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <Linea />

      <Seccion id="contacto">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <Etiqueta n="05">Hablamos</Etiqueta>
            <h2 className="text-[clamp(1.9rem,9vw,3rem)] font-extrabold uppercase leading-[0.9]">¿Lo hablamos?</h2>
            <p className="mt-6 font-medium leading-relaxed text-secundario">
              Déjame tus datos y te escribo personalmente. Una charla de 20 minutos, sin compromiso.
            </p>
          </div>
          <div>
            <Formulario persona={persona} origen="inicio" />
            <p className="mt-6 text-[11px] font-medium uppercase leading-relaxed text-secundario">
              Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada persona.
            </p>
          </div>
        </div>
      </Seccion>

      <PieLegal persona={persona} />
    </>
  );
}
