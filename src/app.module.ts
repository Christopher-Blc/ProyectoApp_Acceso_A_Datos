import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
     * ThrottlerModule.forRoot()
     *
     * Configura límite de peticiones (protección contra abuso de la API)
     */
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 100,//
        limit: 1000000000000,//
      },
      {
        name: 'auth',
        ttl: 3600000, // 60 minutes
        limit: 100,
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

