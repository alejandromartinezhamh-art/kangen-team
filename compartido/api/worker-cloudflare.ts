import { onRequestPost } from './lead-cloudflare';

// Cloudflare Workers (con assets estáticos): /api/lead guarda el formulario en D1 (y en la hoja de
// Google si LEADS_WEBHOOK_URL está configurada); todo lo demás lo sirve la web compilada (ASSETS).

type EntornoLead = Parameters<typeof onRequestPost>[0]['env'];
interface Entorno extends EntornoLead {
  ASSETS: { fetch(request: Request): Promise<Response> };
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
