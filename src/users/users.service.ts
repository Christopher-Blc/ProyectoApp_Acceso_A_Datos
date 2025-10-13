// Importamos los decoradores y clases necesarios desde Nest y TypeORM
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

  // Método para obtener todos los usuarios
  // "relations" indica qué relaciones de la entidad también queremos traer (por ejemplo, posts o perfil)
  findAll() {
    return this.userRepository.find({
      relations: ['Noti', 'profile'],
    });
  }

  // Método para buscar un usuario específico por ID
  findOne(usuario_id: number) {
    return this.userRepository.findOne({
      where: { usuario_id }, // Condición para buscar el usuario
      relations: ['Noti', 'profile'], // También traemos las relaciones
    });
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

  // Método para eliminar un usuario por ID
  async remove(id: number) {
    // "delete" elimina el registro
    await this.userRepository.delete(id);
    // Retornamos un mensaje de confirmación
    return { deleted: true };
  }
}
