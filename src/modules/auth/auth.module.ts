import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenBlacklist } from './blacklist/auth_token_blacklist.entity';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    // Registramos la entidad de blacklist en el módulo de auth
    TypeOrmModule.forFeature([AuthTokenBlacklist]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        // Secret para firmar/verificar access tokens (configurado por ENV)
        secret: process.env.JWT_ACCESS_SECRET as string,
        // Duración por defecto del access token
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
