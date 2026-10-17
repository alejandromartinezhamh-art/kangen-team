import { useEffect, useState } from 'react';
import { idiomas, textos, type Idioma } from './textos';

const CLAVE = 'helena-idioma';

function inicial(): Idioma {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado && (idiomas as readonly string[]).includes(guardado)) return guardado as Idioma;
  } catch {
    // Sin almacenamiento (modo privado): se queda el catalán.
  }
  return 'ca';
}

// Idioma de la web: catalán por defecto, recuerda la elección y actualiza <html lang>.
export function useIdioma() {
  const [idioma, setIdioma] = useState<Idioma>(inicial);

  useEffect(() => {
    document.documentElement.lang = idioma;
    try {
      localStorage.setItem(CLAVE, idioma);
    } catch {
      // Ignorado: el idioma sigue funcionando en esta visita.
    }
  }, [idioma]);

  return { idioma, setIdioma, t: textos[idioma] };
}
