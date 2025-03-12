import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Redirige todas las solicitudes a la API a tu backend en Render
      '/api': 'https://productsvents.onrender.com', // Cambia esta URL con la URL real de tu backend en Render
    },
  },
})
