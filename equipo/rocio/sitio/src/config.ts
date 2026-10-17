import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Rocío. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'rocio',
  nombre: 'Rocío',
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
