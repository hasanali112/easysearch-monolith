import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { HostelRent, Host, User } from '../../entities';

@Injectable()
export class HostelRentService {
  constructor(private readonly em: EntityManager) {}

  async getAllHostelRents(filters: any) {
    const fork = this.em.fork();
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: FilterQuery<HostelRent> = { isApproved: true, isAvailable: true };

    if (filters.city) {
      where.city = { $like: `%${filters.city}%` };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.$gte = filters.minPrice;
      if (filters.maxPrice) where.price.$lte = filters.maxPrice;
    }

    if (filters.roomType) {
      where.roomType = filters.roomType;
    }

    if (filters.tenantType) {
      where.tenantType = filters.tenantType;
    }

    if (filters.categoryId) {
      where.category = filters.categoryId;
    }

    const [data, total] = await fork.findAndCount(HostelRent, where, {
      limit,
      offset,
      populate: ['owner', 'category'],
      orderBy: { createdAt: 'DESC' },
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

  async getHostelRentById(id: string) {
    const fork = this.em.fork();
    const hostelRent = await fork.findOne(HostelRent, { id }, { populate: ['owner', 'category'] });

    if (!hostelRent) {
      throw new NotFoundException('Hostel rental not found');
    }

    hostelRent.views += 1;
    await fork.flush();

    return hostelRent;
  }

  async createHostelRent(createData: any, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });

    if (!user || !user.host) {
      throw new ForbiddenException('Only hosts can create hostel rental listings');
    }

    const hostelRent = fork.create(HostelRent, {
      ...createData,
      owner: user.host,
    });

    await fork.persistAndFlush(hostelRent);
    return hostelRent;
  }

  async updateHostelRent(id: string, updateData: any, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });
    const hostelRent = await fork.findOne(HostelRent, { id }, { populate: ['owner'] });

    if (!hostelRent) {
      throw new NotFoundException('Hostel rental not found');
    }

    if (hostelRent.owner.id !== user?.host?.id) {
      throw new ForbiddenException('You can only update your own listings');
    }

    fork.assign(hostelRent, updateData);
    await fork.flush();
    return hostelRent;
  }

  async deleteHostelRent(id: string, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });
    const hostelRent = await fork.findOne(HostelRent, { id }, { populate: ['owner'] });

    if (!hostelRent) {
      throw new NotFoundException('Hostel rental not found');
    }

    if (hostelRent.owner.id !== user?.host?.id) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await fork.removeAndFlush(hostelRent);
    return { message: 'Hostel rental deleted successfully' };
  }

  async toggleApproval(id: string, isApproved: boolean) {
    const fork = this.em.fork();
    const hostelRent = await fork.findOne(HostelRent, { id });

    if (!hostelRent) {
      throw new NotFoundException('Hostel rental not found');
    }

    hostelRent.isApproved = isApproved;
    await fork.flush();
    return hostelRent;
  }
}
