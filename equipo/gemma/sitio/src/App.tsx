import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Enrutador, Privacidad, AvisoLegal, Cookies } from '@equipo/compartido';
import { persona } from './config';
import Inicio from './paginas/Inicio';
import Webinar from './paginas/Webinar';
import Cuestionario from './paginas/Cuestionario';
import { landings } from './landings';

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
        <Route path="/" element={webPublicada || window.__EDITOR__ ? <Inicio /> : <Navigate to="/l/instagram" replace />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/cuestionario" element={<Cuestionario />} />
        <Route path="/l/:slug" element={<Landing />} />
        <Route path="/privacidad" element={<Privacidad persona={persona} />} />
        <Route path="/legal" element={<AvisoLegal persona={persona} />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Enrutador>
  );
}
