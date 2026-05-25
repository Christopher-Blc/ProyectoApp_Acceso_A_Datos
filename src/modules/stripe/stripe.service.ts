import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import {
  Reservation,
  ReservationStatus,
} from '../reservation/entities/reservation.entity';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../payment/entities/payment.entity';

// Tipo del objeto PaymentIntent que necesitamos del webhook
interface StripePaymentIntentSucceeded {
  id: string;
  amount_received: number;
  metadata: Record<string, string>;
}

@Injectable()
export class StripeService {
  private readonly stripe: ReturnType<typeof Stripe>;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        'STRIPE_SECRET_KEY no está definida en las variables de entorno',
      );
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createPaymentIntent(
    reservationId: number,
    userId: number,
  ): Promise<{ clientSecret: string }> {
    this.logger.log(`Creando PaymentIntent para reserva ${reservationId}`);

    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva ${reservationId} no encontrada`);
    }

    if (reservation.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para pagar esta reserva');
    }

    // Idempotencia: si ya está confirmada, no crear otro PaymentIntent
    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Esta reserva ya está pagada y confirmada');
    }

    const amountInCents = Math.round(Number(reservation.total_price) * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        reservation_id: String(reservation.id),
        user_id: String(userId),
      },
    });

    this.logger.log(
      `PaymentIntent ${paymentIntent.id} creado para reserva ${reservationId} — importe: ${amountInCents} céntimos`,
    );

    if (!paymentIntent.client_secret) {
      throw new BadRequestException(
        'Stripe no devolvió un client_secret válido',
      );
    }

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(signature: string, rawBody: Buffer): Promise<void> {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error(
        'STRIPE_WEBHOOK_SECRET no está definida en las variables de entorno',
      );
    }

    let event: ReturnType<typeof this.stripe.webhooks.constructEvent>;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      this.logger.error(
        `Verificación de firma del webhook fallida: ${(error as Error).message}`,
      );
      throw new BadRequestException('Firma del webhook inválida');
    }

    this.logger.log(`Webhook recibido: ${event.type}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as StripePaymentIntentSucceeded;
      await this.handlePaymentSucceeded(paymentIntent);
    }
  }

  private async handlePaymentSucceeded(
    paymentIntent: StripePaymentIntentSucceeded,
  ): Promise<void> {
    const reservationId = Number(paymentIntent.metadata?.reservation_id);

    if (!reservationId) {
      this.logger.warn(
        `PaymentIntent ${paymentIntent.id} no tiene reservation_id en metadata`,
      );
      return;
    }

    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      this.logger.error(
        `Reserva ${reservationId} no encontrada para PaymentIntent ${paymentIntent.id}`,
      );
      return;
    }

    // Idempotencia: si ya está confirmada, ignorar el evento duplicado
    if (reservation.status === ReservationStatus.CONFIRMED) {
      this.logger.log(
        `Reserva ${reservationId} ya estaba confirmada — evento ignorado (idempotencia)`,
      );
      return;
    }

    await this.reservationRepo.update(reservationId, {
      status: ReservationStatus.CONFIRMED,
    });

    const amountPaid = paymentIntent.amount_received / 100;

    await this.paymentRepo.save(
      this.paymentRepo.create({
        reservation_id: reservationId,
        amount: amountPaid,
        payment_method: PaymentMethod.VISA,
        payment_status: PaymentStatus.PAID,
        stripe_payment_intent_id: paymentIntent.id,
        note: `Pago Stripe — PaymentIntent ${paymentIntent.id}`,
      }),
    );

    this.logger.log(
      `Reserva ${reservationId} confirmada y registro de Payment creado (${amountPaid}€)`,
    );
  }

  async confirmByPaymentIntentId(paymentIntentId: string, userId: number): Promise<void> {
    const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== 'succeeded') {
      throw new BadRequestException('El pago aún no ha sido confirmado por Stripe');
    }

    const piUserId = Number(pi.metadata?.user_id);
    if (piUserId !== userId) {
      throw new ForbiddenException('No tienes permiso para confirmar este pago');
    }

    await this.handlePaymentSucceeded({
      id: pi.id,
      amount_received: pi.amount_received,
      metadata: pi.metadata as Record<string, string>,
    });
  }

  async processRefund(reservationId: number): Promise<void> {
    const payment = await this.paymentRepo.findOne({
      where: {
        reservation_id: reservationId,
        payment_status: PaymentStatus.PAID,
      },
    });

    if (!payment) {
      this.logger.log(
        `Reserva ${reservationId}: sin pago activo que reembolsar`,
      );
      return;
    }

    if (!payment.stripe_payment_intent_id) {
      // Pago no fue a través de Stripe (efectivo, etc.) — solo marcamos como reembolsado
      await this.paymentRepo.update(payment.id, {
        payment_status: PaymentStatus.REFUNDED,
        refund_date: new Date(),
        note:
          (payment.note ? payment.note + ' | ' : '') +
          'Reembolsado al cancelar reserva',
      });
      this.logger.log(
        `Reserva ${reservationId}: pago no-Stripe marcado como reembolsado`,
      );
      return;
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
      });

      await this.paymentRepo.update(payment.id, {
        payment_status: PaymentStatus.REFUNDED,
        stripe_refund_id: refund.id,
        refund_amount: refund.amount / 100,
        refund_date: new Date(),
        note:
          (payment.note ? payment.note + ' | ' : '') +
          `Reembolso Stripe — ${refund.id}`,
      });

      this.logger.log(
        `Reembolso ${refund.id} procesado para reserva ${reservationId} (${refund.amount / 100}€)`,
      );
    } catch (error) {
      this.logger.warn(
        `Stripe no pudo procesar el reembolso para reserva ${reservationId}: ${(error as Error).message} — simulando reembolso`,
      );
      // Simulación para demo/TFG: si Stripe falla, marcamos el pago como reembolsado igualmente
      const simRefundId = `SIM-${Date.now()}`;
      await this.paymentRepo.update(payment.id, {
        payment_status: PaymentStatus.REFUNDED,
        stripe_refund_id: simRefundId,
        refund_amount: Number(payment.amount),
        refund_date: new Date(),
        note:
          (payment.note ? payment.note + ' | ' : '') +
          `Reembolso simulado — ${simRefundId}`,
      });
      this.logger.log(
        `Reembolso simulado ${simRefundId} aplicado para reserva ${reservationId}`,
      );
    }
  }
}
