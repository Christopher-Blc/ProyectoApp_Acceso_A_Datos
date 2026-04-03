import { DataSource } from "typeorm";
import { Seeder } from 'typeorm-extension';
import userData from '../../inventory/inventory_users';
import { User } from '../../../modules/users/entities/user.entity';
import { Membresia } from "../../../modules/membresia/entities/membresia.entity";
import * as bcrypt from 'bcryptjs';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const membresiaRepository = dataSource.getRepository(Membresia);

    // 1. Buscamos la membresía inicial (reservas_requeridas: 0) [cite: 158]
    const membresiaInicial = await membresiaRepository.findOne({
      where: { reservas_requeridas: 0 },
      order: { membresia_id: 'ASC' }
    });

    const userEntries: User[] = [];

    for (const item of userData) {
      // Comprobamos si ya existe por email o por username para evitar duplicados 
      const existing = await userRepository.findOne({ 
        where: [
          { email: item.email },
          { username: item.username }
        ] 
      });
      
      if (existing) continue;

      const userEntry = new User();
      // Mapeo directo a la Entity [cite: 216-224]
      userEntry.username = item.username; 
      userEntry.name = item.name;
      userEntry.surname = item.surname;
      userEntry.email = item.email;
      userEntry.phone = item.phone;
      userEntry.direccion = item.direccion;
      userEntry.role = item.role;
      userEntry.isActive = item.isActive ?? true;
      
      // Encriptamos la contraseña para que el Login funcione después
      userEntry.password = await bcrypt.hash(item.password, 10);
      
      // Asignación de membresía obligatoria para el sistema de rangos 
      if (membresiaInicial) {
        userEntry.membresia_id = membresiaInicial.membresia_id;
      }

      // Fechas (aseguramos objeto Date) [cite: 221-223]
      userEntry.fecha_registro = item.fecha_registro || new Date();
      userEntry.fecha_ultimo_login = item.fecha_ultimo_login || new Date();
      userEntry.fecha_nacimiento = new Date(item.fecha_nacimiento);

      userEntries.push(userEntry);
    }

    if (userEntries.length > 0) {
      await userRepository.save(userEntries);
      console.log(`${userEntries.length} usuarios creados correctamente.`);
    }
    console.log("User seeding completado!");
  }
}