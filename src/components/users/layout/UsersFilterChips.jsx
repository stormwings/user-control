import { FiUserCheck, FiUserMinus, FiShield, FiUsers } from 'react-icons/fi';
import { UserStatus, UserRole } from '../../../utils/user';
import { FilterButton } from '../../common/FilterButton';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UsersFilterChips = ({ status, onChangeStatus, role, onChangeRole }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <FilterButton
          active={status === UserStatus.ACTIVE}
          onClick={() => onChangeStatus(UserStatus.ACTIVE)}
          icon={FiUserCheck}
          title="Usuarios activos"
          dataCy={`${USERS_TEST_IDS.USERS_FILTER_STATUS}-active`}
        >
          Activos
        </FilterButton>

        <FilterButton
          active={status === UserStatus.INACTIVE}
          onClick={() => onChangeStatus(UserStatus.INACTIVE)}
          icon={FiUserMinus}
          title="Usuarios inactivos"
          dataCy={`${USERS_TEST_IDS.USERS_FILTER_STATUS}-inactive`}
        >
          Inactivos
        </FilterButton>
      </div>

      <div className="flex items-center gap-2 border-l border-gray-600 pl-2">
        <FilterButton
          active={role === UserRole.ADMIN}
          onClick={() => onChangeRole(UserRole.ADMIN)}
          icon={FiShield}
          title="Solo administradores"
          dataCy={`${USERS_TEST_IDS.USERS_FILTER_ROLE}-admin`}
        >
          Admin
        </FilterButton>

        <FilterButton
          active={role === UserRole.USER}
          onClick={() => onChangeRole(UserRole.USER)}
          icon={FiUsers}
          title="Solo usuarios regulares"
          dataCy={`${USERS_TEST_IDS.USERS_FILTER_ROLE}-user`}
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
          dataCy={USERS_TEST_IDS.USERS_FILTER_CLEAR}
        >
          Todos
        </FilterButton>
      )}
    </div>
  );
};

export default UsersFilterChips;
