/**
 * Embudo Instagram → cuestionario → webinar, en una hoja de Google.
 *
 * Recibe los leads de /api/lead (Vercel o Cloudflare), los guarda en la pestaña "Leads",
 * envía desde el Gmail del dueño de la hoja el email con el enlace del webinar, avisa a la
 * persona del equipo y, si a las 24 h no lo ha abierto, manda un recordatorio.
 *
 * Los textos y colores de los emails se cambian desde el editor de la web (/editar → Emails): la web los
 * manda con cada lead y aquí se guardan para el recordatorio. Si no llegan, se usan los de EMAIL_POR_DEFECTO.
 *
 * Instalación: compartido/apps-script/README.md
 * Normas de los textos: estrategia/normas-comunicacion.md (sin cifras, sin promesas, sin producto).
 */

// Una entrada por persona del equipo. La clave es el "persona" de su web (config.ts).
// Cada persona tiene su propia hoja con este mismo script; PERSONA dice de quién es esta.
const PERSONAS = {
  alejandro: {
    nombre: 'Alejandro Martínez',
    web: 'https://kangen-ochre.vercel.app',
    // Foto redonda de la firma de los emails (vacío = sin foto)
    foto: 'https://kangen-ochre.vercel.app/foto.jpg',
    // Dónde llegan los avisos de leads. Vacío = el email de la cuenta que instala el script
    aviso: '',
    // Respuestas de los leads. Vacío = la cuenta que envía (la que instala el script)
    responder: '',
    // Colores de los emails, los de su web
    estilo: { boton: '#100904', textoBoton: '#ffedd7', titulo: '#100904', texto: '#2b2118', suave: '#7a6a5a', mayusculas: true },
  },
  gemma: {
    nombre: 'Gemma Oña',
    web: 'https://gemma-ona.vercel.app',
    foto: 'https://gemma-ona.vercel.app/foto-email.jpg',
    aviso: '',
    responder: '',
    estilo: { boton: '#000000', textoBoton: '#fdfcfc', titulo: '#000000', texto: '#44403b', suave: '#a59f97', mayusculas: false },
  },
};

// Persona de esta hoja (una de PERSONAS). Se usa en probar().
const PERSONA = 'alejandro';

// Script independiente (fuera de la hoja): id de la hoja. Vacío = el script vive dentro de la hoja.
const ID_HOJA = '';
// Clave inicial para LEADS_WEBHOOK_SECRET. Vacía = instalar() genera una nueva.
const CLAVE_INICIAL = '';

// Columnas del CRM, en orden. El script mueve solo hacia delante: al enviar el recordatorio
// (Nuevo lead → Recontactado), al ver el webinar (→ Vio el vídeo) y al pulsar WhatsApp (→ WhatsApp).
const ESTADOS = ['Nuevo lead', 'Recontactado', 'Vio el vídeo', 'WhatsApp', 'Videollamada', 'Compra', 'Onboarding', 'Descartado'];
const DESCARTADO = 'Descartado';

const HOJA = 'Leads';
const HORAS_RECORDATORIO = 24;
const COLUMNAS = [
  'Fecha', 'Id', 'Persona', 'Origen', 'Nombre', 'Email', 'WhatsApp',
  'Email webinar', 'Webinar abierto', 'Webinar visto', 'WhatsApp pulsado', 'Recordatorio', 'Quiere hablar',
  'Mensaje', 'Estado', 'Notas',
];

