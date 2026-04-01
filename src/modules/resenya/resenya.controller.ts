import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ResenyaService } from './resenya.service';
import { CreateResenyaDto, UpdateResenyaDto } from './dto/resenya.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Resenya } from './entities/resenya.entity';

@ApiTags('resenyas')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('resenya')
export class ResenyaController {
    constructor(private readonly resenyaService : ResenyaService) {}

    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.' })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Resenya[]> {
        return this.resenyaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a review by ID' })
    @ApiResponse({ status: 200, description: 'Review retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid review ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Review not found.' })
    async findOne(@Param('id') id: number): Promise<Resenya | null> {
        return this.resenyaService.findOne(id);
    }

    @Post()
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new review' })
    @ApiResponse({ status: 201, description: 'Review created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() resenyaDto : CreateResenyaDto): Promise<Resenya | null> {
        return this.resenyaService.create(resenyaDto);
    }

    @Put(':id')
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a review by ID' })
    @ApiResponse({ status: 200, description: 'Review updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Review not found.' })
    async update(@Param('id') id: number, @Body() resenyaDto: UpdateResenyaDto): Promise<Resenya | null> {
        return this.resenyaService.update(id, resenyaDto);
    }   

    @Delete(':id')
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a review by ID' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid review ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Review not found.' })
    async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
        return this.resenyaService.remove(id);
    }
}






