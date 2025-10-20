import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Reserva } from './reserva.entity';
import { ReservaDto } from './reserva.dto';
import { ReservaService } from './reserva.service';

@Controller('reserva')
export class ReservaController {
      constructor(private readonly reservaService: ReservaService) {}
    
      @Get()
      async findAll(): Promise<Reserva[]> {
        return this.reservaService.findAll();
      }

      @Get(':id')
      async findOne(@Param('id') id:number): Promise<Reserva | null> {
        return this.reservaService.findOne(id);
      }

      @Post()
      async create(@Body() reservaDto: ReservaDto): Promise<Reserva | null> {
        return this.reservaService.create(reservaDto);
      }

      @Put(':id')
      async update(@Param('id') id: number, @Body() reservaDto: ReservaDto): Promise<Reserva | null> {
        return this.reservaService.update(id,reservaDto);
      }

      @Delete(':id')
      async remove(@Param('id') id: number): Promise<void | {deleted: boolean}> {
        return this.reservaService.remove(id);
      }
}
