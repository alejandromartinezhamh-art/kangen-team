// Publicador: deja programada en Zernio (zernio.com) una pieza aprobada, y Zernio la publica a su hora en Instagram,
// Facebook, TikTok y YouTube con las API oficiales (reintenta si falla). Guía: contenido/publicar/README.md.
//
//   npm run publicar -- <carpeta> [--borrador] [--otra-vez]   programa la pieza de publicar.json (o la deja en borrador)
//   npm run publicar -- estado <carpeta>                       cómo va y los enlaces de cada red (actualiza publicado.json)
//   npm run publicar -- borrar <carpeta>                       borra de Zernio un borrador o una pieza aún no publicada
//   npm run publicar -- cuentas [persona]                      perfiles y redes conectadas
//   npm run publicar -- conectar <persona> <red>               enlace para que la persona conecte su red (se lo mandas)
//   npm run publicar -- metricas <persona> [AAAA-MM-DD]        métricas de cada publicación desde esa fecha (90 días)
//
// La carpeta va fuera del repositorio (es público), con lo que han generado npm run carrusel o npm run video y su
// publicar.json. La clave de la API nunca se escribe en el repositorio: la pone el entorno (ZERNIO_API_KEY o la
// credencial del entorno de Claude para zernio.com, que el proxy añade sola).
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { incumplimientos } from './normas.mjs';

const API = 'https://zernio.com/api/v1';
const ZONA = 'Europe/Madrid';
const REDES = ['instagram', 'facebook', 'tiktok', 'youtube'];
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.mov': 'video/quicktime' };
const MARGEN_MINUTOS = 10;
const raiz = path.resolve(import.meta.dirname, '..');

const fallar = (mensaje) => {
  console.error(mensaje);
  process.exit(1);
};

