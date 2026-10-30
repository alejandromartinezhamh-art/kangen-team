import contenido from './contenido.json';

// Cuestionario de /cuestionario (el paso entre Instagram y el webinar). Una pantalla por paso.
// Cada respuesta se guarda en la hoja de Google en la columna "columna" de su pregunta, que no cambia
// aunque se edite el texto de la pregunta (así la hoja no se parte en columnas nuevas).
// Pregunta nueva = columna nueva en la hoja. Normas: estrategia/normas-comunicacion.md
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

type Textos = Omit<typeof contenido.cuestionario, 'pasos'> & { pasos: Paso[] };

// Los textos están en contenido.json (cuestionario) para poder cambiarlos desde el editor (/editar).
// El editor solo cambia textos: no añade ni quita pasos, ni toca "tipo", "campo" ni "columna".
export const cuestionario = contenido.cuestionario as unknown as Textos;
