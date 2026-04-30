import { IsString, IsInt, IsNumber, IsOptional, Min, Max, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMembresiaDto {
  @IsInt()
  @Min(1)
  @Max(10)
  rango: number;

  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  descuento: number;

  @IsInt()
  @Min(0)
  reservas_requeridas: number;

  @IsString()
  @IsOptional()
  beneficios?: string;
}

export class UpdateMembresiaDto extends PartialType(CreateMembresiaDto) {}