import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email verification token',
    example:
      '4d45f851ec1efffd91648e4e95f5e216c614d78418f72395e8d67f8e874fdbf4',
  })
  token!: string;
}
