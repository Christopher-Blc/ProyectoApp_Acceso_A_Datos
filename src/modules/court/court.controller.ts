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
import { CourtDto, UpdateCourtDto } from './dto/court.dto';
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

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('pistas')
@ApiBearerAuth()
@Controller('pista')
export class CourtController {
  constructor(private readonly CourtService: CourtService) {}

  // GET /Court -> obtener todas los pistas
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
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('disponibilidad')
  @ApiOperation({ summary: 'Get court availability by date' })
  @ApiResponse({
    status: 200,
    description: 'Availability calculated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'fecha',
    example: '2026-04-27',
    description: 'Date in YYYY-MM-DD format',
  })
  @UseGuards(AuthGuard)
  async getDisponibilidad(@Query('fecha') fecha: string) {
    return await this.CourtService.obtenerDisponibilidad(fecha);
  }

  // GET /pista/:id -> get a court by ID
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
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /Court -> create a new court
  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new court' })
  @ApiResponse({ status: 201, description: 'Court created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() CourtDto: CourtDto): Promise<Court> {
    try {
      return this.CourtService.create(CourtDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /pista/:id -> update an existing court
  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update court - Supports selective maintenance dates' })
  @ApiResponse({ status: 200, description: 'Court updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async update(
    @Param('id') id: number,
    @Body() CourtDto: UpdateCourtDto,
  ): Promise<Court> {
    try {
      return this.CourtService.update(id, CourtDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /pista/:id -> eliminar un pista
  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a court' })
  @ApiResponse({ status: 200, description: 'Court deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.CourtService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}


