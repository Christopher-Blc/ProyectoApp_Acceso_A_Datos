import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UsersModule } from "./modules/users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ReservaModule } from './modules/reserva/reserva.module';
import { ResenyaModule } from './modules/resenya/resenya.module';
import { MembresiaModule } from './modules/membresia/membresia.module';
import { InstalacionModule } from './modules/instalacion/instalacion.module';
import { PagoModule } from './modules/pago/pago.module';
import { NotiModule } from './modules/noti/noti.module';
import { PistaModule } from './modules/pista/pista.module';
import { AuthModule } from './modules/auth/auth.module';
import { TipoPistaModule } from './modules/tipo_pista/tipo_pista.module';



@Module({
  
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * ThrottlerModule.forRoot()
     *
     * Configura rate limiting (protección contra abuso de API)
     */
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 100,
        limit: 10000000,
      },
      {
        name: 'auth',
        ttl: 3600000,//  60 minutos
        limit: 1000,
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
    ReservaModule,
    ResenyaModule,
    MembresiaModule,
    InstalacionModule,
    PagoModule,
    NotiModule,
    PistaModule,
    AuthModule,
    TipoPistaModule,
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

