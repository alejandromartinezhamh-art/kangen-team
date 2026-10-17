/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../../compartido/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Los colores reales viven en src/index.css (variables CSS)
      colors: {
        primario: 'var(--color-primario)',
        acento: 'var(--color-acento)',
        fondo: 'var(--color-fondo)',
        texto: 'var(--color-texto)',
      },
      fontFamily: {
        titulo: 'var(--fuente-titulo)',
        cuerpo: 'var(--fuente-cuerpo)',
      },
    },
  },
  plugins: [],
};
