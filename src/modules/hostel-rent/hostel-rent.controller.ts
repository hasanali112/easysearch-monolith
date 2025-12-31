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
import { HostelRentService } from './hostel-rent.service';
import { CreateHostelRentDto, UpdateHostelRentDto, ApproveHostelRentDto } from './dto/hostel-rent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { UserRole } from '../../enums';

@ApiTags('Hostel Rentals')
@Controller('hostel-rents')
export class HostelRentController {
  constructor(private readonly hostelRentService: HostelRentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hostel rentals', description: 'Retrieve a paginated list of available hostel rentals' })
  @ApiResponse({ status: 200, description: 'Hostel rentals retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by city' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'roomType', required: false, type: String, description: 'Filter by room type' })
  @ApiQuery({ name: 'tenantType', required: false, type: String, description: 'Filter by tenant type' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  async getAllHostelRents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('roomType') roomType?: string,
    @Query('tenantType') tenantType?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.hostelRentService.getAllHostelRents({ page, limit, city, minPrice, maxPrice, roomType, tenantType, categoryId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hostel rental by ID', description: 'Retrieve a single hostel rental and increment views' })
  @ApiResponse({ status: 200, description: 'Hostel rental retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Hostel rental not found' })
  @ApiParam({ name: 'id', description: 'Hostel Rental ID' })
  async getHostelRentById(@Param('id') id: string) {
    return this.hostelRentService.getHostelRentById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create hostel rental', description: 'Create a new hostel rental listing (Host only)' })
  @ApiResponse({ status: 201, description: 'Hostel rental created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Host access required' })
  @ApiBody({ type: CreateHostelRentDto })
  async createHostelRent(@Body() createData: CreateHostelRentDto, @CurrentUser() user: User) {
    return this.hostelRentService.createHostelRent(createData, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update hostel rental', description: 'Update own hostel rental listing (Host only)' })
  @ApiResponse({ status: 200, description: 'Hostel rental updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Hostel rental not found' })
  @ApiParam({ name: 'id', description: 'Hostel Rental ID' })
  @ApiBody({ type: UpdateHostelRentDto })
  async updateHostelRent(@Param('id') id: string, @Body() updateData: UpdateHostelRentDto, @CurrentUser() user: User) {
    return this.hostelRentService.updateHostelRent(id, updateData, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete hostel rental', description: 'Delete own hostel rental listing (Host only)' })
  @ApiResponse({ status: 200, description: 'Hostel rental deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Hostel rental not found' })
  @ApiParam({ name: 'id', description: 'Hostel Rental ID' })
  async deleteHostelRent(@Param('id') id: string, @CurrentUser() user: User) {
    return this.hostelRentService.deleteHostelRent(id, user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approve hostel rental', description: 'Approve or reject a hostel rental listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'Hostel rental approval status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Hostel rental not found' })
  @ApiParam({ name: 'id', description: 'Hostel Rental ID' })
  @ApiBody({ type: ApproveHostelRentDto })
  async approveHostelRent(@Param('id') id: string, @Body() body: ApproveHostelRentDto) {
    return this.hostelRentService.toggleApproval(id, body.isApproved);
  }
}
