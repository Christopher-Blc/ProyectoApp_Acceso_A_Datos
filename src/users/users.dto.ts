
import { IsString, IsEmail, IsBoolean, IsPhoneNumber, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { UserRole } from './user.entity'; // Importamos el enum UserRole desde user.entity

export class UserDto {
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
  phone: string;

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