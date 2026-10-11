import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import contentPlugin from './plugins/content.js'
import adminPlugin from './admin/server/plugin.js'

const root = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentPlugin(), adminPlugin()],
  // Live site (ttvpro007.github.io) is served from the domain root; the staging build
  // sets BASE_PATH (e.g. /portfolio-staging/) when it is published under a sub-path
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
      '@content': path.resolve(root, './content'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep framework code in its own long-cached chunk
        manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] },
      },
    },
  },
})
