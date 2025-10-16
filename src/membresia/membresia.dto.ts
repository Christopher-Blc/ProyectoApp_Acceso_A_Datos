import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { estado_membresia } from './membresia.entity' // Importamos el enum estadoReserva desde membresia.entity

export class MembresiaDto {
    @IsNumber()
    membresia_id: number;
    
    @IsString()
    tipo: string;

    @IsDateString()
    fecha_inicio: Date; 

    @IsDateString()
    fecha_fin: Date;

    @IsOptional()
    @IsEnum(estado_membresia)
    estado: estado_membresia;

    @IsOptional()
    @IsNumber()
    descuento: number;

    @IsBoolean()
    renovable: boolean;

    @IsDateString()
    fecha_renovacion: Date;
}