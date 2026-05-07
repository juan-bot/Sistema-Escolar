import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Limpia el input automáticamente cuando el valor es "0" y se hace foco (solo type="number")
document.addEventListener('focusin', (e) => {
  const el = e.target
  if (el.tagName === 'INPUT' && el.type === 'number' && el.value.trim() === '0') {
    el.value = ''
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
