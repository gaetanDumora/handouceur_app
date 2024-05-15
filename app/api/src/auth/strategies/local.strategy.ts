import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JWTPayload } from '../auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'candidatePassword' });
  }

  async validate(
    identifier: string,
    candidatePassword: string,
  ): Promise<JWTPayload> {
    const { user, success, reason } = await this.authService.validateUser(
      identifier,
      candidatePassword,
    );
    if (!success || !user) {
      return { success, reason };
    }
    // assign it to the Request object as req.user
    const [{ roles, permissions }] = user.userRolesPermissions;
    return {
      success,
      sub: user.userId,
      username: user.username,
      acl: { role: roles.roleName, grant: permissions.permissionName },
    };
  }
}
