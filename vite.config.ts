import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Open-Issue-Finder/',
  plugins: [react()],
})
