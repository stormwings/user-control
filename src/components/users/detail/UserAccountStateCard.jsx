import { FiLock, FiUnlock, FiKey, FiShield } from 'react-icons/fi';
import { Card, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { isUserBlocked } from '../../../utils/userStatusHelpers';

export const UserAccountStateCard = ({ user, onAction }) => {
  return (
    <Card dataCy="user-account-state-card">
      <CardHeader title="Estado de Cuenta" />

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400">
            Estado actual
          </label>
          <p className="mt-1 text-sm text-gray-100" data-cy="user-account-state-text">
            {isUserBlocked(user) ? 'La cuenta está bloqueada y no puede acceder' : 'La cuenta está activa y operativa'}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-700">
          <p className="text-xs font-medium text-gray-400 mb-3">
            Acciones rápidas
          </p>

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction?.('changeRole', user)}
              className="justify-start"
              dataCy="user-action-change-role-button"
            >
              <FiShield />
              <span>Cambiar rol</span>
            </Button>

            {!isUserBlocked(user) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction?.('block', user)}
                className="justify-start text-red-400 hover:bg-red-900/20"
                dataCy="user-action-block-button"
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
                className="justify-start text-green-400 hover:bg-green-900/20"
                dataCy="user-action-unblock-button"
              >
                <FiUnlock />
                <span>Desbloquear cuenta</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction?.('resetPassword', user)}
              className="justify-start"
              dataCy="user-action-reset-password-button"
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
