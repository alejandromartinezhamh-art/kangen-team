import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  abierto: boolean;
  etiqueta: string;
  textoCerrar: string;
  onCerrar: () => void;
  ancho?: boolean;
  children: ReactNode;
}

// Diálogo del prototipo: se cierra con Escape, con el botón o pulsando fuera,
// y devuelve el foco al elemento que lo abrió.
export function Modal({ abierto, etiqueta, textoCerrar, onCerrar, ancho, children }: Props) {
  const dialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    dialogo.current?.focus();

    function tecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar();
      if (e.key !== 'Tab' || !dialogo.current) return;
      const enfocables = dialogo.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!enfocables.length) return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('keydown', tecla);
      anterior?.focus();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-overlay on" onClick={onCerrar}>
      <div
        ref={dialogo}
        className={ancho ? 'modal modal-wide' : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-label={etiqueta}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="kicker">{etiqueta}</p>
        {children}
        <button type="button" className="btn light" onClick={onCerrar}>
          {textoCerrar}
        </button>
      </div>
    </div>
  );
}
