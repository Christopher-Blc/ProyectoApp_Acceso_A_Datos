import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../../inventory/inventory_users';
import { User } from '../../../modules/users/entities/user.entity';
import { Membership } from '../../../modules/membership/entities/membership.entity';
import * as bcrypt from 'bcryptjs';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const membresiaRepository = dataSource.getRepository(Membresia);

    // 1. We search for the initial membership (reservas_requeridas: 0) [cite: 158]
    const membresiaInicial = await membresiaRepository.findOne({
      where: { reservas_requeridas: 0 },
      order: { membresia_id: 'ASC' },
    });

    const userEntries: User[] = [];

    for (const item of userData) {
      // We check if it already exists by email or username to avoid duplicates
      const existing = await userRepository.findOne({
        where: [{ email: item.email }, { username: item.username }],
      });

      if (existing) continue;

      const userEntry = new User();
      // Direct mapping to the Entity [cite: 216-224]
      userEntry.username = item.username;
      userEntry.name = item.name;
      userEntry.surname = item.surname;
      userEntry.email = item.email;
      userEntry.phone = item.phone;
      userEntry.direccion = item.direccion;
      userEntry.role = item.role;
      userEntry.isActive = item.isActive ?? true;

      // We encrypt the password so that Login works afterwards
      userEntry.password = await bcrypt.hash(item.password, 10);

      // Mandatory membership assignment for the ranking system
      if (membresiaInicial) {
        userEntry.membresia_id = membresiaInicial.membresia_id;
      }

      // Dates (we ensure Date object) [cite: 221-223]
      userEntry.fecha_registro = item.fecha_registro || new Date();
      userEntry.fecha_ultimo_login = item.fecha_ultimo_login || new Date();
      userEntry.fecha_nacimiento = new Date(item.fecha_nacimiento);

      userEntries.push(userEntry);
    }

    if (userEntries.length > 0) {
      await userRepository.save(userEntries);
      console.log(`${userEntries.length} users created successfully.`);
    }
    console.log('User seeding completed!');
  }
}

