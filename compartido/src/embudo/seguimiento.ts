// Código de cada pieza de contenido (calendario de Notion, «CT-123»). Va en los enlaces como ?c=CT-123 y llega a la
// columna «Origen» de la hoja de leads, para saber qué pieza trajo a cada persona (estrategia/marketing.md, sección 7).

/** El código de la URL si tiene el formato esperado; si no, vacío (no se guarda nada raro en la hoja). */
export function codigoContenido(params: URLSearchParams) {
  const c = (params.get('c') ?? '').trim().toUpperCase();
  return /^CT-\d{1,6}$/.test(c) ? c : '';
}
