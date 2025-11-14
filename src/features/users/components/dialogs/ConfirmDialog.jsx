import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../../../../components/ui/Button';

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  if (!open) return null;

  const variantColors = {
    danger: 'text-red-600 dark:text-red-400 bg-red-600',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-600',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${variantColors[variant]} bg-opacity-10`}>
              <FiAlertTriangle className={variantColors[variant]} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {}
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 pl-13">
            {message}
          </p>
        </div>

        {}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
