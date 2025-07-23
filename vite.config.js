import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // This will work for your mylogin.github.io repository
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
