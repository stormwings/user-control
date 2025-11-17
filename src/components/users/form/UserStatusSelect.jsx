import { UserStatus, UserStatusLabels } from '../../../utils/user';

export const UserStatusSelect = ({ value, onChange, disabled = false }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="status"
        className="text-sm font-semibold text-brand-hover mb-2"
      >
        Estado
      </label>
      <select
        id="status"
        value={value || UserStatus.ACTIVE}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-3 text-gray-100 outline-none transition-colors focus:border-brand-hover focus:bg-gray-600 focus:ring-4 focus:ring-[rgba(64,153,175,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {Object.values(UserStatus).map((status) => (
          <option key={status} value={status}>
            {UserStatusLabels[status]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserStatusSelect;
