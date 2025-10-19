import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Fix: Ensure asset paths are relative to fix 404 on lazy-loaded chunks.
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: __dirname is not available in ES modules. Use import.meta.url to get the current file path.
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})