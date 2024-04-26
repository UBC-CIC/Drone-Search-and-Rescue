import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

const env = loadEnv("development", process.cwd(), '')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // migrate from create react app
  server: {
      port: 80,
      host: '0.0.0.0',
      proxy: {
          // development proxy: http://localhost:3000/api -> http://localhost:8000/api
          '/api': {
              target: env.VITE_HOST_DNS,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '')
          },
      }
  },
  build: {
      // migrate from create react app
      outDir: 'build',
  }
})