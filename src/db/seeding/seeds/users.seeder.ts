import { DataSource } from "typeorm";
import { Seeder } from 'typeorm-extension';
import userData from '../../../data_info/inventory_users';
import { User } from '../../../users/user.entity';
import * as bcrypt from 'bcryptjs';


export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const userEntries = await Promise.all(
      userData.map(async (item) => {
        const userEntry = new User();
        userEntry.name = item.name;
        userEntry.surname = item.surname;
        const passwordHash = await bcrypt.hash(item.password, 10);
        userEntry.password = passwordHash;
        userEntry.email = item.email;
        userEntry.phone = item.phone;
        userEntry.role = item.role
        userEntry.isActive = item.isActive;
        userEntry.fecha_registro = item.fecha_registro;
        userEntry.fecha_ultimo_login = item.fecha_ultimo_login;
        userEntry.fecha_nacimiento = item.fecha_nacimiento;
        userEntry.direccion = item.direccion; 
        return userEntry;
      }),
    );

    await userRepository.save(userEntries);

    console.log('Users seeding completed!');
  }
}