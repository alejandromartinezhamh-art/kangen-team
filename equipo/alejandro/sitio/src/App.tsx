import { Embudo } from '@equipo/compartido/embudo';
import { persona } from './config';
import contenido from './contenido.json';

// Toda la web sale de compartido/src/embudo; aquí solo van los datos de esta persona.
// webPublicada: la web principal (/) solo se publica cuando sus textos se han revisado con
// estrategia/normas-comunicacion.md; mientras, la raíz lleva a la página de Instagram.
export default function App() {
  return <Embudo persona={persona} contenido={contenido} webPublicada={true} />;
}
