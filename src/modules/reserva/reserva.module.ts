import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservaService],
  controllers: [ReservaController]
})
export class ReservaModule {}
