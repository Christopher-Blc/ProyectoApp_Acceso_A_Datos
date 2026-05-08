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
  Query,
} from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtDto, UpdateCourtDto } from './dto/court.dto';
import { Court } from './entities/court.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { normalizeError } from '../../common/utils/error.util';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('courts')
@ApiBearerAuth()
@Controller('courts')
export class CourtController {
  constructor(private readonly CourtService: CourtService) {}

  // Ruta /Court -> obtener todas las pistas
  @Get()
  @ApiOperation({ summary: 'Get all courts' })
  @ApiResponse({ status: 200, description: 'List of all courts' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Court[]> {
    try {
      return this.CourtService.findAll();
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('availability')
  @ApiOperation({ summary: 'Get court availability by date' })
  @ApiResponse({
    status: 200,
    description: 'Availability calculated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'date',
    example: '2026-04-27',
    description: 'Date in YYYY-MM-DD format',
  })
  @UseGuards(AuthGuard)
  async getDisponibilidad(@Query('date') date: string) {
    return await this.CourtService.obtenerDisponibilidad(date);
  }

  // Ruta /Court/:id -> obtener una pista por ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a court by ID' })
  @ApiResponse({ status: 200, description: 'The court with the specified ID' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Error in some of the data.' })
  async findOne(@Param('id') id: number): Promise<Court> {
    try {
      return this.CourtService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court (POST) -> crear una pista nueva
  @Post()
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new court' })
  @ApiResponse({ status: 201, description: 'Court created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() courtDto: CreateCourtDto): Promise<Court> {
    try {
      return this.CourtService.create(courtDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      console.error('Error creating court:', err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court/:id (PUT) -> actualizar una pista existente
  @Put(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update court - Supports selective maintenance dates',
  })
  @ApiResponse({ status: 200, description: 'Court updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async update(
    @Param('id') id: number,
    @Body() courtDto: UpdateCourtDto,
  ): Promise<Court> {
    try {
      return this.CourtService.update(id, courtDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court/:id (DELETE) -> eliminar una pista
  @Delete(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a court' })
  @ApiResponse({ status: 200, description: 'Court deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.CourtService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
