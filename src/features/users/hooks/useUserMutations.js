import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  changeUserRole as apiChangeUserRole,
  blockUser as apiBlockUser,
  unblockUser as apiUnblockUser,
  deactivateUser as apiDeactivateUser,
  activateUser as apiActivateUser,
  resetUserPassword as apiResetUserPassword,
  deleteUser as apiDeleteUser,
} from '../api/usersApi';
import {
  mapCreateUserPayload,
  mapUpdateUserPayload,
  mapUserFromApi,
} from '../utils/userMappers';

export function useUserMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const createUser = useCallback(async (formValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = mapCreateUserPayload(formValues);
      const response = await apiCreateUser(payload);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario creado exitosamente');
      return user;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al crear usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const updateUser = useCallback(async (userId, formValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = mapUpdateUserPayload(formValues);
      const response = await apiUpdateUser(userId, payload);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario actualizado exitosamente');
      return user;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const changeRole = useCallback(async (userId, role) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiChangeUserRole(userId, role);
      const user = mapUserFromApi(response.data || response);

      toast.success('Rol actualizado exitosamente');
      return user;
    } catch (err) {
      console.error('Error changing role:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al cambiar rol');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const blockUser = useCallback(async (userId, reason = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiBlockUser(userId, reason);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario bloqueado exitosamente');
      return user;
    } catch (err) {
      console.error('Error blocking user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al bloquear usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const unblockUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiUnblockUser(userId);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario desbloqueado exitosamente');
      return user;
    } catch (err) {
      console.error('Error unblocking user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al desbloquear usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const deactivateUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiDeactivateUser(userId);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario desactivado exitosamente');
      return user;
    } catch (err) {
      console.error('Error deactivating user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al desactivar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const activateUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiActivateUser(userId);
      const user = mapUserFromApi(response.data || response);

      toast.success('Usuario activado exitosamente');
      return user;
    } catch (err) {
      console.error('Error activating user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al activar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const resetPassword = useCallback(async (userId, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiResetUserPassword(userId, newPassword);
      toast.success('Contraseña restablecida exitosamente');
      return true;
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al restablecer contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  const deleteUser = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiDeleteUser(userId);
      toast.success('Usuario eliminado exitosamente');
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err);
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createUser,
    updateUser,
    changeRole,
    blockUser,
    unblockUser,
    deactivateUser,
    activateUser,
    resetPassword,
    deleteUser,
  };
}

export default useUserMutations;
