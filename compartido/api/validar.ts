import type { Lead } from '../src/tipos';

// Lectura y validación comunes a todas las plataformas (Vercel, Cloudflare…).

const MAX = 1000;

function texto(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX) : '';
}

/** Devuelve el lead válido, o la respuesta que hay que dar si no lo es. */
export async function leerLead(request: Request): Promise<{ lead: Lead } | { respuesta: Response }> {
  let datos: Record<string, unknown>;
  try {
    datos = await request.json();
  } catch {
    return { respuesta: Response.json({ error: 'JSON no válido' }, { status: 400 }) };
  }

  // Campo trampa relleno = bot. Respondemos ok para no darle pistas.
  if (texto(datos.web)) return { respuesta: Response.json({ ok: true }) };

  const lead: Lead = {
    persona: texto(datos.persona),
    origen: texto(datos.origen),
    nombre: texto(datos.nombre),
    email: texto(datos.email),
    telefono: texto(datos.telefono),
    mensaje: texto(datos.mensaje),
    consentimiento: datos.consentimiento === true,
  };

  if (!lead.persona || !lead.nombre || !lead.telefono || !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { respuesta: Response.json({ error: 'Faltan datos' }, { status: 400 }) };
  }
  if (!lead.consentimiento) {
    return { respuesta: Response.json({ error: 'Falta el consentimiento' }, { status: 400 }) };
  }
  return { lead };
}
