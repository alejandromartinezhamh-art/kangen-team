/**
 * Embudo Instagram → cuestionario → webinar, en una hoja de Google.
 *
 * Recibe los leads de /api/lead (Vercel o Cloudflare), los guarda en la pestaña "Leads",
 * envía desde el Gmail del dueño de la hoja el email con el enlace del webinar, avisa a la
 * persona del equipo y, si a las 24 h no lo ha abierto, manda un recordatorio.
 *
 * Instalación: compartido/apps-script/README.md
 * Normas de los textos: estrategia/normas-comunicacion.md (sin cifras, sin promesas, sin producto).
 */

// Una entrada por persona del equipo que use esta hoja. La clave es el "persona" de su web (config.ts).
const PERSONAS = {
  alejandro: {
    nombre: 'Alejandro',
    web: 'https://kangen-ochre.vercel.app',
    // Vacío = el email de la cuenta de Google dueña de la hoja
    aviso: '',
  },
};

const HOJA = 'Leads';
const HORAS_RECORDATORIO = 24;
const COLUMNAS = [
  'Fecha', 'Id', 'Persona', 'Origen', 'Nombre', 'Email', 'WhatsApp',
  'Email webinar', 'Webinar abierto', 'Recordatorio', 'Quiere hablar', 'Mensaje', 'Estado', 'Notas',
];

// ---------- Entrada ----------

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const datos = JSON.parse(e.postData.contents);
    const clave = PropertiesService.getScriptProperties().getProperty('CLAVE');
    if (!clave || datos.clave !== clave) return respuesta({ ok: false, error: 'clave' });

    if (datos.tipo === 'evento') {
      registrarEvento(datos);
    } else {
      registrarLead(datos);
    }
    return respuesta({ ok: true });
  } catch (err) {
    console.error(err);
    return respuesta({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- Leads ----------

function registrarLead(d) {
  const p = PERSONAS[d.persona];
  if (!p) throw new Error('Persona desconocida: ' + d.persona);
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, Object.keys(d.respuestas || {}));

  // El formulario del final del webinar: misma persona que ya hizo el cuestionario.
  if (d.origen === 'webinar') {
    const fila = buscarFila(hoja, cab, d.id, d.email);
    if (fila) {
      poner(hoja, fila, cab, 'Quiere hablar', ahora());
      if (d.mensaje) poner(hoja, fila, cab, 'Mensaje', d.mensaje);
      if (d.telefono) poner(hoja, fila, cab, 'WhatsApp', d.telefono);
      avisar(p, 'Quiere hablar contigo: ' + d.nombre, d, true);
      return;
    }
  }

  const valores = {
    'Fecha': ahora(), 'Id': d.id || Utilities.getUuid().slice(0, 12), 'Persona': d.persona, 'Origen': d.origen,
    'Nombre': d.nombre, 'Email': d.email, 'WhatsApp': d.telefono, 'Mensaje': d.mensaje || '', 'Estado': 'Nuevo',
  };
  if (d.origen === 'webinar') valores['Quiere hablar'] = ahora();
  Object.keys(d.respuestas || {}).forEach(function (k) { valores[k] = d.respuestas[k]; });
  hoja.appendRow(cab.map(function (c) { return valores[c] !== undefined ? valores[c] : ''; }));
  const fila = hoja.getLastRow();

  if (d.origen === 'webinar') {
    avisar(p, 'Quiere hablar contigo: ' + d.nombre, d, true);
    return;
  }
  emailWebinar(p, d.nombre, d.email, valores['Id']);
  poner(hoja, fila, cab, 'Email webinar', ahora());
  avisar(p, 'Nuevo lead: ' + d.nombre, d, false);
}

function registrarEvento(d) {
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, []);
  const fila = buscarFila(hoja, cab, d.id, '');
  if (!fila) return;
  if (d.evento === 'webinar_abierto' && !leer(hoja, fila, cab, 'Webinar abierto')) {
    poner(hoja, fila, cab, 'Webinar abierto', ahora());
  }
}

// ---------- Emails ----------

function enlaceWebinar(p, id) {
  return p.web.replace(/\/$/, '') + '/webinar?l=' + encodeURIComponent(id);
}

function emailWebinar(p, nombre, email, id) {
  const primer = String(nombre).split(' ')[0];
  const enlace = enlaceWebinar(p, id);
  enviar(email, p.nombre, 'Tu webinar: Otra manera de ganarse la vida', [
    'Hola, ' + primer + ':',
    'Gracias por responder el cuestionario. Aquí tienes el webinar:',
    boton(enlace, 'Ver el webinar'),
    'Te cuento cómo estoy construyendo algo propio, a mi ritmo y con un equipo que me acompaña. ' +
      'Míralo con calma y, si al final te resuena, me dejas tus datos y lo hablamos.',
    'Si tienes cualquier duda, responde a este email: me llega directamente a mí.',
    'Un abrazo,<br>' + p.nombre,
  ]);
}

function emailRecordatorio(p, nombre, email, id) {
  const primer = String(nombre).split(' ')[0];
  enviar(email, p.nombre, '¿Has podido verlo, ' + primer + '?', [
    'Hola, ' + primer + ':',
    'Ayer te envié el webinar y creo que aún no has podido verlo. Te lo dejo aquí otra vez, por si se te pasó:',
    boton(enlaceWebinar(p, id), 'Ver el webinar'),
    'Búscate un rato tranquilo. Y si prefieres que lo hablemos directamente, responde a este email.',
    'Un abrazo,<br>' + p.nombre,
  ]);
}

function boton(url, texto) {
  return '<a href="' + url + '" style="display:inline-block;background:#100904;color:#ffedd7;text-decoration:none;' +
    'font-weight:700;text-transform:uppercase;font-size:13px;padding:16px 28px;border-radius:36px">' + texto + ' →</a>';
}

function enviar(para, remitente, asunto, parrafos) {
  const html = '<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#2b2118;max-width:520px">' +
    parrafos.map(function (t) { return '<p style="margin:0 0 18px">' + t + '</p>'; }).join('') +
    '<p style="margin:28px 0 0;font-size:12px;color:#7a6a5a">Recibes este email porque lo pediste en el cuestionario. ' +
    'Si no quieres recibir más, responde con la palabra BAJA.</p></div>';
  const texto = parrafos.join('\n\n').replace(/<br>/g, '\n').replace(/<a href="([^"]+)"[^>]*>[^<]*<\/a>/g, '$1');
  GmailApp.sendEmail(para, asunto, texto, { htmlBody: html, name: remitente });
}

