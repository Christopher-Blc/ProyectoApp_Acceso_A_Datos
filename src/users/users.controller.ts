import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

// Define la ruta base para este controller: /users
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users
   * Trae todos los usuarios de la base de datos
   */
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Trae un usuario específico por su ID
   * @param id: ID del usuario en la ruta
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    // Convierte el parámetro id a número y llama al service
    return this.usersService.findOne(Number(id));
  }

  /**
   * POST /users
   * Crea un nuevo usuario
   * @param userData: datos del usuario enviados en el body en formato JSON
   */
  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  /**
   * PUT /users/:id
   * Actualiza un usuario existente
   * @param id: ID del usuario a actualizar en la ruta
   * @param userData: datos a actualizar en el body
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User | null> {
    return this.usersService.update(Number(id), userData);
  }

  /**
   * DELETE /users/:id
   * Elimina un usuario por su ID
   * @param id: ID del usuario en la ruta
   * @returns true si se eliminó, false si no existía
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.usersService.remove(Number(id));
  }
}
