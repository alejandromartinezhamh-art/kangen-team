import { Link } from 'react-router-dom';
import { embudo } from '../config';

// Página del enlace de la bio de Instagram, con el diseño de la portada de Gemma (foto redondeada,
// etiquetas espaciadas, titular fino y botón negro en píldora). Un solo botón: al cuestionario del webinar.
export default function Instagram() {
  const [nombre, ...apellidos] = embudo.nombreCompleto.split(' ');
  return (
    <div className="e-enlaces">
      <div className="e-barra">
        <span className="marca">{embudo.nombreCompleto.toUpperCase()}</span>
        <span className="kicker">Enlaces</span>
      </div>

      <figure className="e-retrato">
        <img className="foto" src="/foto.jpg" alt={embudo.nombreCompleto} />
        <span className="photo-caption">{embudo.nombreCompleto.toUpperCase()}</span>
        <span className="hero-caption">OTRA MANERA DE VIVIR Y TRABAJAR</span>
      </figure>

      <main className="e-cuerpo">
        <p className="kicker e-punto">{embudo.subtitulo}</p>
        <h1 className="display e-nombre">
          {nombre} <span className="suave">{apellidos.join(' ')}</span>
        </h1>
        <Link to="/cuestionario?o=instagram" className="btn btn-oscuro e-boton">
          <span>{embudo.boton}</span>
          <span className="flecha" aria-hidden="true">↗</span>
        </Link>
      </main>

      <footer className="e-pie">
        <Link to="/privacidad">Política de privacidad</Link>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