// ---------- La API
async function api(metodo, ruta, { cuerpo, clave } = {}) {
  const cabeceras = {
    // Sin ZERNIO_API_KEY se manda una de relleno: en el entorno de Claude el proxy la cambia por la de verdad.
    Authorization: `Bearer ${process.env.ZERNIO_API_KEY || 'sk_la_pone_el_proxy'}`,
    Accept: 'application/json',
  };
  if (cuerpo) cabeceras['Content-Type'] = 'application/json';
  if (clave) cabeceras['Idempotency-Key'] = clave;
  const r = await fetch(API + ruta, { method: metodo, headers: cabeceras, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const texto = await r.text();
  let datos;
  try {
    datos = texto ? JSON.parse(texto) : {};
  } catch {
    datos = { error: texto.slice(0, 300) };
  }
  if (r.status === 401) fallar('Zernio no reconoce la clave: falta ZERNIO_API_KEY o la credencial de zernio.com en el entorno (contenido/publicar/README.md).');
  if (!r.ok) fallar(`Zernio ha contestado ${r.status} a ${metodo} ${ruta}: ${datos.error ?? datos.message ?? texto.slice(0, 300)}`);
  return datos;
}

const idDe = (o) => o?._id ?? o?.id;

async function perfilDe(persona, { crear = false } = {}) {
  const { profiles = [] } = await api('GET', '/profiles');
  const perfil = profiles.find((p) => (p.name ?? '').toLowerCase() === persona.toLowerCase());
  if (perfil) return perfil;
  if (!crear) fallar(`No hay perfil «${persona}» en Zernio. Conecta antes sus redes: npm run publicar -- conectar ${persona} instagram`);
  const nombre = persona[0].toUpperCase() + persona.slice(1);
  const { profile } = await api('POST', '/profiles', { cuerpo: { name: nombre }, clave: `perfil-${persona.toLowerCase()}` });
  console.log(`Perfil «${nombre}» creado en Zernio.`);
  return profile;
}

async function cuentasDe(perfil) {
  const { accounts = [] } = await api('GET', `/accounts?profileId=${idDe(perfil)}`);
  return accounts;
}

// ---------- Utilidades de la pieza
const leerJson = (archivo) => JSON.parse(readFileSync(archivo, 'utf8'));

function carpetaDe(argumento) {
  const carpeta = argumento ? path.resolve(argumento) : '';
  if (!carpeta || !existsSync(carpeta) || !statSync(carpeta).isDirectory()) fallar('Uso: npm run publicar -- <carpeta>. Guía: contenido/publicar/README.md');
  if (carpeta.startsWith(raiz + path.sep)) fallar('La carpeta tiene que estar fuera del repositorio: es público.');
  return carpeta;
}

// Lo que se publica: lo que diga publicar.json o, si no, el vídeo (video.mp4 o reel.mp4) o las imágenes 01.png, 02.png…
function archivosDe(carpeta, pieza) {
  let nombres = pieza.archivos;
  if (!nombres?.length) {
    const todos = readdirSync(carpeta);
    const video = ['video.mp4', 'reel.mp4'].find((n) => todos.includes(n));
    nombres = video ? [video] : todos.filter((n) => /^\d+\.(png|jpe?g)$/i.test(n)).sort();
  }
  if (!nombres.length) fallar('No hay nada que publicar: ni video.mp4, ni reel.mp4, ni 01.png… (o pon «archivos» en publicar.json).');
  return nombres.map((nombre) => {
    const ruta = path.join(carpeta, nombre);
    const mime = MIME[path.extname(nombre).toLowerCase()];
    if (!existsSync(ruta)) fallar(`Falta ${nombre} en la carpeta.`);
    if (!mime) fallar(`${nombre}: solo se publican png, jpg, mp4 o mov.`);
    return { nombre, ruta, mime, tipo: mime.startsWith('video') ? 'video' : 'image' };
  });
}

// La hora de Madrid dentro de unos minutos, como «AAAA-MM-DDTHH:MM», para compararla con la de la pieza.
function madridDentroDe(minutos) {
  const f = new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return f.format(new Date(Date.now() + minutos * 60_000)).replace(' ', 'T');
}

function revisarPieza(pieza, archivos, { borrador }) {
  const errores = [];
  if (!pieza.persona) errores.push('Falta «persona» (la carpeta de equipo/, p. ej. «gemma»).');
  if (!/^CT-\d+$/.test(pieza.codigo ?? '')) errores.push('Falta «codigo» (el de la pieza en Notion, p. ej. «CT-2»).');
  const redes = Object.keys(pieza.redes ?? {});
  if (!redes.length) errores.push('Falta «redes» (instagram, facebook, tiktok, youtube).');
  for (const red of redes) if (!REDES.includes(red)) errores.push(`Red desconocida: ${red}.`);
  if (pieza.etiquetaIA && redes.includes('facebook')) errores.push('Facebook no deja poner la etiqueta de IA por la API: quita Facebook de «redes» y publícala allí a mano con la etiqueta.');
  if (!borrador) {
    if (!pieza.aprobado) errores.push('Falta «aprobado»: la fecha en que la persona la aprobó en Notion (Estado → Aprobado). Sin aprobación no se programa.');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(pieza.hora ?? '')) errores.push('Falta «hora» (hora de Madrid, «AAAA-MM-DDTHH:MM»).');
    else if (pieza.hora < madridDentroDe(MARGEN_MINUTOS)) errores.push(`La hora ${pieza.hora} ya ha pasado o es en menos de ${MARGEN_MINUTOS} minutos: Zernio la publicaría al momento.`);
  }

  const videos = archivos.filter((a) => a.tipo === 'video');
  if (videos.length && archivos.length > 1 && redes.some((r) => r !== 'instagram')) errores.push('Un vídeo va solo: el carrusel mixto (fotos y vídeo) solo existe en Instagram.');
  if (redes.includes('youtube') && !(videos.length === 1 && archivos.length === 1)) errores.push('YouTube solo publica un vídeo.');
  if (redes.includes('youtube') && !pieza.redes.youtube?.titulo) errores.push('YouTube necesita «titulo».');

  // El texto de cada red cumple las normas y sus enlaces llevan el código de la pieza (así se sabe qué trajo cada lead).
  const textos = [['texto', pieza.texto ?? '']];
  for (const red of redes) {
    const r = pieza.redes[red] ?? {};
    for (const campo of ['texto', 'titulo', 'primerComentario']) if (r[campo]) textos.push([`redes.${red}.${campo}`, r[campo]]);
    if (!(r.texto ?? pieza.texto) && !r.historia) errores.push(`Falta el texto de ${red} («texto» o «redes.${red}.texto»).`);
    if (r.historia && archivos.length > 1) errores.push('Una historia es una sola imagen o un solo vídeo.');
  }
  errores.push(...incumplimientos(textos));
  for (const [donde, texto] of textos) {
    for (const enlace of texto.match(/https?:\/\/\S+/g) ?? []) {
      if (!enlace.includes(`c=${pieza.codigo}`)) errores.push(`${donde}: el enlace ${enlace} no lleva ?c=${pieza.codigo}.`);
    }
  }
  if (errores.length) fallar(`No se programa:\n- ${errores.join('\n- ')}`);
}

// ---------- Cada red, con sus opciones
function entradaDe(red, cuenta, pieza, archivos) {
  const r = pieza.redes[red] ?? {};
  const entrada = { platform: red, accountId: idDe(cuenta) };
  if (r.texto) entrada.customContent = r.texto;
  const datos = {};
  // «etiquetaIA»: lleva imágenes o vídeo realistas hechos con IA (propiedad Etiqueta IA de la pieza en Notion).
  const ia = pieza.etiquetaIA === true;
  if (red === 'instagram' && r.primerComentario) datos.firstComment = r.primerComentario;
  // Las piezas en las que sale el equipo van como colaboración con su cuenta (hasta 3, sin @).
  if (red === 'instagram' && r.colaboradores?.length) datos.collaborators = r.colaboradores.map((u) => u.replace(/^@/, ''));
  if (red === 'instagram' && r.historia) datos.contentType = 'story';
  if (red === 'instagram' && ia) datos.isAiGenerated = true;
  if (red === 'youtube') Object.assign(datos, { title: r.titulo, visibility: 'public', ...(ia ? { containsSyntheticMedia: true } : {}) });
  if (red === 'tiktok') {
    const fotos = archivos[0].tipo === 'image';
    // TikTok no deja poner la etiqueta de IA a las fotos por la API: van como borrador y la persona la marca en la app.
    if (ia && fotos) r.borrador = true;
    datos.tiktokSettings = {
      privacy_level: 'PUBLIC_TO_EVERYONE',
      allow_comment: true,
      // La persona ya ha visto la pieza entera y la ha aprobado en Notion: es la confirmación que pide TikTok.
      content_preview_confirmed: true,
      express_consent_given: true,
      ...(fotos
        ? { media_type: 'photo', photo_cover_index: 0, description: r.texto ?? pieza.texto, auto_add_music: r.musica !== false }
        : { allow_duet: true, allow_stitch: true, ...(ia ? { video_made_with_ai: true } : {}) }),
      // TikTok a veces no admite más publicaciones directas: entonces llega a su bandeja de TikTok y la publica ella.
      ...(r.borrador ? { draft: true } : {}),
    };
  }
  if (Object.keys(datos).length) entrada.platformSpecificData = datos;
  return entrada;
}

async function subir(archivo) {
  const tamano = statSync(archivo.ruta).size;
  const presign = await api('POST', '/media/presign', { cuerpo: { filename: archivo.nombre, contentType: archivo.mime, size: tamano } });
  const r = await fetch(presign.uploadUrl, { method: 'PUT', headers: { 'Content-Type': archivo.mime }, body: readFileSync(archivo.ruta) });
  if (!r.ok) fallar(`No se ha podido subir ${archivo.nombre} (${r.status}).`);
  console.log(`  subido ${archivo.nombre} (${(tamano / 1e6).toFixed(1)} MB)`);
  return { type: archivo.tipo, url: presign.publicUrl };
}

const resumen = (post) => ({
  id: idDe(post),
  estado: post.status,
  hora: post.scheduledFor ?? null,
  redes: (post.platforms ?? []).map((p) => ({ red: p.platform, estado: p.status, enlace: p.platformPostUrl ?? null, error: p.errorMessage ?? p.error ?? undefined })),
});

// ---------- Órdenes
async function programar(argumento, opciones) {
  const carpeta = carpetaDe(argumento);
  const rutaPieza = path.join(carpeta, 'publicar.json');
  const rutaHecho = path.join(carpeta, 'publicado.json');
  if (!existsSync(rutaPieza)) fallar('Falta publicar.json en la carpeta. Formato: contenido/publicar/README.md');
  if (existsSync(rutaHecho) && !opciones.otraVez) fallar('Esta pieza ya está en Zernio (publicado.json). Mira cómo va con «estado», o usa --otra-vez si de verdad es otra publicación.');

  const pieza = leerJson(rutaPieza);
  const archivos = archivosDe(carpeta, pieza);
  revisarPieza(pieza, archivos, opciones);

  const perfil = await perfilDe(pieza.persona);
  const cuentas = await cuentasDe(perfil);
  const plataformas = Object.keys(pieza.redes).map((red) => {
    const cuenta = cuentas.find((c) => c.platform === red);
    if (!cuenta) fallar(`${pieza.persona} no tiene ${red} conectado en Zernio: npm run publicar -- conectar ${pieza.persona} ${red}`);
    return entradaDe(red, cuenta, pieza, archivos);
  });

  console.log(`${pieza.codigo} · ${pieza.persona} · ${Object.keys(pieza.redes).join(', ')} · ${opciones.borrador ? 'borrador' : `${pieza.hora} (Madrid)`}`);
  const mediaItems = [];
  for (const archivo of archivos) mediaItems.push(await subir(archivo));

  const cuerpo = { content: pieza.texto ?? '', mediaItems, platforms: plataformas };
  // Sin hora ni «publicar ya», Zernio lo guarda como borrador: se ve en su panel y no sale en ninguna red.
  if (!opciones.borrador) Object.assign(cuerpo, { scheduledFor: `${pieza.hora}:00`, timezone: ZONA });
  const clave = `${pieza.persona}-${pieza.codigo}-${opciones.borrador ? 'borrador' : pieza.hora}${opciones.otraVez ? `-${Date.now()}` : ''}`;
  const { post } = await api('POST', '/posts', { cuerpo, clave });

  const hecho = { codigo: pieza.codigo, persona: pieza.persona, ...resumen(post), creado: new Date().toISOString() };
  writeFileSync(rutaHecho, JSON.stringify(hecho, null, 2) + '\n');
  console.log(`Hecho: ${hecho.estado} (id ${hecho.id}). En Notion, Estado → ${opciones.borrador ? 'sigue igual (es un borrador)' : 'Programado'}.`);
}

async function estado(argumento) {
  const carpeta = carpetaDe(argumento);
  const rutaHecho = path.join(carpeta, 'publicado.json');
  if (!existsSync(rutaHecho)) fallar('Esta carpeta aún no se ha mandado a Zernio (no hay publicado.json).');
  const hecho = leerJson(rutaHecho);
  const { post } = await api('GET', `/posts/${hecho.id}`);
  Object.assign(hecho, resumen(post), { revisado: new Date().toISOString() });
  writeFileSync(rutaHecho, JSON.stringify(hecho, null, 2) + '\n');
  console.log(`${hecho.codigo}: ${hecho.estado}`);
  for (const r of hecho.redes) console.log(`  ${r.red}: ${r.estado}${r.enlace ? ` · ${r.enlace}` : ''}${r.error ? ` · ${r.error}` : ''}`);
  if (hecho.estado === 'published') console.log('En Notion: Estado → Publicado y estos enlaces en «Publicado en».');
  if (['failed', 'partial'].includes(hecho.estado)) console.log('Algo ha fallado: mira el error de cada red en contenido/publicar/README.md → «Si falla».');
}

async function borrar(argumento) {
  const carpeta = carpetaDe(argumento);
  const rutaHecho = path.join(carpeta, 'publicado.json');
  if (!existsSync(rutaHecho)) fallar('No hay publicado.json: no hay nada que borrar.');
  const hecho = leerJson(rutaHecho);
  await api('DELETE', `/posts/${hecho.id}`);
  writeFileSync(rutaHecho.replace(/\.json$/, '-borrado.json'), JSON.stringify({ ...hecho, borrado: new Date().toISOString() }, null, 2) + '\n');
  rmSync(rutaHecho);
  console.log(`${hecho.codigo}: borrado de Zernio.`);
}

async function listarCuentas(persona) {
  const { profiles = [] } = await api('GET', '/profiles');
  for (const perfil of profiles.filter((p) => !persona || (p.name ?? '').toLowerCase() === persona.toLowerCase())) {
    const cuentas = await cuentasDe(perfil);
    console.log(`${perfil.name}: ${cuentas.map((c) => `${c.platform} ${c.username ?? ''}`.trim()).join(' · ') || 'sin redes conectadas'}`);
  }
}

async function conectar(persona, red) {
  if (!persona || !REDES.includes(red)) fallar(`Uso: npm run publicar -- conectar <persona> <${REDES.join('|')}>`);
  const perfil = await perfilDe(persona, { crear: true });
  const { authUrl, alreadyConnected } = await api('GET', `/connect/${red}?profileId=${idDe(perfil)}&scopes=posting,analytics,comments,messaging`);
  if (alreadyConnected) return console.log(`${persona} ya tiene ${red} conectado.`);
  console.log(`Mándale este enlace a ${persona}: entra con su ${red} y pulsa Permitir.\n${authUrl}`);
}

async function metricas(persona, desde) {
  if (!persona) fallar('Uso: npm run publicar -- metricas <persona> [AAAA-MM-DD]');
  const perfil = await perfilDe(persona);
  const consulta = new URLSearchParams({ profileId: idDe(perfil), limit: '100', ...(desde ? { fromDate: desde } : {}) });
  const { posts = [] } = await api('GET', `/analytics?${consulta}`);
  const filas = posts.map((p) => ({
    fecha: (p.publishedAt ?? '').slice(0, 10),
    red: p.platform,
    enlace: p.platformPostUrl,
    texto: (p.content ?? '').replace(/\s+/g, ' ').slice(0, 60),
    ...Object.fromEntries(['views', 'reach', 'likes', 'comments', 'shares', 'saves', 'clicks'].map((m) => [m, p.analytics?.[m] ?? 0])),
  }));
  console.log(JSON.stringify(filas, null, 2));
}

// ---------- Entrada
const args = process.argv.slice(2);
const banderas = new Set(args.filter((a) => a.startsWith('--')));
const [orden, ...resto] = args.filter((a) => !a.startsWith('--'));
const ordenes = { estado: () => estado(resto[0]), borrar: () => borrar(resto[0]), cuentas: () => listarCuentas(resto[0]), conectar: () => conectar(resto[0], resto[1]), metricas: () => metricas(resto[0], resto[1]) };
await (ordenes[orden] ?? (() => programar(orden, { borrador: banderas.has('--borrador'), otraVez: banderas.has('--otra-vez') })))();
