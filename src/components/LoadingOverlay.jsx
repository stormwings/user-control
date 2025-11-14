import React from 'react';

/**
 * Loading Overlay Component
 * Full-screen loading indicator
 */
const LoadingOverlay = ({ message = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white dark:bg-gray-800 p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-brand-primary dark:border-t-brand-hover"></div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
