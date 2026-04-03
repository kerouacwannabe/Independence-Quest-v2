import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/Independence-Quest-v2/',
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: true
  }
});
