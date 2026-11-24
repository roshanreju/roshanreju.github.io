import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User GitHub Pages site (https://roshanreju.github.io/) uses root base '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
});
