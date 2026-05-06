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
        id: Number(item.userId),
      });
      const court = await courtRepository.findOneBy({
        id: Number(item.courtId),
      });

      if (!user || !court) {
        console.warn(
          `Se omite reserva: usuario ${item.userId} o pista ${item.courtId} no existen.`,
        );
        continue;
      }

      // 2. Evitamos duplicados (usuario + pista + fecha + hora inicio)
      const existing = await reservationRepository.findOne({
        where: {
          userId: user.id,
          courtId: item.courtId,
          startTime: item.startTime,
        },
      });

      if (existing) continue;

      // 3. Cálculo manual de precio para la carga inicial (replicando el servicio)
      const [hInicio, mInicio] = item.startTime.split(':').map(Number);
      const [hFin, mFin] = item.endTime.split(':').map(Number);
      const totalMinutos = hFin * 60 + mFin - (hInicio * 60 + mInicio);

      let precioCalculado = 0;
      if (totalMinutos > 0) {
        const duracionHoras = totalMinutos / 60;
        // Usamos el pricePerHour de la pista encontrada
        precioCalculado = Number((duracionHoras * court.pricePerHour).toFixed(2));
      }

      // 4. Mapeo a la entidad
      const reservationEntry = new Reservation();
      reservationEntry.userId = user.id;
      reservationEntry.courtId = court.id;
      reservationEntry.reservationDate = item.reservationDate;
      reservationEntry.startTime = item.startTime;
      reservationEntry.endTime = item.endTime;
      reservationEntry.status = item.status;
      reservationEntry.note = item.note || 'Datos de seed';
      reservationEntry.totalPrice = precioCalculado; // Campo obligatorio

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
