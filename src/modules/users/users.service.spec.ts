import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UsersService } from './users.service';
import { ReservationStatus } from '../reservation/entities/reservation.entity';
import { NotificationType } from '../notification/entities/notification.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;
  let membershipRepository: any;
  let reservationRepository: any;
  let notificationService: any;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((data: any) => data),
      save: jest.fn(),
      update: jest.fn(),
    };
    membershipRepository = {
      findOne: jest.fn(),
    };
    reservationRepository = {
      count: jest.fn(),
    };
    notificationService = {
      create: jest.fn(),
    };

    service = new UsersService(
      userRepository,
      membershipRepository,
      reservationRepository,
      notificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('asigna automaticamente el membership con 0 reservas al crear usuario', async () => {
    membershipRepository.findOne.mockResolvedValue({
      id: 1,
      name: 'Bronce',
      required_reservations: 0,
    });
    userRepository.save.mockImplementation(async (data: any) => ({
      id: 5,
      ...data,
    }));

    const result = await service.create({
      username: 'neo',
      email: 'neo@example.com',
      password: 'Passw0rd!',
    } as any);

    expect(membershipRepository.findOne).toHaveBeenCalled();
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ membership_id: 1 }),
    );
    expect(result.membership_id).toBe(1);
  });

  it('notifica al usuario cuando cambia de rango', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 10,
      membership_id: 1,
      membership: { id: 1, name: 'Bronce' },
    });
    reservationRepository.count.mockResolvedValue(6);
    membershipRepository.findOne.mockResolvedValue({
      id: 2,
      name: 'Plata',
      required_reservations: 5,
    });
    userRepository.update.mockResolvedValue(undefined);
    notificationService.create.mockResolvedValue(undefined);

    await service.updateUserRank(10);

    expect(userRepository.update).toHaveBeenCalledWith(10, {
      membership_id: 2,
    });
    expect(notificationService.create).toHaveBeenCalledWith({
      user_id: 10,
      title: 'Rango actualizado',
      message: 'Tu rango ha sido actualizado a Plata.',
      notification_type: NotificationType.ALERT,
    });
  });

  it('no notifica si el rango no cambia', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 10,
      membership_id: 2,
      membership: { id: 2, name: 'Plata' },
    });
    reservationRepository.count.mockResolvedValue(6);
    membershipRepository.findOne.mockResolvedValue({
      id: 2,
      name: 'Plata',
      required_reservations: 5,
    });

    await service.updateUserRank(10);

    expect(userRepository.update).not.toHaveBeenCalled();
    expect(notificationService.create).not.toHaveBeenCalled();
  });
});
