import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loomContent } from '@loom/core/node'
import builder from '@loom/builder/vite'

const isStaging = process.env.SITE_ENV === 'staging'

/** Staging builds must not be indexed or mistaken for the live site */
const stagingMarker = () => ({
  name: 'staging-marker',
  apply: 'build',
  transformIndexHtml: (html) =>
    isStaging
      ? html
          .replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
          .replace('<title>', '<title>[staging] ')
      : html,
})

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), await loomContent(), builder(), stagingMarker()],
  // Live site (ttvpro007.github.io) is served from the domain root; the staging build
  // sets BASE_PATH (e.g. /portfolio-staging/) when it is published under a sub-path
  base: process.env.BASE_PATH || '/',
  // The dev server's dependency pre-bundling can't resolve virtual:loom/content inside an
  // installed @loom/core, so the Loom packages are served as source and only their own
  // dependencies are pre-bundled. Belongs in @loom/core's content plugin; remove it once it is there.
  optimizeDeps: {
    exclude: ['@loom/core', '@loom/blocks', '@loom/builder', '@loom/kit-portfolio'],
    include: [
      'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'framer-motion',
      '@loom/blocks > react-markdown', '@loom/blocks > remark-gfm', '@loom/kit-portfolio > react-dom-confetti',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // Keep framework code in its own long-cached chunk
        manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] },
      },
    },
  },
}))
