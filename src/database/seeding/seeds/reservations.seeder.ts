import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Reservation } from '../../../modules/reservationtion/entities/reservation.entity';
import reservaData from '../../inventory/inventory_reserva';
import { User } from '../../../modules/users/entities/user.entity';
import { Court } from '../../../modules/court/entities/court.entity';

export class ReservaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const reservaRepository = dataSource.getRepository(Reserva);
    const userRepository = dataSource.getRepository(User);
    const pistaRepository = dataSource.getRepository(Court);

    const reservaEntries: Reserva[] = [];

    for (const item of reservaData) {
      // 1. We verify that mandatory relationships exist [cite: 207-208]
      const user = await userRepository.findOneBy({
        usuario_id: Number(item.usuario_id),
      });
      const Court = await pistaRepository.findOneBy({
        pista_id: Number(item.pista_id),
      });

      if (!user || !Court) {
        console.warn(
          `Skipping reservation: User ${item.usuario_id} or Court ${item.pista_id} don't exist.`,
        );
        continue;
      }

      // 2. We avoid duplicates (User + Court + Date + Start Time)
      const existing = await reservaRepository.findOne({
        where: {
          usuario_id: user.usuario_id,
          pista_id: pista.pista_id,
          fecha_reserva: item.fecha_Reservation,
          hora_inicio: item.hora_inicio,
        },
      });

      if (existing) continue;

      // 3. Manual price calculation for Seed (replicating the Service)
      const [hInicio, mInicio] = item.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = item.hora_fin.split(':').map(Number);
      const totalMinutos = hFin * 60 + mFin - (hInicio * 60 + mInicio);

      let precioCalculado = 0;
      if (totalMinutos > 0) {
        const duracionHoras = totalMinutos / 60;
        // We use the precio_hora from the Court found
        precioCalculado = Number(
          (duracionHoras * pista.precio_hora).toFixed(2),
        );
      }

      // 4. Mapping to Entity [cite: 200-206]
      const reservaEntry = new Reserva();
      reservaEntry.usuario_id = user.usuario_id;
      reservaEntry.pista_id = pista.pista_id;
      reservaEntry.fecha_Reservation = item.fecha_reserva;
      reservaEntry.hora_inicio = item.hora_inicio;
      reservaEntry.hora_fin = item.hora_fin;
      reservaEntry.estado = item.estado;
      reservaEntry.nota = item.nota || 'Seed data';
      reservaEntry.precio_total = precioCalculado; // Mandatory field

      reservaEntries.push(reservaEntry);
    }

    if (reservaEntries.length > 0) {
      await reservaRepository.save(reservaEntries);
      console.log(`${reservaEntries.length} reservations created successfully.`);
    }
    console.log('Reservation seeding completed!');
  }
}




