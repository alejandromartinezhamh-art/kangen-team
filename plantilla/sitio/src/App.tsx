import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Enrutador, Privacidad, AvisoLegal, Cookies } from '@equipo/compartido';
import type { PaginaEditor } from '@equipo/compartido/editor';
import { persona } from './config';
import contenido from './contenido.json';
import Inicio from './paginas/Inicio';
import { landings } from './landings';

// Editor visual (/editar): solo se descarga al abrirlo.
const Editor = lazy(() => import('@equipo/compartido/editor'));

// Páginas que se pueden editar y qué parte de contenido.json pinta cada una.
// Al añadir una página o landing con textos propios: su sección en contenido.json y una línea aquí.
const paginasEditor: PaginaEditor[] = [{ nombre: 'Web', ruta: '/', secciones: ['textos'] }];

function Landing() {
  const { slug = '' } = useParams();
  const Pagina = landings[slug];
  return Pagina ? <Pagina /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Enrutador>
      <Routes>
        <Route path="/" element={<Inicio />} />
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
