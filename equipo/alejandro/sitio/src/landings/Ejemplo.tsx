import { Formulario, PieLegal } from '@equipo/compartido';
import { persona } from '../config';

// Landing corta para anuncios: un mensaje, un formulario. Copia este archivo para cada campaña nueva.
export default function Ejemplo() {
  return (
    <>
      <main className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:grid-cols-2 sm:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-tight">¿Y si tu próximo año fuera diferente?</h1>
          <p className="mt-4 text-lg opacity-80">
            Te cuento en una charla de 20 minutos cómo estoy construyendo un proyecto propio con un equipo que me acompaña.
          </p>
          <ul className="mt-6 space-y-2">
            <li>✔ A tu ritmo, compatible con lo que ya haces</li>
            <li>✔ Formación desde cero</li>
            <li>✔ Sin compromiso</li>
          </ul>
        </div>
        <Formulario persona={persona} origen="ejemplo" textoBoton="Reservar mi charla" />
      </main>
      <PieLegal persona={persona} />
    </>
  );
}
