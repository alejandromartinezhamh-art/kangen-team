import type { Lead } from '../src/tipos';

// Recibe los formularios de todas las webs y los reenvía a LEADS_WEBHOOK_URL
// (Google Sheets vía Apps Script, Make, Zapier…). Cada lead lleva persona y origen.

const MAX = 1000;

function texto(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX) : '';
}

export async function POST(request: Request): Promise<Response> {
  let datos: Record<string, unknown>;
  try {
    datos = await request.json();
  } catch {
    return Response.json({ error: 'JSON no válido' }, { status: 400 });
  }

  // Campo trampa relleno = bot. Respondemos ok para no darle pistas.
  if (texto(datos.web)) return Response.json({ ok: true });

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
    return Response.json({ error: 'Faltan datos' }, { status: 400 });
  }
  if (!lead.consentimiento) {
    return Response.json({ error: 'Falta el consentimiento' }, { status: 400 });
  }

  const destino = process.env.LEADS_WEBHOOK_URL;
  if (!destino) {
    console.error('LEADS_WEBHOOK_URL no está configurada; lead no guardado', lead.persona, lead.origen);
    return Response.json({ error: 'Formulario no configurado' }, { status: 500 });
  }

  const res = await fetch(destino, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, fecha: new Date().toISOString() }),
  });
  if (!res.ok) {
    console.error('El destino de leads respondió', res.status);
    return Response.json({ error: 'No se pudo guardar' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
