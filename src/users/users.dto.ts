
import { IsString, IsEmail, IsBoolean, IsPhoneNumber, IsEnum, IsOptional, IsDateString, IsNumber, Length, Matches } from 'class-validator';
import { UserRole } from './user.entity'; // Importamos el enum UserRole desde user.entity
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsString()
  @Length(1, 40)
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Name_User',
  })  
  name: string;

  @IsString()
  @Length(1, 40)
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Surname_User',
  })
  surname: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@example.com',
  })
  email: string;

  @IsPhoneNumber('ES')
  @ApiProperty({
    description: 'Phone number of the user',
    example: 123456789,
  })
  phone: number;

  @ApiProperty({
    description: 'Password of the user',
    minLength: 8,
    maxLength: 100,
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @Length(8, 100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'password too weak',
    },
  )
  password: string;

  // Rol con enumeración
  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CLIENTE,
  })
  role?: UserRole;

  //Estado del usuario
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
  })
  isActive?: boolean;

  // Fechas
  @IsDateString()
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  fecha_nacimiento: Date;

  @IsString()
  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
  })
  direccion: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Name_User',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Surname_User',
  })
  surname?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@example.com',
  })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('ES')
  @ApiProperty({
    description: 'Phone number of the user',
    example: 123456789,
  })
  phone?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Password of the user',
    minLength: 8,
    maxLength: 100,
    example: 'StrongP@ssw0rd!',
  })
  password?: string;

  // Rol con enumeración
  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CLIENTE,
  })
  role?: UserRole;

  //Estado del usuario
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
  })
  isActive?: boolean;

  // Fechas
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  fecha_nacimiento?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
  })
  direccion?: string;
}