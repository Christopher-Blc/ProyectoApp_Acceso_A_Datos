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

  async findOne(review_id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: review_id },
      relations: ['user', 'installation'],
    });
    if (!review) {
      throw new NotFoundException(`Review ${review_id} not found`);
    }
    return review;
  }

  async create(info_review: CreateReviewDto) {
    const newReview = this.reviewRepository.create(info_review);
    return this.reviewRepository.save(newReview);
  }

  async update(
    review_id: number,
    info_review: UpdateReviewDto,
  ): Promise<Review> {
    await this.reviewRepository.update(review_id, info_review);
    return this.findOne(review_id);
  }

  async remove(review_id: number): Promise<void> {
    await this.reviewRepository.delete(review_id);
  }
}
