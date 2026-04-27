import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  VALIDATION_LENGTHS,
  VALIDATION_PATTERNS,
} from '../../../common/constants/validation_patterns';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'prueba@prueba.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Abc@1234' })
  password: string;
}
