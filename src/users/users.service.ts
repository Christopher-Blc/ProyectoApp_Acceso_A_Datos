import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// Marca esta clase como injectable, para que pueda ser inyectada en controllers
@Injectable()
export class UsersService {
  constructor(
    // Inyecta el repositorio de TypeORM para la entidad User
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Trae todos los usuarios de la base de datos
   * Incluye las relaciones para obtener notificaciones, comentarios, pagos, reservas y membresia
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['notificaciones', 'comentarios', 'pagos', 'reservas', 'membresia'],
    });
  }

  /**
   * Trae un usuario específico por su ID
   * Devuelve null si no se encuentra
   */
  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { usuario_id: id },
      relations: ['notificaciones', 'comentarios', 'pagos', 'reservas', 'membresia'],
    });
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param userData: datos del usuario a crear
   * @returns el usuario creado y guardado en la base de datos
   */
  create(userData: Partial<User>): Promise<User> {
    // Crea una instancia de User con los datos recibidos (sin guardarla aún)
    const user = this.usersRepository.create(userData);

    // Guarda la entidad en la base de datos y devuelve el usuario completo
    return this.usersRepository.save(user);
  }

  /**
   * Actualiza un usuario existente
   * @param id: ID del usuario
   * @param userData: datos a actualizar
   * @returns el usuario actualizado o null si no existe
   */
  async update(id: number, userData: Partial<User>): Promise<User | null> {
    // Busca primero el usuario en la base de datos
    const user = await this.usersRepository.findOneBy({ usuario_id: id });

    // Si no existe, devuelve null
    if (!user) return null;

    // Actualiza los campos del usuario con los datos recibidos
    Object.assign(user, userData);

    // Guarda los cambios en la base de datos y devuelve la entidad actualizada
    return this.usersRepository.save(user);
  }

  /**
   * Elimina un usuario por su ID
   * @param id: ID del usuario a eliminar
   * @returns true si se eliminó, false si no existía
   */
  async remove(id: number): Promise<boolean> {
    // Busca el usuario en la base de datos
    const user = await this.usersRepository.findOneBy({ usuario_id: id });

    // Si no existe, devuelve false
    if (!user) return false;

    // Elimina el usuario encontrado de la base de datos
    await this.usersRepository.remove(user);

    // Devuelve true indicando que la eliminación fue exitosa
    return true;
  }
}
