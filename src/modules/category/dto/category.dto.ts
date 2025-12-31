import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Apartments' })
  @IsString()
  categoryName!: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  categoryImage?: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Modern apartments for rent' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category name', example: 'Apartments' })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  categoryImage?: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Modern apartments for rent' })
  @IsOptional()
  @IsString()
  description?: string;
}
