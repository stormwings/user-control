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
    case UserRole.USER:
      return 'green';
    case UserRole.VIEWER:
      return 'gray';
    default:
      return 'gray';
  }
}

export function getRoleLabel(role) {
  return UserRoleLabels[role] || role;
}

export function isUserBlocked(user) {
  const status = user?.status?.toLowerCase();
  return user?.status === UserStatus.BLOCKED || status === 'blocked' || status === 'inactive' || user?.blocked === true;
}

export function isUserAdmin(user) {
  return user?.role === UserRole.ADMIN || user?.isAdmin === true;
}
