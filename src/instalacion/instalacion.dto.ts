import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { estado_instalacion } from './instalacion.entity' // Importamos el enum estadoReserva desde instalacion.entity

export class InstalacionDto {
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