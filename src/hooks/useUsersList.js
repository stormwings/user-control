import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchUsers } from '../utils/users';
import { mapUsersFromApi } from '../utils/userMappers';
import { toast } from 'react-toastify';

export function useUsersList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);

  const filters = useMemo(() => ({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    role: searchParams.get('role') || 'all',
  }), [searchParams]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });


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


  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mapStatusToBackend = (status) => {
        if (status === 'all') return undefined;
        return status.toLowerCase();
      };

      const mapRoleToBackend = (role) => {
        if (role === 'all') return undefined;
        if (role === 'ADMIN') return 'admin';
        if (role === 'SELLER') return 'user';
        return undefined;
      };

      const params = {
        search: filters.search || undefined,
        status: mapStatusToBackend(filters.status),
        role: mapRoleToBackend(filters.role),
        page,
        pageSize,
      };

      const response = await fetchUsers(params);

      let mappedUsers;
      let paginationData;

      if (Array.isArray(response)) {
        mappedUsers = mapUsersFromApi(response);
        paginationData = {
          page: 1,
          pageSize: mappedUsers.length,
          total: mappedUsers.length,
          totalPages: 1,
        };
      } else if (response.data && response.pagination) {
        mappedUsers = mapUsersFromApi(response.data);
        paginationData = {
          page: response.pagination.page,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        };
      } else {
        mappedUsers = mapUsersFromApi(response.data || response.users || response);
        paginationData = {
          page,
          pageSize,
          total: mappedUsers.length,
          totalPages: Math.ceil(mappedUsers.length / pageSize),
        };
      }

      setUsers(mappedUsers);
      setPaginationMeta(paginationData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.status, filters.role, page, pageSize]);


  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  const setSearch = useCallback((search) => {
    updateParams({ search, page: 1 });
  }, [updateParams]);


  const setStatus = useCallback((status) => {
    updateParams({ status, page: 1 });
  }, [updateParams]);


  const setRole = useCallback((role) => {
    updateParams({ role, page: 1 });
  }, [updateParams]);


  const setPage = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);


  const setPageSize = useCallback((pageSize) => {
    updateParams({ pageSize, page: 1 });
  }, [updateParams]);


  const openAction = useCallback((type, user) => {
    setCurrentAction({ type, user });
  }, []);


  const closeAction = useCallback(() => {
    setCurrentAction(null);
  }, []);


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
