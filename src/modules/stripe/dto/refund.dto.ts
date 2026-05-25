import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundDto {
  @ApiProperty({ example: 42, description: 'ID de la reserva a reembolsar' })
  @IsInt()
  @IsPositive()
  reservationId!: number;
}
