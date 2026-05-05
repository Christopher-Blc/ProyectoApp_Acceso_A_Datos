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
        usuario_id: Number(item.usuario_id),
      });
      const court = await courtRepository.findOneBy({
        pista_id: Number(item.pista_id),
      });

      if (!user || !court) {
        console.warn(
          `Se omite reserva: usuario ${item.usuario_id} o pista ${item.pista_id} no existen.`,
        );
        continue;
      }

      // 2. Evitamos duplicados (usuario + pista + fecha + hora inicio)
      const existing = await reservationRepository.findOne({
        where: {
          usuario_id: user.usuario_id,
          pista_id: item.pista_id,
          hora_inicio: item.hora_inicio,
        },
      });

      if (existing) continue;

      // 3. Cálculo manual de precio para la carga inicial (replicando el servicio)
      const [hInicio, mInicio] = item.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = item.hora_fin.split(':').map(Number);
      const totalMinutos = hFin * 60 + mFin - (hInicio * 60 + mInicio);

      let precioCalculado = 0;
      if (totalMinutos > 0) {
        const duracionHoras = totalMinutos / 60;
        // Usamos el precio_hora de la pista encontrada
        precioCalculado = Number(
          (duracionHoras * court.precio_hora).toFixed(2),
        );
      }

      // 4. Mapeo a la entidad
      const reservationEntry = new Reservation();
      reservationEntry.usuario_id = user.usuario_id;
      reservationEntry.pista_id = court.pista_id;
      reservationEntry.fecha_Reservation = item.fecha_Reservation;
      reservationEntry.hora_inicio = item.hora_inicio;
      reservationEntry.hora_fin = item.hora_fin;
      reservationEntry.estado = item.estado;
      reservationEntry.nota = item.nota || 'Datos de seed';
      reservationEntry.precio_total = precioCalculado; // Campo obligatorio

      reservationEntries.push(reservationEntry);
    }

    if (reservationEntries.length > 0) {
      await reservationRepository.save(reservationEntries);
      console.log(`${reservationEntries.length} reservas creadas correctamente.`);
    }
    console.log('Seed de reservas completado.');
  }
}




