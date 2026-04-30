import { Membresia } from '../../../modules/membresia/entities/membresia.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import membresiaData from '../../inventory/inventory_membresia';

export class MembresiaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const membresiaRepository = dataSource.getRepository(Membresia);

    const membresiaEntries: Membresia[] = [];

    for (const item of membresiaData) {
      // We search by type (Bronze, Silver, Gold) to avoid exact duplicates
      const existing = await membresiaRepository.findOne({
        where: { tipo: item.tipo },
      });

      if (existing) {
        continue;
      }

      const membresiaEntry = new Membresia();
      // Direct mapping to the Entity columns
      membresiaEntry.rango = item.rango;
      membresiaEntry.tipo = item.tipo;
      membresiaEntry.descuento = item.descuento;
      membresiaEntry.reservas_requeridas = item.reservas_requeridas;
      membresiaEntry.beneficios = item.beneficios;

      membresiaEntries.push(membresiaEntry);
    }

    if (membresiaEntries.length > 0) {
      await membresiaRepository.save(membresiaEntries);
      console.log(`${membresiaEntries.length} membership levels created.`);
    }
    console.log('Membresia seeding completed!');
  }
}
