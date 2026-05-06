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
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiResponse({
    status: 200,
    description: 'Memberships retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Installation[]> {
    return this.InstallationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a membership by ID' })
  @ApiResponse({
    status: 200,
    description: 'Membership retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Membership not found.' })
  async findOne(@Param('id') id: number): Promise<Installation | null> {
    return this.InstallationService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid membership data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() InstallationDto: CreateInstallationDto,
  ): Promise<Installation | null> {
    return this.InstallationService.create(InstallationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid membership data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Membership not found.' })
  async update(
    @Param('id') id: number,
    @Body() InstallationDto: UpdateInstallationDto,
  ): Promise<Installation> {
    return this.InstallationService.update(id, InstallationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Membership not found.' })
  async remove(@Param('id') id: number) {
    await this.InstallationService.remove(id);
    return { deleted: true };
  }
}
