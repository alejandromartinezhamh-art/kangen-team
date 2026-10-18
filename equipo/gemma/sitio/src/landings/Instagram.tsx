import { Link } from 'react-router-dom';
import { embudo, fotos } from '../config';
import Enfasis from '../componentes/Enfasis';

// Página del enlace de la bio de Instagram, con el diseño de la portada de Gemma (foto redondeada,
// etiquetas espaciadas, titular fino y botón negro en píldora). Un solo botón: al cuestionario del webinar.
// Textos: contenido.json → instagram.
export default function Instagram() {
  const { general, instagram: t } = embudo;
  return (
    <div className="e-enlaces">
      <div className="e-barra">
        <span className="marca">{general.marca}</span>
        <span className="kicker">{t.barra}</span>
      </div>

      <figure className="e-retrato">
        <img className="foto" src={fotos.retrato} alt={t.titulo.replaceAll('*', '')} />
        <span className="photo-caption">{general.marca}</span>
        <span className="hero-caption">{t.fotoTexto}</span>
      </figure>

      <main className="e-cuerpo">
        <p className="kicker e-punto">{t.etiqueta}</p>
        <h1 className="display e-nombre">
          <Enfasis texto={t.titulo} />
        </h1>
        <Link to="/cuestionario?o=instagram" className="btn btn-oscuro e-boton">
          <span>{t.boton}</span>
          <span className="flecha" aria-hidden="true">↗</span>
        </Link>
      </main>

      <footer className="e-pie">
        <Link to="/privacidad">{t.privacidad}</Link>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
