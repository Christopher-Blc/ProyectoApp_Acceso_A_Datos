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
        where: { id: Number(item.reservationId) },
      });

      if (!reservation) {
        console.warn(
          `Skipping payment: Reservation with id ${item.reservationId} not found`,
        );
        continue;
      }

      // Buscamos duplicados por reserva y monto
      const existing = await paymentRepository.findOne({
        where: {
          reservationId: Number(item.reservationId),
          amount: item.amount,
          paymentDate: item.paymentDate,
        },
      });

      if (existing) continue;

      const paymentEntry = new Payment();
      // Campos según la entidad
      paymentEntry.reservationId = reservation.id;
      paymentEntry.amount = item.amount;
      paymentEntry.paymentDate = item.paymentDate || new Date();
      paymentEntry.paymentMethod = item.paymentMethod;
      paymentEntry.paymentStatus = item.paymentStatus;
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
