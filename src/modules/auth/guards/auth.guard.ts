import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Optional,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest, AuthUserPayload } from '../types/auth.types';
import { normalizeError } from '../../../common/utils/error.util';
import { UsersService } from '../../users/users.service';

/**
 * Guard de autenticación JWT.
 *
 * Flujo resumido:
 * 1) Lee Authorization header y extrae Bearer token.
 * 2) Verifica firma y vigencia del JWT.
 * 3) Comprueba blacklist para detectar tokens revocados.
 * 4) Inyecta payload tipado en `request.user` para consumo del controlador.
 *
 * Con esto evitamos `any` en la capa HTTP y centralizamos la lógica de acceso.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Optional() private readonly jwtService: JwtService,
    // Servicio de auth para consultar si el token fue revocado
    @Optional() private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    @Optional()
    private readonly usersService: UsersService,
  ) {}

  /**
   * Punto de entrada del guard por cada request protegida.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Recupera request HTTP ya tipada con `AuthenticatedRequest`.
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Intenta extraer el Bearer token del header Authorization.
    const token = this.extractTokenFromHeader(request);

    // Sin token no hay identidad => acceso denegado.
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verifica firma + expiración del token y define el contrato esperado.
      const payload: AuthUserPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_ACCESS_SECRET as string,
        },
      );

      // Si el token fue revocado en logout, se bloquea aunque sea válido criptográficamente.
      const isRevoked = await this.authService.isAccessTokenBlacklisted(token);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      // Se comparte identidad autenticada para controladores y servicios.
      request.user = payload;

      // Mantiene trazabilidad: cada request autenticada refresca última IP y última vez visto.
      const userId = Number(payload.sub);
      const clientIp = this.extractClientIp(request);
      if (!Number.isNaN(userId)) {
        try {
          const actionOrEndpoint = `${request.method} ${request.originalUrl}`;
          await this.usersService?.updateLastIp(
            userId,
            clientIp,
            actionOrEndpoint,
          );
        } catch {
          // No bloqueamos la request por un fallo de telemetría de sesión.
        }
      }
    } catch (error) {
      // Homogeneiza el error para no acceder propiedades sobre `unknown`.
      const { message } = normalizeError(error);
      throw new UnauthorizedException(message);
    }

    // Llegar aquí implica autenticación correcta.
    return true;
  }

  /**
   * Extrae el token en formato: `Authorization: Bearer <token>`.
   */
  private extractTokenFromHeader(request: AuthenticatedRequest) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Se acepta solo el esquema Bearer para evitar tokens ambiguos.
    return type === 'Bearer' ? token : undefined;
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
