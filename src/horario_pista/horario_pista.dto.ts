import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";
import { dia_semana } from "./horario_pista.entity";

export class CreateHorarioPistaDto {

    @IsInt()
    horario_id: number;

    @IsInt()
    pista_id: number;//llave secundaria que viene de la tabla pista

    @IsEnum(dia_semana)
    dia_semana: dia_semana;

    @IsDateString()
    hora_apertura: Date;//Time

    @IsDateString()
    hora_cierre: Date;//Time

    @IsInt()
    intervalos_minutos: number;
}

export class UpdateHorarioPistaDto {
    // Dias de la semana
    @IsOptional()
    @IsEnum(dia_semana)
    dia_semana?: dia_semana;

    @IsOptional()
    @IsDateString()
    hora_apertura?: Date;//Time

    @IsOptional()
    @IsDateString()
    hora_cierre?: Date;//Time

    @IsOptional()
    @IsInt()
    intervalos_minutos?: number;
}