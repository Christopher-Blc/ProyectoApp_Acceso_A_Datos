import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { estadoReserva } from '../entities/reserva.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the pista being reserved',
    example: 1,
  })
  pista_id: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
  })
  fecha_reserva: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in HH:mm format (e.g., 09:00)',
  })
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '09:00',
  })
  hora_inicio: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in HH:mm format (e.g., 10:30)',
  })
  @ApiProperty({
    description: 'End time of the reservation',
    example: '10:30',
  })
  hora_fin: string;

  @IsOptional()
  @IsEnum(estadoReserva)
  @ApiProperty({
    description: 'State of the reservation',
    enum: estadoReserva,
    example: estadoReserva.PENDIENTE,
  })
  estado: estadoReserva;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiProperty({
    description: 'Note for the reservation',
    example: 'Prefiero la pista cerca de la entrada',
  })
  nota: string;
}

export class UpdateReservaDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the pista being reserved',
    example: 1,
  })
  pista_id: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
    required: false,
  })
  fecha_reserva?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '11:00',
    required: false,
  })
  hora_inicio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'End time of the reservation',
    example: '12:30',
    required: false,
  })
  hora_fin?: string;

  @IsOptional()
  @IsEnum(estadoReserva)
  @ApiProperty({
    description: 'State of the reservation',
    enum: estadoReserva,
    required: false,
  })
  estado?: estadoReserva;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiProperty({
    description: 'Note for the reservation',
    required: false,
  })
  nota?: string;
}
