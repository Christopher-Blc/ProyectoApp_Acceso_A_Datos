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
        where: { reserva_id: Number(item.reserva_id) },
      });

      if (!reservation) {
        console.warn(
          `Skipping payment: Reservation with id ${item.reserva_id} not found`,
        );
        continue;
      }

      // Buscamos duplicados por reserva y monto
      const existing = await paymentRepository.findOne({
        where: {
          reserva_id: Number(item.reserva_id),
          monto: item.monto,
          fecha_Payment: item.fecha_Payment,
        },
      });

      if (existing) continue;

      const paymentEntry = new Payment();
      // Campos según la entidad
      paymentEntry.reserva_id = reservation.reserva_id;
      paymentEntry.monto = item.monto;
      paymentEntry.fecha_Payment = item.fecha_Payment || new Date();
      paymentEntry.metodo_pago = item.metodo_pago;
      paymentEntry.estado_pago = item.estado_pago;
      paymentEntry.nota = item.nota;

      paymentsEntries.push(paymentEntry);
    }

    if (paymentsEntries.length > 0) {
      await paymentRepository.save(paymentsEntries);
      console.log(`${paymentsEntries.length} payments created.`);
    }
    console.log('Payment seeding completed!');
  }
}





