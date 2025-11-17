import { ConfirmDialog } from './ConfirmDialog';
import useUserMutations from '../../../hooks/useUserMutations';

export const DeactivateUserDialog = ({ open, user, onClose, onSuccess }) => {
  const { deactivateUser, isLoading } = useUserMutations();

  const handleConfirm = async () => {
    if (!user) return;

    try {
      await deactivateUser(user._id);
      onSuccess?.();
      onClose();
    } catch (error) {
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Desactivar Usuario"
      message={`¿Estás seguro de desactivar a ${user?.name}? El usuario no podrá acceder al sistema.`}
      confirmText="Desactivar"
      cancelText="Cancelar"
      variant="warning"
      onConfirm={handleConfirm}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};

export default DeactivateUserDialog;
