import { NotificationType } from '../../modules/notification/entities/notification.entity';

export default [
  {
    userId: 1,
    message: 'Tienes una partida hoy',
    notificationType: NotificationType.REMINDER,
    isRead: true,
    createdAt: new Date('2025-10-27T10:24:04'),
  },
];
