// Cuestionario de /cuestionario (el paso entre Instagram y el webinar). Una pregunta por pantalla.
// Cada pregunta se guarda como columna en la hoja de Google con su texto como cabecera, así que
// cambiar el texto de una pregunta crea una columna nueva. Normas: estrategia/normas-comunicacion.md.
//
// PROVISIONAL: preguntas de partida hasta tener la versión definitiva.

export interface Pregunta {
  /** Texto de la pregunta; *palabra* va en cursiva */
  texto: string;
  ayuda?: string;
  tipo: 'opciones' | 'texto';
  opciones?: string[];
  /** Solo en 'texto': si se puede dejar en blanco */
  opcional?: boolean;
}

export const cuestionario = {
  titulo: 'Antes del *webinar*, cuéntame un poco de ti',
  entradilla: 'Son 5 preguntas rápidas. Así sé desde dónde partes y te envío el webinar a tu email.',
  boton: 'Empezar',
  preguntas: [
    {
      texto: '¿Qué te describe *mejor* ahora mismo?',
      tipo: 'opciones',
      opciones: ['Trabajo por cuenta ajena', 'Soy autónomo/a o tengo negocio', 'Estoy estudiando', 'Estoy buscando algo nuevo', 'Otra situación'],
    },
    {
      texto: '¿Qué te gustaría *cambiar* en tu día a día?',
      tipo: 'opciones',
      opciones: ['Tener más tiempo para mí y los míos', 'Construir algo propio', 'Un proyecto complementario a lo que hago', 'Crecer y aprender cosas nuevas'],
    },
    {
      texto: '¿Cuánto tiempo podrías dedicarle a la *semana*?',
      tipo: 'opciones',
      opciones: ['Menos de 3 horas', 'Entre 3 y 5 horas', 'Entre 5 y 10 horas', 'Más de 10 horas'],
    },
    {
      texto: '¿Has *emprendido* alguna vez?',
      tipo: 'opciones',
      opciones: ['Sí, y sigo con ello', 'Sí, pero lo dejé', 'Nunca, sería la primera vez'],
    },
    {
      texto: '¿Qué es lo que más te *frena* ahora mismo?',
      ayuda: 'Con una frase me basta.',
      tipo: 'texto',
      opcional: true,
    },
  ] satisfies Pregunta[],
  datos: {
    titulo: '¿A dónde te *envío* el webinar?',
    texto: 'Te llega al momento a tu email. Si me das tu WhatsApp, te escribo yo para resolver dudas.',
    boton: 'Enviarme el webinar',
  },
  gracias: {
    titulo: 'Listo, ya lo tienes en tu *email*',
    texto: 'Si no lo ves en unos minutos, mira en promociones o spam. También puedes verlo ahora mismo.',
    boton: 'Ver el webinar ahora',
  },
};
