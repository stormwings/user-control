import { useState, useEffect, useCallback } from 'react';
// TODO: Enable fetchUserAuditLog when audit endpoint is available in backend
import { fetchUserById /* , fetchUserAuditLog */ } from '../utils/users';
import { mapUserFromApi } from '../utils/userMappers';
import { toast } from 'react-toastify';

export function useUserDetail(userId) {
  const [user, setUser] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [error, setError] = useState(null);


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


  // TODO: Enable when audit endpoint is available in backend
  const loadAuditLog = useCallback(async (/* limit = 10 */) => {
    // if (!userId) return;
    // setIsLoadingAudit(true);
    // try {
    //   const response = await fetchUserAuditLog(userId, limit);
    //   setAuditLog(response.data || response || []);
    // } catch (err) {
    //   console.error('Error fetching audit log:', err);
    // } finally {
    //   setIsLoadingAudit(false);
    // }
  }, [/* userId */]);


  useEffect(() => {
    loadUser();
    loadAuditLog();
  }, [loadUser, loadAuditLog]);


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
