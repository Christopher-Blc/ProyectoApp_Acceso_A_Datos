import { IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_PATTERNS } from '../../../common/constants/validation_patterns';

export class ForgotPasswordDto {
  @IsEmail()
  @Matches(VALIDATION_PATTERNS.email.pattern, {
    message: VALIDATION_PATTERNS.email.message,
  })
  @ApiProperty({
    description: 'Email address associated with the account',
    example: 'email@example.com',
  })
  email!: string;
}
