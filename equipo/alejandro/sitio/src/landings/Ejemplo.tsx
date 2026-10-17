import { Formulario, PieLegal } from '@equipo/compartido';
import { persona } from '../config';

// Landing corta para anuncios: un mensaje, un formulario. Copia este archivo para cada campaña nueva.
export default function Ejemplo() {
  return (
    <>
      <main className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-[18px] py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <img src="/foto.jpg" alt={persona.nombre} className="h-14 w-14 rounded-full object-cover" />
            <div className="text-xs font-bold uppercase">
              <p>{persona.nombre}</p>
              <p className="text-secundario">Emprendimiento y bienestar</p>
            </div>
          </div>
          <p className="mb-3 text-[11px] font-bold uppercase text-acento">Charla gratuita · 20 minutos</p>
          <h1 className="text-[clamp(1.9rem,8vw,2.6rem)] font-extrabold uppercase leading-[0.9] lg:text-[clamp(2.4rem,3.4vw,3.2rem)]">
            ¿Y si tu próximo año fuera diferente?
          </h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-secundario">
            Te cuento cómo estoy construyendo un proyecto propio con un equipo que me acompaña.
          </p>
          <ul className="mt-8">
            {['A tu ritmo, compatible con lo que ya haces', 'Formación desde cero', 'Sin compromiso'].map((t, i) => (
              <li key={t} className="flex gap-4 border-b border-dashed border-linea py-3 text-sm font-bold uppercase first:border-t">
                <span className="text-secundario">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Formulario persona={persona} origen="ejemplo" textoBoton="Reservar mi charla" />
      </main>
      <PieLegal persona={persona} />
    </>
  );
}
