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
