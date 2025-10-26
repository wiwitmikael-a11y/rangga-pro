import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensure relative asset paths for correct builds.
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: `__dirname` is not available in ES modules. Use `import.meta.url` to get the current directory path.
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit for 3D scenes
  },
})
