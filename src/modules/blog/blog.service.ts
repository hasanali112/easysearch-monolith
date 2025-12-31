import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Blog } from '../../entities';

@Injectable()
export class BlogService {
  constructor(private readonly em: EntityManager) {}

  async getAllBlogs(filters: { page?: number; limit?: number; search?: string; tag?: string }) {
    const fork = this.em.fork();
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: FilterQuery<Blog> = { isPublished: true };

    if (filters.search) {
      where.$or = [
        { title: { $like: `%${filters.search}%` } },
        { author: { $like: `%${filters.search}%` } },
      ];
    }

    if (filters.tag) {
      where.tags = { $contains: [filters.tag] };
    }

    const [data, total] = await fork.findAndCount(Blog, where, {
      limit,
      offset,
      orderBy: { publishedAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogById(id: string) {
    const fork = this.em.fork();
    const blog = await fork.findOne(Blog, { id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Increment views
    blog.views += 1;
    await fork.persistAndFlush(blog);

    return blog;
  }

  async createBlog(createData: any) {
    const fork = this.em.fork();
    const blog = fork.create(Blog, createData);
    await fork.persistAndFlush(blog);
    return blog;
  }

  async updateBlog(id: string, updateData: Partial<Blog>) {
    const fork = this.em.fork();
    const blog = await fork.findOne(Blog, { id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    fork.assign(blog, updateData);
    await fork.flush();
    return blog;
  }

  async deleteBlog(id: string) {
    const fork = this.em.fork();
    const blog = await fork.findOne(Blog, { id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await fork.removeAndFlush(blog);
    return { message: 'Blog deleted successfully' };
  }

  async togglePublish(id: string, isPublished: boolean) {
    const fork = this.em.fork();
    const blog = await fork.findOne(Blog, { id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    blog.isPublished = isPublished;
    if (isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await fork.flush();
    return blog;
  }
}
