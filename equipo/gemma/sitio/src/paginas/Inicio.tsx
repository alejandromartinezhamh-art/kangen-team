import { Formulario, PieLegal } from '@equipo/compartido';
import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { fotos, persona, textos } from '../config';
import VideoWebinar from '../componentes/VideoWebinar';
import Enfasis from '../componentes/Enfasis';

// Web principal de Gemma: la misma estructura que la de Alejandro, con sus colores.
// Textos: contenido.json → textos (se cambian desde el editor, /editar).

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
            src={fotos.retrato}
            alt={persona.nombre}
            className="absolute inset-0 h-full w-full object-cover object-[50%_35%] [filter:sepia(.06)_saturate(1.02)_contrast(1.12)_brightness(.94)]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,252,252,.35)_0%,transparent_18%,transparent_58%,rgba(253,252,252,.75)_82%,var(--color-fondo)_100%)] lg:bg-[linear-gradient(to_bottom,transparent_60%,rgba(253,252,252,.55)_100%)]"
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
          <p className="mb-3 text-[11px] font-bold uppercase text-acento">{textos.portadaEtiqueta}</p>
          <h1 className="text-[clamp(2.4rem,9vw,5.2rem)] font-bold leading-[0.9]">
            <Enfasis texto={textos.titular} />
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-secundario sm:text-lg">
            {textos.entradilla}
          </p>
          <hr className="my-8 border-0 border-t border-dashed border-linea" />
          <nav className="flex flex-col gap-3 sm:max-w-md" aria-label="Acciones principales">
            <a
              href="#contacto"
              className="flex min-h-[58px] items-center justify-between gap-4 rounded-[36px] border border-texto bg-texto px-6 text-[13px] font-bold uppercase text-fondo transition hover:bg-[color:var(--color-texto-hover)]"
            >
              <span>{textos.botonContacto}</span>
              <span className="text-[11px] opacity-60">01</span>
            </a>
            <a
              href="#video"
              className="flex min-h-[58px] items-center justify-between gap-4 rounded-[22.5px] border border-texto px-6 text-[13px] font-bold uppercase transition hover:bg-[rgba(0,0,0,.05)]"
            >
              <span>{textos.botonVideo}</span>
              <span className="text-[11px] text-estructura">02</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Vídeo del webinar justo debajo de la portada */}
      <section id="video" className="mx-auto max-w-6xl px-[18px] pb-20 sm:px-8 sm:pb-28">
        <VideoWebinar />
      </section>

      <Linea />

      <Seccion>
        <Etiqueta n="01">{textos.doloresEtiqueta}</Etiqueta>
        <ul>
          {textos.dolores.map((d, i) => (
            <li
              key={d}
              className="flex items-baseline gap-6 border-b border-dashed border-linea py-6 first:border-t"
            >
              <span className="text-[11px] font-bold text-estructura">{num(i)}</span>
              <span className="titular text-xl font-semibold leading-tight sm:text-3xl">{d}</span>
            </li>
          ))}
        </ul>
      </Seccion>

      <Linea />

      <Seccion>
        <Etiqueta n="02">{textos.pilaresEtiqueta}</Etiqueta>
        <div className="grid gap-3 sm:grid-cols-2">
          {textos.pilares.map((p, i) => (
            <div key={p.titulo} className="rounded-[22.5px] border border-texto p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{p.titulo}</h3>
                <span className="text-[11px] font-bold text-estructura">{num(i)}</span>
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
            <Etiqueta n="03">{textos.historiaEtiqueta}</Etiqueta>
            <h2 className="text-[clamp(1.9rem,9vw,3rem)] font-bold leading-[0.92]">
              <Enfasis texto={textos.historiaTitulo} />
            </h2>
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
        <Etiqueta n="04">{textos.pasosEtiqueta}</Etiqueta>
        <ol className="grid gap-3 sm:grid-cols-3">
          {textos.pasos.map((p, i) => (
            <li key={p.titulo} className="rounded-[22.5px] bg-superficie p-6 sm:p-8">
              <span className="text-4xl font-extrabold text-acento">{num(i)}</span>
              <h3 className="mt-6 text-base font-bold">{p.titulo}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-secundario">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <Linea />

      <Seccion id="contacto">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <Etiqueta n="05">{textos.contactoEtiqueta}</Etiqueta>
            <h2 className="text-[clamp(1.9rem,9vw,3rem)] font-bold leading-[0.92]">
              <Enfasis texto={textos.contactoTitulo} />
            </h2>
            <p className="mt-6 font-medium leading-relaxed text-secundario">{textos.contactoTexto}</p>
          </div>
          <div>
            <Formulario persona={persona} origen="inicio" />
            <p className="mt-6 text-[11px] font-medium uppercase leading-relaxed text-secundario">{textos.aviso}</p>
          </div>
        </div>
      </Seccion>

      <PieLegal persona={persona} />
    </>
  );
}
