import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { initLenis } from './lib/lenis.js'

initLenis()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
