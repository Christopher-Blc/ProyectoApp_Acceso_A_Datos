import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Membresia } from './membresia.entity';
import { MembresiaService } from './membresia.service';
import { MembresiaDto } from './membresia.dto';

@Controller('membresia')
export class MembresiaController {
    constructor(private readonly membresiaService: MembresiaService){}

    @Get()
    async findAll(): Promise<Membresia[]>{
        return this.membresiaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id')id: number): Promise<Membresia | null>{
        return this.membresiaService.findOne(id);
    }

    @Post()
    async create(@Body() membresiaDto: MembresiaDto): Promise<Membresia | null>{
        return this.membresiaService.create(membresiaDto);
    }

    @Put(':id')
    async update(@Param('id') id: number , @Body() membresiaDto: MembresiaDto): Promise<Membresia |null>{
        return this.membresiaService.update(id , membresiaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise <void |{deleted: boolean}> {
        return this.membresiaService.remove(id);
    }

}
