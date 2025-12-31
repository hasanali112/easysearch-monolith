import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDate, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHouseRentDto {
  @ApiProperty({ description: 'Property title', example: '3 BHK Apartment in Downtown' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Property description', example: 'Spacious apartment with modern amenities' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Monthly rent price', example: 25000 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Number of bedrooms', example: 3 })
  @IsNumber()
  @Min(1)
  bedrooms!: number;

  @ApiProperty({ description: 'Number of bathrooms', example: 2 })
  @IsNumber()
  @Min(1)
  bathrooms!: number;

  @ApiPropertyOptional({ description: 'Square feet area', example: 1200 })
  @IsOptional()
  @IsNumber()
  squareFeet?: number;

  @ApiProperty({ description: 'Full address', example: '123 Main Street, Apt 4B' })
  @IsString()
  address!: string;

  @ApiProperty({ description: 'City name', example: 'New York' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ description: 'State name', example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Zip/Postal code', example: '10001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Property image URLs', example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Property amenities', example: ['Parking', 'WiFi', 'Swimming Pool'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Available from date', example: '2025-02-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  availableFrom?: Date;

  @ApiPropertyOptional({ description: 'Category ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateHouseRentDto {
  @ApiPropertyOptional({ description: 'Property title', example: '3 BHK Apartment in Downtown' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Property description', example: 'Spacious apartment with modern amenities' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Monthly rent price', example: 25000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Number of bedrooms', example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  bedrooms?: number;

  @ApiPropertyOptional({ description: 'Number of bathrooms', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  bathrooms?: number;

  @ApiPropertyOptional({ description: 'Square feet area', example: 1200 })
  @IsOptional()
  @IsNumber()
  squareFeet?: number;

  @ApiPropertyOptional({ description: 'Full address', example: '123 Main Street, Apt 4B' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City name', example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State name', example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Zip/Postal code', example: '10001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Property image URLs', example: ['https://example.com/img1.jpg'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Property amenities', example: ['Parking', 'WiFi'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ description: 'Availability status', example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Available from date', example: '2025-02-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  availableFrom?: Date;
}

export class ApproveHouseRentDto {
  @ApiProperty({ description: 'Approval status', example: true })
  @IsBoolean()
  isApproved!: boolean;
}
