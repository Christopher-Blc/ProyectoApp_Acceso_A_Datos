import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import {
  Reservation,
  ReservationStatus,
} from '../reservation/entities/reservation.entity';
import { Court } from '../court/entities/court.entity';
import { UserRole } from '../users/entities/user.entity';
import {
  NotificationType,
} from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
    private readonly notificationService: NotificationService,
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
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      reviews.length > 0 ? totalRatings / reviews.length : 0;
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

    let savedReview: Review;
    try {
      savedReview = await this.reviewRepository.save(newReview);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Ya has hecho una review para esta pista. No puedes hacer otra.',
        );
      }
      throw new InternalServerErrorException();
    }

    //Recalcular average_rating y total_reviews para TODAS las pistas con ese nombre
    await this.recalculateCourtRating(court_id);

    return this.findOne(savedReview.id);
  }

  async update(
    reviewId: number,
    infoReview: UpdateReviewDto,
    userId: number,
    userRole?: string,
  ): Promise<Review> {
    // Verificar que existe la review
    const review = await this.findOne(reviewId);
    const previousAdminAnswer = review.admin_answer;

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
        throw new ConflictException('Ya tienes una review para esa pista.');
      }
    }

    // Actualizar la review
    try {
      await this.reviewRepository.update(reviewId, infoReview);
    } catch (error) {
      const dbError = error as { code?: string };
      if (dbError.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya tienes una review para esa pista.');
      }
      throw new InternalServerErrorException();
    }

    //Recalcular average_rating (en update NO incrementamos total_reviews)
    const courtIdToUpdate = infoReview.court_id || review.court_id;
    await this.recalculateCourtRating(courtIdToUpdate);

    const isAdminAnswerUpdate =
      typeof infoReview.admin_answer === 'string' &&
      infoReview.admin_answer.trim().length > 0 &&
      infoReview.admin_answer !== previousAdminAnswer;
    const isAdminActor =
      userRole === UserRole.ADMINISTRATION || userRole === UserRole.SUPER_ADMIN;

    if (isAdminAnswerUpdate && isAdminActor && review.user_id !== userId) {
      await this.notificationService.create({
        user_id: review.user_id,
        title: 'Tu reseña tiene respuesta',
        message: 'Un administrador ha respondido tu reseña.',
        notification_type: NotificationType.REMINDER,
      });
    }

    return this.findOne(reviewId);
  }

  async remove(
    reviewId: number,
    userId: number,
  ): Promise<{ deleted: boolean }> {
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
