import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './index.css';

window.addEventListener('vite:preloadError', () => window.location.reload());

const Aviso = import.meta.env.VITE_DEMO ? lazy(() => import('./demo/Aviso')) : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {Aviso && (
        <Suspense>
          <Aviso />
        </Suspense>
      )}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
