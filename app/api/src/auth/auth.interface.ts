import { UserPermissions, UserRoles } from 'src/users/users.interface';

export interface JWTPayload {
  sub: number;
  username: string;
  acl: { role: UserRoles; grant: UserPermissions };
}

export interface JWTPayloadDecoded extends JWTPayload {
  exp: number;
  iat: number;
}
