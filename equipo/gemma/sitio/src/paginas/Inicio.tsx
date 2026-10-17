import { useRef } from 'react';
import { Formulario, PieLegal } from '@equipo/compartido';
import { persona, textos, webinarUrl } from '../config';

// Portada de Gemma. Diseño: Drive / Landing Kangen Gemma / 08 Design.
export default function Inicio() {
  const aviso = useRef<HTMLDialogElement>(null);
  const abrirWebinar = () => {
    if (webinarUrl) document.getElementById('webinar')?.scrollIntoView();
    else aviso.current?.showModal();
  };

  return (
    <>
      <header className="cabecera">
        <div className="cabecera-inner">
          <a href="#inicio" className="marca">
            GEMMA OÑA<small>{textos.marcaLinea}</small>
          </a>
          <nav className="nav" aria-label="Principal">
            <a className="nav-link" href="#historia">{textos.nav.historia}</a>
            <a className="nav-link" href="#agua">{textos.nav.agua}</a>
            <a className="nav-link" href="#vida">{textos.nav.vida}</a>
            <a className="btn btn-oscuro" href="#hablamos">{textos.nav.hablamos}</a>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section className="hero contenedor">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">{textos.heroEyebrow}</p>
              <h1 className="display">
                {textos.heroTitular.map((linea, i) => (
                  <span key={linea} className={i >= 2 ? 'suave' : undefined}>{linea}</span>
                ))}
              </h1>
              <p>{textos.heroTexto}</p>
              <div className="hero-actions">
                <a className="btn btn-oscuro" href="#historia">
                  {textos.heroCta} <span className="flecha">↘</span>
                </a>
                <button type="button" className="btn btn-claro" onClick={abrirWebinar}>
                  {textos.heroCta2} <span className="flecha">↗</span>
                </button>
              </div>
              <div className="hero-small">
                <span className="fine-line" />
                {textos.heroMeta}
              </div>
            </div>
            <div className="hero-visual">
              <img className="foto" src="/fotos/portada.jpg" alt="Gemma mirando al mar al atardecer" />
              <span className="photo-caption">GEMMA OÑA</span>
              <span className="hero-caption">{textos.heroFoto}</span>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="contenedor marquee-inner">
            {textos.palabras.map((palabra, i) => (
              <span key={palabra} style={{ display: 'contents' }}>
                {i > 0 && <i aria-hidden="true" />}
                <span>{palabra}</span>
              </span>
            ))}
          </div>
        </div>

        <section id="historia" className="story contenedor">
          <div className="story-grid">
            <div className="story-photo">
              <img className="foto" src="/fotos/historia.jpg" alt="Gemma de viaje en un pueblo de casas de colores" />
              <span className="side-caption">2023</span>
              <span className="story-image-caption">{textos.historiaFoto}</span>
            </div>
            <div className="story-copy">
              <p className="kicker">{textos.historiaCapitulo}</p>
              <h2 className="display">{textos.historiaTitulo}</h2>
              {textos.historiaParrafos.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
              <a className="text-link" href="#agua">
                {textos.historiaEnlace} <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="quote-band">
          <div className="rings" aria-hidden="true" />
          <div className="contenedor quote-inner">
            <p className="kicker">{textos.historiaEntradilla}</p>
            <h2 className="display">
              {textos.frase.map((linea) => (
                <span key={linea}>{linea}</span>
              ))}
            </h2>
            <p>{textos.fraseTexto}</p>
          </div>
        </section>

        <section id="agua" className="water contenedor">
          <div className="water-grid">
            <div className="water-copy">
              <p className="kicker">{textos.aguaCapitulo}</p>
              <h2 className="display">{textos.aguaTitulo}</h2>
              <p>{textos.aguaTexto}</p>
              <ul className="water-list">
                {textos.aguaLista.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="btn btn-oscuro" href="#webinar">
                {textos.aguaCta} <span className="flecha">↘</span>
              </a>
              <p className="note">{textos.aguaNota}</p>
            </div>
            <div className="water-art" aria-hidden="true">
              <span className="kicker esquina-a">UN NUEVO RITUAL</span>
              <div className="anillo" />
              <div className="large-circle" />
              <span className="esquina-b">02</span>
            </div>
          </div>
        </section>

        <section id="webinar" className="webinar contenedor">
          <div className="webinar-wrap">
            <div className="webinar-top">
              <div>
                <p className="kicker">{textos.webinarKicker}</p>
                <h2 className="display">{textos.webinarTitulo}</h2>
              </div>
              <p>{textos.webinarTexto}</p>
            </div>
            <div className="video-stage">
              {webinarUrl ? (
                <iframe
                  src={webinarUrl}
                  title={textos.webinarTitulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <span className="video-corner">GEMMA OÑA / 001</span>
                  <div className="video-inner">
                    <button type="button" className="play-btn" onClick={abrirWebinar} aria-label={textos.webinarCta}>
                      ▶
                    </button>
                  </div>
                  <span className="video-meta">{textos.webinarMeta}</span>
                </>
              )}
            </div>
            <div className="webinar-cta">
              <p>{textos.webinarPie}</p>
              <a className="btn btn-oscuro" href="#hablamos">
                {textos.hablamosBoton} <span className="flecha">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section id="vida" className="life contenedor">
          <div className="life-hero">
            <img className="foto" src="/fotos/vida.jpg" alt="Gemma en la montaña con el valle de fondo" />
            <span>{textos.vidaFoto}</span>
          </div>
          <div className="life-text">
            <div>
              <p className="kicker">{textos.vidaCapitulo}</p>
              <h2 className="display">{textos.vidaTitulo}</h2>
            </div>
            <div className="life-aside">
              <p>{textos.vidaTexto}</p>
              <p className="pull">{textos.vidaFrase}</p>
            </div>
          </div>
          <div className="life-values">
            {textos.valores.map((valor, i) => (
              <div key={valor} className="value">
                <span>0{i + 1}</span>
                <strong>{valor}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="posibilidad" className="business">
          <div className="contenedor business-grid">
            <div>
              <p className="kicker">{textos.negocioEtiqueta}</p>
              <h2 className="display">{textos.negocioTitulo}</h2>
            </div>
            <div>
              <p>{textos.negocioTexto}</p>
              <div className="business-actions">
                <a className="btn btn-oscuro" href="#hablamos">{textos.negocioB} <span className="flecha">↗</span></a>
                <a className="btn btn-claro" href="#agua">{textos.negocioA}</a>
              </div>
            </div>
          </div>
        </section>

        <section id="hablamos" className="book contenedor">
          <div className="book-grid">
            <div className="book-copy">
              <p className="kicker">{textos.hablamosEtiqueta}</p>
              <h2 className="display">{textos.hablamosTitulo}</h2>
              <p>{textos.hablamosTexto}</p>
            </div>
            <div className="book-card">
              <div className="book-card-head">
                <span>GEMMA / 30 MIN</span>
                <span className="cal-circle" aria-hidden="true">↗</span>
              </div>
              <Formulario persona={persona} origen="inicio" textoBoton={textos.hablamosBoton} />
              <p className="aviso">
                Propuesta de emprendimiento por cuenta propia. No es una oferta de empleo y los resultados dependen de cada persona.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="pie">
        <div className="contenedor pie-flex">
          <div>
            <span className="marca">GEMMA OÑA<small>{textos.marcaLinea}</small></span>
            <p className="pie-head display">{textos.pieFrase}</p>
          </div>
          <p className="pie-right">{textos.pieNota}</p>
        </div>
      </footer>
      <PieLegal persona={persona} />

      <dialog ref={aviso} className="aviso-dialogo" onClick={(e) => e.target === e.currentTarget && aviso.current?.close()}>
        <div className="aviso-dialogo-inner">
        <p className="kicker">WEBINAR · PRÓXIMAMENTE</p>
        <p>{textos.webinarPendiente}</p>
        <a className="btn btn-oscuro" href="#hablamos" onClick={() => aviso.current?.close()}>
          {textos.nav.hablamos}
        </a>{' '}
        <button type="button" className="btn btn-claro" onClick={() => aviso.current?.close()}>
          Cerrar
        </button>
        </div>
      </dialog>
    </>
  );
}
