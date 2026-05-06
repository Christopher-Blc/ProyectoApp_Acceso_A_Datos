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
    return this.instalacionRepository.find({ relations: ['courts'] });
  }

  async findOne(installation_id: number): Promise<Installation> {
    const Installation = await this.instalacionRepository.findOne({
      where: { installation_id: installation_id },
      relations: ['courts'],
    });
    if (!Installation) {
      throw new NotFoundException(
        `Installation ${installation_id} no encontrada`,
      );
    }
    return Installation;
  }

  async create(info_Installation: CreateInstallationDto) {
    const newInstallation =
      this.instalacionRepository.create(info_Installation);
    return this.instalacionRepository.save(newInstallation);
  }

  async update(
    installation_id: number,
    info_Installation: UpdateInstallationDto,
  ): Promise<Installation> {
    await this.instalacionRepository.update(installation_id, info_Installation);
    return this.findOne(installation_id);
  }

  async remove(installation_id: number): Promise<void> {
    await this.findOne(installation_id);
    await this.instalacionRepository.delete(installation_id);
  }
}
