import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { PagoService } from './pago.service';
import { Pago } from './pago.entity';
import { CreatePagoDto, UpdatePagoDto } from './pago.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/users/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('pago')
export class PagoController {
    constructor(private readonly pagoService: PagoService) {}

    @Get()
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get all payments' })
    @ApiResponse({ status: 200, description: 'List of payments', type: [Pago] })
    @ApiResponse({ status: 204, description: 'No content.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findAll(): Promise<Pago[]>{
        try {
            return this.pagoService.findAll();
        } catch (err) {
            throw new HttpException(
              err.message,
              err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a payment by ID' })
    @ApiResponse({ status: 200, description: 'The payment', type: Pago })
    @ApiResponse({ status: 404, description: 'Payment not found.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async findOne(@Param('id') id: number): Promise<Pago | null> {
        try {
            return this.pagoService.findOne(id);
        } catch (err) {
            throw new HttpException(
              err.message,
              err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post()
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new payment' })
    @ApiResponse({ status: 201, description: 'Payment created successfully.', type: Pago })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' }) 
    async create(@Body() createPagoDto: CreatePagoDto): Promise<Pago | null> {
        try {
            const pagoData = {
                ...createPagoDto,
                fecha_pago: new Date(createPagoDto.fecha_pago),
            };
            return this.pagoService.create(pagoData);
        } catch (err) {
            throw new HttpException(
              err.message,
              err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Put(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Update a payment by ID' })
    @ApiResponse({ status: 200, description: 'Payment updated successfully.', type: Pago })
    @ApiResponse({ status: 404, description: 'Payment not found.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async update(@Param('id') id: number, @Body() updatePagoDto: UpdatePagoDto): Promise<Pago | null> {
        try {
            return this.pagoService.update(id, updatePagoDto);
        } catch (err) {
            throw new HttpException(
              err.message,
              err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Delete(':id')
    @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Delete a payment by ID' })
    @ApiResponse({ status: 200, description: 'Payment deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Payment not found.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async remove(@Param('id') id: number): Promise<void | {deleted: boolean}>{
        try {
            return this.pagoService.remove(id);
        } catch (err) {
            throw new HttpException(
              err.message,
              err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
