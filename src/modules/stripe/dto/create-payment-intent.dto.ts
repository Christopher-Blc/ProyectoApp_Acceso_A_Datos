import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 42, description: 'ID de la reserva a pagar' })
  @IsInt()
  @IsPositive()
  reservationId!: number;
}
