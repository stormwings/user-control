import { FiMoreVertical, FiEdit, FiEye, FiShield, FiLock, FiUnlock, FiKey } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { isUserActive, isUserBlocked } from '../../../utils/userStatusHelpers';

export const UserRow = ({ user, index, onRowClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleAction = (type) => {
    setShowMenu(false);
    onAction?.(type, user);
  };

  return (
    <tr
      className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => onRowClick?.(user._id)}
    >
      <td className="px-4 py-3 text-sm text-gray-400">
        #{index + 1}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-hover/10 text-sm font-semibold text-brand-hover">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-200">
              {user.name || '— — —'}
            </p>
            <p className="truncate text-xs text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <UserRoleBadge role={user.role} />
      </td>

      <td className="px-4 py-3">
        <UserStatusBadge status={user.status} />
      </td>

      <td className="px-4 py-3 text-sm text-gray-300">
        {user.branch || '—'}
      </td>

      <td className="px-4 py-3 text-sm text-gray-400">
        {user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleDateString()
          : 'Nunca'}
      </td>

      <td className="px-4 py-3 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 transition-colors"
            title="Más acciones"
          >
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-10 w-48 rounded-lg border border-gray-700 bg-gray-800 shadow-lg py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('view');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <FiEye /> Ver detalle
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('edit');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <FiEdit /> Editar
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('changeRole');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <FiShield /> Cambiar rol
              </button>

              <div className="border-t border-gray-700 my-1" />

              {isUserActive(user) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('block');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <FiLock /> Bloquear
                </button>
              )}

              {isUserBlocked(user) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('unblock');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-400 hover:bg-green-900/20 transition-colors"
                >
                  <FiUnlock /> Desbloquear
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('resetPassword');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <FiKey /> Restablecer contraseña
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
