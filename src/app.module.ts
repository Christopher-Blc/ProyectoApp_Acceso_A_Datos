
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { MembresiaModule } from './membresia/membresia.module';
import { InstalacionModule } from './instalacion/instalacion.module';
import { HorarioPistaModule } from './horario_pista/horario_pista.module';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [UsersModule, MembresiaModule, InstalacionModule, HorarioPistaModule, PagoModule],
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