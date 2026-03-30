import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "./auth.service";

//esta clase implementa la logica para proteger rutas usando JWT , asegurando que solo los usuarios autenticados puedan acceder a ellas
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    // Servicio de auth para consultar si el token fue revocado
    private readonly authService: AuthService
  ) {}

  // Valida si una solicitud esta autorizada basada en un token JWT
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extrae la solicitud HTTP del contexto de ejecucion
    const request = context.switchToHttp().getRequest();
    
    // Extrae el token JWT del encabezado Authorization
    const token = this.extractTokenFromHeader(request);

    // Lanza un error si no se proporciona ningun token
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET as string,
      });

      const isRevoked = await this.authService.isAccessTokenBlacklisted(token);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      request.user = payload;
    } catch (error) {
      // Lanza un error si la verificacion del token falla
      throw new UnauthorizedException(error?.message);
    }

    // Devuelve true para permitir que la solicitud continue
    return true;
  }

  // Extrae el token Bearer del encabezado Authorization
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    // Devuelve el token solo si el tipo es "Bearer"
    return type === "Bearer" ? token : undefined;
  }
}
