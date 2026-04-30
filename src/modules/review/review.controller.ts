import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@ApiTags('resenyas')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('resenya')
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
  @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() ReviewDto: CreateReviewDto): Promise<Review | null> {
    return this.ReviewService.create(ReviewDto);
  }

  @Put(':id')
  @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async update(
    @Param('id') id: number,
    @Body() ReviewDto: UpdateReviewDto,
  ): Promise<Review | null> {
    return this.ReviewService.update(id, ReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENTE, UserRole.ADMINISTRACION, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid review ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async remove(@Param('id') id: number): Promise<void | { deleted: boolean }> {
    return this.ReviewService.remove(id);
  }
}


