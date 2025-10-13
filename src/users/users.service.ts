<<<<<<< HEAD
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
=======
// Importamos el decorador Injectable para poder inyectar este servicio en otros módulos
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './users.dto';

@Injectable() // Este decorador indica que esta clase puede ser inyectada como servicio en otros lugares (como en controladores)
export class UserService {
  // El constructor recibe el repositorio de la entidad User
  // @InjectRepository(User) inyecta automáticamente la conexión a la tabla correspondiente
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // `userRepo` es el acceso a todas las operaciones de la tabla User
  ) {}

  // 🔹 Método para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    // Llamamos al método find() de TypeORM para traer todos los usuarios
    // Incluimos las relaciones (por ejemplo, las reservas del usuario)
    return this.userRepo.find({ relations: ['reservas'] });
  }

  // 🔹 Método para obtener un usuario por su ID
  async findOne(usuario_id: number): Promise<User> {
    // findOne busca un registro que cumpla la condición `where: { id }`
    // También cargamos las reservas relacionadas con ese usuario
    const user = await this.userRepo.findOne({
      where: { usuario_id: usuario_id },
      relations: ['reservas'],
    });
    if (!user) {
      throw new Error(`Usuario ${usuario_id} no encontrado`); // Lanzamos un error si no se encuentra el usuario
    }
    return user;
  }

  // 🔹 Método para crear un nuevo usuario
  async create(info_user: UserDto): Promise<User> {
    // Creamos una nueva instancia de User con los datos recibidos
    const newUser = this.userRepo.create(info_user);

    // Guardamos el nuevo usuario en la base de datos
    return this.userRepo.save(newUser);
  }

  // 🔹 Método para actualizar un usuario existente
  async update(usuario_id: number, info_user: UserDto): Promise<User> {
    // Actualizamos el usuario con los datos nuevos
    await this.userRepo.update(usuario_id, info_user);

    // Devolvemos el usuario actualizado llamando a findOne()
    return this.findOne(usuario_id);
  }

  // 🔹 Método para eliminar un usuario por ID
  async remove(usuario_id: number): Promise<void> {
    // Borramos el registro que tenga el ID indicado
    await this.userRepo.delete(usuario_id);
  }}
>>>>>>> 4a836fdaa2e9a74f8d4920e43c20de3a2998ab17
