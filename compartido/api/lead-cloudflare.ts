import { leerLead } from './validar';

// Cloudflare Pages Functions: guarda cada lead en la base de datos D1 "leads-equipo",
// enlazada al proyecto de Pages con el nombre DB.

interface D1Statement {
  bind(...valores: unknown[]): { run(): Promise<unknown> };
}
interface Entorno {
  DB?: { prepare(sql: string): D1Statement };
}

export async function onRequestPost({ request, env }: { request: Request; env: Entorno }): Promise<Response> {
  const r = await leerLead(request);
  if ('respuesta' in r) return r.respuesta;
  const { lead } = r;

  if (!env.DB) {
    console.error('La base de datos DB no está enlazada; lead no guardado', lead.persona, lead.origen);
    return Response.json({ error: 'Formulario no configurado' }, { status: 500 });
  }

  try {
    await env.DB.prepare(
      'INSERT INTO leads (persona, origen, nombre, email, telefono, mensaje, consentimiento) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(lead.persona, lead.origen, lead.nombre, lead.email, lead.telefono, lead.mensaje ?? '', lead.consentimiento ? 1 : 0)
      .run();
  } catch (e) {
    console.error('No se pudo guardar el lead en D1', e);
    return Response.json({ error: 'No se pudo guardar' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
