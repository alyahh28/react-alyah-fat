import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- TAMBAHKAN INI
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Bungkus App dengan BrowserRouter */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </StrictMode>,
)