import { IsDateString, IsEnum, IsInt, IsOptional } from "class-validator";
import { dia_semana } from "./horario_pista.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateHorarioPistaDto {

    // @IsInt()
    // horario_id: number;

    @IsInt()
    @ApiProperty({
        description: 'ID of the pista',
        example: 1,
    })
    pista_id: number;//llave secundaria que viene de la tabla pista

    @IsEnum(dia_semana)
    @ApiProperty({
        description: 'Day of the week',
        example: dia_semana.LUNES,
    })
    dia_semana: dia_semana;

    @IsDateString()
    @ApiProperty({
        description: 'Opening time of the pista',
        example: '08:00:00',
    })
    hora_apertura: string;//Time

    @IsDateString()
    @ApiProperty({
        description: 'Closing time of the pista',
        example: '22:00:00',
    })
    hora_cierre: string;//Time

    @IsInt()
    @ApiProperty({
        description: 'Interval in minutes',
        example: 30,
    })
    intervalos_minutos: number;
}

export class UpdateHorarioPistaDto {
    // Dias de la semana
    @IsOptional()
    @IsEnum(dia_semana)
    @ApiProperty({
        description: 'Day of the week',
        example: dia_semana.MARTES,
    })
    dia_semana?: dia_semana;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Opening time of the pista',
        example: '08:00:00',
    })
    hora_apertura?: string;//Time

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'Closing time of the pista',
        example: '22:00:00',
    })
    hora_cierre?: string;//Time

    @IsOptional()
    @IsInt()
    @ApiProperty({
        description: 'Interval in minutes',
        example: 30,
    })
    intervalos_minutos?: number;
}