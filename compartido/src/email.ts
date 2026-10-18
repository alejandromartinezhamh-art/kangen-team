// Emails del embudo (contenido.json → email). La hoja de Google los envía con compartido/apps-script/Embudo.gs;
// esto pinta el mismo HTML para la vista previa del editor. Si cambias uno, cambia el otro.
//
// En los textos: {nombre} = el nombre de la persona; **texto** = negrita.

export interface PlantillaEmail {
  asunto: string;
  saludo: string;
  antes: string[];
  boton: string;
  despues: string[];
}

export interface ColoresEmail {
  boton: string;
  textoBoton: string;
  titulo: string;
  texto: string;
  suave: string;
}

export interface TextosEmail {
  webinar: PlantillaEmail;
  recordatorio: PlantillaEmail;
  despedida: string;
  firma: string;
  pie: string;
  colores: ColoresEmail;
  /** Botón y nombre en mayúsculas y negrita (el estilo de Alejandro) */
  mayusculas?: boolean;
}

const escapar = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const rico = (s: string, nombre: string) =>
  escapar(s)
    .replace(/\{nombre\}/g, escapar(nombre))
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

function boton(t: TextosEmail, url: string, texto: string) {
  const c = t.colores;
  return (
    `<a href="${escapar(url)}" style="display:inline-block;background:${c.boton};color:${c.textoBoton};text-decoration:none;` +
    (t.mayusculas ? 'font-weight:700;text-transform:uppercase;font-size:13px' : 'font-weight:500;font-size:14px') +
    `;padding:16px 28px;border-radius:36px">${escapar(texto)} →</a>`
  );
}

function firma(t: TextosEmail, foto: string) {
  const nombre = `<span style="font-weight:${t.mayusculas ? 700 : 500};color:${t.colores.titulo}">${escapar(t.firma)}</span>`;
  if (!foto) return `<p style="margin:0 0 18px">${escapar(t.despedida)}<br>${nombre}</p>`;
  return (
    `<p style="margin:0 0 10px">${escapar(t.despedida)}</p>` +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr>' +
    `<td style="padding:0 12px 0 0"><img src="${escapar(foto)}" width="56" height="56" alt="${escapar(t.firma)}" ` +
    'style="display:block;width:56px;height:56px;border-radius:50%;object-fit:cover"></td>' +
    `<td style="font-family:Helvetica,Arial,sans-serif;font-size:16px">${nombre}</td>` +
    '</tr></table>'
  );
}

/** Asunto y HTML de un email, como los envía Embudo.gs. */
export function htmlEmail(
  t: TextosEmail,
  tipo: 'webinar' | 'recordatorio',
  datos: { nombre: string; enlace: string; foto: string },
) {
  const e = t[tipo];
  const parrafos = [
    rico(e.saludo, datos.nombre),
    ...e.antes.map((p) => rico(p, datos.nombre)),
    boton(t, datos.enlace, e.boton),
    ...e.despues.map((p) => rico(p, datos.nombre)),
  ];
  const html =
    `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:${t.colores.texto};max-width:520px">` +
    parrafos.map((p) => `<p style="margin:0 0 18px">${p}</p>`).join('') +
    firma(t, datos.foto) +
    `<p style="margin:28px 0 0;font-size:12px;color:${t.colores.suave}">${escapar(t.pie)}</p></div>`;
  return { asunto: e.asunto.replace(/\{nombre\}/g, datos.nombre), html };
}
