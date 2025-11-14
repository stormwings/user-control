import React from 'react';
import { toast } from 'react-toastify';

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Show error toast
    toast.error('Ocurrió un error inesperado. Por favor recarga la página.');

    // You can also log the error to an error reporting service here
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg 
                  className="h-8 w-8 text-red-600 dark:text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Algo salió mal
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ocurrió un error inesperado en la aplicación.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detalles del error
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-brand-primary dark:bg-brand-hover text-white rounded-lg hover:bg-brand-hover dark:hover:bg-opacity-90 transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
