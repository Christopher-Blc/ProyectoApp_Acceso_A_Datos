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
    return this.userRepo.find({ relations: ['reserva', 'membresia', 'pago', 'comentario'] });

  }

  // 🔹 Método para obtener un usuario por su ID
  async findOne(usuario_id: number): Promise<User> {
    // findOne busca un registro que cumpla la condición `where: { id }`
    // También cargamos las reservas relacionadas con ese usuario
    const user = await this.userRepo.findOne({
      where: { usuario_id: usuario_id },
      relations: ['reserva', 'membresia', 'pago', 'comentario'],

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
