import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'github-pages',
  publicDir: '../public',
  base: process.env.PAGES_BASE || './',
  plugins: [react()],
  build: {
    outDir: '../pages-dist',
    emptyOutDir: true,
  },
});
