import { Module } from '@nestjs/common';
import { TipoPistaController } from './tipo_pista.controller';
import { TipoPistaService } from './tipo_pista.service';

@Module({
  controllers: [TipoPistaController],
  providers: [TipoPistaService]
})
export class TipoPistaModule {}
