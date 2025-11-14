import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPackage,
  FiLayers,
  FiShoppingCart,
  FiUserCheck,
  FiUserMinus,
  FiShield,
} from "react-icons/fi";

import { selectUsers } from "../features/auth/selectors";
import { allUsers } from "../features/auth/authSlice";
import { useUserFilters } from "../hooks/useUserFilters";
import { usePagination } from "../hooks/usePagination";

import { Card, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";
import { QuickAction } from "./admin/QuickAction";
import { FilterButton } from "./admin/FilterButton";
import { UserListItem } from "./admin/UserListItem";
import { Pagination } from "./admin/Pagination";

const ITEMS_PER_PAGE = 10;

const QUICK_ACTIONS = [
  {
    id: "new-product",
    icon: FiPackage,
    label: "Nuevo producto",
    path: "/dashboard/form",
  },
  {
    id: "new-category",
    icon: FiLayers,
    label: "Nueva categoría",
    path: "/dashboard/category/add",
  },
  {
    id: "new-order",
    icon: FiShoppingCart,
    label: "Nuevo pedido",
    path: "/invoice",
  },
];

const USER_FILTERS = [
  { id: "active", label: "Activos", icon: FiUserCheck },
  { id: "inactive", label: "Desactivados", icon: FiUserMinus },
  { id: "admin", label: "Admin", icon: FiShield },
  { id: "all", label: "Todos" },
];

const QuickActionsSection = ({ actions, onNavigate }) => (
  <Card>
    <CardHeader title="Acciones rápidas" />
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <QuickAction
          key={action.id}
          icon={action.icon}
          label={action.label}
          onClick={() => onNavigate(action.path)}
          className="basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33%-0.5rem)]"
        />
      ))}
    </div>
  </Card>
);

const UserFilters = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => (
  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap items-center gap-2">
      {USER_FILTERS.map((filterConfig) => (
        <FilterButton
          key={filterConfig.id}
          active={activeFilter === filterConfig.id}
          onClick={() => onFilterChange(filterConfig.id)}
          title={filterConfig.label}
          icon={filterConfig.icon}
        >
          {filterConfig.label}
        </FilterButton>
      ))}
    </div>

    <div className="w-full sm:w-60">
      <Input
        type="text"
        placeholder="Buscar usuario…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </div>
);

const UserTable = ({ users, startIndex, isInactive }) => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="hidden bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 sm:flex">
      <div className="w-6/12">Usuario</div>
      <div className="w-3/12">Rol</div>
      <div className="w-3/12 text-right">Acciones</div>
    </div>

    <div className="max-h-[60vh] sm:max-h-96 lg:max-h-[420px] overflow-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.length > 0 ? (
          users.map((user, idx) => (
            <UserListItem
              key={user._id}
              user={user}
              index={startIndex + idx}
              isInactive={isInactive}
            />
          ))
        ) : (
          <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No se encontraron usuarios
          </li>
        )}
      </ul>
    </div>
  </div>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isInactive,
  } = useUserFilters(users);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedUsers,
    startIndex,
    goToPage,
    resetPage,
  } = usePagination(filteredUsers, ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        await dispatch(allUsers()).unwrap();
      } catch (error) {
        console.error('Error fetching users in AdminPanel:', error);
        // Error already handled by axios interceptor and shown via toast
      }
    };

    fetchAllUsers();
  }, [dispatch]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    resetPage();
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    resetPage();
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 lg:p-6 transition-colors">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Panel de administración
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Accesos rápidos y gestión de usuarios
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-6">
        <QuickActionsSection actions={QUICK_ACTIONS} onNavigate={navigate} />

        <Card className="w-full">
          <CardHeader
            title={`Usuarios (${filteredUsers.length})`}
          />

          <UserFilters
            activeFilter={filter}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          <UserTable
            users={paginatedUsers}
            startIndex={startIndex}
            isInactive={isInactive}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={goToPage}
          />
        </Card>
      </div>
    </section>
  );
};

export default AdminPanel;
