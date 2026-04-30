import { Membresia } from '../../../modules/membresia/entities/membresia.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import membresiaData from '../../inventory/inventory_membresia';

export class MembresiaSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const membresiaRepository = dataSource.getRepository(Membresia);

    const membresiaEntries: Membresia[] = [];

    for (const item of membresiaData) {
      // Buscamos por nombre (Bronce, Plata, Oro) para evitar duplicados exactos
      const existing = await membresiaRepository.findOne({
        where: { nombre: item.nombre },
      });

      if (existing) {
        continue;
      }

      const membresiaEntry = new Membresia();
      // Mapeo directo a las columnas de la Entity
      membresiaEntry.rango = item.rango;
      membresiaEntry.nombre = item.nombre;
      membresiaEntry.descuento = item.descuento;
      membresiaEntry.reservas_requeridas = item.reservas_requeridas;
      membresiaEntry.beneficios = item.beneficios;

      membresiaEntries.push(membresiaEntry);
    }

    if (membresiaEntries.length > 0) {
      await membresiaRepository.save(membresiaEntries);
      console.log(`${membresiaEntries.length} rangos de membresía creados.`);
    }
    console.log('Membresia seeding completado!');
  }
}
