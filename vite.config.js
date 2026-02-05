import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Code splitting automático
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks separados
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          // courseContent separado
          'course-data': ['./src/lib/courseContent.js']
        }
      }
    },

    // Chunk size limit
    chunkSizeWarningLimit: 300,

    // Minificação mais agressiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log em produção
        drop_debugger: true
      }
    }
  },

  // Otimização de dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
