import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formulario } from '@equipo/compartido';
import { maqueta, persona } from '../config';
import { idiomas } from '../textos';
import { useIdioma } from '../idioma';
import { Modal } from '../componentes/Modal';
import { Paisaje } from '../componentes/Paisaje';

// Portada de Helena según su documento de diseño. El orden de secciones es el del prototipo
// y es provisional: el equipo puede reordenarlas sin tocar los estilos de index.css.

type Ventana = null | 'webinar' | 'reserva' | 'negocio';

export default function Inicio() {
  const { idioma, setIdioma, t } = useIdioma();
  const [ventana, setVentana] = useState<Ventana>(null);
  const cerrar = useCallback(() => setVentana(null), []);

  return (
    <>
      {maqueta && <div className="demo-bar">{t.demo}</div>}

      <header className="header">
        <div className="header-inner">
          <a href="#inici" className="brand">
            HELENA SAIGI
            <small>WATER · RITUALS · LIFE</small>
          </a>
          <nav className="nav" aria-label="Principal">
            <a className="nav-link" href="#historia">{t.nav_story}</a>
            <a className="nav-link" href="#aigua">{t.nav_water}</a>
            <a className="nav-link" href="#vida">{t.nav_life}</a>
            <div className="nav-group">
              <div className="lang" role="group" aria-label="Idioma">
                {idiomas.map((codigo) => (
                  <button
                    key={codigo}
                    type="button"
                    lang={codigo}
                    className={codigo === idioma ? 'active' : undefined}
                    aria-pressed={codigo === idioma}
                    onClick={() => setIdioma(codigo)}
                  >
                    {codigo.toUpperCase()}
                  </button>
                ))}
              </div>
              <a className="btn dark" href="#parlem">{t.nav_talk}</a>
            </div>
          </nav>
        </div>
      </header>

      <main id="inici">
        <section className="hero container">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">{t.eyebrow}</p>
              <h1 className="display">
                <span>{t.hero_a}</span>
                <span>{t.hero_b}</span>
                <span className="soft">{t.hero_c}</span>
                <span className="soft">{t.hero_d}</span>
              </h1>
              <p>{t.hero_desc}</p>
              <div className="hero-actions">
                <a className="btn dark" href="#historia">
                  {t.hero_cta} <span className="arrow">↘</span>
                </a>
                <button type="button" className="btn light" onClick={() => setVentana('webinar')}>
                  {t.hero_cta2} <span className="arrow">↗</span>
                </button>
              </div>
              <div className="hero-small kicker">
                <span className="fine-line" />
                {t.hero_side}
              </div>
            </div>
            <div className="hero-visual">
              <img className="photo" src="/fotos/amanecer-mediterrani.jpg" alt="Helena a la vora del mar, a l’alba" />
              <span className="photo-caption">{t.hero_photo}</span>
              <span className="hero-caption">{t.hero_img}</span>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="container marquee-inner">
            <span>{t.marquee1}</span>
            <i />
            <span>{t.marquee2}</span>
            <i />
            <span>{t.marquee3}</span>
            <i />
            <span>{t.marquee4}</span>
          </div>
        </div>

        <section id="historia" className="story container">
          <div className="story-grid">
            <div className="scene-photo story-photo">
              <img className="photo" src="/fotos/viatge-2023.jpg" alt="Helena durant el viatge del 2023, amb un paisatge de turons al darrere" />
              <span className="side-caption">2023</span>
              <span className="story-image-caption">{t.story_tag}</span>
            </div>
            <div className="story-copy">
              <p className="kicker">{t.chapter}</p>
              <p className="kicker muted">{t.story_small}</p>
              <h2 className="display">{t.story_title}</h2>
              <p>{t.story_p1}</p>
              <p>{t.story_p2}</p>
              <a className="text-link" href="#aigua">
                {t.nav_water} <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="quote-band" aria-label={t.pull_desc}>
          <div className="rings" aria-hidden="true" />
          <div className="container quote-inner">
            <h2 className="display">
              <span>{t.pull1}</span>
              <span>{t.pull2}</span>
              <span>{t.pull3}</span>
            </h2>
            <p>{t.pull_desc}</p>
          </div>
        </section>

        <section id="aigua" className="water container">
          <div className="water-grid">
            <div className="water-copy">
              <p className="kicker">{t.water_chapter}</p>
              <h2 className="display">{t.water_title}</h2>
              <p>{t.water_p}</p>
              <ul className="water-list">
                <li>{t.water_label1}</li>
                <li>{t.water_label2}</li>
                <li>{t.water_label3}</li>
              </ul>
              <a className="btn dark" href="#webinar">
                {t.water_cta} <span className="arrow">↘</span>
              </a>
              <p className="note">{t.water_note}</p>
            </div>
            <div className="water-art" aria-hidden="true">
              <span className="halo" />
              <span className="large-circle" />
              <span className="kicker k">{t.water_label1}</span>
              <span className="kicker a">02</span>
            </div>
          </div>
        </section>

        <section id="webinar" className="webinar container">
          <div className="webinar-wrap">
            <div className="webinar-top">
              <div>
                <p className="kicker">{t.webinar_kicker}</p>
                <h2 className="display">{t.webinar_title}</h2>
              </div>
              <p>{t.webinar_text}</p>
            </div>
            <div className="video-stage">
              <div className="video-inner">
                <button type="button" className="play-btn" aria-label={t.webinar_cta} onClick={() => setVentana('webinar')}>
                  ▶
                </button>
              </div>
              <span className="video-corner">HELENA SAIGI / 001</span>
              <span className="video-meta">{t.webinar_video}</span>
            </div>
            <div className="webinar-cta">
              <p className="kicker muted">{t.webinar_duration}</p>
              <button type="button" className="btn dark" onClick={() => setVentana('webinar')}>
                {t.webinar_cta} <span className="arrow">↗</span>
              </button>
            </div>
          </div>
        </section>

        <section id="vida" className="life container">
          <div className="life-hero">
            <Paisaje />
            <span>
              {t.marquee3} · {t.marquee4}
            </span>
          </div>
          <div className="life-text">
            <div>
              <p className="kicker">{t.life_kicker}</p>
              <h2 className="display">{t.life_title}</h2>
            </div>
            <div className="life-aside">
              <p>{t.life_text}</p>
              <p className="pull">{t.life_sub}</p>
            </div>
          </div>
          <div className="life-values">
            {[t.life_card_a, t.life_card_b, t.life_card_c].map((valor, i) => (
              <div key={i} className="value">
                <span>0{i + 1}</span>
                <strong>{valor}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="possibilitat" className="business">
          <div className="container business-grid">
            <div>
              <p className="kicker">{t.business_label}</p>
              <h2 className="display">{t.business_title}</h2>
            </div>
            <div>
              <p>{t.business_text}</p>
              <div className="business-actions">
                <a className="btn light" href="#aigua">{t.business_a}</a>
                <button type="button" className="btn dark" onClick={() => setVentana('negocio')}>
                  {t.business_b} <span className="arrow">↗</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="parlem" className="book container">
          <div className="book-grid">
            <div>
              <p className="kicker">{t.book_label}</p>
              <h2 className="display">{t.book_title}</h2>
              <p>{t.book_text}</p>
              <button type="button" className="btn dark" onClick={() => setVentana('reserva')}>
                {t.book_button} <span className="arrow">↗</span>
              </button>
            </div>
            <div className="book-calendar" aria-hidden="true">
              <div className="calendar-head">
                <span className="cal-id">HELENA / 30 MIN</span>
                <span className="cal-circle">↻</span>
              </div>
              <div className="calendar-filler">
                {Array.from({ length: 35 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="calendar-footer">
                <h3>{t.book_mock}</h3>
                <p>{t.book_mock2}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-flex">
            <div>
              <p className="brand">HELENA SAIGI</p>
              <p className="footer-head display">{t.footer}</p>
            </div>
            <p className="footer-right">
              {maqueta && `${t.footer_maqueta} · `}
              {t.footer_small}
            </p>
          </div>
          <div className="credits">
            <span>© {new Date().getFullYear()} {persona.nombre}</span>
            <nav aria-label="Legal">
              <Link to="/privacidad">{t.privacy}</Link>
              <Link to="/legal">{t.legal}</Link>
              <Link to="/cookies">{t.cookies}</Link>
            </nav>
          </div>
        </div>
      </footer>

      <Modal abierto={ventana === 'webinar'} etiqueta={t.modal_label} textoCerrar={t.modal_close} onCerrar={cerrar}>
        <p>{t.webinar_modal}</p>
      </Modal>

      <Modal
        abierto={ventana === 'reserva' || ventana === 'negocio'}
        etiqueta={ventana === 'negocio' ? t.business_label : t.book_label}
        textoCerrar={t.modal_close}
        onCerrar={cerrar}
        ancho
      >
        <h2 className="display">{ventana === 'negocio' ? t.business_b : t.book_title}</h2>
        <p>
          {t.book_modal} {t.book_form}
        </p>
        <Formulario persona={persona} origen={ventana === 'negocio' ? 'inicio-negocio' : 'inicio-reserva'} textoBoton={t.book_button} />
      </Modal>
    </>
  );
}
