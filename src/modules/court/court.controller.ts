import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourtService } from './court.service';
import { CreateCourtDto, UpdateCourtDto } from './dto/court.dto';
import { Court } from './entities/court.entity';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { normalizeError } from '../../common/utils/error.util';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('courts')
@ApiBearerAuth()
@Controller('courts')
export class CourtController {
  constructor(private readonly CourtService: CourtService) {}

  // Ruta /Court -> obtener todas las pistas
  @Get()
  @ApiOperation({ summary: 'Get all courts' })
  @ApiResponse({ status: 200, description: 'List of all courts' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Court[]> {
    try {
      return this.CourtService.findAll();
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('availability')
  @ApiOperation({ summary: 'Get court availability by date' })
  @ApiResponse({
    status: 200,
    description: 'Availability calculated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'date',
    example: '2026-04-27',
    description: 'Date in YYYY-MM-DD format',
  })
  @UseGuards(AuthGuard)
  async getDisponibilidad(@Query('date') date: string) {
    return await this.CourtService.obtenerDisponibilidad(date);
  }

  // Ruta /Court/:id -> obtener una pista por ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a court by ID' })
  @ApiResponse({ status: 200, description: 'The court with the specified ID' })
  @ApiResponse({ status: 404, description: 'Court not found' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Error in some of the data.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Court> {
    try {
      return this.CourtService.findOne(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court (POST) -> crear una pista nueva
  @Post()
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, png, webp, gif)',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create a new court' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'installation_id',
        'court_type_id',
        'name',
        'image',
        'capacity',
        'price_per_hour',
        'is_covered',
        'has_lighting',
        'status',
        'opening_time',
        'closing_time',
        'day_of_week',
      ],
      properties: {
        installation_id: { type: 'number', example: 1 },
        court_type_id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Court Central Tenis' },
        image: { type: 'string', format: 'binary' },
        capacity: { type: 'number', example: 4 },
        price_per_hour: { type: 'number', example: 20.5 },
        is_covered: { type: 'boolean', example: true },
        has_lighting: { type: 'boolean', example: true },
        description: { type: 'string', example: 'Court de tenis indoor' },
        status: { type: 'string', example: 'DISPONIBLE' },
        opening_time: { type: 'string', example: '09:00' },
        closing_time: { type: 'string', example: '22:00' },
        day_of_week: { type: 'string', example: 'LUNES' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Court created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() courtDto: CreateCourtDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Court> {
    try {
      if (!file) {
        throw new BadRequestException('No image file has been uploaded');
      }
      return this.CourtService.create(courtDto, file.filename);
    } catch (err) {
      const { message, status } = normalizeError(err);
      console.error('Error creating court:', err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court/:id (PUT) -> actualizar una pista existente
  @Put(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, png, webp, gif)',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Update court - Supports selective maintenance dates',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        installation_id: { type: 'number', example: 1 },
        court_type_id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Court Central Tenis' },
        image: { type: 'string', format: 'binary' },
        capacity: { type: 'number', example: 4 },
        price_per_hour: { type: 'number', example: 20.5 },
        is_covered: { type: 'boolean', example: true },
        has_lighting: { type: 'boolean', example: true },
        description: { type: 'string', example: 'Court de tenis indoor' },
        status: { type: 'string', example: 'DISPONIBLE' },
        opening_time: { type: 'string', example: '09:00' },
        closing_time: { type: 'string', example: '22:00' },
        day_of_week: { type: 'string', example: 'LUNES' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Court updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() courtDto: UpdateCourtDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Court> {
    try {
      return this.CourtService.update(id, courtDto, file?.filename);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  // Ruta /Court/:id (DELETE) -> eliminar una pista
  @Delete(':id')
  @Roles(UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a court' })
  @ApiResponse({ status: 200, description: 'Court deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.CourtService.remove(id);
    } catch (err) {
      const { message, status } = normalizeError(err);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
