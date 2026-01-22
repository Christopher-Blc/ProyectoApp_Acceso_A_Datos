import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Membresia } from './membresia.entity';
import { MembresiaService } from './membresia.service';
import { CreateMembresiaDto, UpdateMembresiaDto } from './membresia.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('membresia')
export class MembresiaController {
    constructor(private readonly membresiaService: MembresiaService){}

    @Get()
    @ApiOperation({ summary: 'Get all memberships' })
    @ApiResponse({ status: 200, description: 'Memberships retrieved successfully.' })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Membresia[]>{
        return this.membresiaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    @ApiParam({ name: 'id', example: 1 })
    async findOne(@Param('id')id: number): Promise<Membresia | null>{
        return this.membresiaService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new membership' })
    @ApiResponse({ status: 201, description: 'Membership created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid membership data.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() membresiaDto: CreateMembresiaDto): Promise<Membresia>{
        return this.membresiaService.create(membresiaDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 400, description: 'Invalid membership data.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    async update(@Param('id') id: number , @Body() membresiaDto: UpdateMembresiaDto): Promise<Membresia |null>{
        return this.membresiaService.update(id , membresiaDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a membership by ID' })
    @ApiResponse({ status: 200, description: 'Membership deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 400, description: 'Invalid membership ID.' })
    @ApiResponse({ status: 404, description: 'Membership not found.' })
    async remove(@Param('id') id: number): Promise <void |{deleted: boolean}> {
        return this.membresiaService.remove(id);
    }

}
