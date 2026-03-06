import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyOptions = {
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on('error', (err) => {
      // Suppress noisy ECONNREFUSED errors when backend is not running
      if (err.code !== 'ECONNREFUSED') {
        console.error('[proxy error]', err.message)
      }
    })
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:3001', ...proxyOptions },
      '/auth': { target: 'http://127.0.0.1:3001', ...proxyOptions },
      '/uploads': { target: 'http://127.0.0.1:3001', ...proxyOptions }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
