import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ConfigPersona } from './tipos';

// Textos base. Revisadlos con un asesor antes de lanzar anuncios.

function Pagina({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 leading-relaxed">
      <Link to="/" className="text-sm underline opacity-70">← Volver</Link>
      <h1 className="mt-6 mb-8 text-3xl font-bold">{titulo}</h1>
      <div className="space-y-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold">{children}</div>
    </main>
  );
}

export function Privacidad({ persona }: { persona: ConfigPersona }) {
  const { legal } = persona;
  return (
    <Pagina titulo="Política de privacidad">
      <h2>Responsable del tratamiento</h2>
      <p>{legal.titular} · NIF {legal.nif} · {legal.domicilio} · {legal.email}</p>
      <h2>Qué datos recogemos y para qué</h2>
      <p>
        Nombre, email, teléfono y el mensaje que nos envíes a través del formulario, con la única finalidad de
        contactarte e informarte sobre la propuesta de emprendimiento que has solicitado.
      </p>
      <h2>Base legal</h2>
      <p>Tu consentimiento, que das al marcar la casilla del formulario y que puedes retirar en cualquier momento.</p>
      <h2>Conservación</h2>
      <p>Mientras exista interés mutuo y, como máximo, 12 meses desde el último contacto, salvo que pidas antes su supresión.</p>
      <h2>Destinatarios</h2>
      <p>
        No cedemos tus datos a terceros. Pueden acceder a ellos los proveedores tecnológicos necesarios para
        alojar la web y gestionar los contactos, con las garantías exigidas por el RGPD.
      </p>
      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
        escribiendo a {legal.email}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </Pagina>
  );
}

export function AvisoLegal({ persona }: { persona: ConfigPersona }) {
  const { legal } = persona;
  return (
    <Pagina titulo="Aviso legal">
      <p>
        En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que el sitio web {persona.dominio} es titularidad
        de {legal.titular}, con NIF {legal.nif}, domicilio en {legal.domicilio} y email de contacto {legal.email}.
      </p>
      <h2>Contenido</h2>
      <p>
        Esta web presenta una propuesta de emprendimiento por cuenta propia. No es una oferta de empleo. Los
        resultados de cualquier actividad dependen del trabajo y las circunstancias de cada persona; no se
        garantizan ingresos.
      </p>
      <h2>Propiedad intelectual</h2>
      <p>Los textos, imágenes y diseño de esta web pertenecen a su titular o se usan con permiso.</p>
    </Pagina>
  );
}

export function Cookies() {
  return (
    <Pagina titulo="Política de cookies">
      <p>
        Esta web solo usa las cookies técnicas imprescindibles para funcionar, que no requieren consentimiento.
        No usamos cookies de análisis ni de publicidad.
      </p>
      <p>
        Si en el futuro añadimos herramientas de medición (por ejemplo, el píxel de Meta o Google Analytics),
        actualizaremos esta página y pediremos tu consentimiento antes de activarlas.
      </p>
    </Pagina>
  );
}

export function PieLegal({ persona }: { persona: ConfigPersona }) {
  return (
    <footer className="border-t border-black/10 px-4 py-8 text-center text-sm opacity-70">
      <p>© {new Date().getFullYear()} {persona.nombre}</p>
      <nav className="mt-2 flex justify-center gap-4">
        <Link to="/privacidad" className="underline">Privacidad</Link>
        <Link to="/legal" className="underline">Aviso legal</Link>
        <Link to="/cookies" className="underline">Cookies</Link>
      </nav>
    </footer>
  );
}
