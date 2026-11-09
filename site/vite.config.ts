import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// GitHub Pages uses /crop-map/; local preview and root-domain hosts use /.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        matcha: resolve(import.meta.dirname, 'matcha.html'),
      },
    },
  },
});
