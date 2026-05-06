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
  courtId!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
  })
  reservationDate!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in HH:mm format (e.g., 09:00)',
  })
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '09:00',
  })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in HH:mm format (e.g., 10:30)',
  })
  @ApiProperty({
    description: 'End time of the reservation',
    example: '10:30',
  })
  endTime!: string;

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
  courtId?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of the reservation',
    example: '2026-04-01',
    required: false,
  })
  reservationDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '11:00',
    required: false,
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'End time of the reservation',
    example: '12:30',
    required: false,
  })
  endTime?: string;

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
