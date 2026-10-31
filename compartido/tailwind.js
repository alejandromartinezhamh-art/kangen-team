// Tailwind común a las webs con embudo (compartido/src/embudo): los nombres de color y de letra que usan sus
// páginas. Los valores reales son variables CSS: las pone index.css de cada web y, por encima, contenido.json
// (colores y fuentes), que se cambia desde el editor.
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primario: 'var(--color-primario)',
        acento: 'var(--color-acento)',
        fondo: 'var(--color-fondo)',
        texto: 'var(--color-texto)',
        secundario: 'var(--color-secundario)',
        linea: 'var(--color-linea)',
        estructura: 'var(--color-estructura)',
        superficie: 'var(--color-superficie)',
      },
      fontFamily: {
        titulo: 'var(--fuente-titulo)',
        cuerpo: 'var(--fuente-cuerpo)',
        acento: 'var(--fuente-acento)',
      },
    },
  },
  plugins: [],
};
