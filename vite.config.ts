import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // Define plugins used in the Vite configuration
  plugins: [vue()],
  // Configure the development server
  server: {
    // Set custom headers for the development server
    headers: {
      // Only for development environment to support certain dependencies using new Function/eval during HMR/debugging
      // Remove 'unsafe-eval' in production and use the output from `vite build`
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; connect-src 'self' http://localhost:8000 ws://localhost:5173; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"
    },
    // Configure proxy settings for the development server
    proxy: {
      '/api': {
        // Target URL for the proxy
        target: 'http://localhost:8000',
        // Enable changeOrigin to allow cross-origin requests
        changeOrigin: true,
        // Disable secure protocol for the proxy
        secure: false
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
})
