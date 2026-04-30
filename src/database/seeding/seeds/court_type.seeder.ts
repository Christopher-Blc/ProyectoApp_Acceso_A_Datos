import { TipoCourt } from '../../../modules/court_type/entities/court_type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import tipoPistaData from '../../inventory/inventory_tipo_pista';

export class TipoPistaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const tipoPistaRepository = dataSource.getRepository(TipoCourt);

    const entries: TipoCourt[] = [];

    for (const item of tipoPistaData) {
      // We search by name to avoid duplicates
      const existing = await tipoPistaRepository.findOne({
        where: { nombre: item.nombre },
      });

      if (existing) continue;

      const entry = new CourtType();
      // Only has id (auto) and name according to your Entity
      entry.nombre = item.nombre;
      entry.imagen = item.imagen;

      entries.push(entry);
    }

    if (entries.length > 0) {
      await tipoPistaRepository.save(entries);
      console.log(`${entries.length} Court types created.`);
    }
    console.log('TipoCourt seeding completed!');
  }
}


