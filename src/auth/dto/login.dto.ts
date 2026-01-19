import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
