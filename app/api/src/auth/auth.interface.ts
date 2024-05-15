import { UserDTO } from 'src/users/users.dto';
import { UserPermissions, UserRoles } from 'src/users/users.interface';

export interface AuthResponse {
  success: boolean;
  reason?: { code?: string; description?: string };
  user?: UserDTO;
}

export interface JWTPayload extends AuthResponse {
  sub?: number;
  username?: string;
  acl?: { role: UserRoles; grant: UserPermissions };
}

export interface JWTPayloadDecoded extends JWTPayload {
  exp: number;
  iat: number;
}