// Textos de los emails cuando la web no manda los suyos (contenido.json → email). {nombre} = su nombre;
// **texto** = negrita. Firma vacía = el nombre de PERSONAS.
const EMAIL_POR_DEFECTO = {
  webinar: {
    asunto: 'Tu webinar: Otra manera de ganarse la vida',
    saludo: '¡Hola, {nombre}!',
    antes: ['Gracias por responder el cuestionario. Aquí tienes el webinar:'],
    boton: 'Ver el webinar',
    despues: [
      'Te cuento cómo estoy construyendo algo propio, a mi ritmo y con un equipo que me acompaña. ' +
        'Míralo con calma: cuando lo termines, te aparecerá un botón para escribirme directamente por WhatsApp y lo hablamos.',
      'Si tienes cualquier duda, responde a este email: me llega directamente a mí.',
    ],
  },
  recordatorio: {
    asunto: '¿Has podido verlo, {nombre}?',
    saludo: '¡Hola, {nombre}!',
    antes: ['Ayer te envié el webinar y creo que aún no has podido verlo. Te lo dejo aquí otra vez, por si se te pasó:'],
    boton: 'Ver el webinar',
    despues: [
      'Búscate un rato tranquilo: al terminarlo podrás escribirme directamente por WhatsApp. ' +
        'Y si tienes cualquier duda antes, responde a este email.',
    ],
  },
  despedida: 'Un abrazo,',
  firma: '',
  pie: 'Recibes este email porque lo pediste en el cuestionario. Si no quieres recibir más, responde con la palabra BAJA.',
};

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
    'Nombre': d.nombre, 'Email': d.email, 'WhatsApp': d.telefono, 'Mensaje': d.mensaje || '', 'Estado': ESTADOS[0],
  };
  if (d.origen === 'webinar') valores['Quiere hablar'] = ahora();
  Object.keys(d.respuestas || {}).forEach(function (k) { valores[k] = d.respuestas[k]; });
  hoja.appendRow(cab.map(function (c) { return valores[c] !== undefined ? valores[c] : ''; }));
  const fila = hoja.getLastRow();

  if (d.origen === 'webinar') {
    avisar(p, 'Quiere hablar contigo: ' + d.nombre, d, true);
    return;
  }
  emailWebinar(p, textosEmail(d.persona, d.textosEmail), d.nombre, d.email, valores['Id']);
  poner(hoja, fila, cab, 'Email webinar', ahora());
  avisar(p, 'Nuevo lead: ' + d.nombre, d, false);
}

function registrarEvento(d) {
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, []);
  const fila = buscarFila(hoja, cab, d.id, '');
  if (!fila) return;
  const columna = { webinar_abierto: 'Webinar abierto', webinar_visto: 'Webinar visto', whatsapp_clic: 'WhatsApp pulsado' }[d.evento];
  if (!columna || leer(hoja, fila, cab, columna)) return;
  poner(hoja, fila, cab, columna, ahora());
  if (d.evento === 'webinar_visto') avanzar(hoja, fila, cab, 'Vio el vídeo');
  if (d.evento === 'whatsapp_clic') avanzar(hoja, fila, cab, 'WhatsApp');
  // Ha visto el webinar: avisa para escribirle si no lo hace él.
  if (d.evento === 'webinar_visto') {
    const p = PERSONAS[d.persona];
    const nombre = leer(hoja, fila, cab, 'Nombre');
    if (p) avisar(p, 'Ha visto el webinar: ' + nombre, {
      nombre: nombre, email: leer(hoja, fila, cab, 'Email'), telefono: leer(hoja, fila, cab, 'WhatsApp'), origen: 'webinar visto',
    }, true);
  }
}

// ---------- Emails ----------

/**
 * Textos de los emails de una persona: los que acaba de mandar la web o, si no llegan (recordatorio, fallo al
 * leerlos), los últimos que mandó. Lo que falte sale de EMAIL_POR_DEFECTO.
 */
function textosEmail(persona, recibidos) {
  const props = PropertiesService.getScriptProperties();
  const clave = 'EMAIL_' + persona;
  let t = recibidos && typeof recibidos === 'object' ? recibidos : null;
  if (t) {
    try { props.setProperty(clave, JSON.stringify(t)); } catch (err) { console.error('No se guardaron los textos del email', err); }
  } else {
    try { t = JSON.parse(props.getProperty(clave) || 'null'); } catch (err) { t = null; }
  }
  return combinar(EMAIL_POR_DEFECTO, t || {});
}

/** Copia de `base` con lo que traiga `encima` (textos no vacíos y listas con algo). */
function combinar(base, encima) {
  const r = {};
  Object.keys(base).forEach(function (k) {
    const b = base[k], e = encima[k];
    if (b && typeof b === 'object' && !Array.isArray(b)) r[k] = combinar(b, e && typeof e === 'object' ? e : {});
    else if (Array.isArray(b)) r[k] = Array.isArray(e) && e.length ? e.map(String) : b;
    else r[k] = typeof e === 'string' && e.trim() ? e : b;
  });
  ['colores', 'foto', 'mayusculas'].forEach(function (k) { if (encima[k] !== undefined) r[k] = encima[k]; });
  return r;
}

