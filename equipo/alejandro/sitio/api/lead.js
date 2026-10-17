// GENERADO por scripts/generar-api.mjs desde compartido/api/lead.ts. No editar a mano.

// compartido/api/validar.ts
var MAX = 1e3;
function texto(v) {
  return typeof v === "string" ? v.trim().slice(0, MAX) : "";
}
async function leerLead(request) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return { respuesta: Response.json({ error: "JSON no v\xE1lido" }, { status: 400 }) };
  }
  if (texto(datos.web)) return { respuesta: Response.json({ ok: true }) };
  const lead = {
    persona: texto(datos.persona),
    origen: texto(datos.origen),
    nombre: texto(datos.nombre),
    email: texto(datos.email),
    telefono: texto(datos.telefono),
    mensaje: texto(datos.mensaje),
    consentimiento: datos.consentimiento === true
  };
  if (!lead.persona || !lead.nombre || !lead.telefono || !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { respuesta: Response.json({ error: "Faltan datos" }, { status: 400 }) };
  }
  if (!lead.consentimiento) {
    return { respuesta: Response.json({ error: "Falta el consentimiento" }, { status: 400 }) };
  }
  return { lead };
}

// compartido/api/lead.ts
async function POST(request) {
  const r = await leerLead(request);
  if ("respuesta" in r) return r.respuesta;
  const { lead } = r;
  const destino = process.env.LEADS_WEBHOOK_URL;
  if (!destino) {
    console.error("LEADS_WEBHOOK_URL no est\xE1 configurada; lead no guardado", lead.persona, lead.origen);
    return Response.json({ error: "Formulario no configurado" }, { status: 500 });
  }
  const res = await fetch(destino, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, fecha: (/* @__PURE__ */ new Date()).toISOString() })
  });
  if (!res.ok) {
    console.error("El destino de leads respondi\xF3", res.status);
    return Response.json({ error: "No se pudo guardar" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
export {
  POST
};
