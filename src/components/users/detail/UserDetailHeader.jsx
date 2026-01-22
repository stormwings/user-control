import { FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { UserStatusBadge } from '../list/UserStatusBadge';
import { UserRoleBadge } from '../list/UserRoleBadge';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UserDetailHeader = ({ user, onAction }) => {
  const navigate = useNavigate();

  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/users')}
            className="mb-4"
            dataCy={USERS_TEST_IDS.USER_DETAIL_BACK_BUTTON}
          >
            <FiArrowLeft />
            <span>Volver a lista</span>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-hover/10 text-2xl font-semibold text-brand-hover">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-100" data-cy={USERS_TEST_IDS.USER_DETAIL_NAME}>
                {user?.name || 'Usuario'}
              </h1>
              <p className="text-sm text-gray-400 mt-1" data-cy={USERS_TEST_IDS.USER_DETAIL_EMAIL}>
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <UserRoleBadge role={user?.role} dataCy={USERS_TEST_IDS.USER_DETAIL_ROLE} />
                <UserStatusBadge status={user?.status} dataCy={USERS_TEST_IDS.USER_DETAIL_STATUS} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            onClick={() => onAction?.('menu')}
            title="Más acciones"
          >
            <FiMoreVertical />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UserDetailHeader;
