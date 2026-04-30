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

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('noti')
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}

  // GET /Notification -> obtener todas las noti
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
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET /noti/:id -> obtener una Notification por ID
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
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /Notification -> crear una nueva noti
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
      // Convert 'fecha' from string to Date if present
      const data = {
        ...NotificationDto,
        fecha: NotificationDto.fecha ? new Date(NotificationDto.fecha) : undefined,
      };
      return this.NotificationService.create(data);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /noti/:id -> actualizar un Notification existente
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
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}


