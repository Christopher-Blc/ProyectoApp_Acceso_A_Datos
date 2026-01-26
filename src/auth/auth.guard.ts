import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // Servicio de auth para consultar si el token fue revocado
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verificamos firma y expiración del access token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET as string,
      });

      // Si el token está en blacklist, rechazamos la petición
      const isRevoked = await this.authService.isAccessTokenBlacklisted(token);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      // Adjuntamos el payload al request para su uso posterior
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
