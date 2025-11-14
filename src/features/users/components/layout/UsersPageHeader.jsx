
export const UsersPageHeader = ({ title = "Gestión de Usuarios", subtitle, count }) => {
  return (
    <header className="mb-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
            {count !== undefined && (
              <span className="ml-3 text-lg font-normal text-gray-500 dark:text-gray-400">
                ({count})
              </span>
            )}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default UsersPageHeader;
