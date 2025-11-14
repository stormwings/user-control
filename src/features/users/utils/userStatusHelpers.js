import { UserStatus, UserRole, UserStatusLabels, UserRoleLabels } from '../types/userTypes';

/**
 * Get status badge color tone
 * @param {UserStatus} status - User status
 * @returns {string} - Chip tone
 */
export function getStatusTone(status) {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'green';
    case UserStatus.INACTIVE:
      return 'gray';
    case UserStatus.BLOCKED:
      return 'red';
    case UserStatus.PENDING:
      return 'amber';
    default:
      return 'gray';
  }
}

/**
 * Get status label
 * @param {UserStatus} status - User status
 * @returns {string}
 */
export function getStatusLabel(status) {
  return UserStatusLabels[status] || status;
}

/**
 * Get role badge color tone
 * @param {UserRole} role - User role
 * @returns {string} - Chip tone
 */
export function getRoleTone(role) {
  switch (role) {
    case UserRole.ADMIN:
      return 'blue';
    case UserRole.SELLER:
      return 'amber';
    case UserRole.VIEWER:
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Get role label
 * @param {UserRole} role - User role
 * @returns {string}
 */
export function getRoleLabel(role) {
  return UserRoleLabels[role] || role;
}

/**
 * Check if user is active
 * @param {User} user - User object
 * @returns {boolean}
 */
export function isUserActive(user) {
  return user?.status === UserStatus.ACTIVE;
}

/**
 * Check if user is blocked
 * @param {User} user - User object
 * @returns {boolean}
 */
export function isUserBlocked(user) {
  return user?.status === UserStatus.BLOCKED || user?.blocked === true;
}

/**
 * Check if user is inactive
 * @param {User} user - User object
 * @returns {boolean}
 */
export function isUserInactive(user) {
  return (
    user?.status === UserStatus.INACTIVE ||
    user?.disabled === true ||
    user?.isDisabled === true ||
    user?.active === false
  );
}

/**
 * Check if user is admin
 * @param {User} user - User object
 * @returns {boolean}
 */
export function isUserAdmin(user) {
  return user?.role === UserRole.ADMIN || user?.isAdmin === true;
}

/**
 * Get available actions for a user
 * @param {User} user - User object
 * @returns {Array<string>}
 */
export function getAvailableActions(user) {
  if (!user) return [];

  const actions = ['view', 'edit', 'changeRole'];

  if (isUserActive(user)) {
    actions.push('deactivate', 'block');
  }

  if (isUserInactive(user)) {
    actions.push('activate');
  }

  if (isUserBlocked(user)) {
    actions.push('unblock');
  }

  actions.push('resetPassword');

  return actions;
}
