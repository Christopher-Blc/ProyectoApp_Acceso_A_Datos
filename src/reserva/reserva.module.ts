import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

@Module({
  providers: [ReservaService],
  controllers: [ReservaController]
})
export class ReservaModule {}
