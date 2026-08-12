/// <reference types="vite-plugin-pwa/client" />
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with silent auto update
const updateSW = registerSW({
  onNeedRefresh() {
    // We could show a prompt here, but the decree requested silent auto-update
    // The Vite plugin registerType: 'autoUpdate' handles taking over on new version.
  },
  onOfflineReady() {
    console.log('[Sovereign PWA] App is ready for offline use (Zero-Loading Time).');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
