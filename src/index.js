import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider } from './providers/ThemeProvider';
import ErrorBoundary from './components/layout/ErrorBoundary';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
