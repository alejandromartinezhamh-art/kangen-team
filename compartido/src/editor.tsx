import { StrictMode, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Puente entre cada web y el editor visual (compartido/editor/).
// En la web publicada no hace nada especial; dentro del editor, la web se pinta con el
// contenido que se está editando y se repinta en cada cambio.

/** Lo que vive en src/contenido.json de cada web. Las claves que empiezan por "_" son solo para el editor. */
export type Contenido = {
  colores?: Record<string, string>;
  fotos?: Record<string, string>;
  [clave: string]: unknown;
};

interface PuenteEditor {
  contenido: Contenido;
  repintar?: (contenido: Contenido) => void;
}

declare global {
  interface Window {
    __EDITOR__?: PuenteEditor;
  }
}

const enEditor = () => typeof window !== 'undefined' && !!window.__EDITOR__;

/** Router de cada web: en el editor no toca la barra de direcciones. */
export function Enrutador({ children }: { children: ReactNode }) {
  return enEditor() ? <MemoryRouter>{children}</MemoryRouter> : <BrowserRouter>{children}</BrowserRouter>;
}

const esObjeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

// Copia `origen` dentro de `destino` sin cambiar las referencias, para que los módulos que ya
// importaron partes de contenido.json (textos, fotos…) vean los valores nuevos.
function volcar(destino: Record<string, unknown>, origen: Record<string, unknown>) {
  for (const clave of Object.keys(origen)) {
    const nuevo = origen[clave];
    const actual = destino[clave];
    if (esObjeto(nuevo) && esObjeto(actual)) volcar(actual, nuevo);
    else if (Array.isArray(nuevo) && Array.isArray(actual)) {
      actual.length = 0;
      nuevo.forEach((v) => actual.push(esObjeto(v) ? { ...v } : v));
    } else destino[clave] = nuevo;
  }
}

function aplicarColores(colores: Contenido['colores']) {
  for (const [nombre, valor] of Object.entries(colores ?? {})) {
    document.documentElement.style.setProperty(`--color-${nombre}`, valor);
  }
}

/** Arranca la web: aplica los colores de contenido.json y, dentro del editor, se deja repintar. */
export function montar(App: ComponentType, contenido: Contenido) {
  const puente = enEditor() ? window.__EDITOR__! : null;
  if (puente) volcar(contenido, puente.contenido);
  aplicarColores(contenido.colores);

  const raiz = createRoot(document.getElementById('root')!);
  const pintar = () =>
    raiz.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  pintar();

  if (puente) {
    puente.repintar = (nuevo) => {
      volcar(contenido, nuevo);
      aplicarColores(contenido.colores);
      pintar();
    };
  }
}