/** Colores y estilo del email: los de la web (editor) o, si no, los de PERSONAS. */
function estiloEmail(p, t) {
  const e = Object.assign({}, p.estilo);
  const c = t.colores || {};
  ['boton', 'textoBoton', 'titulo', 'texto', 'suave'].forEach(function (k) {
    if (/^#[0-9a-f]{6}$/i.test(String(c[k] || ''))) e[k] = c[k];
  });
  if (typeof t.mayusculas === 'boolean') e.mayusculas = t.mayusculas;
  return e;
}

function enlaceWebinar(p, id) {
  return p.web.replace(/\/$/, '') + '/webinar?l=' + encodeURIComponent(id);
}

function emailWebinar(p, t, nombre, email, id) {
  enviarPlantilla(p, t, t.webinar, nombre, email, enlaceWebinar(p, id));
}

function emailRecordatorio(p, t, nombre, email, id) {
  enviarPlantilla(p, t, t.recordatorio, nombre, email, enlaceWebinar(p, id));
}

function escapar(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
}

/** Texto de la plantilla para el HTML: escapado, con {nombre} y **negritas**. */
function rico(s, nombre) {
  return escapar(s).replace(/\{nombre\}/g, escapar(nombre)).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

/** Texto de la plantilla para la versión sin formato del email. */
function plano(s, nombre) {
  return String(s).replace(/\{nombre\}/g, nombre).replace(/\*\*([^*]+)\*\*/g, '$1');
}

// El HTML de los emails es el mismo que pinta la vista previa del editor (compartido/src/email.ts).
// Si cambias uno, cambia el otro.
function enviarPlantilla(p, t, e, nombre, email, enlace) {
  const primer = String(nombre).split(' ')[0];
  const estilo = estiloEmail(p, t);
  const firmante = t.firma || p.nombre;
  const parrafos = [rico(e.saludo, primer)]
    .concat(e.antes.map(function (x) { return rico(x, primer); }))
    .concat([boton(estilo, enlace, e.boton)])
    .concat(e.despues.map(function (x) { return rico(x, primer); }));
  const html = '<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:' + estilo.texto + ';max-width:520px">' +
    parrafos.map(function (x) { return '<p style="margin:0 0 18px">' + x + '</p>'; }).join('') +
    firma(estilo, t.despedida, firmante, t.foto || p.foto) +
    '<p style="margin:28px 0 0;font-size:12px;color:' + estilo.suave + '">' + escapar(t.pie) + '</p></div>';
  const texto = [plano(e.saludo, primer)]
    .concat(e.antes.map(function (x) { return plano(x, primer); }), [enlace], e.despues.map(function (x) { return plano(x, primer); }))
    .concat([t.despedida + '\n' + firmante, t.pie])
    .join('\n\n');
  const opciones = { htmlBody: html, name: firmante };
  if (p.responder) opciones.replyTo = p.responder;
  MailApp.sendEmail(email, plano(e.asunto, primer), texto, opciones);
}

function boton(estilo, url, texto) {
  return '<a href="' + escapar(url) + '" style="display:inline-block;background:' + estilo.boton + ';color:' + estilo.textoBoton + ';text-decoration:none;' +
    (estilo.mayusculas ? 'font-weight:700;text-transform:uppercase;font-size:13px' : 'font-weight:500;font-size:14px') +
    ';padding:16px 28px;border-radius:36px">' + escapar(texto) + ' →</a>';
}

/** Firma: la despedida y debajo la foto redonda con el nombre. */
function firma(estilo, despedida, nombre, foto) {
  const n = '<span style="font-weight:' + (estilo.mayusculas ? 700 : 500) + ';color:' + estilo.titulo + '">' + escapar(nombre) + '</span>';
  if (!foto) return '<p style="margin:0 0 18px">' + escapar(despedida) + '<br>' + n + '</p>';
  return '<p style="margin:0 0 10px">' + escapar(despedida) + '</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px"><tr>' +
    '<td style="padding:0 12px 0 0"><img src="' + escapar(foto) + '" width="56" height="56" alt="' + escapar(nombre) + '" ' +
    'style="display:block;width:56px;height:56px;border-radius:50%;object-fit:cover"></td>' +
    '<td style="font-family:Helvetica,Arial,sans-serif;font-size:16px">' + n + '</td>' +
    '</tr></table>';
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
  lineas.push('', 'Hoja: ' + libro().getUrl());
  MailApp.sendEmail(para, asunto, lineas.join('\n'), { name: 'Embudo webinar' });
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
    if (!enviado || v[cab.indexOf('Webinar abierto')] || v[cab.indexOf('Webinar visto')] || v[cab.indexOf('Recordatorio')]) continue;
    if (v[cab.indexOf('Quiere hablar')] || estadoDe(v[cab.indexOf('Estado')]) === DESCARTADO) continue;
    if (new Date(enviado).getTime() > limite) continue;
    const p = PERSONAS[v[cab.indexOf('Persona')]];
    if (!p) continue;
    emailRecordatorio(p, textosEmail(v[cab.indexOf('Persona')], null), v[cab.indexOf('Nombre')], v[cab.indexOf('Email')], v[cab.indexOf('Id')]);
    hoja.getRange(i + 1, cab.indexOf('Recordatorio') + 1).setValue(ahora());
    avanzar(hoja, i + 1, cab, 'Recontactado');
  }
}

/** Estado normalizado (los nombres antiguos pasan a los del CRM). */
function estadoDe(valor) {
  const v = String(valor || '').trim();
  const antiguos = { '': 'Nuevo lead', 'Nuevo': 'Nuevo lead', 'Hablando por WhatsApp': 'WhatsApp', 'Llamada agendada': 'Videollamada',
    'Dentro': 'Compra', 'No encaja': DESCARTADO, 'Baja': DESCARTADO, 'baja': DESCARTADO };
  return antiguos[v] !== undefined ? antiguos[v] : v;
}

/** Mueve el lead a `estado` solo si está en una columna anterior (nunca hacia atrás ni desde Descartado). */
function avanzar(hoja, fila, cab, estado) {
  const actual = estadoDe(leer(hoja, fila, cab, 'Estado'));
  const i = ESTADOS.indexOf(actual);
  if (actual === DESCARTADO || (i !== -1 && i >= ESTADOS.indexOf(estado))) return;
  poner(hoja, fila, cab, 'Estado', estado);
}

// ---------- Hoja ----------

function hojaLeads() {
  const hoja = libro().getSheetByName(HOJA);
  if (hoja) return hoja;
  // Hoja recién creada: se aprovecha la primera pestaña.
  const primera = libro().getSheets()[0];
  return primera.getLastRow() <= 1 ? primera.setName(HOJA) : libro().insertSheet(HOJA);
}

function libro() {
  return ID_HOJA ? SpreadsheetApp.openById(ID_HOJA) : SpreadsheetApp.getActiveSpreadsheet();
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

// ---------- CRM (la URL de la aplicación web + ?crm=CLAVE) ----------

const CAMPOS_EDITABLES = ['Estado', 'Notas'];
const FIJAS = COLUMNAS.concat(['Instagram']);

function doGet(e) {
  const k = (e && e.parameter && e.parameter.crm) || '';
  if (!claveValida(k)) return HtmlService.createHtmlOutput('<p style="font-family:sans-serif">Enlace no válido.</p>');
  const t = HtmlService.createTemplateFromFile('CRM');
  t.clave = k;
  return t.evaluate()
    .setTitle('Leads')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function claveValida(k) {
  const clave = PropertiesService.getScriptProperties().getProperty('CLAVE');
  return Boolean(clave) && k === clave;
}

/** Leads para el CRM, del más nuevo al más antiguo. */
function crmDatos(k) {
  if (!claveValida(k)) throw new Error('Clave no válida');
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, []);
  const filas = hoja.getDataRange().getValues().slice(1);
  const fecha = function (v) { return v instanceof Date ? v.toISOString() : (v ? String(v) : ''); };
  const leads = filas.filter(function (v) { return v[cab.indexOf('Id')]; }).map(function (v) {
    const col = function (c) { return v[cab.indexOf(c)]; };
    const respuestas = {};
    cab.forEach(function (c, i) { if (c && FIJAS.indexOf(c) === -1 && v[i] !== '') respuestas[c] = String(v[i]); });
    return {
      id: String(col('Id')), fecha: fecha(col('Fecha')), origen: String(col('Origen') || ''),
      nombre: String(col('Nombre') || ''), email: String(col('Email') || ''), telefono: String(col('WhatsApp') || ''),
      emailWebinar: fecha(col('Email webinar')), abierto: fecha(col('Webinar abierto')), visto: fecha(col('Webinar visto')),
      pulsado: fecha(col('WhatsApp pulsado')), recordatorio: fecha(col('Recordatorio')), quiereHablar: fecha(col('Quiere hablar')),
      instagram: String(col('Instagram') || ''),
      estado: estadoDe(col('Estado')), notas: String(col('Notas') || ''), respuestas: respuestas,
    };
  });
  leads.reverse();
  return { leads: leads, estados: ESTADOS, horasRecordatorio: HORAS_RECORDATORIO, hoja: libro().getUrl() };
}

/** Cambia el estado o las notas de un lead desde el CRM. */
function crmGuardar(k, id, campo, valor) {
  if (!claveValida(k)) throw new Error('Clave no válida');
  if (CAMPOS_EDITABLES.indexOf(campo) === -1) throw new Error('Campo no editable: ' + campo);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const hoja = hojaLeads();
    const cab = cabeceras(hoja, []);
    const fila = buscarFila(hoja, cab, id, '');
    if (!fila) throw new Error('Lead no encontrado');
    poner(hoja, fila, cab, campo, String(valor).slice(0, 2000));
    return true;
  } finally {
    lock.releaseLock();
  }
}

// ---------- Hoja y CRM juntos ----------

/** Menú "Leads" en la hoja (Google lo ejecuta solo al abrirla). */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Leads')
    .addItem('Abrir CRM', 'abrirCrm')
    .addItem('Preparar la hoja (desplegable de Estado)', 'prepararHoja')
    .addToUi();
}

