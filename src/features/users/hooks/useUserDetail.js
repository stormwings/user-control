import { useState, useEffect, useCallback } from 'react';
import { fetchUserById, fetchUserAuditLog } from '../api/usersApi';
import { mapUserFromApi } from '../utils/userMappers';
import { toast } from 'react-toastify';

/**
 * Hook for fetching and managing single user details
 * @param {string} userId - User ID
 */
export function useUserDetail(userId) {
  const [user, setUser] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user data
   */
  const loadUser = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchUserById(userId);
      const mappedUser = mapUserFromApi(response.data || response);
      setUser(mappedUser);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al cargar usuario');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Fetch user audit log
   */
  const loadAuditLog = useCallback(async (limit = 10) => {
    if (!userId) return;

    setIsLoadingAudit(true);

    try {
      const response = await fetchUserAuditLog(userId, limit);
      setAuditLog(response.data || response || []);
    } catch (err) {
      console.error('Error fetching audit log:', err);
      // Don't show error toast for audit log, it's not critical
    } finally {
      setIsLoadingAudit(false);
    }
  }, [userId]);

  /**
   * Load user on mount or userId change
   */
  useEffect(() => {
    loadUser();
    loadAuditLog();
  }, [loadUser, loadAuditLog]);

  /**
   * Refresh user data
   */
  const refresh = useCallback(() => {
    loadUser();
    loadAuditLog();
  }, [loadUser, loadAuditLog]);

  return {
    user,
    auditLog,
    isLoading,
    isLoadingAudit,
    error,
    refresh,
  };
}

export default useUserDetail;
