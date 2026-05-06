import { Payment } from '../../../modules/payment/entities/payment.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import paymentData from '../../inventory/inventory_payment';
import { Reservation } from '../../../modules/reservation/entities/reservation.entity';

export class PaymentSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const paymentRepository = dataSource.getRepository(Payment);
    const reservationRepository = dataSource.getRepository(Reservation);

    const paymentsEntries: Payment[] = [];

    for (const item of paymentData) {
      // Buscamos la reserva para asegurar que exista la FK
      const reservation = await reservationRepository.findOne({
        where: { id: Number(item.reservation_id) },
      });

      if (!reservation) {
        console.warn(
          `Skipping payment: Reservation with id ${item.reservation_id} not found`,
        );
        continue;
      }

      // Buscamos duplicados por reserva y monto
      const existing = await paymentRepository.findOne({
        where: {
          reservation_id: Number(item.reservation_id),
          amount: item.amount,
          payment_date: item.payment_date,
        },
      });

      if (existing) continue;

      const paymentEntry = new Payment();
      // Campos según la entidad
      paymentEntry.reservation_id = reservation.id;
      paymentEntry.amount = item.amount;
      paymentEntry.payment_date = item.payment_date || new Date();
      paymentEntry.payment_method = item.payment_method;
      paymentEntry.payment_status = item.payment_status;
      paymentEntry.note = item.note;

      paymentsEntries.push(paymentEntry);
    }

    if (paymentsEntries.length > 0) {
      await paymentRepository.save(paymentsEntries);
      console.log(`${paymentsEntries.length} payments created.`);
    }
    console.log('Payment seeding completed!');
  }
}
