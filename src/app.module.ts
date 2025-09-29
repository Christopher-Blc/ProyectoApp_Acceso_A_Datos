
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
<<<<<<< HEAD
<<<<<<< HEAD
import { ReservaModule } from './reserva/reserva.module';
import { ComentarioModule } from './comentario/comentario.module';

@Module({
  imports: [UsersModule, ReservaModule, ComentarioModule],
=======
import { MembresiaModule } from './membresia/membresia.module';
import { InstalacionModule } from './instalacion/instalacion.module';
import { HorarioPistaModule } from './horario_pista/horario_pista.module';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [UsersModule, MembresiaModule, InstalacionModule, HorarioPistaModule, PagoModule],
>>>>>>> c802de90cef5ce0829633f3d82e53cd129f3b8f6
=======
import { NotiModule } from './noti/noti.module';
import { PistaModule } from './pista/pista.module';

@Module({
  imports: [UsersModule, NotiModule, PistaModule],
>>>>>>> 1ff809d (Añadiendo: Notificacion - Pista)
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "password",
      database: "test",
      entities: [""],
      //synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}