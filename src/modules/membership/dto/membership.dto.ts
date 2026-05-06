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
    description: 'Membership level',
    example: 1,
  })
  level!: number;

  @IsString()
  @Length(1, 100)
  @ApiProperty({
    description: 'Visible membership name',
    example: 'Bronce',
  })
  name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: 'Membership discount',
    example: 5,
  })
  discount!: number;

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Minimum number of required reservations',
    example: 10,
  })
  requiredReservations!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Membership benefits',
    example: '5% de descuento y prioridad en eventos.',
  })
  benefits?: string;
}

export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
