import { FiSearch } from 'react-icons/fi';
import { Input } from '../../../../components/ui/Input';

export const UsersSearchInput = ({ value, onChange, placeholder = "Buscar usuario..." }) => {
  return (
    <div className="relative w-full sm:w-80">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="text-gray-400 dark:text-gray-500" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default UsersSearchInput;
