import { DataSource } from "typeorm";
import { Seeder } from 'typeorm-extension';
import userData from '../../inventory/inventory_users';
import { User } from '../../../modules/users/entities/user.entity';
import { Membresia } from "../../../modules/membresia/entities/membresia.entity"; // Ajusta la ruta
import * as bcrypt from 'bcryptjs';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const membresiaRepository = dataSource.getRepository(Membresia);

    // 1. Buscamos la membresía inicial (Bronce/Rango 1)
    // Buscamos la que pida 0 reservas para que todos empiecen ahí
    const membresiaInicial = await membresiaRepository.findOne({
      where: { reservas_requeridas: 0 },
      order: { membresia_id: 'ASC' }
    });

    const userEntries: User[] = [];

    for (const item of userData) {
      // Comprobamos si ya existe por email o por username
      const existing = await userRepository.findOne({ 
        where: [
          { email: item.email },
          { username: item.username }
        ] 
      });
      
      if (existing) {
        continue;
      }

      const userEntry = new User();
      // Campos obligatorios nuevos y existentes
      userEntry.username = item.username; 
      userEntry.name = item.name;
      userEntry.surname = item.surname;
      
      const passwordHash = await bcrypt.hash(item.password, 10);
      userEntry.password = passwordHash;
      
      userEntry.email = item.email;
      userEntry.phone = item.phone;
      userEntry.role = item.role;
      userEntry.isActive = item.isActive ?? true;
      
      // Asignación de membresía inicial
      if (membresiaInicial) {
        userEntry.membresia_id = membresiaInicial.membresia_id;
      }

      // Fechas
      userEntry.fecha_registro = item.fecha_registro || new Date();
      userEntry.fecha_ultimo_login = item.fecha_ultimo_login || new Date();
      userEntry.fecha_nacimiento = new Date(item.fecha_nacimiento);
      userEntry.direccion = item.direccion;

      userEntries.push(userEntry);
    }

    if (userEntries.length > 0) {
      // Usamos insert o save. Save disparará suscriptores si los tienes.
      await userRepository.save(userEntries);
      console.log(`${userEntries.length} users seeded successfully!`);
    } else {
      console.log('No new users to seed.');
    }
  }
}