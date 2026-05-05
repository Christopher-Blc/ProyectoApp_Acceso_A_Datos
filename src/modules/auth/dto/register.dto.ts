import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsDateString,
  Length,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  VALIDATION_LENGTHS,
  VALIDATION_PATTERNS,
} from '../../../common/constants/validation_patterns';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(VALIDATION_LENGTHS.name.min, VALIDATION_LENGTHS.name.max)
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'uniqueUsername',
  })
  username!: string;

  //Nombre
  @IsString()
  @IsNotEmpty()
  @Length(VALIDATION_LENGTHS.name.min, VALIDATION_LENGTHS.name.max)
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Name_User',
  })
  name!: string;

  //Apellido
  @IsString()
  @IsNotEmpty()
  @Length(VALIDATION_LENGTHS.surname.min, VALIDATION_LENGTHS.surname.max)
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Surname_User',
  })
  surname!: string;

  //Correo electronico
  @IsEmail()
  @Matches(VALIDATION_PATTERNS.email.pattern, {
    message: VALIDATION_PATTERNS.email.message,
  })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@example.com',
  })
  email!: string;

  //Telefono
  @IsPhoneNumber('ES')
  @Matches(VALIDATION_PATTERNS.phone.pattern, {
    message: VALIDATION_PATTERNS.phone.message,
  })
  @ApiProperty({
    description: 'Phone number of the user',
    example: 123456789,
  })
  phone!: string;

  //password tiene que tener por lo menos una mayuscula, una minuscula, un numero y un caracter especial
  @ApiProperty({
    description: 'Password of the user',
    minLength: 8,
    maxLength: 100,
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(VALIDATION_LENGTHS.password.min, VALIDATION_LENGTHS.password.max)
  @Matches(VALIDATION_PATTERNS.password.pattern, {
    message: VALIDATION_PATTERNS.password.message,
  })
  password!: string;

  // Fechas
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  fecha_nacimiento!: string;

  //direccion
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
  })
  direccion!: string;
}
