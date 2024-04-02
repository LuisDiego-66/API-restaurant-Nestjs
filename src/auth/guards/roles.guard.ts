import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/roles.decorator';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!roles) return true;
    if (roles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user: User = req.user as User;

    /* for (const rol of user.rol) {
      if (roles.includes(rol.rolName)) {
        return true;
      }
    } */
    throw new ForbiddenException('user need a valid role: ' + roles);
  }
}
