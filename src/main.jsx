import React from 'react'
import ReactDOM from 'react-dom/client'
import ControlDiabetesApp from './App.jsx'
import { GAAssistant } from './components/GAAssistant.jsx'

const manifestLink = document.createElement('link')
manifestLink.rel = 'manifest'
manifestLink.href = '/manifest.webmanifest'
document.head.appendChild(manifestLink)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ControlDiabetesApp />
    <GAAssistant />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
