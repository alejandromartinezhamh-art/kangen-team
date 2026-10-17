import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de __NOMBRE__. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: '__ID__',
  nombre: '__NOMBRE__',
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

// Textos, colores y fotos: en contenido.json (es lo que cambia el editor visual).
export const { textos } = contenido;
