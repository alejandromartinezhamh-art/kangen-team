import { onRequestPost } from './lead-cloudflare';
import { manejarCurso, type EntornoCurso } from './curso';

// Cloudflare Workers (con assets estáticos): /api/lead guarda el formulario en D1 (y en la hoja de
// Google si LEADS_WEBHOOK_URL está configurada); /api/curso es el curso privado (compartido/api/curso.ts);
// todo lo demás lo sirve la web compilada (ASSETS).

type EntornoLead = Parameters<typeof onRequestPost>[0]['env'];
interface Entorno extends EntornoLead, EntornoCurso {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Entorno): Promise<Response> {
    const ruta = new URL(request.url).pathname;
    if (ruta === '/api/lead' || ruta === '/api/curso') {
      if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      return ruta === '/api/lead' ? onRequestPost({ request, env }) : manejarCurso(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
