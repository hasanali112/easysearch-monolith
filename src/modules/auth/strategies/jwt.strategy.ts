import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../../entities';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly em: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.em.findOne(User, { id: payload.userId }, {
      populate: ['admin', 'host', 'customer', 'doctor'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'BLOCKED') {
      throw new UnauthorizedException('User is blocked');
    }

    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('User is inactive');
    }

    return user;
  }
}
