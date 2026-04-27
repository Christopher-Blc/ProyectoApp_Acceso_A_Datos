import { Module } from '@nestjs/common';
import { PistaService } from './pista.service';
import { PistaController } from './pista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pista } from './entities/pista.entity';
import { ReservaModule } from '../reserva/reserva.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pista]), ReservaModule],
  providers: [PistaService],
  controllers: [PistaController],
})
export class PistaModule {}
