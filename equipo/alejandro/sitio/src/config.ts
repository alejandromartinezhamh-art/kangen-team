import type { ConfigPersona } from '@equipo/compartido';

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

// Textos de la web principal. Todo habla de negocio y estilo de vida, nunca de producto
// (ver estrategia/normas-comunicacion.md).
export const textos = {
  subtitulo: 'Emprendimiento y bienestar',
  titular: 'Otra *manera* de ganarse la vida',
  entradilla:
    'Construye algo propio, a tu ritmo y con un equipo que te acompaña desde el primer día. Sin jefes, sin horarios impuestos, sin hacerlo en solitario.',
  dolores: [
    'Tu trabajo ocupa todo tu tiempo y no te deja crecer.',
    'Tienes ganas de emprender, pero no sabes por dónde empezar ni con quién.',
    'Buscas un proyecto complementario que encaje con la vida que ya tienes.',
  ],
  pilares: [
    { titulo: 'Flexibilidad', texto: 'Tú decides cuánto tiempo le dedicas y cómo lo organizas.' },
    { titulo: 'Formación', texto: 'Marketing, comunicación y liderazgo, aprendidos desde cero.' },
    { titulo: 'Equipo', texto: 'Formaciones, quedadas y apoyo real en el día a día.' },
    { titulo: 'Bienestar', texto: 'Hábitos, mentalidad y tiempo para lo que de verdad importa.' },
  ],
  historia: [
    'PENDIENTE: cuenta en 2-3 párrafos cortos por qué empezaste, qué buscabas y qué ha cambiado en tu día a día.',
    'Habla de tiempo, aprendizaje y personas. Sin cifras de dinero.',
  ],
};

// Página del webinar (/webinar). El vídeo puede ser un enlace de YouTube (mejor "oculto"),
// de Vimeo o un archivo .mp4. Vacío = se muestra un aviso de "disponible muy pronto".
export const webinar = {
  titulo: 'Otra *manera* de ganarse la vida',
  subtitulo: 'Webinar gratuito · Emprendimiento y bienestar',
  video: '',
};
