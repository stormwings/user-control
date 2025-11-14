import { useNavigate } from 'react-router-dom';
import useUsersList from '../../features/users/hooks/useUsersList';
import UsersPageHeader from '../../features/users/components/layout/UsersPageHeader';
import UsersToolbar from '../../features/users/components/layout/UsersToolbar';
import UsersSearchInput from '../../features/users/components/layout/UsersSearchInput';
import UsersFilterChips from '../../features/users/components/layout/UsersFilterChips';
import UsersTable from '../../features/users/components/list/UsersTable';
import UsersPagination from '../../features/users/components/layout/UsersPagination';
import ChangeRoleDialog from '../../features/users/components/dialogs/ChangeRoleDialog';
import BlockUserDialog from '../../features/users/components/dialogs/BlockUserDialog';
import DeactivateUserDialog from '../../features/users/components/dialogs/DeactivateUserDialog';
import ResetPasswordDialog from '../../features/users/components/dialogs/ResetPasswordDialog';

function UsersListPage() {
  const navigate = useNavigate();

  const {
    users,
    isLoading,
    filters,
    pagination,
    setSearch,
    setStatus,
    setRole,
    setPage,
    currentAction,
    openAction,
    closeAction,
    refresh,
  } = useUsersList();

  const handleRowClick = (userId) => {
    navigate(`/dashboard/users/${userId}`);
  };

  const handleAction = (type, user) => {
    if (type === 'view') {
      navigate(`/dashboard/users/${user._id}`);
    } else if (type === 'edit') {
      navigate(`/dashboard/users/${user._id}/edit`);
    } else {
      openAction(type, user);
    }
  };

  const handleActionSuccess = () => {
    refresh();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <UsersPageHeader
        title="Gestión de Usuarios"
        subtitle="Administra usuarios, roles y permisos del sistema"
        count={pagination.total}
      />

      <UsersToolbar
        onCreateUser={() => navigate('/dashboard/users/new')}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <UsersSearchInput
          value={filters.search}
          onChange={setSearch}
        />

        <UsersFilterChips
          status={filters.status}
          onChangeStatus={setStatus}
          role={filters.role}
          onChangeRole={setRole}
        />
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        startIndex={(pagination.page - 1) * pagination.pageSize}
        onRowClick={handleRowClick}
        onAction={handleAction}
      />

      <UsersPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={pagination.total}
        onChangePage={setPage}
      />

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

export default UsersListPage;
