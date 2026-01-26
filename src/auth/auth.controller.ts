import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from "./dto/refresh.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token JWT' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso. Retorna el access_token que debes copiar al botón "Authorize" en Swagger para probar endpoints protegidos.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: { type: 'object' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  @ApiOperation({ summary: 'Refrescar token JWT' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
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
      throw new Error('Access token not found');
    }

    return this.authService.logout(userId, accessToken, expiresAt);
  }

}
