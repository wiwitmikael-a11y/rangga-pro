import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Pastikan path aset relatif untuk build yang benar.
  plugins: [react()],
  resolve: {
    alias: {
      // __dirname tidak tersedia di ES Modules, gunakan import.meta.url sebagai gantinya.
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Tingkatkan batas peringatan ukuran chunk untuk scene 3D
  },
})
