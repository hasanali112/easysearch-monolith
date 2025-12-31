import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum, IsDate, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  SHARED = 'SHARED',
}

export enum TenantType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ANY = 'ANY',
}

export class CreateHostelRentDto {
  @ApiProperty({ description: 'Hostel title', example: 'Comfortable PG near Metro Station' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Hostel description', example: 'Clean and safe hostel with all facilities' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Monthly rent price', example: 8000 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Room type', enum: RoomType, example: RoomType.DOUBLE })
  @IsEnum(RoomType)
  roomType!: RoomType;

  @ApiPropertyOptional({ description: 'Meals included', example: true })
  @IsOptional()
  @IsBoolean()
  mealIncluded?: boolean;

  @ApiPropertyOptional({ description: 'Meal details', example: 'Breakfast and Dinner included' })
  @IsOptional()
  @IsString()
  mealDescription?: string;

  @ApiProperty({ description: 'Allowed tenant type', enum: TenantType, example: TenantType.MALE })
  @IsEnum(TenantType)
  tenantType!: TenantType;

  @ApiProperty({ description: 'Full address', example: '456 College Road' })
  @IsString()
  address!: string;

  @ApiProperty({ description: 'City name', example: 'Mumbai' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ description: 'State name', example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Zip/Postal code', example: '400001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Hostel image URLs', example: ['https://example.com/img1.jpg'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Hostel facilities', example: ['WiFi', 'Laundry', 'AC'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

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

export class UpdateHostelRentDto {
  @ApiPropertyOptional({ description: 'Hostel title', example: 'Comfortable PG near Metro Station' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Hostel description', example: 'Clean and safe hostel with all facilities' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Monthly rent price', example: 8000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Room type', enum: RoomType, example: RoomType.DOUBLE })
  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @ApiPropertyOptional({ description: 'Meals included', example: true })
  @IsOptional()
  @IsBoolean()
  mealIncluded?: boolean;

  @ApiPropertyOptional({ description: 'Meal details', example: 'Breakfast and Dinner included' })
  @IsOptional()
  @IsString()
  mealDescription?: string;

  @ApiPropertyOptional({ description: 'Allowed tenant type', enum: TenantType, example: TenantType.MALE })
  @IsOptional()
  @IsEnum(TenantType)
  tenantType?: TenantType;

  @ApiPropertyOptional({ description: 'Full address', example: '456 College Road' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City name', example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State name', example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Zip/Postal code', example: '400001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Hostel image URLs', example: ['https://example.com/img1.jpg'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Hostel facilities', example: ['WiFi', 'Laundry'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

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

export class ApproveHostelRentDto {
  @ApiProperty({ description: 'Approval status', example: true })
  @IsBoolean()
  isApproved!: boolean;
}
