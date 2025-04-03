import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';  // Corrected import of App component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
