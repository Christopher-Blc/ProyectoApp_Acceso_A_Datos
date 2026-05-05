import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../../inventory/inventory_users';
import { User } from '../../../modules/users/entities/user.entity';
import { Membership } from '../../../modules/membership/entities/membership.entity';
import * as bcrypt from 'bcryptjs';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const membershipRepository = dataSource.getRepository(Membership);

    // 1. Buscamos la membresía inicial (required_reservations: 0)
    const membershipInicial = await membershipRepository.findOne({
      where: { required_reservations: 0 },
      order: { membership_id: 'ASC' },
    });

    const userEntries: User[] = [];

    for (const item of userData) {
      // Verificamos si ya existe por email o username para evitar duplicados
      const existing = await userRepository.findOne({
        where: [{ email: item.email }, { username: item.username }],
      });

      if (existing) continue;

      const userEntry = new User();
      // Mapeo directo a la entidad
      userEntry.username = item.username;
      userEntry.name = item.name;
      userEntry.surname = item.surname;
      userEntry.email = item.email;
      userEntry.phone = item.phone;
      userEntry.address = item.address!;
      userEntry.role = item.role;
      userEntry.isActive = item.isActive ?? true;

      // Encriptamos la contraseña para que Login funcione después
      userEntry.password = await bcrypt.hash(item.password, 10);

      // Asignación obligatoria de membresía para el sistema de ranking
      if (membershipInicial) {
        userEntry.Membership_id = membershipInicial.membership_id;
      }

      // Fechas (aseguramos objeto Date)
      userEntry.registration_date = item.registration_date || new Date();
      userEntry.last_login_date = item.last_login_date || new Date();
      userEntry.date_of_birth = new Date(item.date_of_birth!);

      userEntries.push(userEntry);
    }

    if (userEntries.length > 0) {
      await userRepository.save(userEntries);
      console.log(`${userEntries.length} users created successfully.`);
    }
    console.log('User seeding completed!');
  }
}

