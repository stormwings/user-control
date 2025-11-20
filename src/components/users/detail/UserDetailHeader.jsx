import { FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { UserStatusBadge } from '../list/UserStatusBadge';
import { UserRoleBadge } from '../list/UserRoleBadge';

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
          >
            <FiArrowLeft />
            <span>Volver a lista</span>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-hover/10 text-2xl font-semibold text-brand-hover">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-100">
                {user?.name || 'Usuario'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <UserRoleBadge role={user?.role} />
                <UserStatusBadge status={user?.status} />
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
