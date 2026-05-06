import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the Court being reserved',
    example: 1,
  })
  court_id!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
  })
  reservation_date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in HH:mm format (e.g., 09:00)',
  })
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '09:00',
  })
  start_time!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in HH:mm format (e.g., 10:30)',
  })
  @ApiProperty({
    description: 'End time of the reservation',
    example: '10:30',
  })
  end_time!: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  @ApiProperty({
    description: 'State of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
  })
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiProperty({
    description: 'Note for the reservation',
    example: 'Prefiero la Court cerca de la entrada',
  })
  note?: string;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the Court being reserved',
    example: 1,
  })
  court_id?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
    required: false,
  })
  reservation_date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '11:00',
    required: false,
  })
  start_time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'End time of the reservation',
    example: '12:30',
    required: false,
  })
  end_time?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  @ApiProperty({
    description: 'State of the reservation',
    enum: ReservationStatus,
    required: false,
  })
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  @ApiProperty({
    description: 'Note for the reservation',
    required: false,
  })
  note?: string;
}
