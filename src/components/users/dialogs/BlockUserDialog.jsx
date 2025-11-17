import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import useUserMutations from '../../../hooks/useUserMutations';

export const BlockUserDialog = ({ open, user, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const { blockUser, isLoading } = useUserMutations();

  const handleConfirm = async () => {
    if (!user) return;

    try {
      await blockUser(user._id, reason);
      onSuccess?.();
      onClose();
      setReason('');
    } catch (error) {
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <FiLock className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Bloquear Usuario
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {user.name}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            El usuario no podrá acceder al sistema hasta que sea desbloqueado.
          </p>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Motivo del bloqueo (opcional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Violación de políticas..."
              rows={3}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors focus:border-brand-primary dark:focus:border-brand-hover"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Bloqueando...' : 'Bloquear Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockUserDialog;
