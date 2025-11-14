import { FiClock, FiCalendar, FiUser } from 'react-icons/fi';
import { Card, CardHeader } from '../../../../components/ui/Card';

/**
 * User Meta Info Card Component
 * Display metadata like creation date, last login, etc.
 */
export const UserMetaInfo = ({ user }) => {
  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader title="Información del Sistema" />

      <div className="space-y-4">
        {/* Created At */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiCalendar className="text-xs" />
            Fecha de registro
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {formatDate(user?.createdAt)}
          </p>
        </div>

        {/* Last Login */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiClock className="text-xs" />
            Último acceso
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {formatDate(user?.lastLoginAt) || 'Nunca'}
          </p>
        </div>

        {/* Updated At */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiClock className="text-xs" />
            Última actualización
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {formatDate(user?.updatedAt)}
          </p>
        </div>

        {/* Created By */}
        {user?.createdBy && (
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FiUser className="text-xs" />
              Creado por
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {user.createdBy}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserMetaInfo;
