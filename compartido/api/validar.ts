import type { EventoLead, Lead } from '../src/tipos';

// Lectura y validación comunes a todas las plataformas (Vercel, Cloudflare…).

const MAX = 1000;
const MAX_RESPUESTAS = 30;

function texto(v: unknown, max = MAX): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function respuestas(v: unknown): Record<string, string> | undefined {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
  const limpias: Record<string, string> = {};
  for (const [pregunta, respuesta] of Object.entries(v).slice(0, MAX_RESPUESTAS)) {
    const p = texto(pregunta, 200);
    if (p) limpias[p] = texto(respuesta);
  }
  return Object.keys(limpias).length ? limpias : undefined;
}

/** Devuelve el lead o el evento válido, o la respuesta que hay que dar si no lo es. */
export async function leerLead(
  request: Request,
): Promise<{ lead: Lead } | { evento: EventoLead } | { respuesta: Response }> {
  let datos: Record<string, unknown>;
  try {
    datos = await request.json();
  } catch {
    return { respuesta: Response.json({ error: 'JSON no válido' }, { status: 400 }) };
  }

  // Campo trampa relleno = bot. Respondemos ok para no darle pistas.
  if (texto(datos.web)) return { respuesta: Response.json({ ok: true }) };

  if (datos.tipo === 'evento') {
    const evento: EventoLead = {
      tipo: 'evento',
      persona: texto(datos.persona, 40),
      id: texto(datos.id, 40),
      evento: texto(datos.evento, 40),
    };
    if (!evento.persona || !evento.id || !evento.evento) {
      return { respuesta: Response.json({ error: 'Faltan datos' }, { status: 400 }) };
    }
    return { evento };
  }

  const lead: Lead = {
    persona: texto(datos.persona),
    origen: texto(datos.origen),
    nombre: texto(datos.nombre),
    email: texto(datos.email),
    telefono: texto(datos.telefono),
    mensaje: texto(datos.mensaje),
    consentimiento: datos.consentimiento === true,
    id: texto(datos.id, 40) || undefined,
    respuestas: respuestas(datos.respuestas),
  };

  if (!lead.persona || !lead.nombre || !lead.telefono || !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { respuesta: Response.json({ error: 'Faltan datos' }, { status: 400 }) };
  }
  if (!lead.consentimiento) {
    return { respuesta: Response.json({ error: 'Falta el consentimiento' }, { status: 400 }) };
  }
  return { lead };
}
