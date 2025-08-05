import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (window.__POWERED_BY_WUJIE__) {
  let root: Root
  window.__WUJIE_MOUNT = () => {
    root = createRoot(document.getElementById('root')!)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  };
  window.__WUJIE_UNMOUNT = () => {
    root.unmount()
  };
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
