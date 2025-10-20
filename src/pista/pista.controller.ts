import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PistaService } from './pista.service';
import { PistaDto } from './pista.dto';
import { Pista } from './pista.entity';

@Controller('pista')
export class PistaController {
  constructor(private readonly pistaService: PistaService) {}

  // GET /pista -> obtener todos los pistas
  @Get()
  async findAll(): Promise<Pista[]> {
    return this.pistaService.findAll();
  }

  // GET /pista/:id -> obtener un pista por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Pista | null> {
    return this.pistaService.findOne(id);
  }

  // POST /pista -> crear un nuevo pista
  @Post()
  async create(@Body() pistaDto: PistaDto): Promise<Pista | null> {
    return this.pistaService.create(pistaDto);
  }

  // PUT /pista/:id -> actualizar un pista existente
  @Put(':id')
  async update(@Param('id') id: number, @Body() pistaDto: PistaDto): Promise<Pista | null> {
    return this.pistaService.update(id, pistaDto);
  }

  // DELETE /pista/:id -> eliminar un pista
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    return this.pistaService.remove(id);
  }
}
