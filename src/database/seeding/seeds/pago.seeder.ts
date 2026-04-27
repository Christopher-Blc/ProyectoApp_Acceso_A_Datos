import { Pago } from '../../../modules/pago/entities/pago.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import pagoData from '../../inventory/inventory_pago';
import { Reserva } from '../../../modules/reserva/entities/reserva.entity';

export class PagoSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const pagoRepository = dataSource.getRepository(Pago);
    const reservaRepository = dataSource.getRepository(Reserva);

    const pagosEntries: Pago[] = [];

    for (const item of pagoData) {
      // Buscamos la reserva para asegurar que existe la FK [cite: 169, 176]
      const reserva = await reservaRepository.findOne({
        where: { reserva_id: Number(item.reserva_id) },
      });

      if (!reserva) {
        console.warn(
          `Saltando pago: Reserva con id ${item.reserva_id} no encontrada`,
        );
        continue;
      }

      // Buscamos duplicados por reserva y monto
      const existing = await pagoRepository.findOne({
        where: {
          reserva_id: Number(item.reserva_id),
          monto: item.monto,
          fecha_pago: item.fecha_pago,
        },
      });

      if (existing) continue;

      const pagoEntry = new Pago();
      // Campos según tu Entity [cite: 169-175]
      pagoEntry.reserva_id = reserva.reserva_id;
      pagoEntry.monto = item.monto;
      pagoEntry.fecha_pago = item.fecha_pago || new Date();
      pagoEntry.metodo_pago = item.metodo_pago;
      pagoEntry.estado_pago = item.estado_pago;
      pagoEntry.nota = item.nota;

      pagosEntries.push(pagoEntry);
    }

    if (pagosEntries.length > 0) {
      await pagoRepository.save(pagosEntries);
      console.log(`${pagosEntries.length} pagos creados.`);
    }
    console.log('Pago seeding completado!');
  }
}
