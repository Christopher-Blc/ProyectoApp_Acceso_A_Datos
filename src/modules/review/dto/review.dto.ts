import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID of the Court',
    example: 1,
  })
  court_id!: number;

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
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Rating of the comentario (entre 1 y 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating!: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the Court',
    example: 1,
  })
  court_id?: number;

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
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Rating of the review (between 1 and 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Admin answer to the review',
    example:
      'Thank you for your feedback! We are glad you enjoyed your experience.',
  })
  admin_answer?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Visibility of the review',
    example: true,
  })
  is_visible?: boolean;
}
