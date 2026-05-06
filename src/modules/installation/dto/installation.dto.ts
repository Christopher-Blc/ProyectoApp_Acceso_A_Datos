import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstallationStatus } from '../entities/installation.entity';

export class CreateInstallationDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the installation',
    example: 'Gym Central',
  })
  name!: string;

  @IsString()
  @ApiProperty({
    description: 'Address of the installation',
    example: '123 Main St',
  })
  address!: string;

  @IsString()
  @ApiProperty({
    description: 'Phone number of the installation',
    example: '123456789',
  })
  phone!: string;

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
  description!: string;

  @IsOptional()
  @IsEnum(InstallationStatus)
  @ApiPropertyOptional({
    description: 'State of the installation',
    example: InstallationStatus.ACTIVE,
  })
  status?: InstallationStatus;
}

export class UpdateInstallationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Name of the installation',
    example: 'Gym Central',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Address of the installation',
    example: '123 Main St',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone number of the installation',
    example: '123456789',
  })
  phone?: string;

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
  description?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Creation date of the installation',
    example: '2023-01-01',
  })
  createdAt?: string;

  @IsOptional()
  @IsEnum(InstallationStatus)
  @ApiPropertyOptional({
    description: 'State of the installation',
    example: InstallationStatus.ACTIVE,
  })
  status?: InstallationStatus;
}
