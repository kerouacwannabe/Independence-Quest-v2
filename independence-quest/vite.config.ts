import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/Independence-Quest-v2/',
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: true
  }
});
