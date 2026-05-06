import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import {
  CreateMassiveNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
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

  async findOne(notificationId: number): Promise<Notification> {
    const notification = await this.notiRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });
    if (!notification) {
      throw new NotFoundException(`Notification ${notificationId} not found`);
    }
    return notification;
  }

  async create(data: Partial<Notification>) {
    if (!data.userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) {
      throw new NotFoundException(`User ${data.userId} not found`);
    }

    const notification = this.notiRepository.create(data);
    const savedNotification = await this.notiRepository.save(notification);

    if (user.expoPushToken) {
      await this.sendExpoPush(
        user.expoPushToken,
        savedNotification.title || 'Nueva notificación',
        savedNotification.message,
      );
    }

    return savedNotification;
  }

  async createMassive(data: CreateMassiveNotificationDto): Promise<{
    notificationsCreated: number;
    usersWithToken: number;
    pushesSent: number;
  }> {
    const users = await this.userRepository.find({
      where: {},
      select: ['id', 'expoPushToken'],
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
        userId: u.id,
        title: data.title,
        message: data.message,
        notificationType: data.notificationType,
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
            await this.sendExpoPush(u.expoPushToken, data.title, data.message);
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

  async update(notificationId: number, data: UpdateNotificationDto) {
    await this.notiRepository.update(notificationId, {
      isRead: data.isRead,
    });
    return this.findOne(notificationId);
  }

  async remove(id: number) {
    await this.notiRepository.delete(id);
    return { deleted: true };
  }
}
