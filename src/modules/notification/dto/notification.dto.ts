import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { tipoNoti } from '../entities/notification.entity';

export class NotificationDto {
  @IsOptional()
  noti_id?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'ID del usuario destinatario de la notificación',
    example: 10,
    required: false,
  })
  user_id?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'Alias legacy de user_id para compatibilidad',
    example: 10,
    required: false,
  })
  usuario_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Título de la notificación',
    example: 'Reserva confirmada',
    required: false,
  })
  titulo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Mensaje de la notificación',
    example: 'Tu reserva ha sido confirmada',
  })
  mensaje?: string;

  @IsEnum(tipoNoti)
  @IsOptional()
  @ApiProperty({
    description: 'Tipo de notificación',
    example: tipoNoti.AVISO,
  })
  tipoNoti?: tipoNoti;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indica si la notificación ha sido leída',
    example: false,
  })
  leida?: boolean;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Fecha de la notificación',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  fecha?: string;
}

export class CreateMassiveNotiDto {
  @IsString()
  @ApiProperty({
    description: 'Título de la notificación masiva',
    example: 'Mantenimiento programado',
  })
  titulo!: string;

  @IsString()
  @ApiProperty({
    description: 'Mensaje de la notificación masiva',
    example: 'Habrá mantenimiento esta noche a las 23:00.',
  })
  mensaje!: string;

  @IsEnum(tipoNoti)
  @ApiProperty({
    description: 'Tipo de notificación',
    example: tipoNoti.AVISO,
  })
  tipoNoti!: tipoNoti;
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indica si la notificación ha sido leída',
    example: false,
  })
  leida?: boolean;
}
