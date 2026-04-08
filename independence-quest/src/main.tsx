import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from './app/App';

const root = document.getElementById('app');

if (!root) {
  throw new Error('App root #app was not found. The skull has nowhere to manifest.');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.warn('Service worker registration failed', error);
    });
  });
}
