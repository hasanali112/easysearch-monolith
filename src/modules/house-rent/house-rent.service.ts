import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { HouseRent, Host, User } from '../../entities';

@Injectable()
export class HouseRentService {
  constructor(private readonly em: EntityManager) {}

  async getAllHouseRents(filters: any) {
    const fork = this.em.fork();
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const where: FilterQuery<HouseRent> = { isApproved: true, isAvailable: true };

    if (filters.city) {
      where.city = { $like: `%${filters.city}%` };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.$gte = filters.minPrice;
      if (filters.maxPrice) where.price.$lte = filters.maxPrice;
    }

    if (filters.bedrooms) {
      where.bedrooms = filters.bedrooms;
    }

    if (filters.categoryId) {
      where.category = filters.categoryId;
    }

    const [data, total] = await fork.findAndCount(HouseRent, where, {
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

  async getHouseRentById(id: string) {
    const fork = this.em.fork();
    const houseRent = await fork.findOne(HouseRent, { id }, { populate: ['owner', 'category'] });

    if (!houseRent) {
      throw new NotFoundException('House rental not found');
    }

    houseRent.views += 1;
    await fork.flush();

    return houseRent;
  }

  async createHouseRent(createData: any, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });

    if (!user || !user.host) {
      throw new ForbiddenException('Only hosts can create house rental listings');
    }

    const houseRent = fork.create(HouseRent, {
      ...createData,
      owner: user.host,
    });

    await fork.persistAndFlush(houseRent);
    return houseRent;
  }

  async updateHouseRent(id: string, updateData: any, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });
    const houseRent = await fork.findOne(HouseRent, { id }, { populate: ['owner'] });

    if (!houseRent) {
      throw new NotFoundException('House rental not found');
    }

    if (houseRent.owner.id !== user?.host?.id) {
      throw new ForbiddenException('You can only update your own listings');
    }

    fork.assign(houseRent, updateData);
    await fork.flush();
    return houseRent;
  }

  async deleteHouseRent(id: string, userId: string) {
    const fork = this.em.fork();
    const user = await fork.findOne(User, { id: userId }, { populate: ['host'] });
    const houseRent = await fork.findOne(HouseRent, { id }, { populate: ['owner'] });

    if (!houseRent) {
      throw new NotFoundException('House rental not found');
    }

    if (houseRent.owner.id !== user?.host?.id) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await fork.removeAndFlush(houseRent);
    return { message: 'House rental deleted successfully' };
  }

  async toggleApproval(id: string, isApproved: boolean) {
    const fork = this.em.fork();
    const houseRent = await fork.findOne(HouseRent, { id });

    if (!houseRent) {
      throw new NotFoundException('House rental not found');
    }

    houseRent.isApproved = isApproved;
    await fork.flush();
    return houseRent;
  }
}
