import { leerLead } from './validar';

// Vercel: recibe los formularios de todas las webs y los reenvía a LEADS_WEBHOOK_URL
// (Google Sheets vía Apps Script, Make, Zapier…). Cada lead lleva persona y origen.

export async function POST(request: Request): Promise<Response> {
  const r = await leerLead(request);
  if ('respuesta' in r) return r.respuesta;
  const { lead } = r;

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
