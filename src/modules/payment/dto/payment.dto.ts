import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @ApiProperty({
    description: 'Amount of the payment',
    example: 10.5,
  })
  amount!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the payment',
    example: '2024-01-01T10:00:00Z',
  })
  paymentDate!: string;

  // Método de Payment
  @IsEnum(PaymentMethod)
  @ApiProperty({
    description: 'Payment method',
    example: PaymentMethod.VISA,
  })
  paymentMethod!: PaymentMethod;

  // Estado del Payment
  @IsEnum(PaymentStatus)
  @ApiProperty({
    description: 'Payment status',
    example: PaymentStatus.UNPAID,
  })
  paymentStatus!: PaymentStatus;

  @IsString()
  @ApiProperty({
    description: 'Additional notes about the payment',
    example: 'Payment received in full',
  })
  note!: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Amount of the payment',
    example: 10.5,
  })
  amount?: number;

  // @IsOptional()
  // @IsDateString()
  // fecha_Payment?: Date;

  // Método de Payment
  @IsOptional()
  @IsEnum(PaymentMethod)
  @ApiProperty({
    description: 'Payment method',
    example: PaymentMethod.VISA,
  })
  paymentMethod?: PaymentMethod;

  // Estado del Payment
  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiProperty({
    description: 'Payment status',
    example: PaymentStatus.UNPAID,
  })
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Additional notes about the payment',
    example: 'Payment received in full',
  })
  note?: string;
}
