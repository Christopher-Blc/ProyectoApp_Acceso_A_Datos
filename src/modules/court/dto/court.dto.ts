import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana, EstadoCourt } from '../entities/court.entity';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CourtDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  installation_id!: number; // clave foranea Installation

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
  covered!: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  lighting!: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  description?: string;

  @IsEnum(EstadoCourt)
  @ApiProperty({
    description: 'State of the court',
    enum: EstadoCourt,
    example: EstadoCourt.DISPONIBLE,
  })
  status!: EstadoCourt;

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

  @IsEnum(DiaSemana)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  day_of_week!: DiaSemana;
}

// como todos los campos van a ser opcionales , lo ponemos asi
export class UpdateCourtDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  installation_id?: number; // clave foranea Installation

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  court_type_id?: number;

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
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  price_per_hour?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  covered?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  lighting?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  description?: string;

  @IsOptional()
  @IsEnum(EstadoCourt)
  @ApiProperty({
    description: 'State of the court',
    enum: EstadoCourt,
    example: EstadoCourt.DISPONIBLE,
  })
  status?: EstadoCourt;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  opening_time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  closing_time?: string;

  @IsOptional()
  @IsEnum(DiaSemana)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  day_of_week?: DiaSemana;

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
  maintenance_start?: string;

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
  maintenance_end?: string;
}
