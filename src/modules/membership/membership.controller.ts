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
import { Membership } from './entities/membership.entity';
import { MembershipService } from './membership.service';
import { CreateMembershipDto, UpdateMembershipDto } from './dto/membership.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('memberships')
export class MembershipController {
  constructor(private readonly MembershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiResponse({
    status: 200,
    description: 'Memberships retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Membership[]> {
    return this.MembershipService.findAll();
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
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<Membership | null> {
    return this.MembershipService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid membership data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() MembershipDto: CreateMembershipDto): Promise<Membership> {
    return this.MembershipService.create(MembershipDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Invalid membership data.' })
  @ApiResponse({ status: 404, description: 'Membership not found.' })
  async update(
    @Param('id') id: number,
    @Body() MembershipDto: UpdateMembershipDto,
  ): Promise<Membership | null> {
    return this.MembershipService.update(id, MembershipDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
  @ApiResponse({ status: 404, description: 'Membership not found.' })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    return this.MembershipService.remove(id);
  }
}



