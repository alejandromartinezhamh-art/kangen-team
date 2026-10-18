import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { contenidoWeb } from '../../../compartido/vite';

export default defineConfig({
  plugins: [react(), contenidoWeb()],
  server: { port: 3000 },
});
