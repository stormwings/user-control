import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Card, CardHeader } from '../../../../components/ui/Card';

/**
 * User Summary Card Component
 * Display basic user information
 */
export const UserSummaryCard = ({ user }) => {
  return (
    <Card>
      <CardHeader title="Información Básica" />

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Nombre completo
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {user?.name || '—'}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiMail className="text-xs" />
            Correo electrónico
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {user?.email || '—'}
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiPhone className="text-xs" />
            Teléfono
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {user?.phone || '—'}
          </p>
        </div>

        {/* Branch */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FiMapPin className="text-xs" />
            Sucursal
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {user?.branch || '—'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default UserSummaryCard;
