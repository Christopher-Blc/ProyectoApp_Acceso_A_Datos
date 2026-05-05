import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Court } from '../court/entities/court.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Court]), UsersModule],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [TypeOrmModule],
})
export class ReservationModule {}





