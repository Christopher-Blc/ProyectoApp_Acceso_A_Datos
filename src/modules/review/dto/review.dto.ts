import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the user',
    example: 1,
  })
  user_id!: number;

  @IsNumber()
  @ApiProperty({
    description: 'ID of the Court',
    example: 1,
  })
  installation_id!: number;

  @IsString()
  @ApiProperty({
    description: 'Title of the Review',
    example: 'Great experience!',
  })
  title!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Text of the comentario',
    example:
      'The court was in excellent condition and the staff was very friendly.',
  })
  text?: string;

  @IsNumber()
  @ApiProperty({
    description: 'Rating of the comentario',
    example: 5,
  })
  rating!: number;

  @IsDateString()
  @ApiProperty({
    description: 'Date of the comentario',
    example: '2023-12-31T23:59:59Z',
  })
  comment_date!: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Visibility of the comentario',
    example: true,
  })
  is_visible!: boolean;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Title of the comentario',
    example: 'Great experience!',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Text of the comentario',
    example:
      'The court was in excellent condition and the staff was very friendly.',
  })
  text?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Rating of the comentario',
    example: 5,
  })
  rating?: number;

  // @IsOptional()
  // @IsDateString()
  // fecha_comentario: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Visibility of the comentario',
    example: true,
  })
  is_visible?: boolean;
}
