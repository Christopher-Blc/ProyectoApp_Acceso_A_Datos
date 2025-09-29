
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
  imports: [UsersModule],
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