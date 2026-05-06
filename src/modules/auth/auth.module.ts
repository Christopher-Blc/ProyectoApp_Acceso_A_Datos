import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenBlacklist } from './blacklist/auth_token_blacklist.entity';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule,
    ConfigModule,
    TypeOrmModule.forFeature([AuthTokenBlacklist]),
  ],
  exports: [AuthService, AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
