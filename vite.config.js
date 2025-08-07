// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Make the dev server listen on every loop-back interface,
  // so http://127.0.0.1:<port> works in addition to localhost.
  server: {
    host: true,      // equivalent to '0.0.0.0'
  },

  // Same setting for `vite preview` (optional but handy)
  preview: {
    host: true,
  },
})
