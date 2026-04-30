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
    @InjectRepository(Instalacion)
    private readonly instalacionRepository: Repository<Instalacion>,
  ) {}

  async findAll(): Promise<Installation[]> {
    return this.instalacionRepository.find({ relations: ['pista'] });
  }

  async findOne(instalacion_id: number): Promise<Instalacion> {
    const Installation = await this.instalacionRepository.findOne({
      where: { instalacion_id: instalacion_id },
      relations: ['pista'],
    });
    if (!instalacion) {
      throw new NotFoundException(
        `Installation ${instalacion_id} no encontrada`,
      );
    }
    return instalacion;
  }

  async create(info_instalacion: CreateInstallationDto) {
    const newInstallation = this.instalacionRepository.create(info_instalacion);
    return this.instalacionRepository.save(newInstalacion);
  }

  async update(
    instalacion_id: number,
    info_instalacion: UpdateInstallationDto,
  ): Promise<Instalacion> {
    await this.instalacionRepository.update(instalacion_id, info_instalacion);
    return this.findOne(instalacion_id);
  }

  async remove(instalacion_id: number): Promise<void> {
    await this.findOne(instalacion_id);
    await this.instalacionRepository.delete(instalacion_id);
  }
}


