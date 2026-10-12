import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Build output, Vite's dependency cache, and uploaded media (Unity builds…) are not ours to lint
  globalIgnores(['dist', '.vite', 'public', 'content/**/media', '.trash']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Core no-unused-vars can't see JSX usage: components are Capitalized, and `motion` is used as <motion.div>
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z_]|motion$)' }],
    },
  },
  {
    // Node-side code: build and site config, scripts, tests
    files: ['vite.config.js', 'loom.config.js', 'scripts/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])
