import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { estado_membresia } from './membresia.entity' // Importamos el enum estadoReserva desde membresia.entity
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembresiaDto {
    @IsNumber()
    membresia_id: number;
    
    @IsNumber()
    @ApiProperty({
        description: 'User ID associated with the membership',
        example: 1,
    })
    usuario_id: number;
    
    @IsString()
    @ApiProperty({
        description: 'Type of the membership',
        example: 'Basic',
    })
    tipo: string;

    @IsDateString()
    @ApiProperty({
        description: 'Start date of the membership',
        example: '2024-01-01',
    })
    fecha_inicio: string; 

    @IsDateString()
    @ApiProperty({
        description: 'End date of the membership',
        example: '2024-12-31',
    })
    fecha_fin: string;

    @IsOptional()
    @IsEnum(estado_membresia)
    @ApiProperty({
        description: 'State of the membership',
        enum: estado_membresia,
        example: estado_membresia.ACTIVA,
    })
    estado: estado_membresia;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'Discount applied to the membership',
        example: 10,
    })
    descuento: number;

    @IsBoolean()
    @ApiProperty({
        description: 'Indicates if the membership is renewable',
        example: true,
    })
    renovable: boolean;

    @IsDateString()
    @ApiProperty({
        description: 'Renewal date of the membership',
        example: '2024-12-31',
    })
    fecha_renovacion: string;
}

export class UpdateMembresiaDto {

    @IsOptional()
    @IsString()
    tipo: string;

    // @IsOptional()
    // @IsDateString()
    // fecha_inicio: Date; 

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'End date of the membership',
        example: '2024-12-31',
    })
    fecha_fin: string;

    @IsOptional()
    @IsEnum(estado_membresia)
    @ApiProperty({
        description: 'State of the membership',
        enum: estado_membresia,
        example: estado_membresia.ACTIVA,
    })
    estado: estado_membresia;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'Discount applied to the membership',
        example: 10,
    })
    descuento: number;

    @IsBoolean()
    @ApiProperty({
        description: 'Indicates if the membership is renewable',
        example: true,
    })
    renovable: boolean;

    @IsDateString()
    @ApiProperty({
        description: 'Renewal date of the membership',
        example: '2024-12-31',
    })
    fecha_renovacion: string;
}