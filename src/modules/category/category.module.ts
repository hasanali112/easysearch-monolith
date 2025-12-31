import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';
import { Category } from '../../entities';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module.js';

@Module({
  imports: [
    MikroOrmModule.forFeature([Category]),
    CloudinaryModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
