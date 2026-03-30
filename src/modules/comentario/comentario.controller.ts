import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { Comentario } from './comentario.entity';
import { CreateComentarioDto, UpdateComentarioDto } from './comentario.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';

@ApiTags('comentarios')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('comentario')
export class ComentarioController {
    constructor(private readonly comentarioService: ComentarioService) {}

    @Get()
    @ApiOperation({ summary: 'Get all comentarios' })
    @ApiResponse({ status: 200, description: 'Comentarios retrieved successfully.' })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Comentario[]> {
        return this.comentarioService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a comentario by ID' })
    @ApiResponse({ status: 200, description: 'Comentario retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid comentario ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Comentario not found.' })
    async findOne(@Param('id') id: number): Promise<Comentario | null> {
        return this.comentarioService.findOne(id);
    }

    @Post()
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new comentario' })
    @ApiResponse({ status: 201, description: 'Comentario created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async create(@Body() comentarioDto: CreateComentarioDto): Promise<Comentario | null> {
        return this.comentarioService.create(comentarioDto);
    }

    @Put(':id')
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a comentario by ID' })
    @ApiResponse({ status: 200, description: 'Comentario updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Comentario not found.' })
    async update(@Param('id') id: number, @Body() comentarioDto: UpdateComentarioDto): Promise<Comentario | null> {
        return this.comentarioService.update(id, comentarioDto);
    }   

    @Delete(':id')
    @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a comentario by ID' })
    @ApiResponse({ status: 200, description: 'Comentario deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid comentario ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Comentario not found.' })
    async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
        return this.comentarioService.remove(id);
    }
}
