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
      // Buscamos por email para evitar duplicados [cite: 151]
      const existing = await instalacionRepository.findOne({
        where: { email: item.email },
      });

      if (existing) {
        continue;
      }

      const instalacionEntry = new Instalacion();
      // Campos que existen en tu Entity [cite: 151]
      instalacionEntry.nombre = item.nombre;
      instalacionEntry.direccion = item.direccion;
      instalacionEntry.telefono = item.telefono;
      instalacionEntry.email = item.email;
      instalacionEntry.descripcion = item.descripcion;

      // La fecha de creación tiene un default CURRENT_DATE,
      // pero la asignamos si viene en el inventario
      instalacionEntry.fecha_creacion = item.fecha_creacion
        ? new Date(item.fecha_creacion)
        : new Date();

      // El estado usa el enum estado_instalacion
      instalacionEntry.estado = item.estado || estado_instalacion.INACTIVA;

      instalacionEntries.push(instalacionEntry);
    }

    if (instalacionEntries.length > 0) {
      await instalacionRepository.save(instalacionEntries);
      console.log(`${instalacionEntries.length} instalaciones creadas.`);
    } else {
      console.log('No hay nuevas instalaciones para seedear.');
    }
    console.log('Instalacion seeding completado!');
  }
}
