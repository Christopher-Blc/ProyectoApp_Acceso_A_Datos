import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NotiService } from './noti.service';
import { NotiDto } from './noti.dto';
import { Noti } from './noti.entity';


@Controller('noti')
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  // GET /noti -> obtener todas las noti
  @Get()
  async findAll(): Promise<Noti[]> {
    return this.notiService.findAll();
  }

  // GET /noti/:id -> obtener una noti por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Noti | null> {
    return this.notiService.findOne(id);
  }

  // POST /noti -> crear una nueva noti
  @Post()
  async create(@Body() notiDto: NotiDto): Promise<Noti | null> {
    return this.notiService.create(notiDto);
  }

  // PUT /noti/:id -> actualizar un noti existente
  @Put(':id')
  async update(@Param('id') id: number, @Body() notiDto: NotiDto): Promise<Noti | null> {
    return this.notiService.update(id, notiDto);
  }

  // DELETE /noti/:id -> eliminar un noti
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    return this.notiService.remove(id);
  }
}
