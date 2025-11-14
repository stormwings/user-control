import { UserStatus, UserRole } from '../types/userTypes';

export function mapUserFromApi(apiUser) {
  if (!apiUser) return null;

  return {
    ...apiUser,
    status: determineUserStatus(apiUser),
    role: apiUser.isAdmin ? UserRole.ADMIN : (apiUser.role || UserRole.SELLER),
  };
}

export function mapUsersFromApi(apiUsers) {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(mapUserFromApi);
}

export function determineUserStatus(user) {
  if (user.status) return user.status;
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
    phone: formValues.phone?.trim() || '',
    role: formValues.role || UserRole.SELLER,
    branch: formValues.branch?.trim() || '',
  };
}

export function mapUpdateUserPayload(formValues) {
  return {
    name: formValues.name.trim(),
    email: formValues.email.trim().toLowerCase(),
    phone: formValues.phone?.trim() || '',
    role: formValues.role || UserRole.SELLER,
    branch: formValues.branch?.trim() || '',
  };
}

export function mapUserToFormValues(user) {
  if (!user) return {};

  return {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || UserRole.SELLER,
    branch: user.branch || '',
  };
}
