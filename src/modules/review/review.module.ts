import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
