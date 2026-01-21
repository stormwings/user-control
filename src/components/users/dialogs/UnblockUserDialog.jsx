import { FiUnlock } from 'react-icons/fi';
import useUserMutations from '../../../hooks/useUserMutations';

export const UnblockUserDialog = ({ open, user, onClose, onSuccess }) => {
  const { unblockUser, isLoading } = useUserMutations();

  const handleConfirm = async () => {
    if (!user) return;

    try {
      await unblockUser(user._id);
      onSuccess?.();
      onClose();
    } catch (error) {
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 shadow-xl"
        role="dialog"
        aria-modal="true"
        data-cy="user-unblock-dialog"
      >
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-900/30">
              <FiUnlock className="text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                Desbloquear Usuario
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {user.name}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-4">
            El usuario podrá acceder nuevamente al sistema.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-60"
              data-cy="user-unblock-cancel"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-60"
              data-cy="user-unblock-confirm"
            >
              {isLoading ? 'Desbloqueando...' : 'Desbloquear Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnblockUserDialog;
