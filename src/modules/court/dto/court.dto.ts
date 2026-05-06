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
  installation_id!: number;

  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  court_type_id!: number;

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
  price_per_hour!: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  is_covered!: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  has_lighting!: boolean;

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
  opening_time!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  closing_time!: string;

  @IsEnum(DayOfWeek)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  day_of_week!: DayOfWeek;
}

export class UpdateCourtDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  installation_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  court_type_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Unique name of the court',
    example: 'Central tennis court',
  })
  name?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Capacity of the court',
    example: 4,
  })
  capacity?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  price_per_hour?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  is_covered?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  has_lighting?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  description?: string;

  @IsEnum(CourtStatus)
  @IsOptional()
  @ApiProperty({
    description: 'State of the court',
    enum: CourtStatus,
    example: CourtStatus.AVAILABLE,
  })
  status?: CourtStatus;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  opening_time?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  closing_time?: string;

  @IsEnum(DayOfWeek)
  @IsOptional()
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  day_of_week?: DayOfWeek;
}
