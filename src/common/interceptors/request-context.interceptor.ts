import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';
import type { AuthenticatedRequest } from '../../modules/auth/types/auth.types';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestContextInterceptor.name);

  constructor(private readonly usersService: UsersService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return next.handle().pipe(
      tap(() => {
        const userIdRaw = request.user?.sub;
        const userId = Number(userIdRaw);

        if (!userIdRaw || Number.isNaN(userId)) {
          return;
        }

        const actionOrEndpoint = `${request.method} ${request.originalUrl || request.url}`;
        const clientIp = this.extractClientIp(request);

        // No bloqueamos la respuesta por telemetria de sesion.
        void this.usersService
          .updateLastIp(userId, clientIp, actionOrEndpoint)
          .catch(() => {
            this.logger.warn(
              `No se pudo actualizar last_ip/last_time_seen para user_id=${userId}`,
            );
          });
      }),
    );
  }

  private extractClientIp(request: AuthenticatedRequest): string | null {
    const forwardedFor = request.headers['x-forwarded-for'];
    const xForwardedFor = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;

    const candidate =
      (xForwardedFor?.split(',')[0]?.trim() || request.ip || '').replace(
        /^::ffff:/,
        '',
      );

    return candidate || null;
  }
}
