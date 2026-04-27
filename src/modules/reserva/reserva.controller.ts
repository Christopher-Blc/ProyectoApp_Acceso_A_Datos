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
} from '@nestjs/common';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { ReservaService } from './reserva.service';
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
import { AuthenticatedRequest } from '../auth/types/auth.types';
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
@Controller('reserva')
export class ReservaController {
      constructor(private readonly reservaService: ReservaService) {}
    
      @Get()
      @ApiOperation({ summary: 'Get all reservas' })
      @ApiResponse({ status: 200, description: 'Reservas retrieved successfully.' })
      @ApiResponse({ status: 204, description: 'No content.' })
      @ApiResponse({ status: 400, description: 'Bad request.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
      async findAll(): Promise<Reserva[]> {
        try {
          return this.reservaService.findAll();
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
  ): Promise<Reserva[]> {
    // El AuthGuard ya validó token y dejó el payload en req.user.
    const userId = req.user.sub;

    // Se filtra por el id del usuario autenticado, no por parámetro externo.
    return this.reservaService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reserva by ID' })
  @ApiResponse({ status: 200, description: 'Reserva retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid reserva ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reserva not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<Reserva | null> {
    try {
      return this.reservaService.findOne(id);
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
  @ApiOperation({ summary: 'Create a new reserva' })
  async create(
    @Body() reservaDto: CreateReservaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Reserva | null> {
    try {
      // Vinculamos la reserva al usuario del token para evitar suplantación.
      const userId = req.user.sub;
      return this.reservaService.create(reservaDto, userId);
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
  @ApiOperation({ summary: 'Update an existing reserva' })
  async update(
    @Param('id') id: number,
    @Body() reservaDto: UpdateReservaDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Reserva | null> {
    try {
      // El servicio decide permisos combinando id y rol del usuario autenticado.
      const userId = req.user.sub;
      const userRole = req.user.role;
      return this.reservaService.update(id, reservaDto, userId, userRole);
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
  @ApiOperation({ summary: 'Delete reserva by ID' })
  @ApiResponse({ status: 200, description: 'Reserva deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid reserva ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reserva not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.reservaService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
