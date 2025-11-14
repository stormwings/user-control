import { FiUsers } from 'react-icons/fi';

export const UsersEmptyState = ({ message = "No se encontraron usuarios" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <FiUsers className="text-3xl text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {message}
      </p>
    </div>
  );
};

export default UsersEmptyState;
