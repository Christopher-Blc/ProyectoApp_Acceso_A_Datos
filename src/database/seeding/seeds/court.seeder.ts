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
          installation_id: item.installation_id,
          day_of_week: item.day_of_week,
        },
      });

      if (existing) {
        continue;
      }

      const courtEntry = new Court();
      // Asignación de campos según la entidad
      courtEntry.installation_id = item.installation_id;
      courtEntry.court_type_id = item.court_type_id;
      courtEntry.name = item.name;
      courtEntry.capacity = item.capacity;
      courtEntry.price_per_hour = item.price_per_hour;
      courtEntry.covered = item.covered; // booleano
      courtEntry.lighting = item.lighting;
      courtEntry.description = item.description;
      courtEntry.status = item.status!;
      courtEntry.opening_time = item.opening_time!;
      courtEntry.closing_time = item.closing_time!;
      courtEntry.day_of_week = item.day_of_week!;
      courtEntry.reservations_made = item.reservations_made;

      courtEntries.push(courtEntry);
    }

    if (courtEntries.length > 0) {
      await courtRepository.save(courtEntries);
      console.log(`${courtEntries.length} courts created.`);
    }
    console.log('Court seeding completed!');
  }
}
