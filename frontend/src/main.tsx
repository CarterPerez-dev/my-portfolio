// ===========================
// ©AngelaMos | 2025
// main.tsx
// ===========================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/core/i18n/i18n.config'
import App from './App'
import './styles.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
