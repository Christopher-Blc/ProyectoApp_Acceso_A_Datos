import { IsString, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import {estadoReserva} from './reserva.entity'; // Importamos el enum estadoReserva desde reserva.entity

export class ReservaDto {
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
