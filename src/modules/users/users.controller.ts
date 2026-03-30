import { Controller, Get, Post, Put, Delete, Param, Body, HttpException,
  HttpStatus,
  UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';
import { User } from './user.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from './user.entity';

@ApiTags('users') 
@UseGuards(AuthGuard, RolesGuard)
//solo puede entrar un usuario con rol SUPER_ADMIN
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
@Controller('users') // La ruta base para este controlador será /users
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAllUser()/*: Promise<User[]>*/ {
    try {
      return this.userService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  

  // GET /users/:id -> obtener un usuario por ID
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOneUser(@Param('id') id: number)/*: Promise<User | null>*/ {
    try {
      return this.userService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /users -> crear un nuevo usuario
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createUser(@Body() userDto: CreateUserDto)/*: Promise<User | null>*/ {
    try {
      return this.userService.create({
        ...userDto,
        fecha_nacimiento: new Date(userDto.fecha_nacimiento),
      });
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /users/:id -> actualizar un usuario existente
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async updateUser(@Param('id') id: number, @Body() userDto: CreateUserDto)/*: Promise<User | null>*/ {
    try {
      return this.userService.update(id, {
        ...userDto,
        fecha_nacimiento: new Date(userDto.fecha_nacimiento),
      });
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /users/:id -> eliminar un usuario
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 12345 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.userService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
