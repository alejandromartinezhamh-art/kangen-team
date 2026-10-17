import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Privacidad, AvisoLegal, Cookies } from '@equipo/compartido';
import { persona } from './config';
import Inicio from './paginas/Inicio';
import { landings } from './landings';

function Landing() {
  const { slug = '' } = useParams();
  const Pagina = landings[slug];
  return Pagina ? <Pagina /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/l/:slug" element={<Landing />} />
        <Route path="/privacidad" element={<Privacidad persona={persona} />} />
        <Route path="/legal" element={<AvisoLegal persona={persona} />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
