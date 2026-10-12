import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@loom/blocks/styles.css'
import { applyTheme } from '@loom/blocks'
import { theme } from '@loom/core/client'
import App from '@loom/kit-portfolio/app'

applyTheme(theme)

if (import.meta.env.DEV) {
  // The admin's theme editor previews unsaved changes in an iframe of this page
  window.addEventListener('message', (e) => {
    if (e.origin === window.location.origin && e.data?.type === 'loom:theme') applyTheme(e.data.theme)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
