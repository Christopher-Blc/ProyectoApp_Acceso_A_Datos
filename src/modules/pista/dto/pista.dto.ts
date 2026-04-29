import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DiaSemana, EstadoPista } from '../entities/pista.entity';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class PistaDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  instalacion_id: number; // clave foranea instalacion

  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  tipo_pista_id: number;

  @IsString()
  @ApiProperty({
    description: 'Unique name of the court',
    example: 'Central tennis court',
  })
  nombre: string;

  @IsNumber()
  @ApiProperty({
    description: 'Capacity of the court',
    example: 4,
  })
  capacidad: number;

  @IsNumber()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  precio_hora: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  cubierta: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  iluminacion: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  descripcion: string;

  @IsEnum(EstadoPista)
  @ApiProperty({
    description: 'State of the court',
    enum: EstadoPista,
    example: EstadoPista.DISPONIBLE,
  })
  estado: EstadoPista;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  hora_apertura: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  hora_cierre: string;

  @IsEnum(DiaSemana)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  dia_semana: DiaSemana;
}

// como todos los campos van a ser opcionales , lo ponemos asi
export class UpdatePistaDto extends PartialType(PistaDto) {

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the installation',
    example: 1,
  })
  instalacion_id: number; // clave foranea instalacion

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the court type',
    example: 1,
  })
  tipo_pista_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Unique name of the court',
    example: 'Central tennis court',
  })
  nombre: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Capacity of the court',
    example: 4,
  })
  capacidad: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Price per hour of the court',
    example: 20.5,
  })
  precio_hora: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court is covered',
    example: true,
  })
  cubierta: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the court has lighting',
    example: true,
  })
  iluminacion: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the court',
    example: 'Court with synthetic grass and night lighting',
  })
  descripcion: string;

  @IsOptional()
  @IsEnum(EstadoPista)
  @ApiProperty({
    description: 'State of the court',
    enum: EstadoPista,
    example: EstadoPista.DISPONIBLE,
  })
  estado: EstadoPista;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '09:00' })
  hora_apertura: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe tener formato HH:mm o HH:mm:ss',
  })
  @ApiProperty({ example: '18:00' })
  hora_cierre: string;

  @IsOptional()
  @IsEnum(DiaSemana)
  @ApiProperty({
    description: 'Day of the week for the court availability',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  dia_semana: DiaSemana;

  // Formato YYYY-MM-DD
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato de fecha debe ser YYYY-MM-DD' })
  @ApiProperty({
    description: 'Start date for selective maintenance',
    example: '2026-06-01',
    required: false
  })
  mantenimiento_desde?: string; 

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato de fecha debe ser YYYY-MM-DD' })
  @ApiProperty({
    description: 'End date for selective maintenance',
    example: '2026-06-10',
    required: false
  })
  mantenimiento_hasta?: string; 
}
