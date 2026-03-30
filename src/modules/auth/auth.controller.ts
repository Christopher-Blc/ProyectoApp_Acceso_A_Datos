import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from "./dto/refresh.dto";
import { AuthGuard } from './auth.guard';


@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Validación fallida o usuario ya existe.' })
  register(@Body() dto: RegisterDto) {
    // el rol no se decide desde el cliente
    // si alguien intenta colarlo, lo ideal es bloquearlo con ValidationPipe whitelist + forbidNonWhitelisted
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso. Retorna token y datos del usuario',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: { type: 'object' },
      },
    },
  })

  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado correctamente',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Refresh token faltante o inválido' })
  @ApiResponse({ status: 401, description: 'Refresh token expirado o no autorizado' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    // esto depende de cómo tu guard mete el user en req
    // normalmente req.user.sub
    const userId = Number(req.user?.sub);
    // Extraemos el access token del header Authorization
    const authHeader: string | undefined = req.headers?.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    // Calculamos fecha de expiración usando el claim exp del JWT
    const exp = req.user?.exp;
    const expiresAt = typeof exp === 'number' ? new Date(exp * 1000) : new Date();

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    return this.authService.logout(userId, accessToken, expiresAt);
  }

}
