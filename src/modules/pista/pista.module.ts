import { Module } from '@nestjs/common';
import { PistaService } from './pista.service';
import { PistaController } from './pista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pista } from './pista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pista])],
  providers: [PistaService],
  controllers: [PistaController]
})
export class PistaModule {}
