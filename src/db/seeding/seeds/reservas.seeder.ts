import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Reserva } from '../../../reserva/reserva.entity';
import reservaData from '../../../data_info/inventory_reserva';
import { User } from '../../../users/user.entity';
import { Pista } from '../../../pista/pista.entity';

export class ReservaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const reservaRepository = dataSource.getRepository(Reserva);
    const userRepository = dataSource.getRepository(User);
    const pistaRepository = dataSource.getRepository(Pista);

    const reservaEntries: Reserva[] = [];

    for (const item of reservaData) {
      const existing = await reservaRepository.findOne({
        where: { codigo_reserva: item.codigo_reserva },
      });
      if (existing) {
        continue;
      }

      const reservaEntry = new Reserva();
      reservaEntry.fecha_reserva = item.fecha_reserva;
      reservaEntry.fecha_inicio = item.fecha_inicio;
      reservaEntry.fecha_fin = item.fecha_fin;
      reservaEntry.estado = item.estado;
      reservaEntry.precio_total = item.precio_final;
      reservaEntry.fecha_creacion = item.fecha_creacion;
      reservaEntry.codigo_reserva = item.codigo_reserva;
      reservaEntry.nota = item.nota;

      if (item.usuario_id) {
        const user = await userRepository.findOneBy({ usuario_id: Number(item.usuario_id) });
        if (user) {
          reservaEntry.usuario = user;
          reservaEntry.usuario_id = Number(item.usuario_id);
        }
      }

      if (item.pista_id) {
        const pista = await pistaRepository.findOneBy({ pista_id: Number(item.pista_id) });
        if (pista) {
          reservaEntry.pista = pista;
          reservaEntry.pista_id = Number(item.pista_id);
        }
      }

      if (!reservaEntry.pista_id) {
        const anyPistas = await pistaRepository.find({ take: 1 });
        const anyPista = anyPistas && anyPistas.length ? anyPistas[0] : null;
        if (anyPista) {
          reservaEntry.pista = anyPista;
          reservaEntry.pista_id = anyPista.pista_id;
        }
      }

      if (!reservaEntry.usuario_id) {
        const anyUsers = await userRepository.find({ take: 1 });
        const anyUser = anyUsers && anyUsers.length ? anyUsers[0] : null;
        if (anyUser) {
          reservaEntry.usuario = anyUser;
          reservaEntry.usuario_id = anyUser.usuario_id;
        }
      }

      reservaEntries.push(reservaEntry);
    }

    if (reservaEntries.length > 0) {
      await reservaRepository.save(reservaEntries);
    }

    console.log('Reserva seeding completado!');
  }
}
     