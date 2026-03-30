import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { tipoNoti } from "./noti.entity";

export class NotiDto{

    @IsInt()
    noti_id: number;

    @IsNumber()
    @IsOptional()
    usuario_id?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ 
        description: 'Message of the notification',
        example: 'Your reservation is confirmed',
     })
    mensaje?: string;

    @IsEnum(tipoNoti)
    @ApiProperty({ 
        description: 'Type of the notification',
        example: tipoNoti.AVISO,
     })
    tipoNoti: tipoNoti;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ 
        description: 'Indicates if the notification has been read',
        example: false,
     })
    leida?: boolean;

    @IsDateString()
    @ApiProperty({ 
        description: 'Date of the notification',
        example: '2024-01-01T10:00:00Z',
     })
    fecha: string;
}

export class UpdateNotiDto{

    // @IsString()
    // @IsOptional()
    // mensaje?: string;

    // @IsOptional()
    // @IsEnum(tipoNoti)
    // tipoNoti: tipoNoti;

    // @IsOptional()
    // @IsString()
    // canal: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ 
        description: 'Indicates if the notification has been read',
        example: false,
     })
    leida?: boolean;

    // @IsOptional()
    // @IsDateString()
    // fecha: Date;
}