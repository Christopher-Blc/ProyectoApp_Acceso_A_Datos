import { Module } from '@nestjs/common';
import { HorarioPistaController } from './horario_pista.controller';
import { HorarioPistaService } from './horario_pista.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario_Pista } from './horario_pista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Horario_Pista])],
  controllers: [HorarioPistaController],
  providers: [HorarioPistaService]
})
export class HorarioPistaModule {}
