import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateMassiveNotiDto, UpdateNotificationDto } from './dto/notification.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async sendExpoPush(
    token: string,
    title: string,
    body: string,
  ): Promise<void> {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        data: { screen: 'Notifications' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Expo push failed with status ${response.status}`);
    }
  }

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
    if (!data.user_id) {
      throw new BadRequestException('user_id is required');
    }

    const user = await this.userRepository.findOne({
      where: { usuario_id: data.user_id },
    });
    if (!user) {
      throw new NotFoundException(`User ${data.user_id} no encontrado`);
    }

    const Notification = this.notiRepository.create(data);
    const savedNotification = await this.notiRepository.save(Notification);

    if (user.expoPushToken) {
      await this.sendExpoPush(
        user.expoPushToken,
        savedNotification.titulo || 'Nueva notificación',
        savedNotification.mensaje,
      );
    }

    return savedNotification;
  }

  async createMassive(data: CreateMassiveNotiDto): Promise<{
    notificationsCreated: number;
    usersWithToken: number;
    pushesSent: number;
  }> {
    const users = await this.userRepository.find({
      where: {},
      select: ['usuario_id', 'expoPushToken'],
    });

    const recipients = users.filter((u) => !!u.expoPushToken);
    if (recipients.length === 0) {
      return {
        notificationsCreated: 0,
        usersWithToken: 0,
        pushesSent: 0,
      };
    }

    const notifications = recipients.map((u) =>
      this.notiRepository.create({
        user_id: u.usuario_id,
        titulo: data.titulo,
        mensaje: data.mensaje,
        tipoNoti: data.tipoNoti,
      }),
    );

    await this.notiRepository.insert(notifications);

    let pushesSent = 0;
    const chunkSize = 100;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (u) => {
          if (!u.expoPushToken) return;
          try {
            await this.sendExpoPush(u.expoPushToken, data.titulo, data.mensaje);
            pushesSent += 1;
          } catch {
            // Si falla un token no tumbamos el envío completo.
          }
        }),
      );
    }

    return {
      notificationsCreated: notifications.length,
      usersWithToken: recipients.length,
      pushesSent,
    };
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


