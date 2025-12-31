import { Entity, Property, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Customer extends BaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ nullable: true, type: 'string' })
  profilePhoto?: string;

  @Property({ nullable: true, type: 'string' })
  address?: string;

  @Property({ nullable: true, type: 'string' })
  preferences?: string;

  @Property({ default: 0, type: 'number' })
  rating: number = 0;

  @Property({ default: 0, type: 'number' })
  bookingCount: number = 0;

  @OneToOne(() => User, (user) => user.customer, { owner: true })
  user!: User;
}
