import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ReviewService } from './review.service';
import { UserRole } from '../users/entities/user.entity';
import { NotificationType } from '../notification/entities/notification.entity';

describe('ReviewService', () => {
  let instance: ReviewService;

  beforeEach(() => {
    instance = Object.create(ReviewService.prototype) as ReviewService;
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });

  it('uses the admin reply content in the notification body', async () => {
    const review = {
      id: 12,
      user_id: 7,
      court_id: 3,
      admin_answer: null,
    };
    const updatedReview = {
      ...review,
      admin_answer: 'Respuesta del admin',
    };
    const notificationService = {
      create: jest.fn().mockResolvedValue(undefined),
    };

    Object.assign(instance as object, {
      findOne: jest
        .fn()
        .mockResolvedValueOnce(review)
        .mockResolvedValueOnce(updatedReview),
      recalculateCourtRating: jest.fn().mockResolvedValue(undefined),
      reviewRepository: {
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      },
      notificationService,
    });

    const result = await instance.update(
      review.id,
      { admin_answer: '  Respuesta del admin  ' },
      1,
      UserRole.ADMINISTRATION,
    );

    expect(notificationService.create).toHaveBeenCalledWith({
      user_id: review.user_id,
      title: 'Tu reseña tiene respuesta',
      message: 'Respuesta del admin',
      notification_type: NotificationType.REMINDER,
    });
    expect(result).toEqual(updatedReview);
  });
});
