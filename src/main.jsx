import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SlotsPage from './slots/SlotsPage.jsx'

const isSlotsPath = window.location.pathname === '/slots'
  || window.location.pathname === '/slots/'
  || window.location.pathname.startsWith('/slots/index.html')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSlotsPath ? <SlotsPage /> : <App />}
  </StrictMode>,
)
