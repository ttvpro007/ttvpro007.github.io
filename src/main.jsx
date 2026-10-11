import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styling/index.css'
import App from './App.jsx'
import theme from '@content/theme.json'
import { applyTheme } from '@/lib/theme/applyTheme'

applyTheme(theme)

if (import.meta.env.DEV) {
  // Saving content/theme.json restyles the page without a reload
  import.meta.hot?.accept('@content/theme.json', (next) => next && applyTheme(next.default))
  // The admin's theme editor previews unsaved changes in an iframe of this page
  window.addEventListener('message', (e) => {
    if (e.origin === window.location.origin && e.data?.type === 'portfolio:theme') applyTheme(e.data.theme)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
