import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './reserva.dto';
import { ReservaService } from './reserva.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('reserva')
export class ReservaController {
      constructor(private readonly reservaService: ReservaService) {}
    
      @Get()
      @ApiBearerAuth()
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

      @Get(':id')
      @ApiBearerAuth()
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
      @ApiOperation({ summary: 'Create a new reserva' })
      @ApiResponse({ status: 201, description: 'Reserva created successfully.' })
      @ApiResponse({ status: 400, description: 'Bad request.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
      async create(@Body() reservaDto: CreateReservaDto): Promise<Reserva | null> {
        try {
          return this.reservaService.create(reservaDto);
        } catch (err) {
          throw new HttpException(
            err.message,
            err.status || HttpStatus.BAD_REQUEST,
          );
        }
      }

      @Put(':id')
      @ApiBearerAuth()
      @ApiOperation({ summary: 'Update an existing reserva' })
      @ApiResponse({ status: 200, description: 'Reserva updated successfully.' })
      @ApiResponse({ status: 400, description: 'Invalid reserva ID.' })
      @ApiResponse({ status: 401, description: 'Unauthorized.' })
      @ApiResponse({ status: 404, description: 'Reserva not found.' })
      @ApiParam({ name: 'id', example: 1 })
      async update(@Param('id') id: number, @Body() reservaDto: CreateReservaDto): Promise<Reserva | null> {
        try {
          return this.reservaService.update(id,reservaDto);
        } catch (err) {
          throw new HttpException(
            err.message,
            err.status || HttpStatus.BAD_REQUEST,
          );
        }
      }

      @Delete(':id')
      @ApiBearerAuth()
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
