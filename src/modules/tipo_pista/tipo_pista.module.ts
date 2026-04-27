import { Module } from '@nestjs/common';
import { TipoPistaController } from './tipo_pista.controller';
import { TipoPistaService } from './tipo_pista.service';
import { TipoPista } from './entities/tipo_pista.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPista])],
  controllers: [TipoPistaController],
  providers: [TipoPistaService],
  exports: [TipoPistaService],
})
export class TipoPistaModule {}
