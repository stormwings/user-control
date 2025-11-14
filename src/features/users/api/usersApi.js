import httpRequest from '../../../utils/request';

/**
 * Users API Module
 */

/**
 * Fetch paginated users list with filters
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query
 * @param {string} params.status - Filter by status
 * @param {string} params.role - Filter by role
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function fetchUsers(params = {}) {
  try {
    const response = await httpRequest.get('auth/users', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
}

/**
 * Fetch single user by ID
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function fetchUserById(userId) {
  try {
    const response = await httpRequest.get(`auth/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user by ID error:', error);
    throw error;
  }
}

/**
 * Create new user
 * @param {CreateUserPayload} payload - User data
 * @returns {Promise<User>}
 */
export async function createUser(payload) {
  try {
    const response = await httpRequest.post('auth/users', payload);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

/**
 * Update existing user
 * @param {string} userId - User ID
 * @param {UpdateUserPayload} payload - Updated user data
 * @returns {Promise<User>}
 */
export async function updateUser(userId, payload) {
  try {
    const response = await httpRequest.put(`auth/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

/**
 * Change user role
 * @param {string} userId - User ID
 * @param {UserRole} role - New role
 * @returns {Promise<User>}
 */
export async function changeUserRole(userId, role) {
  try {
    const response = await httpRequest.patch(`auth/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Change user role error:', error);
    throw error;
  }
}

/**
 * Block user account
 * @param {string} userId - User ID
 * @param {string} reason - Block reason
 * @returns {Promise<User>}
 */
export async function blockUser(userId, reason) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/block`, { reason });
    return response.data;
  } catch (error) {
    console.error('Block user error:', error);
    throw error;
  }
}

/**
 * Unblock user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function unblockUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/unblock`);
    return response.data;
  } catch (error) {
    console.error('Unblock user error:', error);
    throw error;
  }
}

/**
 * Deactivate user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function deactivateUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error('Deactivate user error:', error);
    throw error;
  }
}

/**
 * Activate user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function activateUser(userId) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error('Activate user error:', error);
    throw error;
  }
}

/**
 * Reset user password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean}>}
 */
export async function resetUserPassword(userId, newPassword) {
  try {
    const response = await httpRequest.post(`auth/users/${userId}/reset-password`, {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Reset user password error:', error);
    throw error;
  }
}

/**
 * Delete user (soft delete)
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteUser(userId) {
  try {
    const response = await httpRequest.delete(`auth/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

/**
 * Fetch user audit log
 * @param {string} userId - User ID
 * @param {number} limit - Number of events to fetch
 * @returns {Promise<Array>}
 */
export async function fetchUserAuditLog(userId, limit = 10) {
  try {
    const response = await httpRequest.get(`auth/users/${userId}/audit`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch user audit log error:', error);
    throw error;
  }
}
