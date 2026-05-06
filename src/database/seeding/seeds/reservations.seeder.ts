import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Reservation } from '../../../modules/reservation/entities/reservation.entity';
import reservationData from '../../inventory/inventory_reservation';
import { User } from '../../../modules/users/entities/user.entity';
import { Court } from '../../../modules/court/entities/court.entity';

export class ReservationsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const reservationRepository = dataSource.getRepository(Reservation);
    const userRepository = dataSource.getRepository(User);
    const courtRepository = dataSource.getRepository(Court);

    const reservationEntries: Reservation[] = [];

    for (const item of reservationData) {
      // 1. Verificamos que existan relaciones obligatorias
      const user = await userRepository.findOneBy({
        usuario_id: Number(item.user_id),
      });
      const court = await courtRepository.findOneBy({
        court_id: Number(item.court_id),
      });

      if (!user || !court) {
        console.warn(
          `Se omite reserva: usuario ${item.user_id} o pista ${item.court_id} no existen.`,
        );
        continue;
      }

      // 2. Evitamos duplicados (usuario + pista + fecha + hora inicio)
      const existing = await reservationRepository.findOne({
        where: {
          user_id: user.usuario_id,
          court_id: item.court_id,
          start_time: item.start_time,
        },
      });

      if (existing) continue;

      // 3. Cálculo manual de precio para la carga inicial (replicando el servicio)
      const [hInicio, mInicio] = item.start_time.split(':').map(Number);
      const [hFin, mFin] = item.end_time.split(':').map(Number);
      const totalMinutos = hFin * 60 + mFin - (hInicio * 60 + mInicio);

      let precioCalculado = 0;
      if (totalMinutos > 0) {
        const duracionHoras = totalMinutos / 60;
        // Usamos el precio_hora de la pista encontrada
        precioCalculado = Number(
          (duracionHoras * court.price_per_hour).toFixed(2),
        );
      }

      // 4. Mapeo a la entidad
      const reservationEntry = new Reservation();
      reservationEntry.user_id = user.usuario_id;
      reservationEntry.court_id = court.court_id;
      reservationEntry.reservation_date = item.reservation_date;
      reservationEntry.start_time = item.start_time;
      reservationEntry.end_time = item.end_time;
      reservationEntry.status = item.status;
      reservationEntry.nota = item.nota || 'Datos de seed';
      reservationEntry.total_price = precioCalculado; // Campo obligatorio

      reservationEntries.push(reservationEntry);
    }

    if (reservationEntries.length > 0) {
      await reservationRepository.save(reservationEntries);
      console.log(
        `${reservationEntries.length} reservas creadas correctamente.`,
      );
    }
    console.log('Seed de reservas completado.');
  }
}
