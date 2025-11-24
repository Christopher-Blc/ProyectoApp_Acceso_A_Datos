import { ApiProperty } from "@nestjs/swagger";
import { CoberturaPista, EstadoPista, tipo_pista } from "./pista.entity";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class PistaDto {

    @IsNumber()
    @ApiProperty({
        description: 'ID of the installation',
        example: 1,
    })
    instalacion_id: number; // clave foranea instalacion

    @IsEnum(tipo_pista)
    @ApiProperty({
        description: 'Type of the court',
        enum: tipo_pista,
        example: tipo_pista.TENIS,
    })
    tipo_Pista: tipo_pista;

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
    

    @IsEnum(CoberturaPista)
    @ApiProperty({
        description: 'Coverage of the court',
        enum: CoberturaPista,
        example: CoberturaPista.CUBIERTA,
    })
    cobertura: CoberturaPista;

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
    
    @IsNumber()
    @ApiProperty({
        description: 'Number of the court',
        example: 1,
    })
    numero: number;;

}

export class UpdatePistaDto {
    @IsOptional()
    @IsNumber()
    instalacion_id: number; // clave foranea instalacion

    @IsOptional()
    @IsEnum(tipo_pista)
    @ApiProperty({
        description: 'Type of the court',
        enum: tipo_pista,
        example: tipo_pista.TENIS,
    })
    tipo_Pista: tipo_pista;

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
    @IsEnum(CoberturaPista)
    @ApiProperty({
        description: 'Coverage of the court',
        enum: CoberturaPista,
        example: CoberturaPista.CUBIERTA,
    })
    cobertura: CoberturaPista;

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
    @IsNumber()
    @ApiProperty({
        description: 'Number of the court',
        example: 1,
    })
    numero: number;;

}
