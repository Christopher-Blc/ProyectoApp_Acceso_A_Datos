import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from "./dto/refresh.dto";
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token JWT' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso. Retorna el token de acceso.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: { type: 'object' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Retorna el token de acceso y el usuario.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }



}
