// Textos de los emails de esta web (contenido.json → email, que se cambian desde el editor). /api/lead
// los añade a cada lead para que la hoja de Google (Embudo.gs) envíe el email con ellos. Si no se pueden
// leer, el lead se guarda igual y la hoja usa los últimos que recibió o los suyos por defecto.

type Buscar = (peticion: Request) => Promise<Response>;

export async function textosEmail(request: Request, buscar: Buscar = fetch): Promise<Record<string, unknown> | undefined> {
  try {
    const url = new URL('/contenido.json', request.url);
    const res = await buscar(new Request(url, { signal: AbortSignal.timeout(2500) }));
    if (!res.ok) return undefined;
    const contenido = (await res.json()) as { email?: unknown; fotos?: Record<string, unknown> };
    if (!contenido.email || typeof contenido.email !== 'object' || Array.isArray(contenido.email)) return undefined;
    const foto = contenido.fotos?.email;
    return {
      ...(contenido.email as Record<string, unknown>),
      // Foto de la firma, con la dirección completa (los emails no entienden rutas como /foto.jpg)
      ...(typeof foto === 'string' && foto.startsWith('/') ? { foto: new URL(foto, url).href } : {}),
    };
  } catch {
    return undefined;
  }
}
