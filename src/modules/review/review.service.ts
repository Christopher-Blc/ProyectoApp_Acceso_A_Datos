import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { Reservation, ReservationStatus } from '../reservation/entities/reservation.entity';
import { Court } from '../court/entities/court.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'court'] });
  }

  async findOne(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'court'],
    });
    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }
    return review;
  }

  private async recalculateCourtRating(court_id: number): Promise<void> {
    //Obtener el court para saber su nombre
    const court = await this.courtRepository.findOneBy({ id: court_id });
    if (!court) {
      throw new NotFoundException(`Court ${court_id} not found`);
    }

    //Obtener todas las reviews para pistas con ese NOMBRE (usando query builder para el JOIN)
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.court', 'court')
      .where('court.name = :courtName', { courtName: court.name })
      .getMany();

    //Calcular el promedio
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;
    const totalReviews = reviews.length;

    //Actualizar TODAS las pistas con ese nombre
    await this.courtRepository.update(
      { name: court.name },
      {
        average_rating: parseFloat(averageRating.toFixed(1)),
        total_reviews: totalReviews,
      },
    );
  }

  async create(info_review: CreateReviewDto, userId: number): Promise<Review> {
    const { court_id } = info_review;

    // Verificar si el usuario ya tiene una review para esta pista
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: userId,
        court_id: court_id,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'Ya has hecho una review para esta pista. No puedes hacer otra.',
      );
    }

    // Verificar que el usuario tenga al menos una reserva finalizada en esta pista
    const completedReservation = await this.reservationRepository.findOne({
      where: {
        user_id: userId,
        court_id: court_id,
        status: ReservationStatus.COMPLETED,
      },
    });

    if (!completedReservation) {
      throw new BadRequestException(
        'Debes tener al menos una reserva finalizada en esta pista para hacer una review.',
      );
    }

    // Crear la review
    const newReview = this.reviewRepository.create({
      ...info_review,
      user_id: userId,
    });

    const savedReview = await this.reviewRepository.save(newReview);

    //Recalcular average_rating y total_reviews para TODAS las pistas con ese nombre
    await this.recalculateCourtRating(court_id);

    return this.findOne(savedReview.id);
  }

  async update(
    reviewId: number,
    infoReview: UpdateReviewDto,
    userId: number,
  ): Promise<Review> {
    // Verificar que existe la review
    const review = await this.findOne(reviewId);

    // Si se intenta cambiar la pista, verificar que tenga reserva finalizada en la nueva pista
    if (infoReview.court_id && infoReview.court_id !== review.court_id) {
      const completedReservation = await this.reservationRepository.findOne({
        where: {
          user_id: userId,
          court_id: infoReview.court_id,
          status: ReservationStatus.COMPLETED,
        },
      });

      if (!completedReservation) {
        throw new BadRequestException(
          'Debes tener al menos una reserva finalizada en la nueva pista para cambiar la review.',
        );
      }

      // Verificar que no exista review anterior en la nueva pista
      const existingReview = await this.reviewRepository.findOne({
        where: {
          user_id: userId,
          court_id: infoReview.court_id,
        },
      });

      if (existingReview && existingReview.id !== reviewId) {
        throw new ConflictException(
          'Ya tienes una review para esa pista.',
        );
      }
    }

    // Actualizar la review
    await this.reviewRepository.update(reviewId, infoReview);

    //Recalcular average_rating (en update NO incrementamos total_reviews)
    const courtIdToUpdate = infoReview.court_id || review.court_id;
    await this.recalculateCourtRating(courtIdToUpdate);

    return this.findOne(reviewId);
  }

  async remove(reviewId: number, userId: number): Promise<{ deleted: boolean }> {
    // Verificar que existe la review
    const review = await this.findOne(reviewId);
    const courtId = review.court_id;

    // Eliminar
    await this.reviewRepository.delete(reviewId);

    // Recalcular average_rating y total_reviews para TODAS las pistas con ese nombre
    await this.recalculateCourtRating(courtId);

    return { deleted: true };
  }
}