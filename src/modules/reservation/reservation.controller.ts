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
  Req,
  Query,
} from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto, UpdateReservationDto } from './dto/reservation.dto';
import { ReservationService } from './reservation.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import type { AuthenticatedRequest } from '../auth/types/auth.types';
import { normalizeError } from '../../common/utils/error.util';

/**
 * Controlador de reservas.
 *
 * Ajustes relevantes del refactor:
 * - `@Req()` tipado como AuthenticatedRequest para usar `req.user` sin `any`.
 * - Manejo homogéneo de errores con normalizeError(err) en todos los catch.
 */
@ApiTags('reservas')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('Reservation')
export class ReservationController {
  constructor(private readonly ReservationService: ReservationService) {}

  // El GET puede recibir opcionalmente id de pista y fecha para filtrar
  @Get()
  @ApiOperation({ summary: 'Get all reservas' })
  @ApiResponse({ status: 200, description: 'Reservas retrieved successfully.' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'pista_id', required: false, type: Number })
  @ApiQuery({ name: 'fecha_desde', required: false, type: String })
  async findAll(
    @Query('pista_id') pista_id?: number,
    @Query('fecha_desde') fecha_desde?: string,
  ): Promise<Reservation[]> {
    try {
      return await this.ReservationService.findAll(pista_id, fecha_desde);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('mis-reservas')
  @ApiOperation({ summary: 'Get my reservations' })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid reservations ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reservations not found.' })
  @ApiParam({ name: 'id', example: 1 })
  @UseGuards(AuthGuard)
  async findMyReservations(
    @Req() req: AuthenticatedRequest,
  ): Promise<Reservation[]> {
    // AuthGuard ya validó el token y dejó el payload en req.user.
    const userId = req.user?.sub;
    if (!userId)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.ReservationService.findByUserId(Number(userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid Reservation ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<Reservation | null> {
    try {
      return this.ReservationService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @Roles(
    UserRole.CLIENTE,
    UserRole.GESTOR_RESERVAS,
    UserRole.ADMINISTRACION,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Create a new Reservation' })
  async create(
    @Body() ReservationDto: CreateReservationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Reservation | null> {
    try {
      // Vinculamos la reserva al usuario del token para evitar suplantaciones.
      const userId = req.user?.sub;
      if (!userId)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return this.ReservationService.create(ReservationDto, Number(userId));
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @Roles(
    UserRole.CLIENTE,
    UserRole.GESTOR_RESERVAS,
    UserRole.ADMINISTRACION,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Update an existing Reservation' })
  async update(
    @Param('id') id: number,
    @Body() ReservationDto: UpdateReservationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Reservation | null> {
    try {
      // El servicio decide permisos combinando id y rol del usuario.
      const userId = req.user?.sub;
      const userRole = req.user?.role ?? UserRole.CLIENTE;
      if (!userId)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return this.ReservationService.update(
        id,
        ReservationDto,
        Number(userId),
        userRole as any,
      );
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(
    UserRole.GESTOR_RESERVAS,
    UserRole.ADMINISTRACION,
    UserRole.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Delete Reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid Reservation ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.ReservationService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}






