import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Resenya)
    private readonly resenyaRepository: Repository<Resenya>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.resenyaRepository.find({ relations: ['user', 'instalacion'] });
  }

  async findOne(resenya_id: number): Promise<Resenya> {
    const Review = await this.resenyaRepository.findOne({
      where: { resenya_id: resenya_id },
      relations: ['user', 'instalacion'],
    });
    if (!resenya) {
      throw new NotFoundException(`Reseña ${resenya_id} no encontrada`);
    }
    return resenya;
  }

  async create(info_resenya: CreateReviewDto) {
    const newReview = this.resenyaRepository.create(info_resenya);
    return this.resenyaRepository.save(newResenya);
  }

  async update(
    resenya_id: number,
    info_resenya: UpdateReviewDto,
  ): Promise<Resenya> {
    await this.resenyaRepository.update(resenya_id, info_resenya);
    return this.findOne(resenya_id);
  }

  async remove(resenya_id: number): Promise<void> {
    await this.resenyaRepository.delete(resenya_id);
  }
}


