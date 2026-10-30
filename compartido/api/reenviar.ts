import type { EventoLead, Lead } from '../src/tipos';

// Envía el lead o el evento al destino externo (la hoja de Google con su script, Make, Zapier…).
// La clave compartida evita que cualquiera que conozca la URL escriba en la hoja.
// Si el destino no contesta o falla por su lado (5xx, 429), se reintenta una vez: Apps Script a veces tarda
// en arrancar. No se reintenta si ya ha pasado mucho rato, para no pasar del tiempo máximo de la función.

const ESPERA_MS = 600;
const MAX_PARA_REINTENTAR_MS = 4000;

type Resultado = 'ok' | 'error' | 'reintentar';

export async function reenviar(
  destino: string,
  clave: string | undefined,
  datos: Lead | EventoLead,
): Promise<boolean> {
  const inicio = Date.now();
  const cuerpo = JSON.stringify({ ...datos, clave: clave ?? '', fecha: new Date().toISOString() });
  let resultado = await enviar(destino, cuerpo);
  if (resultado === 'reintentar' && Date.now() - inicio < MAX_PARA_REINTENTAR_MS) {
    await new Promise((r) => setTimeout(r, ESPERA_MS));
    resultado = await enviar(destino, cuerpo);
  }
  return resultado === 'ok';
}

async function enviar(destino: string, cuerpo: string): Promise<Resultado> {
  try {
    const res = await fetch(destino, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo,
      redirect: 'follow',
    });
    if (res.status >= 500 || res.status === 429) {
      console.error('El destino de leads falló', res.status);
      return 'reintentar';
    }
    if (!res.ok) {
      console.error('El destino de leads respondió', res.status);
      return 'error';
    }
    // Apps Script responde 200 también cuando rechaza; el cuerpo dice si lo ha guardado.
    const texto = await res.text();
    if (texto.includes('"ok":false')) {
      console.error('El destino de leads rechazó el envío', texto.slice(0, 200));
      return 'error';
    }
    return 'ok';
  } catch (e) {
    console.error('No se pudo contactar con el destino de leads', e);
    return 'reintentar';
  }
}
