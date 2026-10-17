import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Anna. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'anna',
  nombre: 'Anna',
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
export const { textos, fotos } = contenido;
// Se lee al pintar (no al importar) para que el editor pueda cambiarlo.
export const webinar = () => contenido.webinarUrl;
