import type { ConfigPersona } from '@equipo/compartido';
import contenido from './contenido.json';

// Datos de Gemma. Rellena los "PENDIENTE" antes de publicar.
export const persona: ConfigPersona = {
  id: 'gemma',
  nombre: 'Gemma',
  dominio: 'PENDIENTE',
  email: 'gemma.gov1986@gmail.com',
  // Solo números, con prefijo y sin "+". Sin él no salen los botones de WhatsApp.
  whatsapp: '34669001442',
  instagram: undefined,
  tiktok: undefined,
  legal: {
    titular: 'PENDIENTE',
    nif: 'PENDIENTE',
    domicilio: 'PENDIENTE',
    email: 'gemma.gov1986@gmail.com',
  },
};

// Todo lo editable (textos, colores, fotos y webinar) vive en contenido.json.
// Lo genera el editor de la web; también se puede cambiar a mano.
export const { textos, fotos } = contenido;
// Se lee al pintar (no al importar) para que el editor pueda cambiarlo.
export const webinar = () => contenido.webinarUrl;

// Embudo de Instagram: /l/instagram → /cuestionario → email con el webinar → /webinar.
// El vídeo es el "webinarUrl" de contenido.json (YouTube, Vimeo o .mp4). Vacío = aviso de "muy pronto"
// y el botón de WhatsApp sale desde el principio; con vídeo, al ver `porcentajeWhatsapp` %.
export const embudo = {
  nombreCompleto: 'Gemma Oña',
  subtitulo: 'Emprendimiento · Naturaleza · Tiempo',
  boton: 'Webinar: Otra manera de ganarse la vida',
  webinar: {
    titulo: 'Otra *manera* de ganarse la vida',
    subtitulo: 'Webinar gratuito · Emprendimiento y forma de vivir',
    texto:
      'Te cuento cómo estoy construyendo algo propio, a mi ritmo y con un equipo que me acompaña. Míralo con calma: al terminar podrás escribirme directamente por WhatsApp.',
    porcentajeWhatsapp: 80,
    mensajeWhatsapp: 'Hola Gemma, acabo de ver tu webinar y quiero más información.',
  },
};
