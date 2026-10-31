import type { ConfigPersona } from '../tipos';
import type { Contenido } from '../puente';

// Forma de src/contenido.json de las webs con embudo (Instagram → cuestionario → email → webinar).
// Todo lo editable vive ahí y lo cambia el editor (/editar); el código de las páginas es el mismo para todas.
//
// Cuestionario: una pantalla por paso. Cada respuesta se guarda en la hoja de Google en la columna "columna"
// de su pregunta, que no cambia aunque se edite el texto de la pregunta (así la hoja no se parte en columnas
// nuevas). Pregunta nueva = columna nueva en la hoja. Normas: estrategia/normas-comunicacion.md
// (sin cifras de ingresos, sin promesas, sin producto, sin presentarlo como empleo).
//
// Marcas: *palabra* = cursiva en titulares; **texto** = negrita en párrafos.

export type Paso =
  /** Pantalla de solo texto con botón para seguir */
  | { tipo: 'info'; titulo: string; parrafos: string[]; lista?: string[]; cierre?: string[]; boton: string }
  /** Pregunta de opción única; avanza sola al elegir. 'final' = la última, con consentimiento y botón de enviar */
  | {
      tipo: 'opciones';
      texto: string;
      /** Cabecera de su columna en la hoja */
      columna: string;
      antes?: string[];
      lista?: string[];
      despues?: string[];
      opciones: string[];
      final?: boolean;
    }
  /** Pregunta abierta */
  | { tipo: 'texto'; texto: string; columna: string; ayuda?: string; opcional?: boolean }
  /** Dato de contacto */
  | { tipo: 'campo'; campo: Campo; texto: string; ayuda?: string; placeholder: string; opcional?: boolean };

export type Campo = 'nombre' | 'instagram' | 'telefono' | 'email';

interface Titulado {
  titulo: string;
  texto: string;
}

/** Lo que el embudo lee de contenido.json. El editor solo cambia textos: no añade ni quita pasos,
 *  ni toca "tipo", "campo" ni "columna". */
export type ContenidoEmbudo = Contenido & {
  fotos: { retrato: string; email?: string };
  enlaces: { webinar: string; whatsapp: string };
  general: { marca: string };
  instagram: { barra: string; etiqueta: string; boton: string; privacidad: string };
  cuestionario: {
    etiqueta: string;
    atras: string;
    siguiente: string;
    placeholderRespuesta: string;
    /** Paso[]: el JSON no distingue los tipos, se comprueban al leerlo */
    pasos: readonly object[];
    boton: string;
    enviando: string;
    error: string;
    gracias: { etiqueta: string; titulo: string; texto: string; boton: string; whatsapp: string; mensajeWhatsapp: string };
  };
  webinar: {
    barra: string;
    etiqueta: string;
    titulo: string;
    texto: string;
    prontoEtiqueta: string;
    prontoTitulo: string;
    prontoTexto: string;
    visto: string;
    siguienteEtiqueta: string;
    siguienteTitulo: string;
    textoAntes: string;
    textoWhatsapp: string;
    textoSinWhatsapp: string;
    boton: string;
    bloqueado: string;
    aviso: string;
    mensajeWhatsapp: string;
  };
  textos: {
    subtitulo: string;
    portadaEtiqueta: string;
    titular: string;
    entradilla: string;
    botonContacto: string;
    botonVideo: string;
    doloresEtiqueta: string;
    dolores: string[];
    pilaresEtiqueta: string;
    pilares: Titulado[];
    historiaEtiqueta: string;
    historiaTitulo: string;
    historia: string[];
    pasosEtiqueta: string;
    pasos: Titulado[];
    contactoEtiqueta: string;
    contactoTitulo: string;
    contactoTexto: string;
    aviso: string;
  };
};

/** Lo que comparten todas las páginas del embudo. */
export interface DatosEmbudo {
  persona: ConfigPersona;
  contenido: ContenidoEmbudo;
  /** % del webinar que hay que ver para que salga el botón de WhatsApp */
  porcentajeWhatsapp: number;
}
