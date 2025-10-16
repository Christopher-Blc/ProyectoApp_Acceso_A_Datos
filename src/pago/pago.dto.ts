import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator";
import { estado_pago, metodo_pago } from "./pago.entity";


export class PagoDto {
@IsNumber()
pago_id: number;

@IsNumber()
monto: number;

@IsDateString()
fecha_pago: Date;

@IsEnum(metodo_pago)
metodo_pago: metodo_pago;

@IsEnum(estado_pago)
estado_pago: estado_pago;

@IsString()
nota: string;

}