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
<<<<<<< HEAD
    return this.instalacionRepository.find({ relations: ['courts'] });
=======
    return this.instalacionRepository.find({ relations: ['pistas'] });
>>>>>>> 4e2b742ee182a048355ce2fbb7492df1c2b1e042
  }

  async findOne(installation_id: number): Promise<Installation> {
    const Installation = await this.instalacionRepository.findOne({
<<<<<<< HEAD
      where: { installation_id: installation_id },
      relations: ['courts'],
=======
      where: { instalacion_id: instalacion_id },
      relations: ['pistas'],
>>>>>>> 4e2b742ee182a048355ce2fbb7492df1c2b1e042
    });
    if (!Installation) {
      throw new NotFoundException(
        `Installation ${installation_id} no encontrada`,
      );
    }
    return Installation;
  }

  async create(info_Installation: CreateInstallationDto) {
    const newInstallation = this.instalacionRepository.create(info_Installation);
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




