
export const UsersTableHeader = () => {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          #
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Usuario
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Rol
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Estado
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Sucursal
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Último acceso
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
  );
};

export default UsersTableHeader;
