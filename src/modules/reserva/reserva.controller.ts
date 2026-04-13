import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards , Request, Req} from '@nestjs/common';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { ReservaService } from './reserva.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

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
      @ApiResponse({ status: 200, description: 'Reservations retrieved successfully.' })
      @ApiResponse({ status: 400, description: 'Invalid reservations ID.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
      @ApiResponse({ status: 404, description: 'Reservations not found.' })
      @ApiParam({ name: 'id', example: 1 })
      @UseGuards(AuthGuard)
      async findMyReservations(@Req() req): Promise<Reserva[]> {
        // NestJS (vía Passport) mete los datos del JWT decodificado en req.user
        const userId = req.user.usuario_id; 
        
        // Luego llamas a un método en el servicio que filtre por ese ID
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
          throw new HttpException(
            err.message,
            err.status || HttpStatus.BAD_REQUEST,
          );
        }
      }

      

      @Post()
      @Roles(UserRole.CLIENTE, UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
      @ApiOperation({ summary: 'Create a new reserva' })
      async create(
        @Body() reservaDto: CreateReservaDto,
        @Request() req // <--- Accedemos a la request
      ): Promise<Reserva | null> {
        try {
          // Extraemos el ID del usuario que el AuthGuard puso en req.user
          const userId = req.user.sub; 
          return this.reservaService.create(reservaDto, userId); 
        } catch (err) {
          throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
        }
      }

      @Put(':id')
      @Roles(UserRole.CLIENTE, UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
      @ApiOperation({ summary: 'Update an existing reserva' })
      async update(
        @Param('id') id: number, 
        @Body() reservaDto: UpdateReservaDto,
        @Request() req
      ): Promise<Reserva | null> {
        try {
          // Opcional: Validar que el CLIENTE solo pueda editar sus propias reservas
          const userId = req.user.sub;
          const userRole = req.user.role;
          return this.reservaService.update(id, reservaDto, userId , userRole);
        } catch (err) {
          throw new HttpException(err.message, err.status || HttpStatus.BAD_REQUEST);
        }
      }

      @Delete(':id')
      @Roles(UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
      @ApiOperation({ summary: 'Delete reserva by ID' })
      @ApiResponse({ status: 200, description: 'Reserva deleted successfully.' })
      @ApiResponse({ status: 400, description: 'Invalid reserva ID.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
      @ApiResponse({ status: 404, description: 'Reserva not found.' })
      @ApiParam({ name: 'id', example: 1 })
      async remove(@Param('id') id: number): Promise<void | {deleted: boolean}> {
        try {
          return this.reservaService.remove(id);
        } catch (err) {
          throw new HttpException(
            err.message,
            err.status || HttpStatus.BAD_REQUEST,
          );
        }
      } 
}






