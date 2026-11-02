// Forma del curso común (compartido/curso/curso.json). Lo sirve /api/curso solo a quien entra con su email y su
// contraseña (las da el CRM), así que no va en el código de la web. Estructura y guiones: estrategia/curso.md.
//
// Textos de las lecciones: una línea por párrafo; '- ' al principio = punto de una lista; **texto** = negrita.

export type Bloque =
  /** Tabla de rangos (cifras.rangos) */
  | { tipo: 'rangos' }
  /** Maneras de empezar (cifras.paquetes) */
  | { tipo: 'paquetes' }
  /** ¿En qué venta recuperas la inversión? (cifras.paquetes) */
  | { tipo: 'calculadora' }
  | { tipo: 'enlaces'; enlaces: { texto: string; url: string }[] };

export interface Leccion {
  id: string;
  titulo: string;
  /** Duración del vídeo, aproximada ("6 min") */
  duracion: string;
  /** YouTube (oculto), Vimeo o .mp4. Vacío = "vídeo en preparación" y se lee el texto */
  video: string;
  texto: string[];
  bloques?: Bloque[];
  /**
   * bienvenida: vídeo y texto de cada persona (contenido.json → curso y enlaces.curso).
   * final: el botón de WhatsApp (contenido.json → curso).
   */
  tipo?: 'bienvenida' | 'final';
  /** No cuenta para el progreso (extras) */
  opcional?: boolean;
}

export interface Modulo {
  id: string;
  titulo: string;
  lecciones: Leccion[];
}

export interface Paquete {
  id: string;
  nombre: string;
  incluye: string;
  /** Sin IVA. null = sin confirmar */
  precio: number | null;
  /** Rango con el que se empieza */
  rango: string;
  /** Comisión de la propia compra */
  comisionInicial: number | null;
  /** Comisión de la 1.ª, 2.ª, 3.ª… venta del mismo paquete */
  comisiones: number[];
}

export interface Cifras {
  /** Precios y rangos comprobados con la documentación oficial */
  confirmadas: boolean;
  /** Enagic ha aprobado por escrito enseñar comisiones y la calculadora */
  comisionesAprobadas: boolean;
  fuente: string;
  iva: number;
  rangos: { rango: string; ventas: string; puntos: number }[];
  paquetes: Paquete[];
  aviso: string;
  sinPrecio: string;
  sinRangos: string;
  sinComisiones: string;
}

export interface Curso {
  revision: string;
  modulos: Modulo[];
  cifras: Cifras;
}

/** Las lecciones que cuentan para el progreso, en orden. */
export const leccionesObligatorias = (curso: Curso) =>
  curso.modulos.flatMap((m) => m.lecciones).filter((l) => !l.opcional);
