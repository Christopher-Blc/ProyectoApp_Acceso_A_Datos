import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './guards/auth.guard';
import { Throttle } from '../../common/decorators/throttle.decorator';
import type { AuthenticatedRequest } from './types/auth.types';

/**
 * HTTP authentication controller.
 *
 * This file consumes the types from the auth module to avoid `any` in `req`.
 * The chain is:
 * AuthService (signs token) -> AuthGuard (verifies and sets req.user)
 * -> AuthController (reads req.user with strong typing).
 */
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. Email verification is required before login.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or user already exists.',
  })
  register(@Body() dto: RegisterDto) {
    // El rol no se decide por el cliente
    // Si alguien intenta enviarlo, lo ideal es bloquearlo con ValidationPipe whitelist + forbidNonWhitelisted
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email with confirmation token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @Throttle('auth')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiResponse({
    status: 200,
    description: 'Verification email resend requested successfully.',
  })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @Post('login')
  @Throttle('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Successful login. Returns token and user data',
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
  @ApiResponse({ status: 401, description: 'Incorrect credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Throttle('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renewed successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Refresh token missing or invalid',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token expired or unauthorized',
  })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthenticatedRequest) {
    // `sub` viene del payload JWT y representa el id del usuario autenticado.
    const userId = Number(req.user?.sub);

    // Leemos el token en bruto del header para revocarlo en blacklist.
    const authHeader: string | undefined = req.headers?.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    // `exp` es un claim estándar de JWT en segundos UNIX.
    // Se convierte a Date para guardar una expiración real en blacklist.
    const exp = req.user?.exp;
    const expiresAt =
      typeof exp === 'number' ? new Date(exp * 1000) : new Date();

    // Si no hay token, no se puede ejecutar un logout fuerte de forma segura.
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    // Delega en servicio: revoca access y limpia refresh hash.
    return this.authService.logout(userId, accessToken, expiresAt);
  }
}
