import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PagoService } from './pago.service';
import { Pago } from './pago.entity';
import { CreatePagoDto } from './pago.dto';

@Controller('pago')
export class PagoController {
    constructor(private readonly pagoService: PagoService) {}

    @Get()
    async findAll(): Promise<Pago[]>{
        return this.pagoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Pago | null> {
        return this.pagoService.findOne(id);
    }

    @Post()
    async create(@Param('id') id: number, @Body() createPagoDto: CreatePagoDto): Promise<Pago | null> {
        return this.pagoService.create(createPagoDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() createPagoDto: CreatePagoDto): Promise<Pago | null> {
        return this.pagoService.update(id, createPagoDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void | {deleted: boolean}>{
        return this.pagoService.remove(id);
    }
}
