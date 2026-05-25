import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ReservationStatus } from '../reservation/entities/reservation.entity';
import { PaymentStatus } from '../payment/entities/payment.entity';

// ─── Builders de mocks ────────────────────────────────────────────────────────
// Los builders retornan `any` para evitar que TS infiera never en mockResolvedValue

const buildMockStripe = (): any => ({
  paymentIntents: { create: jest.fn() },
  refunds: { create: jest.fn() },
  webhooks: { constructEvent: jest.fn() },
});

const buildMockReservationRepo = (): any => ({
  findOne: jest.fn(),
  update: jest.fn(),
});

const buildMockPaymentRepo = (): any => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockImplementation((d: any) => d),
  update: jest.fn(),
});

const ORIG_ENV = { ...process.env };

describe('StripeService', () => {
  let service: StripeService;
  let mockStripe: any;
  let reservationRepo: any;
  let paymentRepo: any;

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock_secret';

    reservationRepo = buildMockReservationRepo();
    paymentRepo = buildMockPaymentRepo();

    service = new StripeService(reservationRepo as any, paymentRepo as any);

    mockStripe = buildMockStripe();
    (service as any).stripe = mockStripe;
  });

  afterEach(() => {
    process.env = { ...ORIG_ENV };
    jest.clearAllMocks();
  });

  // ─── createPaymentIntent ──────────────────────────────────────────────────

  describe('createPaymentIntent', () => {
    const baseReservation = {
      id: 1,
      user_id: 10,
      total_price: 20.0,
      status: ReservationStatus.PENDING,
    };

    it('devuelve clientSecret para una reserva PENDIENTE válida', async () => {
      reservationRepo.findOne.mockResolvedValue(baseReservation);
      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
      });

      const result = await service.createPaymentIntent(1, 10);

      expect(result).toEqual({ clientSecret: 'pi_test_123_secret' });
      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 2000,
          currency: 'eur',
          metadata: { reservation_id: '1', user_id: '10' },
        }),
      );
    });

    it('lanza NotFoundException si la reserva no existe', async () => {
      reservationRepo.findOne.mockResolvedValue(null);

      await expect(service.createPaymentIntent(99, 10)).rejects.toThrow(NotFoundException);
    });

    it('lanza ForbiddenException si la reserva pertenece a otro usuario', async () => {
      reservationRepo.findOne.mockResolvedValue({ ...baseReservation, user_id: 999 });

      await expect(service.createPaymentIntent(1, 10)).rejects.toThrow(ForbiddenException);
    });

    it('lanza BadRequestException si la reserva ya está CONFIRMADA', async () => {
      reservationRepo.findOne.mockResolvedValue({
        ...baseReservation,
        status: ReservationStatus.CONFIRMED,
      });

      await expect(service.createPaymentIntent(1, 10)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── processRefund ────────────────────────────────────────────────────────

  describe('processRefund', () => {
    const paidPayment = {
      id: 5,
      reservation_id: 1,
      amount: 20.0,
      payment_status: PaymentStatus.PAID,
      stripe_payment_intent_id: 'pi_test_456',
      note: 'Pago Stripe',
    };

    it('emite un reembolso en Stripe y actualiza el pago a REEMBOLSADO', async () => {
      paymentRepo.findOne.mockResolvedValue(paidPayment);
      mockStripe.refunds.create.mockResolvedValue({ id: 're_test_789', amount: 2000 });

      await service.processRefund(1);

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_test_456',
      });
      expect(paymentRepo.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          payment_status: PaymentStatus.REFUNDED,
          stripe_refund_id: 're_test_789',
          refund_amount: 20.0,
        }),
      );
    });

    it('no hace nada si no hay pago activo para la reserva', async () => {
      paymentRepo.findOne.mockResolvedValue(null);

      await expect(service.processRefund(1)).resolves.toBeUndefined();
      expect(mockStripe.refunds.create).not.toHaveBeenCalled();
    });

    it('marca como REEMBOLSADO sin llamar a Stripe si no hay stripe_payment_intent_id', async () => {
      paymentRepo.findOne.mockResolvedValue({ ...paidPayment, stripe_payment_intent_id: undefined });

      await service.processRefund(1);

      expect(mockStripe.refunds.create).not.toHaveBeenCalled();
      expect(paymentRepo.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({ payment_status: PaymentStatus.REFUNDED }),
      );
    });

    it('simula el reembolso si Stripe devuelve un error (modo TFG)', async () => {
      paymentRepo.findOne.mockResolvedValue(paidPayment);
      mockStripe.refunds.create.mockRejectedValue(new Error('Stripe API error'));

      await expect(service.processRefund(1)).resolves.toBeUndefined();

      expect(paymentRepo.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          payment_status: PaymentStatus.REFUNDED,
          refund_amount: 20.0,
        }),
      );
    });
  });

  // ─── handleWebhook ────────────────────────────────────────────────────────

  describe('handleWebhook', () => {
    const pendingReservation = { id: 1, user_id: 10, status: ReservationStatus.PENDING };

    it('confirma la reserva y guarda el pago con stripe_payment_intent_id', async () => {
      mockStripe.webhooks.constructEvent.mockReturnValue({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_abc',
            amount_received: 2000,
            metadata: { reservation_id: '1', user_id: '10' },
          },
        },
      });
      reservationRepo.findOne.mockResolvedValue(pendingReservation);

      await service.handleWebhook('sig_test', Buffer.from('{}'));

      expect(reservationRepo.update).toHaveBeenCalledWith(1, {
        status: ReservationStatus.CONFIRMED,
      });
      expect(paymentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          reservation_id: 1,
          amount: 20.0,
          stripe_payment_intent_id: 'pi_test_abc',
          payment_status: PaymentStatus.PAID,
        }),
      );
    });

    it('es idempotente: ignora si la reserva ya está CONFIRMADA', async () => {
      mockStripe.webhooks.constructEvent.mockReturnValue({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_abc',
            amount_received: 2000,
            metadata: { reservation_id: '1', user_id: '10' },
          },
        },
      });
      reservationRepo.findOne.mockResolvedValue({
        ...pendingReservation,
        status: ReservationStatus.CONFIRMED,
      });

      await service.handleWebhook('sig_test', Buffer.from('{}'));

      expect(reservationRepo.update).not.toHaveBeenCalled();
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('lanza BadRequestException con firma de webhook inválida', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Firma inválida');
      });

      await expect(service.handleWebhook('bad_sig', Buffer.from('{}'))).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
