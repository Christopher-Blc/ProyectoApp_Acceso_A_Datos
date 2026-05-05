import {
  Installation,
  estado_instalacion,
} from '../../../modules/installation/entities/installation.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import installationData from '../../inventory/inventory_installation';

export class InstallationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const installationRepository = dataSource.getRepository(Installation);

    const installationEntries: Installation[] = [];

    for (const item of installationData) {
      // Buscamos por email para evitar duplicados [cite: 151]
      const existing = await installationRepository.findOne({
        where: { email: item.email },
      });

      if (existing) {
        continue;
      }

      const installationEntry = new Installation();
      // Campos que existen en la entidad
      installationEntry.nombre = item.nombre;
      installationEntry.direccion = item.direccion;
      installationEntry.telefono = item.telefono;
      installationEntry.email = item.email;
      installationEntry.descripcion = item.descripcion;

      // La fecha de creación tiene CURRENT_DATE por defecto,
      // pero la asignamos si viene en el inventario
      installationEntry.fecha_creacion = item.fecha_creacion
        ? new Date(item.fecha_creacion)
        : new Date();

      // El estado usa el enum estado_instalacion
      installationEntry.estado = item.estado || estado_instalacion.INACTIVA;

      installationEntries.push(installationEntry);
    }

    if (installationEntries.length > 0) {
      await installationRepository.save(installationEntries);
      console.log(`${installationEntries.length} facilities created.`);
    } else {
      console.log('No new facilities to seed.');
    }
    console.log('Installation seeding completed!');
  }
}



