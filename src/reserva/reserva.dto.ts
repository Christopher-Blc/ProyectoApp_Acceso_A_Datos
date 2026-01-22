import { IsString, IsEnum, IsOptional, IsDateString, IsNumber, Length } from 'class-validator';
import {estadoReserva} from './reserva.entity'; // Importamos el enum estadoReserva desde reserva.entity
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
    @IsNumber()
    @ApiProperty({
        description: 'ID of the reservation',
        example: 1,
    })
    reserva_id: number;

    @IsNumber()
    @ApiProperty({
        description: 'ID of the user',
        example: 1,
    })
    usuario_id: number;

    @IsNumber()
    @ApiProperty({
        description: 'ID of the pista',
        example: 1,
    })
    pista_id: number;

    @IsNumber()
    @ApiProperty({
        description: 'ID of the payment',
        example: 1,
    })
    pago_id: number;
    
    @IsDateString()
    @ApiProperty({
        description: 'Date of the reservation',
        example: '1990-01-01',
    })
    fecha_reserva: string;

    @IsDateString()
    @ApiProperty({
        description: 'Start date of the reservation',
        example: '1990-01-01',
    })
    fecha_inicio: string; 

    @IsDateString()
    @ApiProperty({  
        description: 'End date of the reservation',
        example: '1990-01-01',
    })
    fecha_fin: string;

    @IsOptional()
    @IsEnum(estadoReserva)
    @ApiProperty({
        description: 'State of the reservation',
        enum: estadoReserva,
        example: estadoReserva.PENDIENTE,
    })
    estado: estadoReserva;

    @IsNumber()
    @ApiProperty({
        description: 'Total price of the reservation',
        example: 10.50,
    })
    precio_total: number;

    @IsDateString()
    @ApiProperty({
        description: 'Creation date of the reservation',
        example: '1990-01-01T00:00:00Z',
    })
    fecha_creacion: Date;

    @IsString()
    @ApiProperty({
        description: 'Reservation code',
        example: 'ABC123',
    })
    codigo_reserva: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    @ApiProperty({
        description: 'Note for the reservation',
    })
    nota: string;
}

export class UpdateReservaDto {
    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Date of the reservation',
        example: '1990-01-01',
    })
    fecha_reserva?: Date;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Start date of the reservation',
        example: '1990-01-01',
    })
    fecha_inicio?: Date;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'End date of the reservation',
        example: '1990-01-01',
    })
    fecha_fin?: Date;

    // Estado de la reserva
    @IsOptional()
    @IsEnum(estadoReserva)
    @ApiProperty({
        description: 'State of the reservation',
        enum: estadoReserva,
        example: estadoReserva.PENDIENTE,
    })
    estado?: estadoReserva;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'Total price of the reservation',
        example: 10.50,
    })
    precio_total?: number;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    @ApiProperty({
        description: 'Note for the reservation',
    })
    nota?: string;
}