/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  // Asegurar que las variables de entorno se incluyan en el build
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  // Configuración para el build
  build: {
    sourcemap: true, // Facilita el debug
    rollupOptions: {
      output: {
        manualChunks: undefined, // Simplifica el debug
      },
    },
  },
})
