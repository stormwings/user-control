import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useUserDetail from '../../features/users/hooks/useUserDetail';
import UserDetailHeader from '../../features/users/components/detail/UserDetailHeader';
import UserSummaryCard from '../../features/users/components/detail/UserSummaryCard';
import UserAccountStateCard from '../../features/users/components/detail/UserAccountStateCard';
import UserMetaInfo from '../../features/users/components/detail/UserMetaInfo';
import UserAuditMiniList from '../../features/users/components/detail/UserAuditMiniList';
import ChangeRoleDialog from '../../features/users/components/dialogs/ChangeRoleDialog';
import BlockUserDialog from '../../features/users/components/dialogs/BlockUserDialog';
import DeactivateUserDialog from '../../features/users/components/dialogs/DeactivateUserDialog';
import ResetPasswordDialog from '../../features/users/components/dialogs/ResetPasswordDialog';

function UserDetailPage() {
  const { userId } = useParams();
  const { user, auditLog, isLoading, isLoadingAudit, error, refresh } = useUserDetail(userId);
  const [currentAction, setCurrentAction] = useState(null);

  const handleAction = (type, actionUser) => {
    setCurrentAction({ type, user: actionUser || user });
  };

  const closeAction = () => {
    setCurrentAction(null);
  };

  const handleActionSuccess = () => {
    refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-brand-primary dark:border-t-brand-hover"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cargando usuario...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Usuario no encontrado
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            El usuario que buscas no existe o fue eliminado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <UserDetailHeader user={user} onAction={handleAction} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserSummaryCard user={user} />
          <UserMetaInfo user={user} />
        </div>

        <div className="space-y-6">
          <UserAccountStateCard user={user} onAction={handleAction} />
          <UserAuditMiniList auditLog={auditLog} isLoading={isLoadingAudit} />
        </div>
      </div>

      <ChangeRoleDialog
        open={currentAction?.type === 'changeRole'}
        user={currentAction?.user}
        onClose={closeAction}
        onSuccess={handleActionSuccess}
      />

      <BlockUserDialog
        open={currentAction?.type === 'block'}
        user={currentAction?.user}
        onClose={closeAction}
        onSuccess={handleActionSuccess}
      />

      <DeactivateUserDialog
        open={currentAction?.type === 'deactivate'}
        user={currentAction?.user}
        onClose={closeAction}
        onSuccess={handleActionSuccess}
      />

      <ResetPasswordDialog
        open={currentAction?.type === 'resetPassword'}
        user={currentAction?.user}
        onClose={closeAction}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}

export default UserDetailPage;
