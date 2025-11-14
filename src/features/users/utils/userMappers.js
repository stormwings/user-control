import { UserStatus, UserRole } from '../types/userTypes';

/**
 * Map user from API response to frontend format
 * @param {Object} apiUser - User from API
 * @returns {User}
 */
export function mapUserFromApi(apiUser) {
  if (!apiUser) return null;

  return {
    ...apiUser,
    // Normalize status
    status: determineUserStatus(apiUser),
    // Ensure role is normalized
    role: apiUser.isAdmin ? UserRole.ADMIN : (apiUser.role || UserRole.SELLER),
  };
}

/**
 * Map users array from API
 * @param {Array} apiUsers - Users from API
 * @returns {Array<User>}
 */
export function mapUsersFromApi(apiUsers) {
  if (!Array.isArray(apiUsers)) return [];
  return apiUsers.map(mapUserFromApi);
}

/**
 * Determine user status from various flags
 * @param {Object} user - User object
 * @returns {UserStatus}
 */
export function determineUserStatus(user) {
  if (user.status) return user.status;
  if (user.blocked) return UserStatus.BLOCKED;
  if (user.disabled || user.isDisabled || user.active === false) {
    return UserStatus.INACTIVE;
  }
  return UserStatus.ACTIVE;
}

/**
 * Map create user form values to API payload
 * @param {Object} formValues - Form values
 * @returns {CreateUserPayload}
 */
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

/**
 * Map update user form values to API payload
 * @param {Object} formValues - Form values
 * @returns {UpdateUserPayload}
 */
export function mapUpdateUserPayload(formValues) {
  return {
    name: formValues.name.trim(),
    email: formValues.email.trim().toLowerCase(),
    phone: formValues.phone?.trim() || '',
    role: formValues.role || UserRole.SELLER,
    branch: formValues.branch?.trim() || '',
  };
}

/**
 * Map user to form initial values
 * @param {User} user - User object
 * @returns {Object}
 */
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
