import { FiUserCheck, FiUserMinus, FiShield, FiUsers } from 'react-icons/fi';
import { UserStatus, UserRole } from '../../types/userTypes';
import { FilterButton } from '../../../../components/admin/FilterButton';

export const UsersFilterChips = ({ status, onChangeStatus, role, onChangeRole }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {}
      <div className="flex items-center gap-2">
        <FilterButton
          active={status === UserStatus.ACTIVE}
          onClick={() => onChangeStatus(UserStatus.ACTIVE)}
          icon={FiUserCheck}
          title="Usuarios activos"
        >
          Activos
        </FilterButton>

        <FilterButton
          active={status === UserStatus.INACTIVE}
          onClick={() => onChangeStatus(UserStatus.INACTIVE)}
          icon={FiUserMinus}
          title="Usuarios inactivos"
        >
          Inactivos
        </FilterButton>

        <FilterButton
          active={status === UserStatus.BLOCKED}
          onClick={() => onChangeStatus(UserStatus.BLOCKED)}
          icon={FiUserMinus}
          title="Usuarios bloqueados"
        >
          Bloqueados
        </FilterButton>
      </div>

      {}
      <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-2">
        <FilterButton
          active={role === UserRole.ADMIN}
          onClick={() => onChangeRole(UserRole.ADMIN)}
          icon={FiShield}
          title="Solo administradores"
        >
          Admin
        </FilterButton>

        <FilterButton
          active={role === UserRole.SELLER}
          onClick={() => onChangeRole(UserRole.SELLER)}
          icon={FiUsers}
          title="Solo vendedores"
        >
          Vendedor
        </FilterButton>
      </div>

      {}
      {(status !== 'all' || role !== 'all') && (
        <FilterButton
          active={status === 'all' && role === 'all'}
          onClick={() => {
            onChangeStatus('all');
            onChangeRole('all');
          }}
          title="Mostrar todos"
        >
          Todos
        </FilterButton>
      )}
    </div>
  );
};

export default UsersFilterChips;
