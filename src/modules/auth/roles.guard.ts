import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from 'src/users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  // El metodo canActivate se llama para determinar si la solicitud actual
  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const controller = context.getClass();
    const roles =
      Reflect.getMetadata(ROLES_KEY, handler) ??
      Reflect.getMetadata(ROLES_KEY, controller);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole: UserRole | undefined = request.user?.role;
    return !!userRole && roles.includes(userRole);
  }
}
