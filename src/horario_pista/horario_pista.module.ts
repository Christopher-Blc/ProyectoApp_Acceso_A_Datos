import { Module } from '@nestjs/common';
import { HorarioPistaController } from './horario_pista.controller';
import { HorarioPistaService } from './horario_pista.service';

@Module({
  controllers: [HorarioPistaController],
  providers: [HorarioPistaService]
})
export class HorarioPistaModule {}
