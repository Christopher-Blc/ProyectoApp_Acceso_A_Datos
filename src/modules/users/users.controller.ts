import { 
  Controller, Get, Post, Put, Delete, Param, Body, HttpException, 
  HttpStatus, UseGuards, Req 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { User, UserRole } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Rutas de perfil (para cualquier user autenticado)

  @Get('profile/me')
  @ApiOperation({ summary: 'Get my own profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getMyProfile(@Req() req: any) {
    try {
      const userId = req.user.usuario_id;
      return await this.userService.findOne(userId);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put('profile/update')
  @ApiOperation({ summary: 'Update my own profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateMyProfile(@Req() req: any, @Body() userDto: UpdateUserDto) {
    try {
      const userId = req.user.usuario_id;
      return await this.userService.update(userId, userDto , true);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('profile/delete')
  @ApiOperation({ summary: 'Delete my own account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async deleteMyProfile(@Req() req: any) {
    try {
      const userId = req.user.usuario_id;
      return await this.userService.remove(userId);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  //rutas de admnin (solo para superadmin y adnministracion)

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMINISTRACION)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  async findAllUser() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMINISTRACION)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOneUser(@Param('id') id: number) {
    try {
      return await this.userService.findOne(id);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMINISTRACION)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createUser(@Body() userDto: CreateUserDto) {
    try {
      return await this.userService.create({
        ...userDto,
        fecha_nacimiento: new Date(userDto.fecha_nacimiento),
      });
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMINISTRACION)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async updateUser(@Param('id') id: number, @Body() userDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, userDto);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMINISTRACION)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number) {
    try {
      return await this.userService.remove(id);
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}