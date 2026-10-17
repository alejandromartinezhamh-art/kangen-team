// GENERADO por scripts/generar-api.mjs desde compartido/api/lead.ts. No editar a mano.

// compartido/api/validar.ts
var MAX = 1e3;
var MAX_RESPUESTAS = 30;
function texto(v, max = MAX) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function respuestas(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return void 0;
  const limpias = {};
  for (const [pregunta, respuesta] of Object.entries(v).slice(0, MAX_RESPUESTAS)) {
    const p = texto(pregunta, 200);
    if (p) limpias[p] = texto(respuesta);
  }
  return Object.keys(limpias).length ? limpias : void 0;
}
async function leerLead(request) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return { respuesta: Response.json({ error: "JSON no v\xE1lido" }, { status: 400 }) };
  }
  if (texto(datos.web)) return { respuesta: Response.json({ ok: true }) };
  if (datos.tipo === "evento") {
    const evento = {
      tipo: "evento",
      persona: texto(datos.persona, 40),
      id: texto(datos.id, 40),
      evento: texto(datos.evento, 40)
    };
    if (!evento.persona || !evento.id || !evento.evento) {
      return { respuesta: Response.json({ error: "Faltan datos" }, { status: 400 }) };
    }
    return { evento };
  }
  const lead = {
    persona: texto(datos.persona),
    origen: texto(datos.origen),
    nombre: texto(datos.nombre),
    email: texto(datos.email),
    telefono: texto(datos.telefono),
    mensaje: texto(datos.mensaje),
    consentimiento: datos.consentimiento === true,
    id: texto(datos.id, 40) || void 0,
    respuestas: respuestas(datos.respuestas)
  };
  if (!lead.persona || !lead.nombre || !lead.telefono || !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { respuesta: Response.json({ error: "Faltan datos" }, { status: 400 }) };
  }
  if (!lead.consentimiento) {
    return { respuesta: Response.json({ error: "Falta el consentimiento" }, { status: 400 }) };
  }
  return { lead };
}

// compartido/api/reenviar.ts
async function reenviar(destino, clave, datos) {
  try {
    const res = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datos, clave: clave ?? "", fecha: (/* @__PURE__ */ new Date()).toISOString() }),
      redirect: "follow"
    });
    if (!res.ok) {
      console.error("El destino de leads respondi\xF3", res.status);
      return false;
    }
    const cuerpo = await res.text();
    if (cuerpo.includes('"ok":false')) {
      console.error("El destino de leads rechaz\xF3 el env\xEDo", cuerpo.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.error("No se pudo contactar con el destino de leads", e);
    return false;
  }
}

// compartido/api/lead.ts
async function POST(request) {
  const r = await leerLead(request);
  if ("respuesta" in r) return r.respuesta;
  const datos = "lead" in r ? r.lead : r.evento;
  const destino = process.env.LEADS_WEBHOOK_URL;
  if (!destino) {
    console.error("LEADS_WEBHOOK_URL no est\xE1 configurada; no guardado", datos.persona);
    return Response.json({ error: "Formulario no configurado" }, { status: 500 });
  }
  if (!await reenviar(destino, process.env.LEADS_WEBHOOK_SECRET, datos)) {
    return Response.json({ error: "No se pudo guardar" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
export {
  POST
};
