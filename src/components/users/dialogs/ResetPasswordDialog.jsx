import { useState } from 'react';
import { FiKey, FiX } from 'react-icons/fi';
import { Button } from '../../ui/Button';
import useUserMutations from '../../../hooks/useUserMutations';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const ResetPasswordDialog = ({ open, user, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { resetPassword, isLoading } = useUserMutations();

  const handleConfirm = async () => {
    if (!user) return;

    setError('');

    if (!newPassword) {
      setError('La contraseña es requerida');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await resetPassword(user._id, newPassword);
      onSuccess?.();
      handleClose();
    } catch (error) {
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 shadow-xl"
        role="dialog"
        aria-modal="true"
        data-cy="user-reset-password-dialog"
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-900/30">
              <FiKey className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                Restablecer Contraseña
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {user.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              data-cy="user-reset-password-input"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-brand-hover"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              data-cy="user-reset-password-confirm-input"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-brand-hover"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <p className="text-xs text-gray-400">
            Mínimo 6 caracteres
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-700 px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            dataCy="user-reset-password-cancel"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            dataCy="user-reset-password-confirm"
          >
            {isLoading ? 'Restableciendo...' : 'Restablecer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordDialog;
