// Cuestionario de /cuestionario (el paso entre Instagram y el webinar). Una pantalla por paso.
// Las preguntas se guardan en la hoja de Google con su texto como cabecera de columna, así que
// cambiar el texto de una pregunta crea una columna nueva. Normas: estrategia/normas-comunicacion.md
// (sin cifras de ingresos, sin promesas, sin producto, sin presentarlo como empleo).
//
// Marcas: *palabra* = cursiva en titulares; **texto** = negrita en párrafos.

export type Paso =
  /** Pantalla de solo texto con botón para seguir */
  | { tipo: 'info'; titulo: string; parrafos: string[]; lista?: string[]; cierre?: string[]; boton: string }
  /** Pregunta de opción única; avanza sola al elegir. 'final' = la última, con consentimiento y botón de enviar */
  | { tipo: 'opciones'; texto: string; antes?: string[]; lista?: string[]; despues?: string[]; opciones: string[]; final?: boolean }
  /** Pregunta abierta */
  | { tipo: 'texto'; texto: string; ayuda?: string; opcional?: boolean }
  /** Dato de contacto */
  | { tipo: 'campo'; campo: Campo; texto: string; ayuda?: string; placeholder: string; opcional?: boolean };

export type Campo = 'nombre' | 'instagram' | 'telefono' | 'email';

const pasos: Paso[] = [
    {
      tipo: 'info',
      titulo: '¿Y si tu trabajo no fuera la *única* opción?',
      parrafos: [
        'Si sientes que tu trabajo se lo lleva todo y te gustaría construir algo propio, este cuestionario de **1 minuto** te dirá si esta forma de emprender encaja contigo.',
      ],
      boton: 'Descubrir si es para mí',
    },
    {
      tipo: 'info',
      titulo: 'Hola, soy *Alejandro*',
      parrafos: [
        'Antes de empezar, quiero ser claro: esto **no es un empleo** ni un dinero rápido. Es un negocio propio, por cuenta propia, y lo que consigas depende de lo que tú le dediques.',
        'Por eso quiero que sepas cómo trabajo:',
      ],
      lista: [
        'No necesitas experiencia: aprendes desde cero.',
        'No lo haces en solitario: hay un equipo que te acompaña desde el primer día.',
        'Sin jefes ni horarios impuestos: lo organizas a tu ritmo.',
        'Puedes empezar compaginándolo con lo que ya haces.',
      ],
      cierre: [
        'Busco personas con ganas de construir algo propio con constancia, y me apasiona acompañarlas en ese camino.',
      ],
      boton: 'Seguir',
    },
    {
      tipo: 'opciones',
      antes: [
        'Las siguientes preguntas son para conocerte (menos de 1 minuto). Me ayudan a saber desde dónde partes y si es un buen momento para que trabajemos juntos.',
      ],
      texto: '¿Cuánto te *comprometes* a hacer un cambio en tu vida en los próximos 3-6 meses?',
      opciones: [
        'Al 100 %: estoy listo/a para actuar con constancia',
        'Me da curiosidad, pero aún no estoy listo/a para comprometerme',
      ],
    },
    {
      tipo: 'campo',
      campo: 'nombre',
      texto: '¿Cómo te *llamas*?',
      ayuda: 'Yo soy Alejandro, ¡con ganas de hablar contigo!',
      placeholder: 'Nombre y apellidos',
    },
    {
      tipo: 'campo',
      campo: 'instagram',
      texto: '¿Cuál es tu *Instagram*?',
      ayuda: 'Lo encuentras arriba del todo en tu perfil. Si no tienes, déjalo en blanco.',
      placeholder: '@tuusuario',
      opcional: true,
    },
    {
      tipo: 'campo',
      campo: 'telefono',
      texto: 'Tu *WhatsApp*',
      ayuda: 'Te escribiré yo personalmente, así que revisa que el número sea correcto.',
      placeholder: '600 000 000',
    },
    {
      tipo: 'campo',
      campo: 'email',
      texto: 'Tu *email*',
      ayuda: 'Al enviar el cuestionario te llega el enlace a mi webinar gratuito. Si no lo ves en unos minutos, mira en promociones o spam.',
      placeholder: 'tu@email.com',
    },
    {
      tipo: 'opciones',
      texto: '¿Qué describe *mejor* tu situación actual?',
      opciones: [
        'Trabajo a jornada completa por cuenta ajena',
        'Trabajo a media jornada por cuenta ajena',
        'Tengo mi propio negocio o soy autónomo/a',
        'Ahora mismo no estoy trabajando',
      ],
    },
    {
      tipo: 'opciones',
      antes: [
        '**Esto no es una oferta de empleo.**',
        'Como cualquier negocio, empezar requiere una inversión, y prefiero que lo sepas desde el principio.',
      ],
      texto: 'Sabiendo esto, ¿podrías *invertir* en un negocio si la oportunidad encaja contigo?',
      opciones: [
        'Sí, estoy preparado/a y tengo los medios',
        'Sí, me interesa, pero ahora mismo no tengo los medios y estaría abierto/a a buscar la forma',
        'No, ahora mismo no puedo o no quiero invertir',
      ],
    },
    {
      tipo: 'opciones',
      final: true,
      antes: ['**Una última cosa antes de enviar.** Para saber si esto es para ti hacen falta dos pasos:'],
      lista: ['Ver el webinar (te llega ahora a tu email).', 'Una conversación conmigo, por mensaje o llamada.'],
      despues: ['**Si no vas a responder a mis mensajes o no puedes dedicarle un rato a ver la información, mejor no sigas.**'],
      texto: '¿Seguimos?',
      opciones: [
        'Sí, quiero que hablemos por WhatsApp y le dedicaré un rato a ver la información',
        'Ahora no tengo tiempo para hablar, solo quiero ver el webinar',
      ],
    },
];

export const cuestionario = {
  pasos,
  boton: 'Enviar',
  gracias: {
    titulo: 'Listo, ya lo tienes en tu *email*',
    texto: 'Si no lo ves en unos minutos, mira en promociones o spam. También puedes verlo ahora mismo.',
    boton: 'Ver el webinar ahora',
    whatsapp: 'Escríbeme por WhatsApp',
    mensajeWhatsapp: 'Hola Alejandro, acabo de rellenar tu cuestionario y quiero más información.',
  },
};
