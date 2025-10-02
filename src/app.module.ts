import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ReservaModule } from './reserva/reserva.module';
import { ComentarioModule } from './comentario/comentario.module';
import { MembresiaModule } from './membresia/membresia.module';
import { InstalacionModule } from './instalacion/instalacion.module';
import { HorarioPistaModule } from './horario_pista/horario_pista.module';
import { PagoModule } from './pago/pago.module';
import { NotiModule } from './noti/noti.module';
import { PistaModule } from './pista/pista.module';

@Module({
  imports: [UsersModule, ReservaModule, ComentarioModule, MembresiaModule, InstalacionModule, HorarioPistaModule, PagoModule, NotiModule, PistaModule],
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
      password: "root",
      database: "test",
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
  ],
})
export class AppModule {}