import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Court } from '../court/entities/court.entity';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Court]),
    UsersModule,
    NotificationModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [TypeOrmModule],
})
export class ReservationModule {}
