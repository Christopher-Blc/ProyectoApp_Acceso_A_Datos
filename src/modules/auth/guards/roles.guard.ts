import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  // El metodo canActivate se llama para determinar si la solicitud actual
  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const controller = context.getClass();
    const roles =
      (Reflect.getMetadata(ROLES_KEY, handler) as UserRole[] | undefined) ??
      (Reflect.getMetadata(ROLES_KEY, controller) as UserRole[] | undefined);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { role?: UserRole };
    }>();
    const userRole = request.user?.role;

    return !!userRole && roles.includes(userRole);
  }
}
