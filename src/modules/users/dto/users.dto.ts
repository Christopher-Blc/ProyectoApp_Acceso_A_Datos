
import { IsString, IsEmail, IsBoolean, IsPhoneNumber, IsEnum, IsOptional, IsDateString, IsNumber, Length, Matches } from 'class-validator';
import { UserRole } from '../entities/user.entity'; // Importamos el enum UserRole desde user.entity
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_LENGTHS, VALIDATION_PATTERNS } from '../../../common/constants/validation-patterns';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsString()
  @Length(VALIDATION_LENGTHS.name.min, VALIDATION_LENGTHS.name.max)
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Name_User',
  })  
  name: string;

  @IsString()
  @Length(VALIDATION_LENGTHS.surname.min, VALIDATION_LENGTHS.surname.max)
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Surname_User',
  })
  surname: string;

  @IsEmail()
  @Matches(VALIDATION_PATTERNS.email.pattern, {
    message: VALIDATION_PATTERNS.email.message,
  })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@example.com',
  })
  email: string;

  @IsPhoneNumber('ES')
  @Matches(VALIDATION_PATTERNS.phone.pattern, {
    message: VALIDATION_PATTERNS.phone.message,
  })
  @ApiProperty({
    description: 'Phone number of the user',
    example: 123456789,
  })
  phone: string;

  @ApiProperty({
    description: 'Password of the user',
    minLength: 8,
    maxLength: 100,
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @Length(VALIDATION_LENGTHS.password.min, VALIDATION_LENGTHS.password.max)
  @Matches(VALIDATION_PATTERNS.password.pattern, {
    message: VALIDATION_PATTERNS.password.message,
  })
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
  fecha_nacimiento: string;

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
    example: 'Christtopher',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Bolocan',
  })
  surname?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'christtopher.bolocan@example.com',
  })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('ES')
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+34123456789',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  // Rol con enumeración
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  //Estado del usuario
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Fechas
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: Date;

  @IsOptional()
  @IsString()
  direccion?: string;
}



