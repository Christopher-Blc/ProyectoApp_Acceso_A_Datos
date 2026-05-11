import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ReservationModule } from './modules/reservation/reservation.module';
import { ReviewModule } from './modules/review/review.module';
import { MembershipModule } from './modules/membership/membership.module';
import { InstallationModule } from './modules/installation/installation.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CourtModule } from './modules/court/court.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourtTypeModule } from './modules/court_type/court_type.module';
// Comentario de prueba para verificar subida a GitHub y despliegue en VPS
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * JwtModule.register()
     *
     * Configuración global del JWT para toda la aplicación.
     * El secret se lee de las variables de entorno (JWT_ACCESS_SECRET).
     * La duración por defecto es configurable vía JWT_EXPIRES_IN.
     *
     * Por qué es necesario:
     * - NestJS necesita saber con qué secret firmar/verificar tokens
     * - Sin esta configuración, JwtService no funcionará en ningún módulo
     * - register() lo hace global para toda la app
     *
     * Alternativas:
     * - registerAsync(): Si necesitas inyectar ConfigService (más flexible pero más código)
     * - register(): Configuración estática en tiempo de inicialización (más simple)
     */
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as unknown as number,
      },
      global: true,
    }),

    /**
     * ThrottlerModule.forRoot()
     *
     * Configura límite de peticiones (protección contra abuso de la API)
     */
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 100, //
        limit: 20, //
      },
      {
        name: 'auth',
        ttl: 180000, // 60 minutes = 3600000 pero dejo media hora por tests
        limit: 1000000000000,
      },
    ]),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'database',
      port: parseInt(process.env.DB_PORT!) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'my-secret',
      database: process.env.DB_DATABASE || 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ReservationModule,
    ReviewModule,
    MembershipModule,
    InstallationModule,
    PaymentModule,
    NotificationModule,
    CourtModule,
    AuthModule,
    CourtTypeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
