import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { User } from '../../entities';
import { UserStatus } from '../../enums';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async getMe(userId: string): Promise<Partial<User>> {
    const fork = this.em.fork();
    const user = await fork.findOne(
      User,
      { id: userId },
      { populate: ['admin', 'host', 'customer', 'doctor'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, updateData: any): Promise<Partial<User>> {
    const fork = this.em.fork();
    const user = await fork.findOne(
      User,
      { id: userId },
      { populate: ['admin', 'host', 'customer', 'doctor'] },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update role-specific profile
    if (user.admin && updateData.admin) {
      fork.assign(user.admin, updateData.admin);
    }
    if (user.host && updateData.host) {
      fork.assign(user.host, updateData.host);
    }
    if (user.customer && updateData.customer) {
      fork.assign(user.customer, updateData.customer);
    }
    if (user.doctor && updateData.doctor) {
      fork.assign(user.doctor, updateData.doctor);
    }

    await fork.flush();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(filters?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: UserStatus;
    search?: string;
  }): Promise<{ data: Partial<User>[]; meta: any }> {
    const fork = this.em.fork();
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    const where: FilterQuery<User> = {};

    if (filters?.role) {
      where.role = filters.role as any;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.$or = [
        { email: { $like: `%${filters.search}%` } },
        { contactNumber: { $like: `%${filters.search}%` } },
      ];
    }

    const [users, total] = await fork.findAndCount(
      User,
      where,
      {
        populate: ['admin', 'host', 'customer', 'doctor'],
        limit,
        offset,
        orderBy: { createdAt: 'DESC' },
      },
    );

    return {
      data: users.map(({ password, ...user }) => user),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: string, status: UserStatus, adminId: string) {
    const fork = this.em.fork();
    
    const admin = await fork.findOne(User, { id: adminId });
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      throw new ForbiddenException('Only admins can update user status');
    }

    const user = await fork.findOne(User, { id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    await fork.flush();

    return { message: 'User status updated successfully' };
  }
}
