export const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
} as const;
export type UserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_PERMISSIONS = {
  READ: 'ro',
  RW: 'rw',
  RWD: 'rwd',
} as const;
export type UserPermissions =
  (typeof USER_PERMISSIONS)[keyof typeof USER_PERMISSIONS];
