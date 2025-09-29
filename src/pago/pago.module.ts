import { Module } from '@nestjs/common';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';

@Module({
  controllers: [PagoController],
  providers: [PagoService]
})
export class PagoModule {}
