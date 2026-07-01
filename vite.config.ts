import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The API whitelists http://localhost:5173 for CORS, so pin to it and
    // fail loudly rather than drifting to a non-allowed port.
    port: 5173,
    strictPort: true,
  },
})
