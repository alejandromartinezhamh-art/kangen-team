import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Gemma. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'gemma',
  nombre: 'Gemma',
  dominio: 'PENDIENTE',
  email: 'PENDIENTE',
  whatsapp: undefined,
  instagram: undefined,
  tiktok: undefined,
  legal: {
    titular: 'PENDIENTE',
    nif: 'PENDIENTE',
    domicilio: 'PENDIENTE',
    email: 'PENDIENTE',
  },
};

// Todo lo editable (textos, colores, fotos y webinar) vive en contenido.json.
// Lo genera el editor de la web; también se puede cambiar a mano.
export const { textos, fotos } = contenido;
// Se lee al pintar (no al importar) para que el editor pueda cambiarlo.
export const webinar = () => contenido.webinarUrl;
