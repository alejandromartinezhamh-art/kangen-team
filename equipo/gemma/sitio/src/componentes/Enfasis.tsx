import { Fragment } from 'react';

// Pinta en gris suave (como la segunda mitad de los titulares de la portada) las palabras
// marcadas entre asteriscos: "Otra *manera* de ganarse la vida".
export default function Enfasis({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/\*([^*]+)\*/).map((parte, i) =>
        i % 2 ? <span key={i} className="suave">{parte}</span> : <Fragment key={i}>{parte}</Fragment>,
      )}
    </>
  );
}
