import { FiUserPlus, FiDownload, FiFilter } from 'react-icons/fi';
import { Button } from '../../ui/Button';

export const UsersToolbar = ({
  onCreateUser,
  onExport,
  onToggleFilters,
  showFilters = true,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3" data-cy="users-toolbar">
      <div className="flex items-center gap-2">
        {onCreateUser && (
          <Button
            variant="primary"
            size="md"
            onClick={onCreateUser}
            className="gap-2"
            data-cy="users-create-button"
          >
            <FiUserPlus className="text-lg" />
            <span>Nuevo Usuario</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onToggleFilters && showFilters && (
          <Button
            variant="ghost"
            size="md"
            onClick={onToggleFilters}
            title="Mostrar/ocultar filtros"
            data-cy="users-toggle-filters-button"
          >
            <FiFilter className="text-lg" />
          </Button>
        )}

        {onExport && (
          <Button
            variant="ghost"
            size="md"
            onClick={onExport}
            title="Exportar lista"
            data-cy="users-export-button"
          >
            <FiDownload className="text-lg" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UsersToolbar;
