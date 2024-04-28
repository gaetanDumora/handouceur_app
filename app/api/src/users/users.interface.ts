export interface User extends UserRolesPermissions {
  userId?: number;
  username: string;
  emailAddress: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UserRolesPermissions {
  userRolesPermissions: {
    roles: { roleName: UserRoles };
    permissions: { permissionName: UserPermissions };
  }[];
}

export interface createUserInput
  extends Omit<User, 'userRolesPermissions' | 'createdAt' | 'updatedAt'> {
  password: string;
}

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
