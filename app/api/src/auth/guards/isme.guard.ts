import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { JWTPayload } from '../auth.interface';
import { USER_ROLES } from 'src/users/users.interface';

@Injectable()
export class IsMeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const routeParams: { id?: string } = request.params;
    if (!routeParams?.id) {
      return false;
    }
    const paramValue = parseInt(routeParams.id, 10);

    const { user }: { user: JWTPayload } = context.switchToHttp().getRequest();
    if (user.acl.role === USER_ROLES.OWNER) {
      return true;
    }

    return user.sub === paramValue;
  }
}
