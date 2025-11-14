import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiLayers,
  FiShoppingCart,
  FiUserCheck,
  FiUserMinus,
  FiShield,
  FiShieldOff,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../features/auth/selectors";
import { allUsers } from "../features/auth/authSlice";

const ButtonGhost = ({
  children,
  onClick,
  title,
  className = "",
  disabled = false,
}) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    title={title}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const QuickAction = ({ icon: Icon, label, className = "", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3 text-xs shadow-sm hover:bg-gray-50 ${className}`}
  >
    <Icon className="text-gray-600" />
    <span className="font-medium text-gray-800">{label}</span>
  </button>
);

const Chip = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] ${tones[tone]}`}>
      {children}
    </span>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isInactive = (u) =>
    u?.disabled === true ||
    u?.isDisabled === true ||
    u?.status === "INACTIVE" ||
    u?.active === false;

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (filter === "active") filtered = filtered.filter((u) => !isInactive(u));
    if (filter === "inactive") filtered = filtered.filter((u) => isInactive(u));
    if (filter === "admin") filtered = filtered.filter((u) => !!u.isAdmin);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, filter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

    useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Panel de administración
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Accesos rápidos y gestión de usuarios
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-6">
        <section className="w-full rounded-xl border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Acciones rápidas
          </h3>
          <div className="flex flex-wrap gap-3">
            <QuickAction
              icon={FiPackage}
              label="Nuevo producto"
              className="basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33%-0.5rem)]"
              onClick={() => navigate("/dashboard/form")}
            />
            <QuickAction
              icon={FiLayers}
              label="Nueva categoría"
              className="basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33%-0.5rem)]"
              onClick={() => navigate("/dashboard/category/add")}
            />
            <QuickAction
              icon={FiShoppingCart}
              label="Nuevo pedido"
              className="basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33%-0.5rem)]"
              onClick={() => navigate("/invoice")}
            />
          </div>
        </section>

        <section className="w-full rounded-xl border border-gray-200 p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Usuarios ({filteredUsers.length})
            </h3>
          </div>

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleFilterChange("active")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === "active"
                    ? "bg-[var(--blackpos-primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Activos"
              >
                <FiUserCheck className="mr-1 inline-block" />
                Activos
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange("inactive")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === "inactive"
                    ? "bg-[var(--blackpos-primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Desactivados"
              >
                <FiUserMinus className="mr-1 inline-block" />
                Desactivados
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange("admin")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === "admin"
                    ? "bg-[var(--blackpos-primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Administradores"
              >
                <FiShield className="mr-1 inline-block" />
                Admin
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === "all"
                    ? "bg-[var(--blackpos-primary)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Todos"
              >
                Todos
              </button>
            </div>

            <div className="w-full sm:w-60">
              <input
                type="text"
                placeholder="Buscar usuario…"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--blackpos-primary)]"
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="hidden bg-gray-50 px-4 py-2 text-xs text-gray-600 sm:flex">
              <div className="w-6/12">Usuario</div>
              <div className="w-3/12">Rol</div>
              <div className="w-3/12 text-right">Acciones</div>
            </div>

            <div className="max-h-[60vh] sm:max-h-96 lg:max-h-[420px] overflow-auto">
              <ul className="divide-y">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u, idx) => (
                    <li key={u._id} className="px-4 py-3 text-sm">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <div className="flex w-full min-w-0 items-center gap-3 sm:w-6/12">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                            U{startIndex + idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-800">
                              {u.name || "— — —"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        <div className="w-full sm:w-3/12">
                          <Chip tone={u.isAdmin ? "blue" : "amber"}>
                            {u.isAdmin ? "Administrador" : "Vendedor"}
                          </Chip>
                        </div>

                        <div className="flex w-full justify-stretch gap-2 sm:w-3/12 sm:justify-end">
                          <ButtonGhost
                            title={u.isAdmin ? "Quitar admin" : "Hacer admin"}
                            className="flex-1 sm:flex-none"
                            disabled
                          >
                            {u.isAdmin ? <FiShieldOff /> : <FiShield />}
                            <span className="hidden xs:inline">Admin</span>
                          </ButtonGhost>

                          <ButtonGhost
                            title={isInactive(u) ? "Activar" : "Desactivar"}
                            className="flex-1 sm:flex-none"
                            disabled
                          >
                            <FiUserMinus />
                            <span className="hidden xs:inline">Desactivar</span>
                          </ButtonGhost>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-8 text-center text-sm text-gray-500">
                    No se encontraron usuarios
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-xs text-gray-600">
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, filteredUsers.length)} de{" "}
                {filteredUsers.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Página anterior"
                >
                  <FiChevronLeft />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if there's a gap
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 text-xs text-gray-500">
                              …
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`min-w-[32px] rounded-md px-3 py-1.5 text-xs font-medium ${
                              currentPage === page
                                ? "bg-[var(--blackpos-primary)] text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Página siguiente"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default AdminPanel;
