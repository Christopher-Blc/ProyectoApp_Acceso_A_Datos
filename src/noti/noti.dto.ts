import { IsBoolean, IsDate, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { tipoNoti } from "./noti.entity";

export class NotiDto{

    @IsInt()
    noti_id: number;

    @IsString()
    @IsOptional()
    mensaje?: string;

    @IsEnum(tipoNoti)
    tipoNoti: tipoNoti;

    @IsString()
    canal: string;

    @IsBoolean()
    @IsOptional()
    leida?: boolean;

    @IsDateString()
    fecha: Date;
}