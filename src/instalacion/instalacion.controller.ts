import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InstalacionService } from './instalacion.service';
import { Instalacion } from './instalacion.entity';
import { InstalacionDto } from './instalacion.dto';

@Controller('instalacion')
export class InstalacionController {
    constructor(private readonly instalacionService: InstalacionService) {}

    @Get()
    async findAll(): Promise<Instalacion[]> {
        return this.instalacionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Instalacion | null> {
        return  this.instalacionService.findOne(id);
    }

    @Post()
    async create(@Body() instalacionDto: InstalacionDto): Promise<Instalacion | null> {
        return this.instalacionService.create(instalacionDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() instalacionDto: InstalacionDto): Promise<Instalacion | null> {
        return this.instalacionService.update(id, instalacionDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
        await this.instalacionService.remove(id);
    }
}
