import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDto } from './users.dto';
import { User } from './user.entity';

@Controller('users') // La ruta base para este controlador será /users
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // 🔹 GET /users -> obtener todos los usuarios
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 🔹 GET /users/:id -> obtener un usuario por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // 🔹 POST /users -> crear un nuevo usuario
  @Post()
  async create(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  // 🔹 PUT /users/:id -> actualizar un usuario existente
  @Put(':id')
  async update(@Param('id') id: number, @Body() userDto: UserDto): Promise<User> {
    return this.userService.update(id, userDto);
  }

  // 🔹 DELETE /users/:id -> eliminar un usuario
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
