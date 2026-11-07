import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths keep the build working from any subdirectory on
// GitHub Pages, including project sites served from /<repo>/.
// Set VITE_BASE_PATH to override (e.g. "/focus/" or "/").
const base = process.env.VITE_BASE_PATH ?? './';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
});
