/**
 * User Types and Constants
 */

export const UserRole = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  VIEWER: 'VIEWER',
};

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
};

export const UserRoleLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.SELLER]: 'Vendedor',
  [UserRole.VIEWER]: 'Visualizador',
};

export const UserStatusLabels = {
  [UserStatus.ACTIVE]: 'Activo',
  [UserStatus.INACTIVE]: 'Inactivo',
  [UserStatus.BLOCKED]: 'Bloqueado',
  [UserStatus.PENDING]: 'Pendiente',
};

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {UserRole} role
 * @property {UserStatus} status
 * @property {boolean} isAdmin
 * @property {boolean} active
 * @property {boolean} disabled
 * @property {boolean} blocked
 * @property {string} branch
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastLoginAt
 * @property {string} createdBy
 */

/**
 * @typedef {Object} CreateUserPayload
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} phone
 * @property {UserRole} role
 * @property {string} branch
 */

/**
 * @typedef {Object} UpdateUserPayload
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {UserRole} role
 * @property {string} branch
 */

/**
 * @typedef {Object} UsersListFilters
 * @property {string} search
 * @property {UserStatus} status
 * @property {UserRole} role
 * @property {number} page
 * @property {number} pageSize
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page
 * @property {number} pageSize
 * @property {number} total
 * @property {number} totalPages
 */
