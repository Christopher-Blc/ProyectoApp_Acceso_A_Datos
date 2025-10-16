import { IsDateString, IsEnum, IsInt } from "class-validator";
import { dia_semana } from "./horario_pista.entity";

export class horario_pistaDto {

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