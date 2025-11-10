import { CoberturaPista, EstadoPista, tipo_pista } from "./pista.entity";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class PistaDto {

    @IsNumber()
    instalacion_id: number; // clave foranea instalacion

    @IsEnum(tipo_pista)
    tipo_Pista: tipo_pista;

    @IsNumber()
    capacidad: number;

    @IsNumber()
    precio_hora: number;
    

    @IsEnum(CoberturaPista)
    cobertura: CoberturaPista;

    @IsBoolean()
    iluminacion: boolean;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsEnum(EstadoPista)
    estado: EstadoPista;
    
    @IsNumber()
    numero: number;;

}

export class UpdatePistaDto {

    @IsOptional()
    @IsEnum(tipo_pista)
    tipo_Pista: tipo_pista;

    @IsOptional()
    @IsNumber()
    capacidad: number;

    @IsOptional()
    @IsNumber()
    precio_hora: number;
    
    @IsOptional()
    @IsEnum(CoberturaPista)
    cobertura: CoberturaPista;

    @IsOptional()
    @IsBoolean()
    iluminacion: boolean;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsOptional()
    @IsEnum(EstadoPista)
    estado: EstadoPista;
    
    @IsOptional()
    @IsNumber()
    numero: number;;

}
