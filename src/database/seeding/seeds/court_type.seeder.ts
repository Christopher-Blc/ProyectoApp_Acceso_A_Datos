import { CourtType } from '../../../modules/court_type/entities/court_type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import courtTypeData from '../../inventory/inventory_court_type';

export class CourtTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const courtTypeRepository = dataSource.getRepository(CourtType);

    const entries: CourtType[] = [];

    for (const item of courtTypeData) {
      // Buscamos por nombre para evitar duplicados
      const existing = await courtTypeRepository.findOne({
        where: { nombre: item.nombre },
      });

      if (existing) continue;

      const entry = new CourtType();
      // Solo tiene id (auto), nombre e imagen según la entidad
      entry.nombre = item.nombre;
      entry.imagen = item.imagen;

      entries.push(entry);
    }

    if (entries.length > 0) {
      await courtTypeRepository.save(entries);
      console.log(`${entries.length} Court types created.`);
    }
    console.log('CourtType seeding completed!');
  }
}
