import { IsString, Length, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  VALIDATION_LENGTHS,
  VALIDATION_PATTERNS,
} from '../../../common/constants/validation_patterns';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password reset token sent by email',
    example: '8f25f19f4a8e3f31f2f3a338f6de3f4f6f0a1ac5c8d2e4d6a7b8c9d0e1f2a3b4',
  })
  token!: string;

  @IsString()
  @IsNotEmpty()
  @Length(VALIDATION_LENGTHS.password.min, VALIDATION_LENGTHS.password.max)
  @Matches(VALIDATION_PATTERNS.password.pattern, {
    message: VALIDATION_PATTERNS.password.message,
  })
  @ApiProperty({
    description: 'New password',
    example: 'StrongP@ssw0rd!',
  })
  new_password!: string;
}
