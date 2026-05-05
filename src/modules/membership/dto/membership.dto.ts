import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMembershipDto {
  @IsInt()
  @Min(1)
  @Max(10)
  @ApiProperty({
    description: 'Nivel de la membresía',
    example: 1,
  })
  rango!: number;

  @IsString()
  @Length(1, 100)
  @ApiProperty({
    description: 'Nombre visible de la membresía',
    example: 'Bronce',
  })
  nombre!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: 'Descuento aplicado a la membresía',
    example: 5,
  })
  descuento!: number;

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Número mínimo de reservas requeridas',
    example: 10,
  })
  reservas_requeridas!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Beneficios asociados a la membresía',
    example: '5% de descuento y prioridad en eventos.',
  })
  beneficios?: string;
}

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
