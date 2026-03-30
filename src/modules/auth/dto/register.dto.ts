import { IsString, IsEmail , IsPhoneNumber , IsOptional, IsDateString , Length, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  //Nombre
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  @ApiProperty({
    description: 'Name of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Name_User',
  })  
  name: string;

  //Apellido
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  @ApiProperty({
    description: 'Surname of the user',
    minLength: 1,
    maxLength: 40,
    example: 'Surname_User',
  })
  surname: string;

  //Correo electronico
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'email@example.com',
  })
  email: string;

  //Telefono
  @IsPhoneNumber('ES')
  @ApiProperty({
    description: 'Phone number of the user',
    example: 123456789,
  })
  phone: string;


  //password tiene que tener por lo menos una mayuscula, una minuscula, un numero y un caracter especial
  @ApiProperty({
    description: 'Password of the user',
    minLength: 8,
    maxLength: 100,
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'password too weak',
    },
  )
  password: string;


  // Fechas
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  fecha_nacimiento: string;

  //direccion
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
  })
  direccion: string;
}