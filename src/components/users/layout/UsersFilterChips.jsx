import { FiUserCheck, FiUserMinus, FiShield, FiUsers } from 'react-icons/fi';
import { UserStatus, UserRole } from '../../../utils/user';
import { FilterButton } from '../../common/FilterButton';

export const UsersFilterChips = ({ status, onChangeStatus, role, onChangeRole }) => {
  return (
    <div className="flex flex-wrap items-center gap-2" data-cy="users-filter-chips">
      <div className="flex items-center gap-2">
        <FilterButton
          active={status === UserStatus.ACTIVE}
          onClick={() => onChangeStatus(UserStatus.ACTIVE)}
          icon={FiUserCheck}
          title="Usuarios activos"
          data-cy="filter-status-active"
        >
          Activos
        </FilterButton>

        <FilterButton
          active={status === UserStatus.INACTIVE}
          onClick={() => onChangeStatus(UserStatus.INACTIVE)}
          icon={FiUserMinus}
          title="Usuarios inactivos"
          data-cy="filter-status-inactive"
        >
          Inactivos
        </FilterButton>
      </div>

      <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-2">
        <FilterButton
          active={role === UserRole.ADMIN}
          onClick={() => onChangeRole(UserRole.ADMIN)}
          icon={FiShield}
          title="Solo administradores"
          data-cy="filter-role-admin"
        >
          Admin
        </FilterButton>

        <FilterButton
          active={role === UserRole.SELLER}
          onClick={() => onChangeRole(UserRole.SELLER)}
          icon={FiUsers}
          title="Solo usuarios regulares"
          data-cy="filter-role-user"
        >
          Usuario
        </FilterButton>
      </div>

      {(status !== 'all' || role !== 'all') && (
        <FilterButton
          active={status === 'all' && role === 'all'}
          onClick={() => {
            onChangeStatus('all');
            onChangeRole('all');
          }}
          title="Mostrar todos"
          data-cy="filter-clear-all"
        >
          Todos
        </FilterButton>
      )}
    </div>
  );
};

export default UsersFilterChips;
