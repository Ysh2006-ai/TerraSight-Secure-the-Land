import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "child_process": path.resolve(__dirname, "src/lib/empty.ts"),
    }
  },
  server: {
    proxy: {
      '/api/sentinel': {
        target: 'https://services.sentinel-hub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sentinel/, ''),
      },
    },
  }
})
