import { FiShield, FiShieldOff, FiUserMinus } from "react-icons/fi";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";

export const UserListItem = ({
  user,
  index,
  isInactive,
  onToggleAdmin,
  onToggleActive
}) => (
  <li className="px-4 py-3 text-sm">
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <div className="flex w-full min-w-0 items-center gap-3 sm:w-6/12">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300">
          U{index + 1}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800 dark:text-gray-200">
            {user.name || "— — —"}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-3/12">
        <Chip tone={user.isAdmin ? "blue" : "amber"}>
          {user.isAdmin ? "Administrador" : "Vendedor"}
        </Chip>
      </div>

      <div className="flex w-full justify-stretch gap-2 sm:w-3/12 sm:justify-end">
        <Button
          variant="ghost"
          size="sm"
          title={user.isAdmin ? "Quitar admin" : "Hacer admin"}
          className="flex-1 sm:flex-none"
          disabled
          onClick={() => onToggleAdmin?.(user)}
        >
          {user.isAdmin ? <FiShieldOff /> : <FiShield />}
          <span className="hidden xs:inline">Admin</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          title={isInactive(user) ? "Activar" : "Desactivar"}
          className="flex-1 sm:flex-none"
          disabled
          onClick={() => onToggleActive?.(user)}
        >
          <FiUserMinus />
          <span className="hidden xs:inline">Desactivar</span>
        </Button>
      </div>
    </div>
  </li>
);
