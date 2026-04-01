import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Reserva } from '../../../modules/reserva/entities/reserva.entity';
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
      // Nota: Como quitamos 'codigo_reserva' de la entidad, 
      // validamos por combinacion de usuario, pista y fecha para evitar duplicados en el seed
      const existing = await reservaRepository.findOne({
        where: { 
          usuario_id: Number(item.usuario_id),
          pista_id: Number(item.pista_id),
          fecha_reserva: item.fecha_reserva 
        },
      });
      
      if (existing) {
        continue;
      }

      const reservaEntry = new Reserva();
      reservaEntry.fecha_reserva = item.fecha_reserva;
      reservaEntry.hora_inicio = item.hora_inicio; 
      reservaEntry.hora_fin = item.hora_fin; 
      reservaEntry.estado = item.estado;
      reservaEntry.nota = item.nota;

      // Busqueda de Usuario
      if (item.usuario_id) {
        const user = await userRepository.findOneBy({ usuario_id: Number(item.usuario_id) });
        if (user) {
          reservaEntry.usuario_id = user.usuario_id;
        }
      }

      // Busqueda de Pista
      if (item.pista_id) {
        const pista = await pistaRepository.findOneBy({ pista_id: Number(item.pista_id) });
        if (pista) {
          reservaEntry.pista_id = pista.pista_id;
        }
      }

      // Fallback: Si no hay IDs validos, asignamos los primeros que encontremos (para que el seed no falle)
      if (!reservaEntry.pista_id) {
        const anyPista = await pistaRepository.findOne({ where: {} });
        if (anyPista) reservaEntry.pista_id = anyPista.pista_id;
      }

      if (!reservaEntry.usuario_id) {
        const anyUser = await userRepository.findOne({ where: {} });
        if (anyUser) reservaEntry.usuario_id = anyUser.usuario_id;
      }

      if (reservaEntry.usuario_id && reservaEntry.pista_id) {
        reservaEntries.push(reservaEntry);
      }
    }

    if (reservaEntries.length > 0) {
      await reservaRepository.save(reservaEntries);
    }

    console.log('Reserva seeding completado!');
  }
}