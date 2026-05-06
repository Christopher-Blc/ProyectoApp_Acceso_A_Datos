import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, CourtStatus } from '../entities/court.entity';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCourtDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  installationId!: number;

  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  courtTypeId!: number;

  @IsString()
  @ApiProperty({
    description: 'Unique name of the court',
    example: 'Central tennis court',
  })
  name!: string;

  @IsNumber()
  @ApiProperty({
    description: 'Capacity of the court',
    example: 4,
  })
  capacity!: number;

  @IsNumber()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  pricePerHour!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  isCovered!: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  hasLighting!: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  description?: string;

  @IsEnum(CourtStatus)
  @ApiProperty({
    description: 'State of the court',
    enum: CourtStatus,
    example: CourtStatus.AVAILABLE,
  })
  status!: CourtStatus;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  openingTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  closingTime!: string;

  @IsEnum(DayOfWeek)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  dayOfWeek!: DayOfWeek;
}

// como todos los campos van a ser opcionales , lo ponemos asi
export class UpdateCourtDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  installationId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  courtTypeId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Unique name of the court',
    example: 'Central tennis court',
  })
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Capacity of the court',
    example: 4,
  })
  capacidad?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  pricePerHour?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  isCovered?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  hasLighting?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  description?: string;

  @IsOptional()
  @IsEnum(CourtStatus)
  @ApiProperty({
    description: 'State of the court',
    enum: CourtStatus,
    example: CourtStatus.AVAILABLE,
  })
  status?: CourtStatus;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  openingTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  closingTime?: string;

  @IsOptional()
  @IsEnum(DayOfWeek)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  dayOfWeek?: DayOfWeek;

  // Formato YYYY-MM-DD
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha debe ser YYYY-MM-DD',
  })
  @ApiProperty({
    description: 'Start date for selective maintenance',
    example: '2026-06-01',
    required: false,
  })
  maintenanceFrom?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha debe ser YYYY-MM-DD',
  })
  @ApiProperty({
    description: 'End date for selective maintenance',
    example: '2026-06-10',
    required: false,
  })
  maintenanceUntil?: string;
}
