import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { colores } from './config';
import './index.css';

// Los colores de contenido.json sustituyen a los de index.css
for (const [nombre, valor] of Object.entries(colores)) {
  document.documentElement.style.setProperty(`--color-${nombre}`, valor);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
