import { LucideProvider } from 'lucide-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/hud.css'
import App from './App.tsx'
import { startAutosave } from './lib/storage/autosave.ts'

startAutosave()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Bolder-than-default stroke reads clearer at a glance for young kids. */}
    <LucideProvider strokeWidth={2.25}>
      <App />
    </LucideProvider>
  </StrictMode>,
)
