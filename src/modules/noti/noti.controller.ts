import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { NotiService } from './noti.service';
import { NotiDto } from './noti.dto';
import { Noti } from './noti.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('noti')
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  // GET /noti -> obtener todas las noti
  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones obtenida correctamente.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Noti[]> {
    try {
      return this.notiService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET /noti/:id -> obtener una noti por ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiResponse({ status: 200, description: 'Notificación obtenida correctamente.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: number): Promise<Noti | null> {
    try {
      return this.notiService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /noti -> crear una nueva noti
  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({ status: 201, description: 'Notificación creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() notiDto: NotiDto): Promise<Noti | null> {
    try {
      // Convert 'fecha' from string to Date if present
      const data = {
        ...notiDto,
        fecha: notiDto.fecha ? new Date(notiDto.fecha) : undefined,
      };
      return this.notiService.create(data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /noti/:id -> actualizar un noti existente
  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar una notificación por ID' })
  @ApiResponse({ status: 200, description: 'Notificación actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(@Param('id') id: number, @Body() notiDto: NotiDto): Promise<Noti | null> {
    try {
      return this.notiService.update(id, notiDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /noti/:id -> eliminar un noti
  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar una notificación por ID' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.notiService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  
}
