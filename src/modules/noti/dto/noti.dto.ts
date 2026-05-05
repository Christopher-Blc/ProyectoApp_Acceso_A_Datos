import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { tipoNoti } from '../entities/noti.entity';

export class NotiDto {
  @IsInt()
  @IsOptional()
  noti_id?: number;

  @IsInt()
  @ApiProperty({
    description: 'ID del usuario destinatario de la notificación',
    example: 10,
  })
  user_id!: number;

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
    description: 'Title of the notification',
    example: 'Reserva confirmada',
    required: false,
  })
  titulo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Message of the notification',
    example: 'Your reservation is confirmed',
  })
  mensaje?: string;

  @IsEnum(tipoNoti)
  @ApiProperty({
    description: 'Type of the notification',
    example: tipoNoti.AVISO,
  })
  tipoNoti!: tipoNoti;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the notification has been read',
    example: false,
  })
  leida?: boolean;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Date of the notification',
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

export class UpdateNotiDto {
  // @IsString()
  // @IsOptional()
  // mensaje?: string;

  // @IsOptional()
  // @IsEnum(tipoNoti)
  // tipoNoti: tipoNoti;

  // @IsOptional()
  // @IsString()
  // canal: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the notification has been read',
    example: false,
  })
  leida?: boolean;

  // @IsOptional()
  // @IsDateString()
  // fecha: Date;
}
