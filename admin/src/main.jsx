import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { DialogProvider } from './ui.jsx';
import './admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>,
);
