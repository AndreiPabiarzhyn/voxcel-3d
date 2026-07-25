import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/voxcel-3d/ (a project page, not a
  // user page), so every asset URL needs this prefix or they 404 in prod.
  base: '/voxcel-3d/',
  plugins: [react()],
})
