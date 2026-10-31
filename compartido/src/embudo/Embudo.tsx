import { lazy, Suspense, useMemo, type ComponentType } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Privacidad, AvisoLegal, Cookies } from '../Legal';
import { Enrutador, enEditor } from '../puente';
import type { ConfigPersona } from '../tipos';
import type { PaginaEditor } from '../editor/Editor';
import { ContextoEmbudo } from './contexto';
import type { ContenidoEmbudo } from './tipos';
import Inicio from './Inicio';
import Instagram from './Instagram';
import Cuestionario from './Cuestionario';
import Webinar from './Webinar';

// La web entera de una persona del equipo: Instagram (/l/instagram) → cuestionario (/cuestionario) → email con
// el webinar → webinar (/webinar), más la web principal (/), las páginas legales y el editor visual (/editar).
// El código es el mismo para todas; cada web solo pone su persona (config.ts), su contenido.json (textos,
// colores, fotos, enlaces y emails), sus fotos y sus colores de partida (index.css).

// Editor visual (/editar): solo se descarga al abrirlo.
const Editor = lazy(() => import('../editor/Editor'));

interface Props {
  persona: ConfigPersona;
  /** src/contenido.json de la web */
  contenido: ContenidoEmbudo;
  /**
   * La web principal (/) ya está revisada con estrategia/normas-comunicacion.md y se publica.
   * Mientras no, la raíz lleva a la página de Instagram (en el editor se ve siempre).
   */
  webPublicada?: boolean;
  /** % del webinar que hay que ver para que salga el botón de WhatsApp (sin vídeo sale desde el principio) */
  porcentajeWhatsapp?: number;
  /** Landings extra, una por campaña o anuncio para medir qué funciona: /l/<clave> → página */
  landings?: Record<string, ComponentType>;
}

export function Embudo({ persona, contenido, webPublicada = false, porcentajeWhatsapp = 80, landings = {} }: Props) {
  const todas: Record<string, ComponentType> = { instagram: Instagram, ...landings };

  // Páginas que se pueden editar y qué parte de contenido.json pinta cada una.
  const paginasEditor: PaginaEditor[] = [
    { nombre: 'Instagram', ruta: '/l/instagram', secciones: ['general', 'instagram'] },
    { nombre: 'Cuestionario', ruta: '/cuestionario', secciones: ['general', 'cuestionario'], pasos: contenido.cuestionario.pasos.length },
    { nombre: 'Webinar', ruta: '/webinar', secciones: ['general', 'webinar'] },
    { nombre: 'Emails', secciones: ['email'], email: true },
    { nombre: webPublicada ? 'Web' : 'Web (aún sin publicar)', ruta: '/', secciones: ['textos'] },
  ];

  // Mismo objeto mientras no cambien: las páginas no se repintan de más.
  const datos = useMemo(() => ({ persona, contenido, porcentajeWhatsapp }), [persona, contenido, porcentajeWhatsapp]);

  return (
    <ContextoEmbudo.Provider value={datos}>
      <Enrutador>
        <Routes>
          <Route path="/" element={webPublicada || enEditor() ? <Inicio /> : <Navigate to="/l/instagram" replace />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/cuestionario" element={<Cuestionario />} />
          <Route path="/l/:slug" element={<Landing landings={todas} />} />
          <Route path="/privacidad" element={<Privacidad persona={persona} />} />
          <Route path="/legal" element={<AvisoLegal persona={persona} />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route
            path="/editar"
            element={
              <Suspense fallback={null}>
                <Editor id={persona.id} nombre={persona.nombre} contenido={contenido} paginas={paginasEditor} />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Enrutador>
    </ContextoEmbudo.Provider>
  );
}

function Landing({ landings }: { landings: Record<string, ComponentType> }) {
  const { slug = '' } = useParams();
  const Pagina = landings[slug];
  return Pagina ? <Pagina /> : <Navigate to="/" replace />;
}
