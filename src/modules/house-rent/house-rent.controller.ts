import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { HouseRentService } from './house-rent.service';
import { CreateHouseRentDto, UpdateHouseRentDto, ApproveHouseRentDto } from './dto/house-rent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { UserRole } from '../../enums';

@ApiTags('House Rentals')
@Controller('house-rents')
export class HouseRentController {
  constructor(private readonly houseRentService: HouseRentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all house rentals', description: 'Retrieve a paginated list of available house rentals' })
  @ApiResponse({ status: 200, description: 'House rentals retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by city' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number, description: 'Number of bedrooms' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  async getAllHouseRents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('bedrooms') bedrooms?: number,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.houseRentService.getAllHouseRents({ page, limit, city, minPrice, maxPrice, bedrooms, categoryId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get house rental by ID', description: 'Retrieve a single house rental and increment views' })
  @ApiResponse({ status: 200, description: 'House rental retrieved successfully' })
  @ApiResponse({ status: 404, description: 'House rental not found' })
  @ApiParam({ name: 'id', description: 'House Rental ID' })
  async getHouseRentById(@Param('id') id: string) {
    return this.houseRentService.getHouseRentById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create house rental', description: 'Create a new house rental listing (Host only)' })
  @ApiResponse({ status: 201, description: 'House rental created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Host access required' })
  @ApiBody({ type: CreateHouseRentDto })
  async createHouseRent(@Body() createData: CreateHouseRentDto, @CurrentUser() user: User) {
    return this.houseRentService.createHouseRent(createData, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update house rental', description: 'Update own house rental listing (Host only)' })
  @ApiResponse({ status: 200, description: 'House rental updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'House rental not found' })
  @ApiParam({ name: 'id', description: 'House Rental ID' })
  @ApiBody({ type: UpdateHouseRentDto })
  async updateHouseRent(@Param('id') id: string, @Body() updateData: UpdateHouseRentDto, @CurrentUser() user: User) {
    return this.houseRentService.updateHouseRent(id, updateData, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete house rental', description: 'Delete own house rental listing (Host only)' })
  @ApiResponse({ status: 200, description: 'House rental deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'House rental not found' })
  @ApiParam({ name: 'id', description: 'House Rental ID' })
  async deleteHouseRent(@Param('id') id: string, @CurrentUser() user: User) {
    return this.houseRentService.deleteHouseRent(id, user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approve house rental', description: 'Approve or reject a house rental listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'House rental approval status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'House rental not found' })
  @ApiParam({ name: 'id', description: 'House Rental ID' })
  @ApiBody({ type: ApproveHouseRentDto })
  async approveHouseRent(@Param('id') id: string, @Body() body: ApproveHouseRentDto) {
    return this.houseRentService.toggleApproval(id, body.isApproved);
  }
}
