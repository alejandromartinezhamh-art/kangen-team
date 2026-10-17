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
        eggshell: 'var(--color-eggshell)',
        taupe: 'var(--color-warm-taupe)',
        stone: 'var(--color-stone)',
        graphite: 'var(--color-graphite)',
        smoke: 'var(--color-smoke)',
        ash: 'var(--color-ash)',
        'natural-a': 'var(--color-violet-spark)',
        'natural-b': 'var(--color-ember-orange)',
      },
      fontFamily: {
        titulo: 'var(--fuente-titulo)',
        cuerpo: 'var(--fuente-cuerpo)',
      },
    },
  },
  plugins: [],
};
