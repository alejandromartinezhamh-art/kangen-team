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

// Enlace "embed" del webinar (YouTube, Vimeo…). Mientras esté vacío se muestra el espacio reservado.
export const webinarUrl = '';

// Textos de la web principal, sacados del design.md de Gemma (Drive: 08 Design).
// Son provisionales: el diseño no cambia aunque se reescriban.
export const textos = {
  marcaLinea: 'AGUA · RITUALES · VIDA',
  nav: { historia: 'La historia', agua: 'El agua', vida: 'Otra manera', hablamos: '¿Hablamos?' },

  heroEyebrow: 'AGUA · NATURALEZA · FORMA DE VIVIR',
  heroTitular: ['Quizá no haga falta', 'cambiarlo todo.', 'Quizá solo sea', 'empezar por el agua.'],
  heroTexto:
    'Una historia real sobre hidratación, rituales cotidianos y la libertad de construir una vida más parecida a la que quieres vivir.',
  heroCta: 'Descubre la historia',
  heroCta2: 'Ver el webinar',
  heroFoto: 'LA CALMA TAMBIÉN ES UNA FORMA DE VIVIR',
  heroMeta: 'Mediterráneo · 06:42 h',

  palabras: ['HIDRATACIÓN', 'CONSCIENCIA', 'NATURALEZA', 'TIEMPO'],

  historiaCapitulo: '01 / EL COMIENZO',
  historiaEntradilla: 'A VECES, EL PRINCIPIO NO ES LO QUE ESPERABAS.',
  historiaTitulo: 'Un viaje en 2023. Una persona inesperada. Y una nueva forma de mirar las cosas.',
  historiaParrafos: [
    'Aquel año me fui de viaje con personas que no conocía. Una de ellas se convertiría en una amiga muy importante. Fue ella quien me habló, por primera vez, de Kangen.',
    'Estaba en un momento personal lleno de preguntas, revisando mis hábitos de salud y afrontando mucho estrés laboral. No buscaba un negocio: quería comprender mejor cómo cuidarme cada día.',
  ],
  historiaFoto: 'GEMMA OÑA · UNA HISTORIA PERSONAL',
  historiaEnlace: 'Un nuevo ritual',

  frase: ['Lo que bebemos.', 'Lo que hacemos.', 'Cómo vivimos.'],
  fraseTexto:
    'Hay pequeñas decisiones que, si las miras con atención, te hacen replantearte cosas mucho mayores.',

  aguaCapitulo: '02 / UN NUEVO RITUAL',
  aguaTitulo: 'El agua ya formaba parte de mi vida. Solo empecé a mirarla de otra manera.',
  aguaTexto:
    'Habíamos cambiado las garrafas de plástico por botellas de vidrio. Después descubrí una tecnología para tratar el agua del grifo en casa. Me interesó cómo funcionaba y también la comodidad: menos botellas que cargar y almacenar.',
  aguaLista: ['Una elección cotidiana', 'Más sencillez en casa', 'Menos dependencia del agua embotellada'],
  aguaNota:
    'La tecnología Kangen combina filtración y electrólisis; las características y usos dependen del modelo y del agua de entrada.',
  aguaCta: 'Conocer la experiencia',

  webinarKicker: 'UNA CONVERSACIÓN PARA EMPEZAR',
  webinarTitulo: '¿Y si lo hablamos con calma?',
  webinarTexto:
    'He preparado un espacio para explicar qué descubrí, cómo funciona la tecnología y por qué este camino también me hizo reflexionar sobre el tiempo, el trabajo y la vida que quiero construir.',
  webinarMeta: 'VÍDEO DE PRESENTACIÓN · PRÓXIMAMENTE',
  webinarPie: 'Una presentación tranquila, para verla cuando quieras.',
  webinarCta: 'Ver el webinar',
  webinarPendiente: 'El webinar estará disponible muy pronto. Mientras tanto, si quieres, lo hablamos directamente.',

  vidaFoto: 'LA MONTAÑA, LA PLAYA, EL TIEMPO',
  vidaCapitulo: '03 / VIVIR BIEN, CADA DÍA',
  vidaTitulo: 'La vida que me gusta no empieza cuando termino de trabajar.',
  vidaTexto:
    'La montaña. La playa por la mañana. Hacer deporte. Salir con mi perra. Tener tiempo para las personas que me importan. No son premios para después del trabajo: también son mi vida.',
  vidaFrase: 'No busco una vida perfecta. Busco una manera más consciente de vivirla.',
  valores: ['Más naturaleza.', 'Más presencia.', 'Más tiempo para lo importante.'],

  negocioEtiqueta: 'UNA POSIBILIDAD QUE LLEGÓ DESPUÉS',
  negocioTitulo: 'Primero fue el agua. Más adelante, la posibilidad de construir más opciones.',
  negocioTexto:
    'Mi profesión está vinculada a los datos, los mercados y las ventas. Cuando entendí que Enagic trabaja con distribuidores independientes, empecé a explorar su dimensión profesional. No es una promesa de libertad económica ni de ingresos garantizados: es una actividad comercial que requiere dedicación.',
  negocioA: 'Me interesa el agua',
  negocioB: 'Quiero conocer el negocio',

  hablamosEtiqueta: 'UNA CONVERSACIÓN, SIN PRISAS',
  hablamosTitulo: '¿Te ha despertado curiosidad?',
  hablamosTexto:
    'Podemos hablar del agua, de los distintos equipos o de cómo funciona el modelo de distribución independiente. Sin compromiso. Sin prisas.',
  hablamosBoton: 'Reservar una conversación',

  pieFrase: 'Vivir bien también es una decisión cotidiana.',
  pieNota: 'Gemma Oña es distribuidora independiente de Enagic.',
};
