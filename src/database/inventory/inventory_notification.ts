import { tipoNoti } from '../../modules/notification/entities/notification.entity';

export default [
  {
    user_id: 1,
    message: 'Tienes una partida hoy',
    notification_type: tipoNoti.REMINDER,
    read: true,
    fecha: new Date('2025-10-27T10:24:04'),
  },
];
