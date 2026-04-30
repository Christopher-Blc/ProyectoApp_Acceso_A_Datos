import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TipoCourtDto {
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  nombre: string;

  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  imagen: string;
}

export class UpdateTipoCourtDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  nombre: string;

  @IsOptional()
  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  imagen: string;
}
