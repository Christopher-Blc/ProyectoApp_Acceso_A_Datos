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

  async findOne(installationId: number): Promise<Installation> {
    const installation = await this.instalacionRepository.findOne({
      where: { id: installationId },
      relations: ['courts'],
    });
    if (!installation) {
      throw new NotFoundException(`Installation ${installationId} not found`);
    }
    return installation;
  }

  async create(infoInstallation: CreateInstallationDto) {
    const newInstallation = this.instalacionRepository.create(infoInstallation);
    return this.instalacionRepository.save(newInstallation);
  }

  async update(
    installationId: number,
    infoInstallation: UpdateInstallationDto,
  ): Promise<Installation> {
    await this.instalacionRepository.update(installationId, infoInstallation);
    return this.findOne(installationId);
  }

  async remove(installationId: number): Promise<void> {
    await this.findOne(installationId);
    await this.instalacionRepository.delete(installationId);
  }
}
