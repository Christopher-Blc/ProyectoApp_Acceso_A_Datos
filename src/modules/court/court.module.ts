import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from './entities/court.entity';
import { ReservationModule } from '../reservationtiontion/reserva.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pista]), ReservationModule],
  providers: [CourtService],
  controllers: [CourtController],
})
export class CourtModule {}



