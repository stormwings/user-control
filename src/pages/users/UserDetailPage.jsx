import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useUserDetail from '../../hooks/useUserDetail';
import UserDetailHeader from '../../components/users/detail/UserDetailHeader';
import UserSummaryCard from '../../components/users/detail/UserSummaryCard';
import UserAccountStateCard from '../../components/users/detail/UserAccountStateCard';
import UserMetaInfo from '../../components/users/detail/UserMetaInfo';
// TODO: Enable when audit endpoint is available in backend
// import UserAuditMiniList from '../../components/users/detail/UserAuditMiniList';
import ChangeRoleDialog from '../../components/users/dialogs/ChangeRoleDialog';
import BlockUserDialog from '../../components/users/dialogs/BlockUserDialog';
import UnblockUserDialog from '../../components/users/dialogs/UnblockUserDialog';
import ResetPasswordDialog from '../../components/users/dialogs/ResetPasswordDialog';
import { USERS_TEST_IDS } from '../../constants/testIds';

function UserDetailPage() {
  const { userId } = useParams();
  // TODO: Enable auditLog and isLoadingAudit when audit endpoint is available in backend
  const { user, /* auditLog, */ isLoading, /* isLoadingAudit, */ error, refresh } = useUserDetail(userId);
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-brand-hover"></div>
          <p className="text-sm text-gray-400">
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
          <p className="text-lg font-semibold text-gray-100 mb-2">
            Usuario no encontrado
          </p>
          <p className="text-sm text-gray-400">
            El usuario que buscas no existe o fue eliminado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6" data-cy={USERS_TEST_IDS.USER_DETAIL_PAGE}>
      <UserDetailHeader user={user} onAction={handleAction} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserSummaryCard user={user} />
          <UserMetaInfo user={user} />
        </div>

        <div className="space-y-6">
          <UserAccountStateCard user={user} onAction={handleAction} />
          {/* TODO: Enable when audit endpoint is available in backend */}
          {/* <UserAuditMiniList auditLog={auditLog} isLoading={isLoadingAudit} /> */}
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

      <UnblockUserDialog
        open={currentAction?.type === 'unblock'}
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
