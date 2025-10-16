import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class ComentarioDto {
    @IsNumber()
    comentario_id: number;  
    
    @IsOptional()
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