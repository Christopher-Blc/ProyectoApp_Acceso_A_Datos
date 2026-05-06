import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCourtTypeDto {
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  name!: string;

  @IsString()
  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  image!: string;
}

export class UpdateCourtTypeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type picture',
    example: 'todavia no hay example porque no se pueden subir desde el front',
  })
  image?: string;
}
