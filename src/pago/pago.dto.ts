import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { estado_pago, metodo_pago } from "./pago.entity";


export class CreatePagoDto {
@IsNumber()
pago_id: number;

@IsNumber()
monto: number;

@IsDateString()
fecha_pago: Date;

// Método de pago
@IsEnum(metodo_pago)
metodo_pago: metodo_pago;

// Estado del pago
@IsEnum(estado_pago)
estado_pago: estado_pago;

@IsString()
nota: string;

}

export class UpdatePagoDto {
    @IsOptional()
    @IsNumber()
    monto?: number;

    // @IsOptional()
    // @IsDateString()
    // fecha_pago?: Date;

    // Método de pago
    @IsOptional()
    @IsEnum(metodo_pago)
    metodo_pago?: metodo_pago;  

    // Estado del pago
    @IsOptional()
    @IsEnum(estado_pago)
    estado_pago?: estado_pago;

    @IsOptional()
    @IsString()
    nota?: string;
}