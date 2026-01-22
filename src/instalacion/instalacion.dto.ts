import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { estado_instalacion } from './instalacion.entity' // Importamos el enum estadoReserva desde instalacion.entity
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstalacionDto {
    // @IsNumber()
    // instalacion_id: number;

    @IsString()
    @ApiProperty({
        description: 'Name of the installation',
        example: 'Gym Central',
    })
    nombre: string;

    @IsString()
    @ApiProperty({
        description: 'Address of the installation',
        example: '123 Main St',
    })
    direccion: string;

    @IsString()
    @ApiProperty({
        description: 'Phone number of the installation',
        example: 123456789,
    })
    telefono: string;

    @IsString()
    @ApiProperty({
        description: 'Email of the installation',
        example: 'contact@gymcentral.com',
    })
    email: string;

    @IsNumber()
    @ApiProperty({
        description: 'Maximum capacity of the installation',
        example: 100,
    })
    capacidad_max: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Description of the installation',
        example: 'A well-equipped gym with modern facilities',
    })
    descripcion: string;

    // @IsDateString()
    // @ApiProperty({
    //     description: 'Creation date of the installation',
    //     example: '2023-01-01T00:00:00Z',
    // })
    // fecha_creacion: Date;

    @IsOptional()
    @IsEnum(estado_instalacion)
    @ApiProperty({
        description: 'State of the installation',
        example: estado_instalacion.ACTIVA,
    })
    estado: estado_instalacion;

    @IsDateString()
    @ApiProperty({
        description: 'Opening time of the installation',
        example: '08:00:00',
    })
    horario_apertura: string;

    @IsDateString()
    @ApiProperty({
        description: 'Closing time of the installation',
        example: '22:00:00',
    })
    horario_cierre: string;
}

export class UpdateInstalacionDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Name of the installation',
        example: 'Gym Central',
    })
    nombre?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Address of the installation',
        example: '123 Main St',
    })
    direccion?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Phone number of the installation',
        example: 123456789,
    })
    telefono?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Email of the installation',
        example: 'contact@gymcentral.com',
    })
    email?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'Maximum capacity of the installation',
        example: 100,
    })
    capacidad_max?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Description of the installation',
        example: 'A well-equipped gym with modern facilities',
    })
    descripcion?: string;

    // Estado de la instalacion
    @IsOptional()
    @IsEnum(estado_instalacion)
    @ApiProperty({
        description: 'State of the installation',
        example: estado_instalacion.ACTIVA,
    })
    estado?: estado_instalacion;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Opening time of the installation',
        example: '08:00:00',
    })
    horario_apertura?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Closing time of the installation',
        example: '22:00:00',
    })
    horario_cierre?: string;
}