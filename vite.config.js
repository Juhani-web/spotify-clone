// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Kör endast på 127.0.0.1 (inte localhost)
    port: 5173,        // Valfri: sätt en fast port
  },
  preview: {
    host: '127.0.0.1', // Samma sak för vite preview
    port: 4173,        // Standard preview-port (valfri)
  },
});
