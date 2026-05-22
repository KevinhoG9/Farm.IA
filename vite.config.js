import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy exato para GitHub Pages no repositório:
// https://github.com/SEU-USUARIO/biogen-sertao
// URL final esperada: https://SEU-USUARIO.github.io/biogen-sertao/
export default defineConfig({
  plugins: [react()],
  base: '/Farm.IA/',
})
