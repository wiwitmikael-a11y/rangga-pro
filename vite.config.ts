import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: __dirname is not available in all module contexts.
      // Resolving from the current working directory instead.
      '@': path.resolve('./src'),
    },
  },
})