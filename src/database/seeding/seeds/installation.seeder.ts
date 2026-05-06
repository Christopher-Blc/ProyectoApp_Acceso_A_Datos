import {
  Installation,
  InstallationStatus,
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
      installationEntry.name = item.name;
      installationEntry.address = item.address;
      installationEntry.phone = item.phone;
      installationEntry.email = item.email;
      installationEntry.description = item.description;

      // La fecha de creación tiene CURRENT_DATE por defecto,
      // pero la asignamos si viene en el inventario
      installationEntry.createdAt = item.createdAt
        ? new Date(item.createdAt)
        : new Date();

      // El estado usa el enum InstallationStatus
      installationEntry.status = item.status || InstallationStatus.INACTIVE;

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
