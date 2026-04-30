import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Noti)
    private readonly notiRepository: Repository<Noti>,
  ) {}

  findAll() {
    return this.notiRepository.find({
      relations: ['user'],
    });
  }

  async findOne(noti_id: number): Promise<Noti> {
    const Notification = await this.notiRepository.findOne({
      where: { noti_id },
      relations: ['user'],
    });
    if (!noti) {
      throw new NotFoundException(`Notification ${noti_id} no encontrada`);
    }
    return noti;
  }

  async create(data: Partial<Noti>) {
    const Notification = this.notiRepository.create(data);
    return this.notiRepository.save(noti);
  }

  async update(noti_id: number, data: UpdateNotificationDto) {
    await this.notiRepository.update(noti_id, data);
    return this.findOne(noti_id);
  }

  async remove(id: number) {
    await this.notiRepository.delete(id);
    return { deleted: true };
  }
}

