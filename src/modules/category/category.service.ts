import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Category } from '../../entities';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly em: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllCategories(search?: string, page: number = 1, limit: number = 10) {
    try {
      const fork = this.em.fork();
      const where: any = {};

      if (search) {
        where.categoryName = { $like: `%${search}%` };
      }

      const offset = (page - 1) * limit;

      const [categories, total] = await fork.findAndCount(Category, where, {
        orderBy: { categoryName: 'ASC' },
        limit,
        offset,
      });

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      // Handle case when table doesn't exist or other DB errors
      return {
        success: true,
        message: 'No categories found',
        data: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getCategoryById(id: string) {
    try {
      const fork = this.em.fork();
      const category = await fork.findOne(
        Category,
        { id },
        { populate: ['houseRents', 'hostelRents'] },
      );

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Category not found');
    }
  }

  async createCategory(createData: any, imageFile?: Express.Multer.File) {
    const fork = this.em.fork();

    const existing = await fork.findOne(Category, {
      categoryName: createData.categoryName,
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    let categoryImage: string | undefined;
    if (imageFile) {
      try {
        const result: any = await this.cloudinaryService.uploadImage(imageFile, 'categories');
        categoryImage = result.url;
      } catch (uploadError) {
        throw new ConflictException('Failed to upload image to Cloudinary');
      }
    }

    const category = fork.create(Category, {
      ...createData,
      categoryImage,
    });
    await fork.persistAndFlush(category);
    
    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    };
  }

  async updateCategory(id: string, updateData: any, imageFile?: Express.Multer.File) {
    const fork = this.em.fork();
    const category = await fork.findOne(Category, { id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateData.categoryName && updateData.categoryName !== category.categoryName) {
      const existing = await fork.findOne(Category, {
        categoryName: updateData.categoryName,
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // Handle image upload if provided
    if (imageFile) {
      try {
        // If there's an existing image, delete it from Cloudinary
        if (category.categoryImage) {
          const publicId = category.categoryImage.split('/').pop()?.split('.')[0];
          if (publicId) {
            await this.cloudinaryService.deleteImage(`categories/${publicId}`);
          }
        }

        const result: any = await this.cloudinaryService.uploadImage(imageFile, 'categories');
        updateData.categoryImage = result.url;
      } catch (uploadError) {
        throw new ConflictException('Failed to upload image to Cloudinary');
      }
    }

    fork.assign(category, updateData);
    await fork.flush();
    
    return {
      success: true,
      message: 'Category updated successfully',
      data: category,
    };
  }

  async deleteCategory(id: string) {
    const fork = this.em.fork();
    const category = await fork.findOne(Category, { id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await fork.removeAndFlush(category);
    
    return {
      success: true,
      message: 'Category deleted successfully',
      data: null,
    };
  }
}
