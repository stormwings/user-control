import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchUsers } from '../api/usersApi';
import { mapUsersFromApi } from '../utils/userMappers';
import { toast } from 'react-toastify';

/**
 * Hook for managing users list with filters, search, and pagination
 * Syncs state with URL params
 */
export function useUsersList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null); // { type, user }

  // Read filters from URL
  const filters = useMemo(() => ({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    role: searchParams.get('role') || 'all',
  }), [searchParams]);

  // Read pagination from URL
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  /**
   * Update URL params
   */
  const updateParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === 'all' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  /**
   * Fetch users from API
   */
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        role: filters.role !== 'all' ? filters.role : undefined,
        page,
        pageSize,
      };

      const response = await fetchUsers(params);

      const mappedUsers = mapUsersFromApi(response.data || response.users || response);
      setUsers(mappedUsers);

      // Update pagination meta
      if (response.meta) {
        setPaginationMeta({
          page: response.meta.page || page,
          pageSize: response.meta.pageSize || pageSize,
          total: response.meta.total || mappedUsers.length,
          totalPages: response.meta.totalPages || Math.ceil((response.meta.total || mappedUsers.length) / pageSize),
        });
      } else {
        setPaginationMeta({
          page,
          pageSize,
          total: mappedUsers.length,
          totalPages: Math.ceil(mappedUsers.length / pageSize),
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.status, filters.role, page, pageSize]);

  /**
   * Load users when filters/pagination change
   */
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /**
   * Update search filter
   */
  const setSearch = useCallback((search) => {
    updateParams({ search, page: 1 }); // Reset to page 1 on search
  }, [updateParams]);

  /**
   * Update status filter
   */
  const setStatus = useCallback((status) => {
    updateParams({ status, page: 1 }); // Reset to page 1 on filter change
  }, [updateParams]);

  /**
   * Update role filter
   */
  const setRole = useCallback((role) => {
    updateParams({ role, page: 1 }); // Reset to page 1 on filter change
  }, [updateParams]);

  /**
   * Change page
   */
  const setPage = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  /**
   * Change page size
   */
  const setPageSize = useCallback((pageSize) => {
    updateParams({ pageSize, page: 1 }); // Reset to page 1 on page size change
  }, [updateParams]);

  /**
   * Open action dialog
   */
  const openAction = useCallback((type, user) => {
    setCurrentAction({ type, user });
  }, []);

  /**
   * Close action dialog
   */
  const closeAction = useCallback(() => {
    setCurrentAction(null);
  }, []);

  /**
   * Refresh users list
   */
  const refresh = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    error,
    filters,
    pagination: paginationMeta,
    setSearch,
    setStatus,
    setRole,
    setPage,
    setPageSize,
    currentAction,
    openAction,
    closeAction,
    refresh,
  };
}

export default useUsersList;
