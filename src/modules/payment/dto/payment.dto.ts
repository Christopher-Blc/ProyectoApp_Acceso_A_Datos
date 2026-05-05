import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { estado_pago, metodo_pago } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @ApiProperty()
  Payment_id: number;

  @IsNumber()
  @ApiProperty({
    description: 'Amount of the payment',
    example: 10.5,
  })
  monto: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the payment',
    example: '2024-01-01T10:00:00Z',
  })
  fecha_Payment: string;

  // Método de Payment
  @IsEnum(metodo_pago)
  @ApiProperty({
    description: 'Payment method',
    example: metodo_pago.VISA,
  })
  metodo_pago: metodo_pago;

  // Estado del Payment
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

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Amount of the payment',
    example: 10.5,
  })
  monto?: number;

  // @IsOptional()
  // @IsDateString()
  // fecha_Payment?: Date;

  // Método de Payment
  @IsOptional()
  @IsEnum(metodo_pago)
  @ApiProperty({
    description: 'Payment method',
    example: metodo_pago.VISA,
  })
  metodo_pago?: metodo_pago;

  // Estado del Payment
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







