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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import type { AuthenticatedRequest } from '../auth/types/auth.types';
import { normalizeError } from 'src/common/utils/error.util';

@ApiTags('reviews')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('reviews')
export class ReviewController {
  constructor(private readonly ReviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.' })
  @ApiResponse({ status: 204, description: 'No content.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(): Promise<Review[]> {
    return this.ReviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid review ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async findOne(@Param('id') id: number): Promise<Review | null> {
    return this.ReviewService.findOne(id);
  }

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'User already has a review for this court.' })
  async create(@Body() reviewDto: CreateReviewDto, @Req() req: AuthenticatedRequest): Promise<Review | null> {
    try {
      const userId = req.user?.sub;
      if (!userId)
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return this.ReviewService.create(reviewDto, Number(userId));
    } catch (error) {
      const { message, status } = normalizeError(error);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  

  @Put(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async update(
    @Param('id') id: number,
    @Body() reviewDto: UpdateReviewDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Review | null> {
    try {
      const userId = req.user?.sub;
      if (!userId)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return this.ReviewService.update(id, reviewDto, Number(userId));
    } catch (error) {
      const { message, status } = normalizeError(error);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMINISTRATION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid review ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async remove(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void | { deleted: boolean }> {
    try {
      const userId = req.user?.sub;
      if (!userId)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return this.ReviewService.remove(id, Number(userId));
    } catch (error) {
      const { message, status } = normalizeError(error);
      throw new HttpException(message, status || HttpStatus.BAD_REQUEST);
    }
  }
}
