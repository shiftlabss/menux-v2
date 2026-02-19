import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StudioProvider } from './context/StudioContext'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <StudioProvider>
        <App />
      </StudioProvider>
    </UserProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  console.log('[SW] Service Worker is supported.');
  const registerServiceWorker = () => {
    console.log('[SW] Attempting to register...');
    navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' })
      .then(registration => {
        console.log('[SW] Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('[SW] Service Worker registration failed:', err);
      });
  };

  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
} else {
  console.warn('[SW] Service Worker is NOT supported in this browser.');
}
