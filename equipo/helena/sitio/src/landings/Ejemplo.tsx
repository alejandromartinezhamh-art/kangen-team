import { Formulario, PieLegal } from '@equipo/compartido';
import { persona } from '../config';

// Landing corta para anuncios: un mensaje, un formulario. Copia este archivo para cada campaña nueva.
// Usa las mismas clases que la portada (index.css) para mantener el diseño de Helena.
export default function Ejemplo() {
  return (
    <>
      <main className="container book">
        <div className="book-grid">
          <div>
            <p className="kicker">Una conversa, sense pressa</p>
            <h1 className="display" style={{ fontSize: 'clamp(42px, 4.5vw, 67px)', margin: '24px 0' }}>
              Potser només cal començar per un ritual petit.
            </h1>
            <p>
              T’explico en una conversa de 20 minuts com he començat a construir un projecte propi que encaixa amb la
              vida que vull viure. Sense compromís. Sense presses.
            </p>
            <ul className="water-list">
              <li>Al teu ritme, compatible amb el que ja fas</li>
              <li>Acompanyament des del primer dia</li>
              <li>Sense compromís</li>
            </ul>
          </div>
          <div className="book-calendar">
            <Formulario persona={persona} origen="ejemplo" textoBoton="Reservar una conversa" />
          </div>
        </div>
      </main>
      <PieLegal persona={persona} />
    </>
  );
}
