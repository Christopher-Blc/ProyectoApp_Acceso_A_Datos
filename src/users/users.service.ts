// Importamos el decorador Injectable para poder inyectar este servicio en otros módulos
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importamos la entidad User, que representa la tabla en la base de datos
import { User } from './user.entity';

// El decorador @Injectable() le dice a Nest que esta clase puede ser inyectada
// en otras clases (por ejemplo, en el controlador)
@Injectable()
export class UsersService {
  // En el constructor, declaramos las dependencias que queremos que NestJS inyecte automáticamente.
  // En este caso, el repositorio de la entidad User.
  constructor(
    // @InjectRepository(User) indica que queremos el repositorio de esta entidad.
    // NestJS creará una instancia del repositorio correspondiente y la inyectará aquí.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Repositorio genérico de TypeORM para la entidad User
  ) {}

  // 🔹 Método para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    // Llamamos al método find() de TypeORM para traer todos los usuarios
    // Incluimos las relaciones (por ejemplo, las reservas del usuario)
    return this.userRepository.find({ relations: ['reservas', 'membresia', 'pago', 'comentario'] });
  }

  // 🔹 Método para obtener un usuario por su ID
  async findOne(usuario_id: number): Promise<User> {
    // findOne busca un registro que cumpla la condición `where: { id }`
    // También cargamos las reservas relacionadas con ese usuario
    const user = await this.userRepository.findOne({
      where: { usuario_id: usuario_id },
      relations: ['reservas', 'membresia', 'pago', 'comentario'],
    });
    if (!user) {
      throw new Error(`Usuario ${usuario_id} no encontrado`); // Lanzamos un error si no se encuentra el usuario
    }
    return user;
  }

  // Método para crear un nuevo usuario
  async create(data: Partial<User>) {
    // "create" crea una instancia del objeto User (no la guarda todavía)
    const user = this.userRepository.create(data);
    // "save" guarda el usuario en la base de datos
    return this.userRepository.save(user);
  }

  // Método para actualizar un usuario existente
  async update(usuario_id: number, data: Partial<User>) {
    // "update" modifica los campos en la base de datos
    await this.userRepository.update(usuario_id, data);
    // Retornamos el usuario actualizado
    return this.findOne(usuario_id);
  }

  // 🔹 Método para eliminar un usuario por ID
  async remove(usuario_id: number): Promise<void> {
    // Borramos el registro que tenga el ID indicado
    await this.userRepository.delete(usuario_id);
  }
}
