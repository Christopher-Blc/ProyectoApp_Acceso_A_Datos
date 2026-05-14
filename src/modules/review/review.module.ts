import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Reservation } from '../reservation/entities/reservation.entity';
import { Court } from '../court/entities/court.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Reservation, Court])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
