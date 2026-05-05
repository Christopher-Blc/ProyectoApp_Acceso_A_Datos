import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Noti } from './entities/noti.entity';
import { Repository } from 'typeorm';
import { CreateMassiveNotiDto, UpdateNotiDto } from './dto/noti.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti)
    private readonly notiRepository: Repository<Noti>,
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

  async findOne(noti_id: number): Promise<Noti> {
    const noti = await this.notiRepository.findOne({
      where: { noti_id },
      relations: ['user'],
    });
    if (!noti) {
      throw new NotFoundException(`Noti ${noti_id} no encontrada`);
    }
    return noti;
  }

  async create(data: Partial<Noti>) {
    if (!data.user_id) {
      throw new BadRequestException('user_id is required');
    }

    const user = await this.userRepository.findOne({
      where: { usuario_id: data.user_id },
    });
    if (!user) {
      throw new NotFoundException(`User ${data.user_id} no encontrado`);
    }

    const noti = this.notiRepository.create(data);
    const savedNoti = await this.notiRepository.save(noti);

    if (user.expoPushToken) {
      await this.sendExpoPush(
        user.expoPushToken,
        savedNoti.titulo || 'Nueva notificación',
        savedNoti.mensaje,
      );
    }

    return savedNoti;
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

  async update(noti_id: number, data: UpdateNotiDto) {
    await this.notiRepository.update(noti_id, data);
    return this.findOne(noti_id);
  }

  async remove(id: number) {
    await this.notiRepository.delete(id);
    return { deleted: true };
  }
}
