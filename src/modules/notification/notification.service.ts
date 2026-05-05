import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
  ) {}

  findAll() {
    return this.notiRepository.find({
      relations: ['user'],
    });
  }

  async findOne(Notification_id: number): Promise<Notification> {
    const Notification = await this.notiRepository.findOne({
      where: { Notification_id },
      relations: ['user'],
    });
    if (!Notification) {
      throw new NotFoundException(`Notification ${Notification_id} no encontrada`);
    }
    return Notification;
  }

  async create(data: Partial<Notification>) {
    const Notification = this.notiRepository.create(data);
    return this.notiRepository.save(Notification);
  }

  async update(Notification_id: number, data: UpdateNotificationDto) {
    await this.notiRepository.update(Notification_id, data);
    return this.findOne(Notification_id);
  }

  async remove(id: number) {
    await this.notiRepository.delete(id);
    return { deleted: true };
  }
}


