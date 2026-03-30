import { IsEmail, IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_LENGTHS, VALIDATION_PATTERNS } from '../../../common/constants/validation-patterns';

export class LoginDto {
  @IsEmail()
  @Matches(VALIDATION_PATTERNS.email.pattern, {
    message: VALIDATION_PATTERNS.email.message,
  })
  @IsNotEmpty()
  @ApiProperty({ example: 'prueba@prueba.com' })
  email: string;

  @IsString()
  @Length(VALIDATION_LENGTHS.password.min, VALIDATION_LENGTHS.password.max)
  @Matches(VALIDATION_PATTERNS.password.pattern, {
    message: VALIDATION_PATTERNS.password.message,
  })
  @IsNotEmpty()
  @ApiProperty({ example: 'Abc@1234' })
  password: string;
}



