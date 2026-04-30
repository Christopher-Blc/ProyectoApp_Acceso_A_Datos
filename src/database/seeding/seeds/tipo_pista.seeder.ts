import { TipoPista } from '../../../modules/tipo_pista/entities/tipo_pista.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import tipoPistaData from '../../inventory/inventory_tipo_pista';

export class TipoPistaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const tipoPistaRepository = dataSource.getRepository(TipoPista);

    const entries: TipoPista[] = [];

    for (const item of tipoPistaData) {
      // We search by name to avoid duplicates
      const existing = await tipoPistaRepository.findOne({
        where: { nombre: item.nombre },
      });

      if (existing) continue;

      const entry = new TipoPista();
      // Only has id (auto) and name according to your Entity
      entry.nombre = item.nombre;
      entry.imagen = item.imagen;

      entries.push(entry);
    }

    if (entries.length > 0) {
      await tipoPistaRepository.save(entries);
      console.log(`${entries.length} pista types created.`);
    }
    console.log('TipoPista seeding completed!');
  }
}
