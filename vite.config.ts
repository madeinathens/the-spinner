import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IPFS deployment: relative paths so the bundle works under any CID gateway
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          wagmi: ['wagmi', 'viem', '@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