/** Abre el CRM en una pestaña nueva desde el menú de la hoja. */
function abrirCrm() {
  const url = urlCrm();
  const html = url
    ? '<script>window.open(' + JSON.stringify(url) + ', "_blank"); google.script.host.close();</script>' +
      '<p style="font-family:sans-serif">Si no se abre, <a href="' + url + '" target="_blank">pulsa aquí</a>.</p>'
    : '<p style="font-family:sans-serif">Primero publica el script como aplicación web (Implementar → Nueva implementación).</p>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(320).setHeight(90), 'Abriendo el CRM…');
}

function urlCrm() {
  const url = ScriptApp.getService().getUrl();
  return url ? url + '?crm=' + PropertiesService.getScriptProperties().getProperty('CLAVE') : '';
}

/**
 * Deja la columna Estado con los mismos nombres que el CRM: traduce los antiguos y pone un desplegable,
 * así da igual cambiar el estado en la hoja o en el CRM.
 */
function prepararHoja() {
  const hoja = hojaLeads();
  const cab = cabeceras(hoja, []);
  const col = cab.indexOf('Estado') + 1;
  const filas = Math.max(hoja.getMaxRows() - 1, 1);
  const rango = hoja.getRange(2, col, filas, 1);
  const valores = rango.getValues().map(function (f, i) { return [i < hoja.getLastRow() - 1 ? estadoDe(f[0]) : f[0]]; });
  rango.setValues(valores);
  rango.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build());
}

