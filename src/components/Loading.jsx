import React from 'react';

const Loading = ({ 
  size = 'md', 
  message = null,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4',
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div className={`animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-brand-primary dark:border-t-brand-hover ${spinnerClass}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {message && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {spinner}
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
