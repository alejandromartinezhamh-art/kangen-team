import type { ConfigPersona } from '@equipo/compartido';

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

// Textos de la web principal. Todo habla de negocio y estilo de vida, nunca de producto
// (ver estrategia/normas-comunicacion.md).
export const textos = {
  titular: 'Estoy construyendo la vida que quiero, con un equipo que me acompaña.',
  subtitular:
    'Un proyecto propio, a tu ritmo, con formación y un equipo que te acompaña desde el primer día.',
  dolores: [
    'Sientes que tu trabajo ocupa todo tu tiempo y no te deja crecer.',
    'Tienes ganas de emprender, pero no sabes por dónde empezar.',
    'Buscas un proyecto complementario que encaje con tu vida actual.',
  ],
  pilares: [
    { titulo: 'Flexibilidad', texto: 'Tú decides cuánto tiempo le dedicas y cómo lo organizas.' },
    { titulo: 'Formación', texto: 'Aprendes marketing, comunicación y liderazgo desde cero.' },
    { titulo: 'Equipo', texto: 'Trabajamos juntos: formaciones, quedadas y apoyo diario.' },
    { titulo: 'Crecimiento personal', texto: 'Mentalidad, hábitos y confianza para salir de tu zona de confort.' },
  ],
  historia: [
    'PENDIENTE: cuenta en 2-3 párrafos cortos por qué empezaste, qué buscabas y qué ha cambiado en tu día a día.',
    'Habla de tiempo, aprendizaje y personas. Sin cifras de dinero.',
  ],
};
