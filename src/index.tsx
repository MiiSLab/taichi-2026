import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { installLongTaskAutoDemote } from './utils/performanceTier';

// Watch for sustained main-thread jank during the first few seconds.
// If the user's machine struggles, persist a lower performance tier so
// next visit auto-degrades the hero animations.
installLongTaskAutoDemote();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
