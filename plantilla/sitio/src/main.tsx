import { montar } from '@equipo/compartido';
import App from './App';
import contenido from './contenido.json';
import './index.css';

// montar() aplica los colores y letras de contenido.json y deja que el editor (/editar) repinte la web.
montar(App, contenido);
