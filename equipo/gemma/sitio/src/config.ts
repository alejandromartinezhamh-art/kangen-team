import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Gemma. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'gemma',
  nombre: 'Gemma',
  dominio: 'PENDIENTE',
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

// Todo lo editable (textos, colores, fuentes, fotos, enlaces y emails) vive en contenido.json.
// Lo cambia el editor de la web (/editar); también se puede cambiar a mano.
export const { textos, fotos } = contenido;
// Se lee al pintar (no al importar) para que el editor pueda cambiarlo.
export const webinar = () => contenido.enlaces.webinar;

// Embudo de Instagram: /l/instagram → /cuestionario → email con el webinar → /webinar.
// El vídeo es enlaces.webinar de contenido.json (YouTube, Vimeo o .mp4). Vacío = aviso de "muy pronto"
// y el botón de WhatsApp sale desde el principio; con vídeo, al ver `porcentajeWhatsapp` %.
export const embudo = {
  general: contenido.general,
  instagram: contenido.instagram,
  webinar: contenido.webinar,
  porcentajeWhatsapp: 80,
};
