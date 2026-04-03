import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Reserva, estadoReserva } from '../../../modules/reserva/entities/reserva.entity';
import reservaData from '../../inventory/inventory_reserva';
import { User } from '../../../modules/users/entities/user.entity';
import { Pista } from '../../../modules/pista/entities/pista.entity';

export class ReservaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const reservaRepository = dataSource.getRepository(Reserva);
    const userRepository = dataSource.getRepository(User);
    const pistaRepository = dataSource.getRepository(Pista);

    const reservaEntries: Reserva[] = [];

    for (const item of reservaData) {
      // 1. Buscamos el Usuario y la Pista
      const user = await userRepository.findOneBy({ usuario_id: Number(item.usuario_id) });
      const pista = await pistaRepository.findOneBy({ pista_id: Number(item.pista_id) });

      if (!user || !pista) {
        console.warn(`Saltando reserva: Usuario ${item.usuario_id} o Pista ${item.pista_id} no existen.`);
        continue;
      }

      // 2. Evitamos duplicados
      const existing = await reservaRepository.findOne({
        where: { 
          usuario_id: user.usuario_id,
          pista_id: pista.pista_id,
          fecha_reserva: item.fecha_reserva,
          hora_inicio: item.hora_inicio
        },
      });
      
      if (existing) continue;

      //Calculamos el precio (Copiando la lógica del Service)
      const [hInicio, mInicio] = item.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = item.hora_fin.split(':').map(Number);
      const totalMinutos = (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
      
      let precioCalculado = 0;
      if (totalMinutos > 0) {
        const duracionHoras = totalMinutos / 60;
        precioCalculado = Number((duracionHoras * pista.precio_hora).toFixed(2));
      }

      const reservaEntry = new Reserva();
      reservaEntry.usuario_id = user.usuario_id;
      reservaEntry.pista_id = pista.pista_id;
      reservaEntry.fecha_reserva = item.fecha_reserva;
      reservaEntry.hora_inicio = item.hora_inicio; 
      reservaEntry.hora_fin = item.hora_fin; 
      reservaEntry.estado = item.estado as estadoReserva;
      reservaEntry.nota = item.nota || 'Seed data';
      reservaEntry.precio_total = precioCalculado; 

      reservaEntries.push(reservaEntry);
    }

    if (reservaEntries.length > 0) {
      await reservaRepository.save(reservaEntries);
      console.log(`${reservaEntries.length} reservas creadas correctamente.`);
    }
  }
}