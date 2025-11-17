import { UserStatus, UserRole, UserStatusLabels, UserRoleLabels } from './user';

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

export function getStatusLabel(status) {
  return UserStatusLabels[status] || status;
}

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

export function getRoleLabel(role) {
  return UserRoleLabels[role] || role;
}

export function isUserActive(user) {
  return user?.status === UserStatus.ACTIVE;
}

export function isUserBlocked(user) {
  return user?.status === UserStatus.BLOCKED || user?.blocked === true;
}

export function isUserInactive(user) {
  return (
    user?.status === UserStatus.INACTIVE ||
    user?.disabled === true ||
    user?.isDisabled === true ||
    user?.active === false
  );
}

export function isUserAdmin(user) {
  return user?.role === UserRole.ADMIN || user?.isAdmin === true;
}

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
