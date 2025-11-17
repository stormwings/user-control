import { useState } from 'react';
import { FiX, FiShield } from 'react-icons/fi';
import { Button } from '../../ui/Button';
import { UserRoleSelect } from '../form/UserRoleSelect';
import useUserMutations from '../../../hooks/useUserMutations';

export const ChangeRoleDialog = ({ open, user, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const { changeRole, isLoading } = useUserMutations();

  const handleConfirm = async () => {
    if (!user || !selectedRole) return;

    try {
      await changeRole(user._id, selectedRole);
      onSuccess?.();
      onClose();
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
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiShield className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Cambiar Rol
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {user.name}
              </p>
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

        <div className="px-6 pb-6">
          <UserRoleSelect
            value={selectedRole}
            onChange={setSelectedRole}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? 'Cambiando...' : 'Cambiar Rol'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleDialog;
