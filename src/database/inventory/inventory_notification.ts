import { tipoNoti } from '../../modules/notification/entities/notification.entity';

export default [
  {
    user_id: 1,
    mensaje: 'Tienes una partida hoy',
    tipoNoti: tipoNoti.RECORDATORIO,
    leida: true,
    fecha: new Date('2025-10-27T10:24:04'),
  },
];


