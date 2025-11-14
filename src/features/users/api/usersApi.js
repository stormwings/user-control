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
  const response = await httpRequest.get('/admin/users', { params });
  return response.data;
}

/**
 * Fetch single user by ID
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function fetchUserById(userId) {
  const response = await httpRequest.get(`/admin/users/${userId}`);
  return response.data;
}

/**
 * Create new user
 * @param {CreateUserPayload} payload - User data
 * @returns {Promise<User>}
 */
export async function createUser(payload) {
  const response = await httpRequest.post('/admin/users', payload);
  return response.data;
}

/**
 * Update existing user
 * @param {string} userId - User ID
 * @param {UpdateUserPayload} payload - Updated user data
 * @returns {Promise<User>}
 */
export async function updateUser(userId, payload) {
  const response = await httpRequest.put(`/admin/users/${userId}`, payload);
  return response.data;
}

/**
 * Change user role
 * @param {string} userId - User ID
 * @param {UserRole} role - New role
 * @returns {Promise<User>}
 */
export async function changeUserRole(userId, role) {
  const response = await httpRequest.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
}

/**
 * Block user account
 * @param {string} userId - User ID
 * @param {string} reason - Block reason
 * @returns {Promise<User>}
 */
export async function blockUser(userId, reason) {
  const response = await httpRequest.post(`/admin/users/${userId}/block`, { reason });
  return response.data;
}

/**
 * Unblock user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function unblockUser(userId) {
  const response = await httpRequest.post(`/admin/users/${userId}/unblock`);
  return response.data;
}

/**
 * Deactivate user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function deactivateUser(userId) {
  const response = await httpRequest.post(`/admin/users/${userId}/deactivate`);
  return response.data;
}

/**
 * Activate user account
 * @param {string} userId - User ID
 * @returns {Promise<User>}
 */
export async function activateUser(userId) {
  const response = await httpRequest.post(`/admin/users/${userId}/activate`);
  return response.data;
}

/**
 * Reset user password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean}>}
 */
export async function resetUserPassword(userId, newPassword) {
  const response = await httpRequest.post(`/admin/users/${userId}/reset-password`, {
    password: newPassword,
  });
  return response.data;
}

/**
 * Delete user (soft delete)
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteUser(userId) {
  const response = await httpRequest.delete(`/admin/users/${userId}`);
  return response.data;
}

/**
 * Fetch user audit log
 * @param {string} userId - User ID
 * @param {number} limit - Number of events to fetch
 * @returns {Promise<Array>}
 */
export async function fetchUserAuditLog(userId, limit = 10) {
  const response = await httpRequest.get(`/admin/users/${userId}/audit`, {
    params: { limit },
  });
  return response.data;
}
