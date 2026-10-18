import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de __NOMBRE__. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: '__ID__',
  nombre: '__NOMBRE__',
  dominio: 'PENDIENTE',
  email: 'PENDIENTE',
  // Su WhatsApp vive en contenido.json (enlaces.whatsapp) para poder cambiarlo desde el editor.
  get whatsapp() {
    return contenido.enlaces.whatsapp.replace(/\D/g, '') || undefined;
  },
  instagram: undefined,
  tiktok: undefined,
  legal: {
    titular: 'PENDIENTE',
    nif: 'PENDIENTE',
    domicilio: 'PENDIENTE',
    email: 'PENDIENTE',
  },
};

// Todo lo que se ve (textos, colores, letras, fotos y enlaces) vive en contenido.json, para poder
// cambiarlo desde el editor de la web (/editar). Ningún texto visible se escribe en los componentes.
// Todo habla de negocio y estilo de vida, nunca de producto (ver estrategia/normas-comunicacion.md).
export const { textos, fotos } = contenido;
