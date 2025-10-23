import { DataSource } from 'typeorm';
import { resetEnv, Seeder } from 'typeorm-extension';
import { Reserva } from 'src/reserva/reserva.entity';
import reservaData from '../../../data_info/inventory_reserva';

export class ReservaSeeder implements Seeder {
     public async run(dataSource: DataSource): Promise<any> {
        const reservaRepository = dataSource.getRepository(Reserva);

    const reservaEntries = await Promise.all(
      reservaData.map(async (item) => {
        const reservaEntry = new Reserva();

       reservaEntry.fecha_reserva = item.fecha_reserva;
       reservaEntry.fecha_inicio = item.fecha_inicio;
       reservaEntry.fecha_fin = item.fecha_fin;
       reservaEntry.estado = item.estado;
       reservaEntry.precio_total = item.precio_final;
       reservaEntry.fecha_creacion = item.fecha_creacion;
       reservaEntry.codigo_reserva = item.codigo_reserva;
       reservaEntry.nota = item.nota;

        return reservaEntry;
      }),
    );

    await reservaRepository.save(reservaEntries);

    console.log('Users seeding completed!');
  }
}
     