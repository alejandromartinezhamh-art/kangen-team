import { StrictMode, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { urlFuentes, variablesCss } from './fuentes';

// Puente entre cada web y su editor visual (/editar, compartido/src/editor/).
// El editor pinta la web dentro de un iframe de la misma web: ahí la web toma el contenido que se está
// editando, se repinta en cada cambio y no envía nada a /api (ni leads ni emails de prueba).
// En la web publicada no hace nada especial.

/** Lo que vive en src/contenido.json de cada web. Las claves que empiezan por "_" son solo para el editor. */
export type Contenido = {
  colores?: Record<string, string>;
  fuentes?: Record<string, string>;
  fotos?: Record<string, string>;
  [clave: string]: unknown;
};

/** Lo que el editor deja en su ventana (window.__EDITOR__) para la web del iframe. */
export interface PuenteEditor {
  contenido: Contenido;
  repintar?: (contenido: Contenido) => void;
}

declare global {
  interface Window {
    __EDITOR__?: PuenteEditor;
  }
}

function puenteDelEditor(): PuenteEditor | null {
  if (typeof window === 'undefined' || window.parent === window) return null;
  try {
    // Solo una página de la misma web puede leerlo; desde otra web el navegador lo bloquea.
    return window.parent.__EDITOR__ ?? null;
  } catch {
    return null;
  }
}

/** La web se está viendo dentro del editor. */
export const enEditor = () => !!puenteDelEditor();

/** Router de cada web. */
export function Enrutador({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
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
      nuevo.forEach((v, i) => {
        if (esObjeto(v) && esObjeto(actual[i])) volcar(actual[i] as Record<string, unknown>, v);
        else actual[i] = esObjeto(v) ? { ...v } : v;
      });
      actual.length = nuevo.length;
    } else destino[clave] = nuevo;
  }
}

/** Colores y tipografías de contenido.json (la compilación ya los pone en el HTML; aquí, para el editor). */
function aplicarEstilos(contenido: Contenido) {
  for (const [variable, valor] of Object.entries(variablesCss(contenido))) {
    document.documentElement.style.setProperty(variable, valor);
  }
  const url = urlFuentes(contenido.fuentes);
  if (!url) return;
  let enlace = document.getElementById('fuentes-contenido') as HTMLLinkElement | null;
  if (!enlace) {
    enlace = Object.assign(document.createElement('link'), { id: 'fuentes-contenido', rel: 'stylesheet' });
    document.head.appendChild(enlace);
  }
  if (enlace.getAttribute('href') !== url) enlace.href = url;
}

// Dentro del editor, los formularios y eventos no llegan a la hoja: responden "ok" sin enviar nada.
function bloquearEnvios() {
  const original = window.fetch.bind(window);
  window.fetch = (entrada, opciones) => {
    const url = typeof entrada === 'string' ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
    if (new URL(url, location.href).pathname.startsWith('/api/')) {
      return Promise.resolve(new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } }));
    }
    return original(entrada, opciones);
  };
}

/** Arranca la web con los colores y fuentes de contenido.json; dentro del editor, se deja repintar. */
export function montar(App: ComponentType, contenido: Contenido) {
  const puente = puenteDelEditor();
  if (puente) {
    volcar(contenido, puente.contenido);
    bloquearEnvios();
  }
  aplicarEstilos(contenido);

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
      aplicarEstilos(contenido);
      pintar();
    };
  }
}
