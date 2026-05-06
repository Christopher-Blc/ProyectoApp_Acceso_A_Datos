import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'installation'] });
  }

  async findOne(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'installation'],
    });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }
    return review;
  }

  async create(info_review: CreateReviewDto) {
    const newReview = this.reviewRepository.create(info_review);
    return this.reviewRepository.save(newReview);
  }

  async update(
    reviewId: number,
    infoReview: UpdateReviewDto,
  ): Promise<Review> {
    await this.reviewRepository.update(reviewId, infoReview);
    return this.findOne(reviewId);
  }

  async remove(reviewId: number): Promise<void> {
    await this.reviewRepository.delete(reviewId);
  }
}
