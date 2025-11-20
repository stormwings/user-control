import { UserStatus, UserRole } from './user';

export function mapUserFromApi(apiUser) {
  if (!apiUser) return null;

  return {
    ...apiUser,
    status: mapStatusFromBackend(apiUser.status),
    role: mapRoleFromBackend(apiUser.role, apiUser.isAdmin),
  };
}

export function mapUsersFromApi(apiUsers) {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(mapUserFromApi);
}

export function mapStatusFromBackend(backendStatus) {
  if (!backendStatus) return UserStatus.ACTIVE;

  const statusMap = {
    'active': UserStatus.ACTIVE,
    'inactive': UserStatus.INACTIVE,
    'blocked': UserStatus.BLOCKED,
    'pending': UserStatus.PENDING,
  };

  return statusMap[backendStatus.toLowerCase()] || UserStatus.ACTIVE;
}

export function mapRoleFromBackend(backendRole, isAdmin) {
  if (isAdmin) return UserRole.ADMIN;

  if (!backendRole) return UserRole.USER;

  const roleMap = {
    'admin': UserRole.ADMIN,
    'seller': UserRole.SELLER,
    'user': UserRole.USER,
    'viewer': UserRole.VIEWER,
  };

  return roleMap[backendRole.toLowerCase()] || UserRole.USER;
}

export function determineUserStatus(user) {
  if (user.status) return mapStatusFromBackend(user.status);
  if (user.blocked) return UserStatus.BLOCKED;
  if (user.disabled || user.isDisabled || user.active === false) {
    return UserStatus.INACTIVE;
  }
  return UserStatus.ACTIVE;
}

export function mapCreateUserPayload(formValues) {
  return {
    name: formValues.name.trim(),
    email: formValues.email.trim().toLowerCase(),
    password: formValues.password,
  };
}
