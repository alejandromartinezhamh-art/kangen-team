import { useState } from 'react';

// Teléfono en dos partes: el prefijo del país (con su bandera, España por defecto) y el número sin prefijo.
// Se envía junto ("+34 600 000 000"); /api/lead lo deja solo con cifras para la hoja y para wa.me.

/** España primero; el resto por orden alfabético. El valor es el código del país (+1 lo comparten varios). */
export const PREFIJOS = [
  ['ES', 'España', '34'],
  ['DE', 'Alemania', '49'],
  ['AD', 'Andorra', '376'],
  ['AR', 'Argentina', '54'],
  ['BE', 'Bélgica', '32'],
  ['BO', 'Bolivia', '591'],
  ['BR', 'Brasil', '55'],
  ['CL', 'Chile', '56'],
  ['CO', 'Colombia', '57'],
  ['CU', 'Cuba', '53'],
  ['EC', 'Ecuador', '593'],
  ['US', 'Estados Unidos', '1'],
  ['FR', 'Francia', '33'],
  ['IE', 'Irlanda', '353'],
  ['IT', 'Italia', '39'],
  ['MA', 'Marruecos', '212'],
  ['MX', 'México', '52'],
  ['NL', 'Países Bajos', '31'],
  ['PY', 'Paraguay', '595'],
  ['PE', 'Perú', '51'],
  ['PT', 'Portugal', '351'],
  ['GB', 'Reino Unido', '44'],
  ['DO', 'República Dominicana', '1'],
  ['RO', 'Rumanía', '40'],
  ['CH', 'Suiza', '41'],
  ['UY', 'Uruguay', '598'],
  ['VE', 'Venezuela', '58'],
].map(([pais, nombre, codigo]) => ({ pais, nombre, codigo, bandera: bandera(pais) }));

function bandera(pais: string) {
  return String.fromCodePoint(...[...pais].map((letra) => 0x1f1e6 + letra.charCodeAt(0) - 65));
}

/**
 * Prefijo + número. Si la persona escribe el número ya con prefijo (+…, 00… o un móvil español con el 34
 * delante), se respeta tal cual.
 */
export function unirTelefono(codigo: string, numero: string) {
  const n = numero.trim();
  if (!n) return '';
  if (/^(\+|00)/.test(n)) return n;
  const cifras = n.replace(/\D/g, '');
  if (codigo === '34' && /^34[6789]\d{8}$/.test(cifras)) return '+' + cifras;
  return `+${codigo} ${n}`;
}

/** Separa un teléfono ya unido ("+34 600…") para volver a pintarlo en el campo. */
function separar(valor: string) {
  const m = /^\+(\d{1,3}) (.*)$/.exec(valor);
  const prefijo = m && PREFIJOS.find((p) => p.codigo === m[1]);
  return prefijo ? { pais: prefijo.pais, numero: m[2] } : { pais: 'ES', numero: valor };
}

interface Props {
  /** id del campo del número (para el <label>) */
  id?: string;
  /** Nombre con el que va el teléfono completo en un <form> (campo oculto) */
  name?: string;
  /** Teléfono completo al pintar el campo, p. ej. al volver a este paso del cuestionario */
  valor?: string;
  onCambio?: (telefono: string) => void;
  /** Clases del campo de texto de cada web, para que el prefijo se vea igual */
  clase: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export function CampoTelefono({ id, name, valor = '', onCambio, clase, placeholder, required, autoFocus }: Props) {
  const [inicial] = useState(() => separar(valor));
  const [pais, setPais] = useState(inicial.pais);
  const [numero, setNumero] = useState(inicial.numero);
  const prefijo = PREFIJOS.find((p) => p.pais === pais) ?? PREFIJOS[0];
  const completo = unirTelefono(prefijo.codigo, numero);

  function cambiar(nuevoPais: string, nuevoNumero: string) {
    setPais(nuevoPais);
    setNumero(nuevoNumero);
    const codigo = (PREFIJOS.find((p) => p.pais === nuevoPais) ?? PREFIJOS[0]).codigo;
    onCambio?.(unirTelefono(codigo, nuevoNumero));
  }

  return (
    <div className="flex gap-2">
      {/* El selector nativo va encima, invisible: en el móvil abre la lista del sistema con los nombres */}
      <div
        className={`${clase} relative flex !w-auto flex-none items-center gap-1.5 whitespace-nowrap focus-within:border-[color:var(--color-primario,currentColor)]`}
      >
        <span aria-hidden="true">
          {prefijo.bandera} +{prefijo.codigo}
        </span>
        <span aria-hidden="true" className="text-[10px] opacity-60">
          ▾
        </span>
        <select
          aria-label="Prefijo del país"
          value={pais}
          onChange={(e) => cambiar(e.target.value, numero)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {PREFIJOS.map((p) => (
            <option key={p.pais} value={p.pais}>
              {p.bandera} {p.nombre} (+{p.codigo})
            </option>
          ))}
        </select>
      </div>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required={required}
        placeholder={placeholder}
        value={numero}
        onChange={(e) => cambiar(pais, e.target.value)}
        className={`${clase} min-w-0 flex-1`}
        autoFocus={autoFocus}
      />
      {name && <input type="hidden" name={name} value={completo} />}
    </div>
  );
}
