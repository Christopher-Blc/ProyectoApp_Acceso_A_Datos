import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { Comentario } from './comentario.entity';
import { ComentarioDto } from './comentario.dto';

@Controller('comentario')
export class ComentarioController {
    constructor(private readonly comentarioService: ComentarioService) {}

    @Get()
    async findAll(): Promise<Comentario[]> {
        return this.comentarioService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Comentario | null> {
        return this.comentarioService.findOne(id);
    }

    @Post()
    async create(@Body() comentarioDto: ComentarioDto): Promise<Comentario | null> {
        return this.comentarioService.create(comentarioDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() comentarioDto: ComentarioDto): Promise<Comentario | null> {
        return this.comentarioService.update(id, comentarioDto);
    }   

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
        return this.comentarioService.remove(id);
    }
}
