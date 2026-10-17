import { leerLead } from './validar';
import { reenviar } from './reenviar';

// Vercel: recibe los formularios de todas las webs y los reenvía a LEADS_WEBHOOK_URL
// (Google Sheets vía Apps Script, Make, Zapier…). Cada lead lleva persona y origen.
// LEADS_WEBHOOK_SECRET es la clave que comprueba el script de la hoja.

export async function POST(request: Request): Promise<Response> {
  const r = await leerLead(request);
  if ('respuesta' in r) return r.respuesta;
  const datos = 'lead' in r ? r.lead : r.evento;

  const destino = process.env.LEADS_WEBHOOK_URL;
  if (!destino) {
    console.error('LEADS_WEBHOOK_URL no está configurada; no guardado', datos.persona);
    return Response.json({ error: 'Formulario no configurado' }, { status: 500 });
  }

  if (!(await reenviar(destino, process.env.LEADS_WEBHOOK_SECRET, datos))) {
    return Response.json({ error: 'No se pudo guardar' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
