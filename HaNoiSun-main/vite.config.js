import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 5173
  },
  plugins: [react()],
  define: {
    // Define environment variables for production
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://api.hanoisuntravel.com/api'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME || 'Hà Nội Sun Travel'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
    'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT || 'production')
  }
})
