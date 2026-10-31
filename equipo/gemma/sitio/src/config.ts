import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Gemma. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'gemma',
  nombre: 'Gemma',
  dominio: 'gemma-ona.vercel.app',
  email: 'gemma.gov1986@gmail.com',
  // Su WhatsApp vive en contenido.json (enlaces.whatsapp) para poder cambiarlo desde el editor.
  // Sin él no salen los botones de WhatsApp.
  get whatsapp() {
    return contenido.enlaces.whatsapp.replace(/\D/g, '') || undefined;
  },
  instagram: undefined,
  tiktok: undefined,
  legal: {
    titular: 'PENDIENTE',
    nif: 'PENDIENTE',
    domicilio: 'PENDIENTE',
    email: 'gemma.gov1986@gmail.com',
  },
};

// Todo lo demás (textos, colores, fuentes, fotos, enlaces y emails) vive en contenido.json y lo cambia el
// editor de la web (/editar). Las páginas son las de compartido/src/embudo.
