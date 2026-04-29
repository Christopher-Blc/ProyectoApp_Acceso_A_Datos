import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TipoPistaService } from './tipo_pista.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TipoPista } from './entities/tipo_pista.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { TipoPistaDto, UpdateTipoPistaDto } from './dto/tipo_pista.dto';

@ApiTags('tipo_pista')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('tipo_pista')
export class TipoPistaController {
  constructor(private readonly tipoPistaService: TipoPistaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all court types' })
  @ApiResponse({
    status: 200,
    description: 'Court types retrieved successfully.',
  })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<TipoPista[]> {
    try {
      return this.tipoPistaService.findAll();
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
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
  async findOne(@Param('id') id: number): Promise<TipoPista | null> {
    try {
      return this.tipoPistaService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Create a new court type with image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nombre', 'imagen'],
      properties: {
        nombre: { type: 'string', example: 'Tenis' },
        imagen: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Court type created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid file.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() tipoPistaDto: TipoPistaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TipoPista | null> {
    try {
      if (!file) {
        throw new BadRequestException('No se ha subido ningún archivo de imagen');
      }
      return this.tipoPistaService.create(tipoPistaDto, file.filename);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Update an existing court type (imagen optional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Tenis' },
        imagen: { type: 'string', format: 'binary', description: 'Imagen opcional' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Court type updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async update(
    @Param('id') id: number,
    @Body() tipoPistaDto: UpdateTipoPistaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TipoPista | null> {
    try {
      return this.tipoPistaService.update(id, tipoPistaDto, file?.filename);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete court type by ID' })
  @ApiResponse({ status: 200, description: 'Court type deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid court type ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Court type not found.' })
  @ApiParam({ name: 'id', example: 1 })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    try {
      return this.tipoPistaService.remove(id);
    } catch (err) {
      throw new HttpException(
        err.message,
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
