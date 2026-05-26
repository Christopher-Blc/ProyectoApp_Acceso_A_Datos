import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationStatus } from './entities/reservation.entity';
import { NotificationType } from '../notification/entities/notification.entity';

// ─── Helpers de mocks ────────────────────────────────────────────────────────
// Los builders retornan `any` para evitar que TS infiera never en mockResolvedValue

const buildReservationRepo = (): any => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn().mockImplementation((d: any) => d),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const buildCourtRepo = (): any => ({
  findOneBy: jest.fn(),
  increment: jest.fn(),
});

const buildUserService = (): any => ({
  findById: jest.fn(),
  updateUserRank: jest.fn(),
});

const buildNotificationService = (): any => ({
  create: jest.fn(),
});

const buildStripeService = (): any => ({
  processRefund: jest.fn(),
});

// ─── Datos de ejemplo ────────────────────────────────────────────────────────

const COURT = { id: 2, price_per_hour: 10, reservations_made: 0 };

const pendingReservation = (overrides = {}) => ({
  id: 1,
  user_id: 10,
  court_id: 2,
  reservation_date: new Date('2025-08-01'),
  start_time: '10:00',
  end_time: '11:00',
  status: ReservationStatus.PENDING,
  total_price: 10,
  court: COURT,
  payments: [],
  user: { id: 10 },
  ...overrides,
});

const confirmedReservation = (overrides = {}) =>
  pendingReservation({ status: ReservationStatus.CONFIRMED, ...overrides });

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('ReservationService', () => {
  let service: ReservationService;
  let reservaRepo: any;
  let pistaRepo: any;
  let userService: any;
  let notificationService: any;
  let stripeService: any;

  beforeEach(() => {
    reservaRepo = buildReservationRepo();
    pistaRepo = buildCourtRepo();
    userService = buildUserService();
    notificationService = buildNotificationService();
    stripeService = buildStripeService();

    service = new ReservationService(
      reservaRepo,
      pistaRepo,
      userService,
      notificationService,
      stripeService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── should be defined ────────────────────────────────────────────────────

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('calcula el precio y asigna estado PENDIENTE', async () => {
      userService.findById.mockResolvedValue({ id: 10 });
      pistaRepo.findOneBy.mockResolvedValue(COURT);
      const saved = {
        id: 99,
        status: ReservationStatus.PENDING,
        total_price: 10,
      };
      reservaRepo.save.mockResolvedValue(saved);
      reservaRepo.findOne.mockResolvedValue({
        ...saved,
        court: COURT,
        payments: [],
      });

      const result = await service.create(
        {
          court_id: 2,
          reservation_date: '2025-08-01',
          start_time: '10:00',
          end_time: '11:00',
        } as any,
        10,
      );

      expect(result.status).toBe(ReservationStatus.PENDING);
      expect(result.total_price).toBe(10);
    });

    it('lanza NotFoundException si la pista no existe', async () => {
      userService.findById.mockResolvedValue({ id: 10 });
      pistaRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(
          {
            court_id: 99,
            reservation_date: '2025-08-01',
            start_time: '10:00',
            end_time: '11:00',
          } as any,
          10,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update – cancelación ─────────────────────────────────────────────────

  describe('update – cancelación con reembolso', () => {
    it('cancela una reserva CONFIRMADA y llama a processRefund', async () => {
      reservaRepo.findOne.mockResolvedValue(confirmedReservation());
      reservaRepo.update.mockResolvedValue(undefined);
      notificationService.create.mockResolvedValue(undefined);
      stripeService.processRefund.mockResolvedValue(undefined);

      await service.update(
        1,
        { status: ReservationStatus.CANCELLED } as any,
        10,
        'SUPER_ADMIN' as any,
      );

      expect(stripeService.processRefund).toHaveBeenCalledWith(1);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({ notification_type: NotificationType.ALERT }),
      );
    });

    it('cancela una reserva PENDIENTE sin llamar a processRefund', async () => {
      reservaRepo.findOne.mockResolvedValue(pendingReservation());
      reservaRepo.update.mockResolvedValue(undefined);
      notificationService.create.mockResolvedValue(undefined);

      await service.update(
        1,
        { status: ReservationStatus.CANCELLED } as any,
        10,
        'SUPER_ADMIN' as any,
      );

      expect(stripeService.processRefund).not.toHaveBeenCalled();
    });

    it('la cancelación se completa aunque falle el reembolso', async () => {
      reservaRepo.findOne.mockResolvedValue(confirmedReservation());
      reservaRepo.update.mockResolvedValue(undefined);
      notificationService.create.mockResolvedValue(undefined);
      stripeService.processRefund.mockRejectedValue(new Error('Stripe error'));

      await expect(
        service.update(
          1,
          { status: ReservationStatus.CANCELLED } as any,
          10,
          'SUPER_ADMIN' as any,
        ),
      ).resolves.not.toThrow();

      expect(reservaRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ status: ReservationStatus.CANCELLED }),
      );
    });
  });

  // ─── update – permisos ────────────────────────────────────────────────────

  describe('update – permisos', () => {
    it('lanza ForbiddenException si un cliente intenta editar la reserva de otro usuario', async () => {
      reservaRepo.findOne.mockResolvedValue(
        pendingReservation({ user_id: 999 }),
      );

      await expect(
        service.update(1, { note: 'hack' } as any, 10, 'CLIENTE' as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza ForbiddenException si un cliente intenta modificar (no cancelar) una reserva ya procesada', async () => {
      reservaRepo.findOne.mockResolvedValue(confirmedReservation());

      await expect(
        service.update(1, { note: 'update' } as any, 10, 'CLIENTE' as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('permite a un cliente cancelar una reserva CONFIRMADA propia', async () => {
      reservaRepo.findOne.mockResolvedValue(confirmedReservation());
      reservaRepo.update.mockResolvedValue(undefined);
      notificationService.create.mockResolvedValue(undefined);
      stripeService.processRefund.mockResolvedValue(undefined);

      await expect(
        service.update(
          1,
          { status: ReservationStatus.CANCELLED } as any,
          10,
          'CLIENTE' as any,
        ),
      ).resolves.not.toThrow();

      expect(stripeService.processRefund).toHaveBeenCalledWith(1);
    });
  });

  // ─── update – recálculo de precio ─────────────────────────────────────────

  describe('update – recálculo de precio', () => {
    it('recalcula el precio cuando cambia la hora de fin (admin)', async () => {
      reservaRepo.findOne.mockResolvedValue(pendingReservation());
      pistaRepo.findOneBy.mockResolvedValue(COURT);
      reservaRepo.update.mockResolvedValue(undefined);

      await service.update(
        1,
        { end_time: '12:00' } as any,
        10,
        'SUPER_ADMIN' as any,
      );

      // price_per_hour=10, duración 10:00–12:00 = 2h → 20€
      expect(reservaRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ total_price: 20 }),
      );
    });
  });

  // ─── validarCodigoReserva ─────────────────────────────────────────────────

  describe('validarCodigoReserva', () => {
    it('lanza NotFoundException si el código no existe', async () => {
      reservaRepo.findOne.mockResolvedValue(null);

      await expect(service.validarCodigoReserva('RES-FAKE99')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('lanza ForbiddenException si la reserva no es de hoy', async () => {
      reservaRepo.findOne.mockResolvedValue({
        ...pendingReservation(),
        reservation_date: new Date('2020-01-01'),
      });

      await expect(service.validarCodigoReserva('RES-ABC123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
