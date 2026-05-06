import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'Recipient user ID',
    example: 10,
    required: false,
  })
  userId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Notification title',
    example: 'Reserva confirmada',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Notification message',
    example: 'Tu reserva ha sido confirmada',
  })
  message?: string;

  @IsEnum(NotificationType)
  @IsOptional()
  @ApiProperty({
    description: 'Notification type',
    example: NotificationType.ALERT,
  })
  notificationType?: NotificationType;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates whether the notification has been read',
    example: false,
  })
  isRead?: boolean;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Notification date',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  createdAt?: string;
}

export class CreateMassiveNotificationDto {
  @IsString()
  @ApiProperty({
    description: 'Mass notification title',
    example: 'Mantenimiento programado',
  })
  title!: string;

  @IsString()
  @ApiProperty({
    description: 'Mass notification message',
    example: 'Habrá mantenimiento esta noche a las 23:00.',
  })
  message!: string;

  @IsEnum(NotificationType)
  @ApiProperty({
    description: 'Notification type',
    example: NotificationType.ALERT,
  })
  notificationType!: NotificationType;
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates whether the notification has been read',
    example: false,
  })
  isRead?: boolean;
}
