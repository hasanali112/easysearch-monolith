import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog title', example: 'Top 10 Tips for Finding a Great Apartment' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Blog content', example: 'Looking for the perfect apartment can be...' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ description: 'Featured image URL', example: 'https://example.com/blog-image.jpg' })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Author name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Blog tags', example: ['rental', 'apartment', 'tips'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateBlogDto {
  @ApiPropertyOptional({ description: 'Blog title', example: 'Top 10 Tips for Finding a Great Apartment' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Blog content', example: 'Looking for the perfect apartment can be...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Featured image URL', example: 'https://example.com/blog-image.jpg' })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Author name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Blog tags', example: ['rental', 'apartment', 'tips'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class PublishBlogDto {
  @ApiProperty({ description: 'Publish status', example: true })
  @IsBoolean()
  isPublished!: boolean;
}
