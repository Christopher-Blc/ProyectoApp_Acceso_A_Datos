import { Module } from '@nestjs/common';
import { PistaService } from './pista.service';
import { PistaController } from './pista.controller';

@Module({
  providers: [PistaService],
  controllers: [PistaController]
})
export class PistaModule {}
