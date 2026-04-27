import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { Resenya } from './entities/resenya.entity';
import { CreateResenyaDto, UpdateResenyaDto } from './dto/resenya.dto';

@Injectable()
export class ResenyaService {
  constructor(
    @InjectRepository(Resenya)
    private readonly resenyaRepository: Repository<Resenya>,
  ) {}

  async findAll(): Promise<Resenya[]> {
    return this.resenyaRepository.find({ relations: ['user', 'instalacion'] });
  }

  async findOne(resenya_id: number): Promise<Resenya> {
    const resenya = await this.resenyaRepository.findOne({
      where: { resenya_id: resenya_id },
      relations: ['user', 'instalacion'],
    });
    if (!resenya) {
      throw new NotFoundException(`Reseña ${resenya_id} no encontrada`);
    }
    return resenya;
  }

  async create(info_resenya: CreateResenyaDto) {
    const newResenya = this.resenyaRepository.create(info_resenya);
    return this.resenyaRepository.save(newResenya);
  }

  async update(
    resenya_id: number,
    info_resenya: UpdateResenyaDto,
  ): Promise<Resenya> {
    await this.resenyaRepository.update(resenya_id, info_resenya);
    return this.findOne(resenya_id);
  }

  async remove(resenya_id: number): Promise<void> {
    await this.resenyaRepository.delete(resenya_id);
  }
}
