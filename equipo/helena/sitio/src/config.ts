import type { ConfigPersona } from '@equipo/compartido';

// Datos de Helena. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'helena',
  nombre: 'Helena Saigi',
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

// Mientras sea true se ve la franja "Proposta visual" y el aviso de maqueta en el pie.
// Ponlo a false cuando el equipo apruebe estructura y textos.
export const maqueta = true;

// Los textos de la web están en src/textos.ts (catalán, castellano e inglés).
