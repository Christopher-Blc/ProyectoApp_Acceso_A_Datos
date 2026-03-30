import { Module } from '@nestjs/common';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago])],
  controllers: [PagoController],
  providers: [PagoService]
})
export class PagoModule {}
