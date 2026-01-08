import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  password: string;
}
