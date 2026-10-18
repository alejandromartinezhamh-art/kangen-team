import { leerLead } from './validar';
import { reenviar } from './reenviar';
import { textosEmail } from './email';

// Cloudflare (Pages Functions y Workers): guarda cada lead en la base de datos D1 "leads-equipo",
// enlazada con el nombre DB. Si además están LEADS_WEBHOOK_URL y LEADS_WEBHOOK_SECRET, lo reenvía
// a la hoja de Google, que es la que manda el email del webinar.

interface D1Statement {
  bind(...valores: unknown[]): { run(): Promise<unknown> };
}
interface Entorno {
  DB?: { prepare(sql: string): D1Statement };
  LEADS_WEBHOOK_URL?: string;
  LEADS_WEBHOOK_SECRET?: string;
  /** Los archivos de la web (Workers con assets y Pages): de ahí sale /contenido.json */
  ASSETS?: { fetch(request: Request): Promise<Response> };
}

export async function onRequestPost({ request, env }: { request: Request; env: Entorno }): Promise<Response> {
  const r = await leerLead(request);
  if ('respuesta' in r) return r.respuesta;

  // Los eventos (abrir el webinar…) solo existen en la hoja.
  if ('evento' in r) {
    if (env.LEADS_WEBHOOK_URL) await reenviar(env.LEADS_WEBHOOK_URL, env.LEADS_WEBHOOK_SECRET, r.evento);
    return Response.json({ ok: true });
  }

  const { lead } = r;
  if (!env.DB && !env.LEADS_WEBHOOK_URL) {
    console.error('Ni DB ni LEADS_WEBHOOK_URL configurados; lead no guardado', lead.persona, lead.origen);
    return Response.json({ error: 'Formulario no configurado' }, { status: 500 });
  }

  let guardado = false;
  if (env.DB) {
    // Las respuestas del cuestionario van en "mensaje" para no cambiar la tabla.
    const mensaje = lead.respuestas ? JSON.stringify({ mensaje: lead.mensaje, ...lead.respuestas }) : lead.mensaje;
    try {
      await env.DB.prepare(
        'INSERT INTO leads (persona, origen, nombre, email, telefono, mensaje, consentimiento) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
        .bind(lead.persona, lead.origen, lead.nombre, lead.email, lead.telefono, mensaje ?? '', lead.consentimiento ? 1 : 0)
        .run();
      guardado = true;
    } catch (e) {
      console.error('No se pudo guardar el lead en D1', e);
    }
  }
  if (env.LEADS_WEBHOOK_URL) {
    const assets = env.ASSETS;
    const textos = await textosEmail(request, assets ? (p) => assets.fetch(p) : fetch);
    guardado = (await reenviar(env.LEADS_WEBHOOK_URL, env.LEADS_WEBHOOK_SECRET, { ...lead, textosEmail: textos })) || guardado;
  }

  return guardado ? Response.json({ ok: true }) : Response.json({ error: 'No se pudo guardar' }, { status: 502 });
}
