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
import { BlogService } from './blog.service.js';
import { CreateBlogDto, UpdateBlogDto, PublishBlogDto } from './dto/blog.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { UserRole } from '../../enums';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blogs', description: 'Retrieve a paginated list of published blogs' })
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title or author' })
  @ApiQuery({ name: 'tag', required: false, type: String, description: 'Filter by tag' })
  async getAllBlogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    return this.blogService.getAllBlogs({ page, limit, search, tag });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by ID', description: 'Retrieve a single blog by ID and increment views' })
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create blog', description: 'Create a new blog post (Admin only)' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiBody({ type: CreateBlogDto })
  async createBlog(@Body() createData: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogService.createBlog(createData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog', description: 'Update an existing blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiBody({ type: UpdateBlogDto })
  async updateBlog(@Param('id') id: string, @Body() updateData: UpdateBlogDto) {
    return this.blogService.updateBlog(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog', description: 'Delete a blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Publish blog', description: 'Publish or unpublish a blog post (Admin only)' })
  @ApiResponse({ status: 200, description: 'Blog publish status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiBody({ type: PublishBlogDto })
  async togglePublish(@Param('id') id: string, @Body() body: PublishBlogDto) {
    return this.blogService.togglePublish(id, body.isPublished);
  }
}
