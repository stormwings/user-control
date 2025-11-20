export const UserRole = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  USER: 'USER',
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
  [UserRole.USER]: 'Usuario',
  [UserRole.VIEWER]: 'Visualizador',
};

export const UserStatusLabels = {
  [UserStatus.ACTIVE]: 'Activo',
  [UserStatus.INACTIVE]: 'Inactivo',
  [UserStatus.BLOCKED]: 'Bloqueado',
  [UserStatus.PENDING]: 'Pendiente',
};
