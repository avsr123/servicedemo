import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  server: {
    host: '127.0.0.1', // Force Vite to use IPv4
    port: 3000,        // You can also change the port if needed
  },
})
