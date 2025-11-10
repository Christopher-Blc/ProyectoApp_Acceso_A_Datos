import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HorarioPistaService } from './horario_pista.service';
import { Horario_Pista } from './horario_pista.entity';
import { CreateHorarioPistaDto } from './horario_pista.dto';

@Controller('horario-pista')
export class HorarioPistaController {
    constructor(private readonly HorarioPistaService: HorarioPistaService) {}

    @Get()
    async findAll(): Promise<Horario_Pista[]> {
        return this.HorarioPistaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Horario_Pista | null> {
        return this.HorarioPistaService.findOne(id);
    }

    @Post()
    async create(@Body() horario_pistaDto: CreateHorarioPistaDto): Promise<Horario_Pista | null> {
        return this.HorarioPistaService.create(horario_pistaDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() horario_pistaDto: CreateHorarioPistaDto): Promise<Horario_Pista | null> {
        return this.HorarioPistaService.update(id, horario_pistaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void | {deleted: boolean}>{
        return this.HorarioPistaService.remove(id);
    }
}