// ---------- Instalación (ejecutar una vez a mano) ----------

/** Crea la clave, las cabeceras y el activador de recordatorios, y pide los permisos de Gmail. */
function instalar() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('CLAVE')) props.setProperty('CLAVE', CLAVE_INICIAL || Utilities.getUuid().replace(/-/g, ''));
  cabeceras(hojaLeads(), []);
  prepararHoja();
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'recordatorios'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('recordatorios').timeBased().everyHours(1).create();
  console.log('Listo. CLAVE (cópiala en LEADS_WEBHOOK_SECRET): ' + props.getProperty('CLAVE'));
  console.log('Emails que te quedan hoy: ' + MailApp.getRemainingDailyQuota());
  const crm = urlCrm();
  if (crm) console.log('CRM (guárdalo en favoritos, no lo compartas): ' + crm);
}

/** Escribe en el registro el enlace privado del CRM. */
function enlaceCrm() {
  const crm = urlCrm();
  console.log(crm ? 'CRM: ' + crm : 'Primero publica el script como aplicación web (Implementar → Nueva implementación).');
}

/** Prueba de punta a punta: crea un lead de ejemplo y te envía el email del webinar a ti. */
function probar() {
  const yo = Session.getEffectiveUser().getEmail();
  if (!PERSONAS[PERSONA]) throw new Error('PERSONA tiene que ser una de: ' + Object.keys(PERSONAS).join(', '));
  registrarLead({
    persona: PERSONA, origen: 'prueba', nombre: 'Prueba', email: yo, telefono: '+34600000000',
    id: 'prueba' + Date.now().toString(36), respuestas: { '¿Pregunta de prueba?': 'Respuesta de prueba' },
  });
}
