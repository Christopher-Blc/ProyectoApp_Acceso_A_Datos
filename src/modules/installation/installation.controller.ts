import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InstallationService } from './installation.service';
import { Installation } from './entities/installation.entity';
import {
  CreateInstallationDto,
  UpdateInstallationDto,
} from './dto/installation.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('installations')
export class InstallationController {
  constructor(private readonly InstallationService: InstallationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all installations' })
  @ApiResponse({
    status: 200,
    description: 'Installations retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Installation[]> {
    return this.InstallationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an installation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Installation retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid installation ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Installation not found.' })
  async findOne(@Param('id') id: number): Promise<Installation | null> {
    return this.InstallationService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new installation' })
  @ApiResponse({ status: 201, description: 'Installation created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid installation data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() installationDto: CreateInstallationDto,
  ): Promise<Installation | null> {
    return this.InstallationService.create(installationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an installation by ID' })
  @ApiResponse({ status: 200, description: 'Installation updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid installation data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Installation not found.' })
  async update(
    @Param('id') id: number,
    @Body() installationDto: UpdateInstallationDto,
  ): Promise<Installation> {
    return this.InstallationService.update(id, installationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an installation by ID' })
  @ApiResponse({ status: 200, description: 'Installation deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid installation ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Installation not found.' })
  async remove(@Param('id') id: number) {
    await this.InstallationService.remove(id);
    return { deleted: true };
  }
}
