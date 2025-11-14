import httpRequest from '../../../utils/request';
import { toast } from 'react-toastify';

export async function fetchUsers(params = {}) {
  try {
    const response = await httpRequest.get('auth/users', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    toast.error(error.response?.data?.message || 'Error al cargar usuarios');
    throw error;
  }
}

export async function fetchUserById(userId) {
  try {
    const response = await httpRequest.get(`auth/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user by ID error:', error);
    toast.error(error.response?.data?.message || 'Error al cargar usuario');
    throw error;
  }
}

export async function createUser(payload) {
  try {
    const response = await httpRequest.post('auth/users', payload);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error);
    toast.error(error.response?.data?.message || 'Error al crear usuario');
    throw error;
  }
}

export async function updateUser(userId, payload) {
  try {
    const response = await httpRequest.put(`auth/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    toast.error(error.response?.data?.message || 'Error al actualizar usuario');
    throw error;
  }
}

export async function changeUserRole(userId, role) {
  try {
    const response = await httpRequest.patch(`auth/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Change user role error:', error);
    toast.error(error.response?.data?.message || 'Error al cambiar rol');
    throw error;
  }
}

export async function blockUser(userId, reason) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/block`, { reason });
    return response.data;
  } catch (error) {
    console.error('Block user error:', error);
    toast.error(error.response?.data?.message || 'Error al bloquear usuario');
    throw error;
  }
}

export async function unblockUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/unblock`);
    return response.data;
  } catch (error) {
    console.error('Unblock user error:', error);
    toast.error(error.response?.data?.message || 'Error al desbloquear usuario');
    throw error;
  }
}

export async function deactivateUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Deactivate user error:', error);
    toast.error(error.response?.data?.message || 'Error al desactivar usuario');
    throw error;
  }
}

export async function activateUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error('Activate user error:', error);
    toast.error(error.response?.data?.message || 'Error al activar usuario');
    throw error;
  }
}

export async function resetUserPassword(userId, newPassword) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/reset-password`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Reset user password error:', error);
    toast.error(error.response?.data?.message || 'Error al restablecer contraseña');
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await httpRequest.delete(`auth/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    throw error;
  }
}

export async function fetchUserAuditLog(userId, limit = 10) {
  try {
    const response = await httpRequest.get(`auth/users/${userId}/audit`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch user audit log error:', error);
    toast.error(error.response?.data?.message || 'Error al cargar registro de auditoría');
    throw error;
  }
}
