import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add server configuration
    proxy: {
      // Proxy requests starting with /api to your backend API
      '/api': {
        target: 'https://ngte2hwp1k.execute-api.us-east-1.amazonaws.com', // Your backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before forwarding
        // secure: false, // Uncomment if backend uses HTTPS with self-signed certs
      },
    }
  }
})
