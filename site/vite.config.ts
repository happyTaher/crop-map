import { defineConfig } from 'vite';

// The matcha guide uses public OpenFreeMap tiles and needs no crop archives or API keys.
export default defineConfig({ build: { target: 'es2022', chunkSizeWarningLimit: 1500 } });
