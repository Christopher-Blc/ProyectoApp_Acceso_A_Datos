import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { estado_instalacion } from '../entities/installation.entity';

export class CreateInstallationDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the installation',
    example: 'Gym Central',
  })
  nombre!: string;

  @IsString()
  @ApiProperty({
    description: 'Address of the installation',
    example: '123 Main St',
  })
  direccion!: string;

  @IsString()
  @ApiProperty({
    description: 'Phone number of the installation',
    example: '123456789',
  })
  telefono!: string;

  @IsString()
  @ApiProperty({
    description: 'Email of the installation',
    example: 'contact@gymcentral.com',
  })
  email!: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the installation',
    example: 'A well-equipped gym with modern facilities',
  })
  descripcion!: string;

  @IsOptional()
  @IsEnum(estado_instalacion)
  @ApiPropertyOptional({
    description: 'State of the installation',
    example: estado_instalacion.ACTIVA,
  })
  estado?: estado_instalacion;
}

export class UpdateInstallationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Name of the installation',
    example: 'Gym Central',
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Address of the installation',
    example: '123 Main St',
  })
  direccion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone number of the installation',
    example: '123456789',
  })
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Email of the installation',
    example: 'contact@gymcentral.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Description of the installation',
    example: 'A well-equipped gym with modern facilities',
  })
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Creation date of the installation',
    example: '2023-01-01',
  })
  fecha_creacion?: string;

  @IsOptional()
  @IsEnum(estado_instalacion)
  @ApiPropertyOptional({
    description: 'State of the installation',
    example: estado_instalacion.ACTIVA,
  })
  estado?: estado_instalacion;
}







