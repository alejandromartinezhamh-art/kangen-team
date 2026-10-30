/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../../compartido/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Los colores reales viven en src/index.css (variables CSS) y en contenido.json (colores)
      colors: {
        primario: 'var(--color-primario)',
        acento: 'var(--color-acento)',
        fondo: 'var(--color-fondo)',
        texto: 'var(--color-texto)',
        secundario: 'var(--color-secundario)',
        linea: 'var(--color-linea)',
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
