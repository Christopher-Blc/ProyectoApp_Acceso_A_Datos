import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCourtTypeDto {
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  name!: string;
}

export class UpdateCourtTypeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sport type name',
    example: 'Tennis',
  })
  name?: string;
}
