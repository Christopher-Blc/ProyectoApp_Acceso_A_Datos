import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { HorarioPistaService } from './horario_pista.service';
import { Horario_Pista } from './horario_pista.entity';
import { CreateHorarioPistaDto, UpdateHorarioPistaDto } from './horario_pista.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';


@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('horario-pista')
export class HorarioPistaController {
    constructor(private readonly HorarioPistaService: HorarioPistaService) {}

    @Get()
    @ApiOperation({ summary: 'Get all horario_pista' })
    @ApiResponse({ status: 200, description: 'Horario_Pista retrieved successfully.' })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Horario_Pista[]> {
        return this.HorarioPistaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a horario_pista by ID' })
    @ApiResponse({ status: 200, description: 'Horario_Pista retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid horario_pista ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Horario_Pista not found.' })
    async findOne(@Param('id') id: number): Promise<Horario_Pista | null> {
        return this.HorarioPistaService.findOne(id);
    }

    @Post()
    @Roles(UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new horario_pista' })
    @ApiResponse({ status: 201, description: 'Horario_Pista created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid horario_pista data.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() horario_pistaDto: CreateHorarioPistaDto): Promise<Horario_Pista | null> {
        // Convert string dates to Date objects
        const data: Partial<Horario_Pista> = {
            ...horario_pistaDto,
            hora_apertura: new Date(horario_pistaDto.hora_apertura),
            hora_cierre: new Date(horario_pistaDto.hora_cierre),
        };
        return this.HorarioPistaService.create(data);
    }

    @Put(':id')
    @Roles(UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a horario_pista by ID' })
    @ApiResponse({ status: 200, description: 'Horario_Pista updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid horario_pista data.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Horario_Pista not found.' })
    async update(@Param('id') id: number, @Body() horario_pistaDto: UpdateHorarioPistaDto): Promise<Horario_Pista | null> {
        return this.HorarioPistaService.update(id, horario_pistaDto);
    }

    @Delete(':id')
    @Roles(UserRole.GESTOR_RESERVAS, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a horario_pista by ID' })
    @ApiResponse({ status: 200, description: 'Horario_Pista deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid horario_pista ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Horario_Pista not found.' })
    async remove(@Param('id') id: number): Promise<void | {deleted: boolean}>{
        return this.HorarioPistaService.remove(id);
    }
}
