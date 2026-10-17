import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Alejandro. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'alejandro',
  nombre: 'Alejandro',
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

// Textos, colores, foto y vídeo del webinar: en contenido.json (es lo que cambia el editor visual).
// Todo habla de negocio y estilo de vida, nunca de producto (ver estrategia/normas-comunicacion.md).
// El vídeo del webinar puede ser un enlace de YouTube (mejor "oculto"), de Vimeo o un archivo .mp4.
// Vacío = se muestra un aviso de "disponible muy pronto".
export const { textos, fotos, webinar } = contenido;
