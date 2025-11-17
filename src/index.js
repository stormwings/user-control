import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './utils/store';
import ErrorBoundary from './components/layout/ErrorBoundary';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Apply dark mode permanently to the HTML element
document.documentElement.classList.add('dark');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
