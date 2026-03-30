import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./modules/users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ReservaModule } from './modules/reserva/reserva.module';
import { ComentarioModule } from './modules/comentario/comentario.module';
import { MembresiaModule } from './modules/membresia/membresia.module';
import { InstalacionModule } from './modules/instalacion/instalacion.module';
import { HorarioPistaModule } from './modules/horario_pista/horario_pista.module';
import { PagoModule } from './modules/pago/pago.module';
import { NotiModule } from './modules/noti/noti.module';
import { PistaModule } from './modules/pista/pista.module';
import { AuthModule } from './modules/auth/auth.module';



@Module({
  
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    ComentarioModule,
    MembresiaModule,
    InstalacionModule,
    HorarioPistaModule,
    PagoModule,
    NotiModule,
    PistaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
