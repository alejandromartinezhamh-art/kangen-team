import { onRequestPost } from './lead-cloudflare';

// Cloudflare Workers (con assets estáticos): /api/lead guarda el formulario en D1;
// todo lo demás lo sirve la web compilada (ASSETS).

interface Entorno {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: Parameters<typeof onRequestPost>[0]['env']['DB'];
}

export default {
  async fetch(request: Request, env: Entorno): Promise<Response> {
    if (new URL(request.url).pathname === '/api/lead') {
      if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
