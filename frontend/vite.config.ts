import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 5173,      // Your desired port
  },
  plugins: [react()]
})