function avisar(p, asunto, d, quiereHablar) {
  const para = p.aviso || Session.getEffectiveUser().getEmail();
  const lineas = [
    'Nombre: ' + d.nombre, 'Email: ' + d.email, 'WhatsApp: ' + d.telefono, 'Origen: ' + d.origen,
  ];
  Object.keys(d.respuestas || {}).forEach(function (k) { lineas.push(k + ' ' + d.respuestas[k]); });
  if (d.mensaje) lineas.push('Mensaje: ' + d.mensaje);
  const tel = String(d.telefono || '').replace(/\D/g, '');
  if (tel) lineas.push('', (quiereHablar ? 'Escríbele ya: ' : 'WhatsApp: ') + 'https://wa.me/' + tel);
  lineas.push('', 'Hoja: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  GmailApp.sendEmail(para, asunto, lineas.join('\n'), { name: 'Embudo webinar' });
}

// ---------- Recordatorios (activador cada hora, lo crea instalar()) ----------

function recordatorios() {
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, []);
  const filas = hoja.getDataRange().getValues();
  const limite = Date.now() - HORAS_RECORDATORIO * 3600 * 1000;
  for (let i = 1; i < filas.length; i++) {
    const v = filas[i];
    const enviado = v[cab.indexOf('Email webinar')];
    if (!enviado || v[cab.indexOf('Webinar abierto')] || v[cab.indexOf('Recordatorio')]) continue;
    if (v[cab.indexOf('Quiere hablar')] || String(v[cab.indexOf('Estado')]).toLowerCase() === 'baja') continue;
    if (new Date(enviado).getTime() > limite) continue;
    const p = PERSONAS[v[cab.indexOf('Persona')]];
    if (!p) continue;
    emailRecordatorio(p, v[cab.indexOf('Nombre')], v[cab.indexOf('Email')], v[cab.indexOf('Id')]);
    hoja.getRange(i + 1, cab.indexOf('Recordatorio') + 1).setValue(ahora());
  }
}

// ---------- Hoja ----------

function hojaLeads() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName(HOJA);
  if (hoja) return hoja;
  // Hoja recién creada: se aprovecha la primera pestaña.
  const primera = libro.getSheets()[0];
  return primera.getLastRow() <= 1 ? primera.setName(HOJA) : libro.insertSheet(HOJA);
}

/** Cabeceras actuales; añade al final las que falten (columnas fijas y preguntas nuevas). */
function cabeceras(hoja, extra) {
  const n = hoja.getLastColumn();
  const cab = n ? hoja.getRange(1, 1, 1, n).getValues()[0].map(String) : [];
  const faltan = COLUMNAS.concat(extra).filter(function (c) { return c && cab.indexOf(c) === -1; });
  if (faltan.length) {
    hoja.getRange(1, cab.length + 1, 1, faltan.length).setValues([faltan]).setFontWeight('bold');
    hoja.setFrozenRows(1);
    return cab.concat(faltan);
  }
  return cab;
}

function buscarFila(hoja, cab, id, email) {
  const filas = hoja.getDataRange().getValues();
  const cId = cab.indexOf('Id'), cEmail = cab.indexOf('Email');
  for (let i = filas.length - 1; i >= 1; i--) {
    if (id && filas[i][cId] === id) return i + 1;
    if (email && String(filas[i][cEmail]).toLowerCase() === String(email).toLowerCase()) return i + 1;
  }
  return 0;
}

function poner(hoja, fila, cab, columna, valor) {
  hoja.getRange(fila, cab.indexOf(columna) + 1).setValue(valor);
}

function leer(hoja, fila, cab, columna) {
  return hoja.getRange(fila, cab.indexOf(columna) + 1).getValue();
}

function ahora() {
  return new Date();
}

// ---------- Instalación (ejecutar una vez a mano) ----------

/** Crea la clave, las cabeceras y el activador de recordatorios, y pide los permisos de Gmail. */
function instalar() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('CLAVE')) props.setProperty('CLAVE', Utilities.getUuid().replace(/-/g, ''));
  cabeceras(hojaLeads(), []);
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'recordatorios'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('recordatorios').timeBased().everyHours(1).create();
  console.log('Listo. CLAVE (cópiala en LEADS_WEBHOOK_SECRET): ' + props.getProperty('CLAVE'));
  console.log('Emails que te quedan hoy: ' + MailApp.getRemainingDailyQuota());
}

/** Prueba de punta a punta: crea un lead de ejemplo y te envía el email del webinar a ti. */
function probar() {
  const yo = Session.getEffectiveUser().getEmail();
  registrarLead({
    persona: 'alejandro', origen: 'prueba', nombre: 'Prueba', email: yo, telefono: '+34600000000',
    id: 'prueba' + Date.now().toString(36), respuestas: { '¿Pregunta de prueba?': 'Respuesta de prueba' },
  });
}
