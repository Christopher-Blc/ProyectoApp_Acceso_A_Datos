import { IsString, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import {estadoReserva} from './reserva.entity'; // Importamos el enum estadoReserva desde reserva.entity

export class CreateReservaDto {
    @IsNumber()
    reserva_id: number;
    
    @IsDateString()
    fecha_reserva: Date;

    @IsDateString()
    fecha_inicio: Date; 

    @IsDateString()
    fecha_fin: Date;

    @IsOptional()
    @IsEnum(estadoReserva)
    estado: estadoReserva;

    @IsNumber()
    precio_total: number;

    @IsDateString()
    fecha_creacion: Date;

    @IsString()
    codigo_reserva: string;

    @IsOptional()
    @IsString()
    nota: string;
}

export class UpdateReservaDto {
    @IsOptional()
    @IsDateString()
    fecha_reserva?: Date;

    @IsOptional()
    @IsDateString()
    fecha_inicio?: Date;

    @IsOptional()
    @IsDateString()
    fecha_fin?: Date;

    // Estado de la reserva
    @IsOptional()
    @IsEnum(estadoReserva)
    estado?: estadoReserva;

    @IsOptional()
    @IsNumber()
    precio_total?: number;

    @IsOptional()
    @IsString()
    nota?: string;
}