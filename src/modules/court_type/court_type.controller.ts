import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourtTypeService, CourtTypeWithCount } from './court_type.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CourtType } from './entities/court_type.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreateCourtTypeDto,
  UpdateCourtTypeDto,
} from './dto/court_type.dto';
import { normalizeError } from '../../common/utils/error.util';

@ApiTags('court-types')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('court-types')
export class CourtTypeController {
  constructor(private readonly CourtTypeService: CourtTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all court types' })
  @ApiResponse({
    status: 200,
    description: 'Court types retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<CourtTypeWithCount[]> {
    try {
      return this.CourtTypeService.findAll();
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get court type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Court type retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async findOne(@Param('id') id: number): Promise<CourtTypeWithCount> {
    try {
      return this.CourtTypeService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new court type' })
  @ApiResponse({ status: 201, description: 'Court type created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() courtTypeDto: CreateCourtTypeDto): Promise<CourtType | null> {
    try {
      return this.CourtTypeService.create(courtTypeDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an existing court type' })
  @ApiResponse({ status: 200, description: 'Court type updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async update(
    @Param('id') id: number,
    @Body() courtTypeDto: UpdateCourtTypeDto,
  ): Promise<CourtType | null> {
    try {
      return this.CourtTypeService.update(id, courtTypeDto);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete court type by ID' })
  @ApiResponse({ status: 200, description: 'Court type deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.CourtTypeService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
