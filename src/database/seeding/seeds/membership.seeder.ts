import { Membership } from '../../../modules/membership/entities/membership.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import membershipData from '../../inventory/inventory_membership';

export class MembershipSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const membershipRepository = dataSource.getRepository(Membership);

    const membershipEntries: Membership[] = [];

    for (const item of membershipData) {
      // Buscamos por tipo (Bronce, Plata, Oro) para evitar duplicados exactos
      const existing = await membershipRepository.findOne({
        where: { tipo: item.tipo },
      });

      if (existing) {
        continue;
      }

      const membershipEntry = new Membership();
      // Mapeo directo a las columnas de la entidad
      membershipEntry.rango = item.rango;
      membershipEntry.tipo = item.tipo;
      membershipEntry.descuento = item.descuento;
      membershipEntry.reservas_requeridas = item.reservas_requeridas;
      membershipEntry.beneficios = item.beneficios;

      membershipEntries.push(membershipEntry);
    }

    if (membershipEntries.length > 0) {
      await membershipRepository.save(membershipEntries);
      console.log(`${membershipEntries.length} membership levels created.`);
    }
    console.log('Membership seeding completed!');
  }
}


