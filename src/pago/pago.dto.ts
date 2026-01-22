import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { estado_pago, metodo_pago } from "./pago.entity";


export class CreatePagoDto {
@IsNumber()
@ApiProperty()
pago_id: number;

@IsNumber()
@ApiProperty({
    description: 'Amount of the payment',
    example: 10.50,
})
monto: number;

@IsDateString()
@ApiProperty({
    description: 'Date of the payment',
    example: '2024-01-01T10:00:00Z',
})
fecha_pago: string;

// Método de pago
@IsEnum(metodo_pago)
@ApiProperty({
    description: 'Payment method',
    example: metodo_pago.VISA,
})
metodo_pago: metodo_pago;

// Estado del pago
@IsEnum(estado_pago)
@ApiProperty({
    description: 'Payment status',
    example: estado_pago.NO_PAGADO,
})
estado_pago: estado_pago;

@IsString()
@ApiProperty({
    description: 'Additional notes about the payment',
    example: 'Payment received in full',
})
nota: string;

}

export class UpdatePagoDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'Amount of the payment',
        example: 10.50,
    })
    monto?: number;

    // @IsOptional()
    // @IsDateString()
    // fecha_pago?: Date;

    // Método de pago
    @IsOptional()
    @IsEnum(metodo_pago)
    @ApiProperty({
        description: 'Payment method',
        example: metodo_pago.VISA,
    })
    metodo_pago?: metodo_pago;  

    // Estado del pago
    @IsOptional()
    @IsEnum(estado_pago)
    @ApiProperty({
        description: 'Payment status',
        example: estado_pago.NO_PAGADO,
    })
    estado_pago?: estado_pago;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Additional notes about the payment',
        example: 'Payment received in full',
    })
    nota?: string;
}