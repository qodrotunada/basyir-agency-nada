
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

import './styles.css';
import './styles-vnext71.css';
import './styles-vnext72.css';
import './styles-vnext8.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

