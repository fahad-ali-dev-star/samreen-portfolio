import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const proxyOptions = {
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
          console.error('[proxy error]', err.message)
        }
      })
    }
  }

  return {
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
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://samreen-portfolio.onrender.com')
    }
  }
})
