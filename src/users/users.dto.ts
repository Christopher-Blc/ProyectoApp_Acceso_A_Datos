
import { IsString, IsEmail, IsBoolean, IsPhoneNumber, IsEnum, IsOptional, IsDateString, IsNumber, Matches } from 'class-validator';
import { UserRole } from './user.entity'; // Importamos el enum UserRole desde user.entity
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('ES')
  phone: number;

  @IsString()
  password: string;

  // Rol con enumeración
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  //Estado del usuario
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Fechas
  @IsDateString()
  fecha_nacimiento: Date;

  @IsString()
  direccion: string;
}