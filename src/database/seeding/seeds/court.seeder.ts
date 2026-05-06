import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import courtData from '../../inventory/inventory_court';
import { Court } from '../../../modules/court/entities/court.entity';

export class CourtSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const courtRepository = dataSource.getRepository(Court);

    const courtEntries: Court[] = [];

    for (const item of courtData) {
      // Buscamos duplicados según la restricción @Unique de la entidad
      const existing = await courtRepository.findOne({
        where: {
          name: item.name,
          installationId: item.installationId,
          dayOfWeek: item.dayOfWeek,
        },
      });

      if (existing) {
        continue;
      }

      const courtEntry = new Court();
      // Asignación de campos según la entidad
      courtEntry.installationId = item.installationId;
      courtEntry.courtTypeId = item.courtTypeId;
      courtEntry.name = item.name;
      courtEntry.capacity = item.capacity;
      courtEntry.pricePerHour = item.pricePerHour;
      courtEntry.isCovered = item.isCovered; // booleano
      courtEntry.hasLighting = item.hasLighting;
      courtEntry.description = item.description;
      courtEntry.status = item.status!;
      courtEntry.openingTime = item.openingTime!;
      courtEntry.closingTime = item.closingTime!;
      courtEntry.dayOfWeek = item.dayOfWeek!;
      courtEntry.reservationsMade = item.reservationsMade;

      courtEntries.push(courtEntry);
    }

    if (courtEntries.length > 0) {
      await courtRepository.save(courtEntries);
      console.log(`${courtEntries.length} pistas created.`);
    }
    console.log('Court seeding completed!');
  }
}
