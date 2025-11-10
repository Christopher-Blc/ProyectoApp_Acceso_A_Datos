import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { estado_instalacion } from './instalacion.entity' // Importamos el enum estadoReserva desde instalacion.entity

export class CreateInstalacionDto {
    @IsNumber()
    instalacion_id: number;

    @IsString()
    nombre: string;

    @IsString()
    direccion: string;

    @IsString()
    telefono: string;

    @IsString()
    email: string;

    @IsNumber()
    capacidad_max: number;

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsDateString()
    fecha_creacion: Date;

    @IsOptional()
    @IsEnum(estado_instalacion)
    estado: estado_instalacion;

    @IsDateString()
    horario_apertura: Date;

    @IsDateString()
    horario_cierre: Date;
}

export class UpdateInstalacionDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsNumber()
    capacidad_max?: number;

    @IsOptional()
    @IsString()
    descripcion?: string;

    // Estado de la instalacion
    @IsOptional()
    @IsEnum(estado_instalacion)
    estado?: estado_instalacion;

    @IsOptional()
    @IsDateString()
    horario_apertura?: Date;

    @IsOptional()
    @IsDateString()
    horario_cierre?: Date;
}