import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JiraCloneFrond from './JiraCloneFrond'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JiraCloneFrond />
  </StrictMode>,
)
