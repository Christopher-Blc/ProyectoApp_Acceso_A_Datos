
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

// export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   @ApiPropertyOptional({
//     description: 'Name of the user',
//     minLength: 1,
//     maxLength: 500,
//     example: 'John',
//   })
//   name?: string;

//   @IsOptional()
//   @IsString()
//   @ApiPropertyOptional({
//     description: 'Username of the user',
//     minLength: 1,
//     maxLength: 500,
//     example: 'Percebe',
//   })
//   surname?: string;

//   // @IsOptional()
//   // @IsString()
//   // @Matches(
//   //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//   //   {
//   //     message: 'password too weak',
//   //   },
//   // )
//   // @ApiPropertyOptional({
//   //   description: 'Password of the user',
//   //   minLength: 8,
//   //   maxLength: 100,
//   //   example: 'StrongP@ssw0rd',
//   // })
//   // password?: string;

//   @IsOptional()
//   @IsEmail()
//   @ApiPropertyOptional({
//     description: 'Email of the user',
//     example: 'johndoe@example.com',
//   })
//   email?: string;

//   @IsOptional()
//   @ApiPropertyOptional({
//     description: 'Role of the user',
//     minimum: 0,
//     maximum: 5,
//     example: 1,
//   })
//   role?: number;

  

