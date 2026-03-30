// Importamos el decorador Injectable para poder inyectar este servicio en otros módulos
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Importamos la entidad User, que representa la tabla en la base de datos
import { User } from './user.entity';
import { UpdateUserDto } from './users.dto';

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

  // Metodo para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['reservas', 'membresia', 'pagos', 'comentarios'] });
  }

  //Metodo para obtener un usuario por su ID
  async findOne(usuario_id: number): Promise<User> {
    // findOne busca un registro que cumpla la condición `where: { id }`
    // También cargamos las reservas relacionadas con ese usuario
    const user = await this.userRepository.findOne({
      where: { usuario_id: usuario_id },
      relations: ['reservas', 'membresia', 'pagos', 'comentarios'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${usuario_id} no encontrado`); // Lanzamos un error si no se encuentra el usuario
    }
    return user;
  }

  // Método para crear un nuevo usuario
  async create(data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // "create" crea una instancia del objeto User (no la guarda todavía)
    const user = this.userRepository.create(data);
    // "save" guarda el usuario en la base de datos
    return this.userRepository.save(user);
  }

  // Método para actualizar un usuario existente
  async update(usuario_id: number, data: UpdateUserDto): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
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

  //Metodo para encontrar un usuario por su email
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  //Metodo para actualizar la fecha del ultimo login
  async updateLastLogin(usuario_id: number) {
    await this.userRepository.update(
      { usuario_id },
      { fecha_ultimo_login: new Date() },
    );
  }

    // Metodo para obtener usuario por id (sin lanzar exception si no existe)
  async findById(usuario_id: number) {
    return this.userRepository.findOne({ where: { usuario_id } });
  }

  // Metodo para guardar o borrar el hash del refresh token
  async updateRefreshTokenHash(usuario_id: number, hash: string | null) {
    await this.userRepository.update(
      { usuario_id },
      { refresh_token_hash: hash },
    );
  }


}
