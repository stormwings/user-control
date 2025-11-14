import { FiLock, FiUnlock, FiUserMinus, FiUserCheck, FiKey, FiShield } from 'react-icons/fi';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { isUserActive, isUserBlocked, isUserInactive } from '../../utils/userStatusHelpers';

/**
 * User Account State Card Component
 * Display account status and quick actions
 */
export const UserAccountStateCard = ({ user, onAction }) => {
  return (
    <Card>
      <CardHeader title="Estado de Cuenta" />

      <div className="space-y-4">
        {/* Status description */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Estado actual
          </label>
          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {isUserActive(user) && 'La cuenta está activa y operativa'}
            {isUserBlocked(user) && 'La cuenta está bloqueada y no puede acceder'}
            {isUserInactive(user) && !isUserBlocked(user) && 'La cuenta está desactivada'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
            Acciones rápidas
          </p>

          <div className="grid grid-cols-1 gap-2">
            {/* Change Role */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction?.('changeRole', user)}
              className="justify-start"
            >
              <FiShield />
              <span>Cambiar rol</span>
            </Button>

            {/* Block / Unblock */}
            {isUserActive(user) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('block', user)}
                className="justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLock />
                <span>Bloquear cuenta</span>
              </Button>
            )}

            {isUserBlocked(user) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('unblock', user)}
                className="justify-start text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <FiUnlock />
                <span>Desbloquear cuenta</span>
              </Button>
            )}

            {/* Deactivate / Activate */}
            {isUserActive(user) && !isUserBlocked(user) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('deactivate', user)}
                className="justify-start text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <FiUserMinus />
                <span>Desactivar cuenta</span>
              </Button>
            )}

            {isUserInactive(user) && !isUserBlocked(user) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('activate', user)}
                className="justify-start text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <FiUserCheck />
                <span>Activar cuenta</span>
              </Button>
            )}

            {/* Reset Password */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction?.('resetPassword', user)}
              className="justify-start"
            >
              <FiKey />
              <span>Restablecer contraseña</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserAccountStateCard;
