import { UsersTableHeader } from './UsersTableHeader';
import { UsersTableBody } from './UsersTableBody';
import { UsersEmptyState } from './UsersEmptyState';

export const UsersTable = ({
  users,
  isLoading,
  startIndex = 0,
  onRowClick,
  onAction,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-700 overflow-hidden bg-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-brand-hover"></div>
            <p className="text-sm text-gray-400">
              Cargando usuarios...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 overflow-hidden bg-gray-800">
        <UsersEmptyState />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <UsersTableHeader />
          <UsersTableBody
            users={users}
            startIndex={startIndex}
            onRowClick={onRowClick}
            onAction={onAction}
          />
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
