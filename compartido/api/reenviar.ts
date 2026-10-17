import type { EventoLead, Lead } from '../src/tipos';

// Envía el lead o el evento al destino externo (la hoja de Google con su script, Make, Zapier…).
// La clave compartida evita que cualquiera que conozca la URL escriba en la hoja.

export async function reenviar(
  destino: string,
  clave: string | undefined,
  datos: Lead | EventoLead,
): Promise<boolean> {
  try {
    const res = await fetch(destino, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, clave: clave ?? '', fecha: new Date().toISOString() }),
      redirect: 'follow',
    });
    if (!res.ok) {
      console.error('El destino de leads respondió', res.status);
      return false;
    }
    // Apps Script responde 200 también cuando rechaza; el cuerpo dice si lo ha guardado.
    const cuerpo = await res.text();
    if (cuerpo.includes('"ok":false')) {
      console.error('El destino de leads rechazó el envío', cuerpo.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.error('No se pudo contactar con el destino de leads', e);
    return false;
  }
}
