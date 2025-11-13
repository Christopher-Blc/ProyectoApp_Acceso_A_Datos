import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class ComentarioDto {
    @IsNumber()
    comentario_id: number;  

    @IsString()
    titulo: string;

    @IsOptional()
    @IsString()
    texto: string;

    @IsNumber()
    calificacion: number;

    @IsDateString()
    fecha_comentario: Date;

    @IsBoolean()
    visible: boolean;
}

export class UpdateComentarioDto {
    
    @IsOptional()
    @IsString()
    titulo: string;

    @IsOptional()
    @IsString()
    texto: string;

    @IsOptional()
    @IsNumber()
    calificacion: number;

    // @IsOptional()
    // @IsDateString()
    // fecha_comentario: Date;

    @IsOptional()
    @IsBoolean()
    visible: boolean;
}