import {
  Instalacion,
  estado_instalacion,
} from '../../../modules/instalacion/entities/instalacion.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import instalacionData from '../../inventory/inventory_instalacion';

export class InstalacionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const instalacionRepository = dataSource.getRepository(Instalacion);

    const instalacionEntries: Instalacion[] = [];

    for (const item of instalacionData) {
      // We search by email to avoid duplicates [cite: 151]
      const existing = await instalacionRepository.findOne({
        where: { email: item.email },
      });

      if (existing) {
        continue;
      }

      const instalacionEntry = new Instalacion();
      // Fields that exist in your Entity [cite: 151]
      instalacionEntry.nombre = item.nombre;
      instalacionEntry.direccion = item.direccion;
      instalacionEntry.telefono = item.telefono;
      instalacionEntry.email = item.email;
      instalacionEntry.descripcion = item.descripcion;

      // Creation date has a default CURRENT_DATE,
      // but we assign it if it comes from inventory
      instalacionEntry.fecha_creacion = item.fecha_creacion
        ? new Date(item.fecha_creacion)
        : new Date();

      // Status uses the estado_instalacion enum
      instalacionEntry.estado = item.estado || estado_instalacion.INACTIVA;

      instalacionEntries.push(instalacionEntry);
    }

    if (instalacionEntries.length > 0) {
      await instalacionRepository.save(instalacionEntries);
      console.log(`${instalacionEntries.length} facilities created.`);
    } else {
      console.log('No new facilities to seed.');
    }
    console.log('Instalacion seeding completed!');
  }
}
