import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { normalizeError } from '../../common/utils/error.util';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('Notification')
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}

  // Ruta /Notification -> obtener todas las notificaciones
  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones obtenida correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Notification[]> {
    try {
      return this.NotificationService.findAll();
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(
        message,
        status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Ruta /Notification/:id -> obtener una notificación por ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación obtenida correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: number): Promise<Notification | null> {
    try {
      return this.NotificationService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(
        message,
        status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Ruta /Notification (POST) -> crear una notificación nueva
  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() NotificationDto: NotificationDto): Promise<Notification | null> {
    try {
      // Convertir 'fecha' de string a Date si viene presente
      const data = {
        ...NotificationDto,
        fecha: NotificationDto.fecha ? new Date(NotificationDto.fecha) : undefined,
      };
      return this.NotificationService.create(data);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(
        message,
        status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Ruta /Notification/:id (PUT) -> actualizar una notificación existente
  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar una notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación actualizada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(
    @Param('id') id: number,
    @Body() NotificationDto: NotificationDto,
  ): Promise<Notification | null> {
    try {
      return this.NotificationService.update(id, NotificationDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(
        message,
        status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Ruta /Notification/:id (DELETE) -> eliminar una notificación
  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar una notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación eliminada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.NotificationService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(
        message,
        status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}



