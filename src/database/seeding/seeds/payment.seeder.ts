import { Payment } from '../../../modules/payment/entities/payment.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import pagoData from '../../inventory/inventory_pago';
import { Reservation } from '../../../modules/reservationtion/entities/reservation.entity';

export class PagoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const pagoRepository = dataSource.getRepository(Pago);
    const reservaRepository = dataSource.getRepository(Reserva);

    const pagosEntries: Payment[] = [];

    for (const item of pagoData) {
      // We search for the reservation to ensure that the FK exists [cite: 169, 176]
      const Reservation = await reservaRepository.findOne({
        where: { reserva_id: Number(item.reserva_id) },
      });

      if (!reserva) {
        console.warn(
          `Skipping payment: Reservation with id ${item.reserva_id} not found`,
        );
        continue;
      }

      // We search for duplicates by reservation and amount
      const existing = await pagoRepository.findOne({
        where: {
          reserva_id: Number(item.reserva_id),
          monto: item.monto,
          fecha_pago: item.fecha_Payment,
        },
      });

      if (existing) continue;

      const pagoEntry = new Payment();
      // Fields according to your Entity [cite: 169-175]
      pagoEntry.reserva_id = reserva.reserva_id;
      pagoEntry.monto = item.monto;
      pagoEntry.fecha_Payment = item.fecha_Payment || new Date();
      pagoEntry.metodo_Payment = item.metodo_pago;
      pagoEntry.estado_Payment = item.estado_pago;
      pagoEntry.nota = item.nota;

      pagosEntries.push(pagoEntry);
    }

    if (pagosEntries.length > 0) {
      await pagoRepository.save(pagosEntries);
      console.log(`${pagosEntries.length} payments created.`);
    }
    console.log('Payment seeding completed!');
  }
}





