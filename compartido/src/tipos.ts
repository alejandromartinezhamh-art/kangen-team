export interface DatosLegales {
  /** Nombre completo o razón social del titular de la web */
  titular: string;
  nif: string;
  domicilio: string;
  email: string;
}

export interface ConfigPersona {
  /** Identificador sin espacios ni tildes; se guarda en cada lead */
  id: string;
  nombre: string;
  dominio: string;
  email: string;
  /** Solo dígitos con prefijo, p. ej. 34600000000 */
  whatsapp?: string;
  instagram?: string;
  tiktok?: string;
  legal: DatosLegales;
}

export interface Lead {
  persona: string;
  origen: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje?: string;
  consentimiento: boolean;
  /** Identificador corto del lead, para enlazar el webinar y sus eventos con su fila */
  id?: string;
  /** Respuestas del cuestionario: pregunta → respuesta */
  respuestas?: Record<string, string>;
}

/** Algo que hace un lead ya registrado, p. ej. abrir el webinar desde el email */
export interface EventoLead {
  tipo: 'evento';
  persona: string;
  id: string;
  evento: string;
}
