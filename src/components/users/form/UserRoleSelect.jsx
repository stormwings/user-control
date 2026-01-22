import { UserRole, UserRoleLabels } from '../../../utils/user';
import { USERS_TEST_IDS } from '../../../constants/testIds';

export const UserRoleSelect = ({ value, onChange, disabled = false, required = true }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="role"
        className="text-sm font-semibold text-brand-hover mb-2"
      >
        Rol {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id="role"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        data-cy={USERS_TEST_IDS.USER_FORM_ROLE_SELECT}
        className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-3 text-gray-100 outline-none transition-colors focus:border-brand-hover focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(64,153,175,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">Seleccionar rol...</option>
        {Object.values(UserRole).map((role) => (
          <option key={role} value={role}>
            {UserRoleLabels[role]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserRoleSelect;
