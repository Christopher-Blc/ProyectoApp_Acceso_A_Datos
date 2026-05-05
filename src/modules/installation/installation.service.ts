import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Installation } from './entities/installation.entity';
import {
  CreateInstallationDto,
  UpdateInstallationDto,
} from './dto/installation.dto';

@Injectable()
export class InstallationService {
  constructor(
    @InjectRepository(Installation)
    private readonly instalacionRepository: Repository<Installation>,
  ) {}

  async findAll(): Promise<Installation[]> {
    return this.instalacionRepository.find({ relations: ['Court'] });
  }

  async findOne(instalacion_id: number): Promise<Installation> {
    const Installation = await this.instalacionRepository.findOne({
      where: { instalacion_id: instalacion_id },
      relations: ['Court'],
    });
    if (!Installation) {
      throw new NotFoundException(
        `Installation ${instalacion_id} no encontrada`,
      );
    }
    return Installation;
  }

  async create(info_Installation: CreateInstallationDto) {
    const newInstallation = this.instalacionRepository.create(info_Installation);
    return this.instalacionRepository.save(newInstallation);
  }

  async update(
    instalacion_id: number,
    info_Installation: UpdateInstallationDto,
  ): Promise<Installation> {
    await this.instalacionRepository.update(instalacion_id, info_Installation);
    return this.findOne(instalacion_id);
  }

  async remove(instalacion_id: number): Promise<void> {
    await this.findOne(instalacion_id);
    await this.instalacionRepository.delete(instalacion_id);
  }
}




