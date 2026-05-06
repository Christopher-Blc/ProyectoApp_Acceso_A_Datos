import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { NotificationService } from './notification.service';
import {
  CreateMassiveNotificationDto,
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
      return this.notificationService.findAll();
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación obtenida correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<Notification | null> {
    try {
      return this.notificationService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() notificationDto: CreateNotificationDto,
  ): Promise<Notification | null> {
    try {
      const data = {
        ...notificationDto,
        user_id: notificationDto.user_id,
        created_at: notificationDto.created_at
          ? new Date(notificationDto.created_at)
          : undefined,
      };
      return this.notificationService.create(data);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('massive')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear notificación masiva y enviarla por push' })
  @ApiResponse({
    status: 201,
    description: 'Notificación masiva creada y enviada correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createMassive(@Body() body: CreateMassiveNotificationDto) {
    try {
      return await this.notificationService.createMassive(body);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
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
    @Body() notificationDto: UpdateNotificationDto,
  ): Promise<Notification | null> {
    try {
      return this.notificationService.update(id, notificationDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
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
      return this.notificationService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
