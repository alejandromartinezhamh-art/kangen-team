import { Link } from 'react-router-dom';
import { persona, textos } from '../config';

// Página del enlace de la bio de Instagram: misma composición que "Alejandro — enlaces".
const enlaces = [
  { texto: 'Otra manera de ganarse la vida', a: '/', etiqueta: 'Webinar gratuito' },
  { texto: 'Construye algo propio', a: '/#contacto' },
];

export default function Instagram() {
  return (
    <div className="relative mx-auto flex h-[100svh] max-w-[480px] flex-col">
      <div className="absolute inset-x-0 top-0 z-[3] flex items-center justify-between px-[18px] pt-[18px] text-xs font-bold uppercase leading-none">
        <span>{persona.nombre}</span>
        <span className="text-secundario">Enlaces</span>
      </div>

      <header className="relative aspect-[1/1.02] max-h-[calc(100svh-230px)] flex-none overflow-hidden">
        <img
          src="/foto.jpg"
          alt={persona.nombre}
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] [filter:sepia(.06)_saturate(1.02)_contrast(1.12)_brightness(.94)]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,9,4,.35)_0%,transparent_18%,transparent_58%,rgba(16,9,4,.75)_82%,#100904_100%)]"
          aria-hidden="true"
        />
      </header>
      <span
        className="absolute right-[14px] top-[34%] z-[3] translate-x-1/2 rotate-90 whitespace-nowrap text-[10px] font-bold uppercase opacity-75"
        aria-hidden="true"
      >
        {persona.nombre} — 01
      </span>

      <main className="relative z-[2] -mt-16 flex min-h-0 flex-1 flex-col justify-center px-[18px] pb-[clamp(4px,1.5vh,12px)]">
        <h1 className="text-[clamp(1.8rem,8.3vw,2.2rem)] font-extrabold uppercase leading-[0.88]">{persona.nombre}</h1>
        <p className="mt-[10px] text-xs font-semibold uppercase leading-tight text-secundario">{textos.subtitulo}</p>
        <hr className="my-[clamp(16px,2.6vh,24px)] border-0 border-t border-dashed border-linea" />
        <nav className="flex flex-col gap-3" aria-label="Enlaces">
          {enlaces.map((e, i) => (
            <div key={e.texto}>
              {e.etiqueta && <p className="mb-[2px] text-[11px] font-bold uppercase text-acento">{e.etiqueta}</p>}
              <Link
                to={e.a}
                className={
                  'flex min-h-[clamp(54px,7.4vh,62px)] items-center justify-between gap-4 border px-6 text-[13px] font-bold uppercase leading-[1.15] no-underline transition ' +
                  (i === 0
                    ? 'rounded-[36px] border-texto bg-texto text-fondo hover:bg-[#fff6ea]'
                    : 'rounded-[22.5px] border-texto hover:bg-[rgba(255,237,215,.06)]')
                }
              >
                <span>{e.texto}</span>
                <span className={'flex-none text-[11px] ' + (i === 0 ? 'opacity-60' : 'text-secundario')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            </div>
          ))}
        </nav>
      </main>

      <footer className="flex justify-between px-[18px] pb-[14px] pt-[10px] text-[10px] font-medium uppercase text-secundario">
        <Link to="/privacidad" className="no-underline">Política de privacidad</Link>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
