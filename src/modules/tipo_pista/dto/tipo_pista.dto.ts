import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TipoPistaDto {
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  nombre: string;

  @IsString()
  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  imagen: string;
}

export class UpdateTipoPistaDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  nombre: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  imagen: string;
}