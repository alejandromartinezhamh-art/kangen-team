import embudo from '../../../compartido/tailwind.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [embudo],
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../../compartido/src/**/*.{ts,tsx}'],
};
