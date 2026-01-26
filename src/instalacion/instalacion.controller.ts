import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { InstalacionService } from './instalacion.service';
import { Instalacion } from './instalacion.entity';
import { CreateInstalacionDto, UpdateInstalacionDto } from './instalacion.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';


@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('instalacion')
export class InstalacionController {
    constructor(private readonly instalacionService: InstalacionService) {}

    @Get()
    @ApiOperation({ summary: 'Get all memberships' })
    @ApiResponse({ status: 200, description: 'Memberships retrieved successfully.' })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Instalacion[]> {
        return this.instalacionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    async findOne(@Param('id') id: number): Promise<Instalacion | null> {
        return  this.instalacionService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new membership' })
    @ApiResponse({ status: 201, description: 'Membership created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership data.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() instalacionDto: CreateInstalacionDto): Promise<Instalacion | null> {
        return this.instalacionService.create(instalacionDto)
    }

    @Put(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership data.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    async update(@Param('id') id: number, @Body() instalacionDto: UpdateInstalacionDto): Promise<Instalacion> {
        return this.instalacionService.update(id, instalacionDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    async remove(@Param('id') id: number) {
    await this.instalacionService.remove(id);
    return { deleted: true };
}

}
