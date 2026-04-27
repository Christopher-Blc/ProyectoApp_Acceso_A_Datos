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
import { TipoPistaService } from './tipo_pista.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reserva } from '../reserva/entities/reserva.entity';
import { TipoPista } from './entities/tipo_pista.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateReservaDto } from '../reserva/dto/reserva.dto';
import { TipoPistaDto } from './dto/tipo_pista.dto';

@ApiTags('tipo_pista')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('tipo_pista')
export class TipoPistaController {
  constructor(private readonly tipoPistaService: TipoPistaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all court types' })
  @ApiResponse({
    status: 200,
    description: 'Court types retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<TipoPista[]> {
    try {
      return this.tipoPistaService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get court type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Court type retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<TipoPista | null> {
    try {
      return this.tipoPistaService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new court type' })
  @ApiResponse({ status: 201, description: 'Court type created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() tipoPistaDto: TipoPistaDto): Promise<TipoPista | null> {
    try {
      return this.tipoPistaService.create(tipoPistaDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing court type' })
  @ApiResponse({ status: 200, description: 'Court type updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async update(
    @Param('id') id: number,
    @Body() tipoPistaDto: TipoPistaDto,
  ): Promise<TipoPista | null> {
    try {
      return this.tipoPistaService.update(id, tipoPistaDto);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete court type by ID' })
  @ApiResponse({ status: 200, description: 'Court type deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.tipoPistaService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
