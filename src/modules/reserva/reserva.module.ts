import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Pista } from '../pista/entities/pista.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Pista]), UsersModule],
  providers: [ReservaService],
  controllers: [ReservaController],
  exports: [TypeOrmModule],
})
export class ReservaModule {}
