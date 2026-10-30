import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Enrutador, Privacidad, AvisoLegal, Cookies, enEditor } from '@equipo/compartido';
import type { PaginaEditor } from '@equipo/compartido/editor';
import { persona } from './config';
import contenido from './contenido.json';
import Inicio from './paginas/Inicio';
import Webinar from './paginas/Webinar';
import Cuestionario from './paginas/Cuestionario';
import { landings } from './landings';

// Editor visual (/editar): solo se descarga al abrirlo.
const Editor = lazy(() => import('@equipo/compartido/editor'));

// Páginas que se pueden editar y qué parte de contenido.json pinta cada una.
const paginasEditor: PaginaEditor[] = [
  { nombre: 'Instagram', ruta: '/l/instagram', secciones: ['general', 'instagram'] },
  { nombre: 'Cuestionario', ruta: '/cuestionario', secciones: ['general', 'cuestionario'], pasos: contenido.cuestionario.pasos.length },
  { nombre: 'Webinar', ruta: '/webinar', secciones: ['general', 'webinar'] },
  { nombre: 'Emails', secciones: ['email'], email: true },
  { nombre: 'Web (aún sin publicar)', ruta: '/', secciones: ['textos'] },
];

function Landing() {
  const { slug = '' } = useParams();
  const Pagina = landings[slug];
  return Pagina ? <Pagina /> : <Navigate to="/" replace />;
}

// La web (Inicio) no se publica hasta revisar sus textos con estrategia/normas-comunicacion.md:
// mientras, la raíz lleva a la página de Instagram. En el editor se ve siempre.
const webPublicada = false;

export default function App() {
  return (
    <Enrutador>
      <Routes>
        <Route path="/" element={webPublicada || enEditor() ? <Inicio /> : <Navigate to="/l/instagram" replace />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/cuestionario" element={<Cuestionario />} />
        <Route path="/l/:slug" element={<Landing />} />
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
  );
}
