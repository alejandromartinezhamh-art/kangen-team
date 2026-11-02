// Envía el lead o el evento al destino externo (la hoja de Google con su script, Make, Zapier…).
// La clave compartida evita que cualquiera que conozca la URL escriba en la hoja.
// Si el destino no contesta o falla por su lado (5xx, 429), se reintenta una vez: Apps Script a veces tarda
// en arrancar. No se reintenta si ya ha pasado mucho rato, para no pasar del tiempo máximo de la función.

const ESPERA_MS = 600;
const MAX_PARA_REINTENTAR_MS = 4000;

type Resultado = 'ok' | 'error' | 'reintentar';

export async function reenviar(destino: string, clave: string | undefined, datos: object): Promise<boolean> {
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

/**
 * Como reenviar, pero devuelve lo que contesta el destino (el acceso al curso necesita saber si la contraseña es
 * buena). null si no contesta o no responde con JSON.
 */
export async function consultar(
  destino: string,
  clave: string | undefined,
  datos: object,
): Promise<Record<string, unknown> | null> {
  const cuerpo = JSON.stringify({ ...datos, clave: clave ?? '', fecha: new Date().toISOString() });
  for (let intento = 0; intento < 2; intento++) {
    try {
      const res = await fetch(destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: cuerpo,
        redirect: 'follow',
      });
      if (res.ok) return ((await res.json().catch(() => null)) as Record<string, unknown> | null) ?? null;
      console.error('El destino de leads respondió', res.status);
      if (res.status < 500 && res.status !== 429) return null;
    } catch (e) {
      console.error('No se pudo contactar con el destino de leads', e);
    }
    if (intento === 0) await new Promise((r) => setTimeout(r, ESPERA_MS));
  }
  return null;
}
