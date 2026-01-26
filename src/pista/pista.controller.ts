import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { PistaService } from './pista.service';
import { PistaDto } from './pista.dto';
import { Pista } from './pista.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('pistas')
@ApiBearerAuth()
@Controller('pista')
export class PistaController {
  constructor(private readonly pistaService: PistaService) {}

  // GET /pista -> obtener todos los pistas
  @Get()
  @ApiOperation({ summary: 'Get all courts' })
  @ApiResponse({ status: 200, description: 'List of all courts' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Pista[]> {
    try {
      return this.pistaService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET /pista/:id -> obtener un pista por ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a court by ID' })
  @ApiResponse({ status: 200, description: 'The court with the specified ID' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Error en alguno de los datos.' })
  async findOne(@Param('id') id: number): Promise<Pista> {
    try {
      return this.pistaService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /pista -> crear un nuevo pista
  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new court' })
  @ApiResponse({ status: 201, description: 'Court created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() pistaDto: PistaDto): Promise<Pista> {
    try {
      return this.pistaService.create(pistaDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /pista/:id -> actualizar un pista existente
  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing court' })
  @ApiResponse({ status: 200, description: 'Court updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async update(@Param('id') id: number, @Body() pistaDto: PistaDto): Promise<Pista> {
    try {
      return this.pistaService.update(id, pistaDto);
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
      return this.pistaService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
