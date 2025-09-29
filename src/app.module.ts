
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { ReservaModule } from './reserva/reserva.module';
import { ComentarioModule } from './comentario/comentario.module';

@Module({
  imports: [UsersModule, ReservaModule, ComentarioModule],
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