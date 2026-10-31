import { Fragment } from 'react';

// Pinta en cursiva serif las palabras marcadas entre asteriscos: "Otra *manera* de ganarse la vida".
export default function Enfasis({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/\*([^*]+)\*/).map((parte, i) => (i % 2 ? <em key={i}>{parte}</em> : <Fragment key={i}>{parte}</Fragment>))}
    </>
  );
}
