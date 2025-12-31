import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Host } from './host.entity';
import { Category } from './category.entity';

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

@Entity()
export class HostelRent extends BaseEntity {
  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Enum(() => RoomType)
  roomType!: RoomType;

  @Property({ default: false, type: 'boolean' })
  mealIncluded: boolean = false;

  @Property({ nullable: true, type: 'string' })
  mealDescription?: string;

  @Enum(() => TenantType)
  tenantType: TenantType = TenantType.ANY;

  @Property({ type: 'string' })
  address!: string;

  @Property({ type: 'string' })
  city!: string;

  @Property({ nullable: true, type: 'string' })
  state?: string;

  @Property({ nullable: true, type: 'string' })
  zipCode?: string;

  @Property({ type: 'json', nullable: true })
  images?: string[];

  @Property({ type: 'json', nullable: true })
  facilities?: string[];

  @Property({ default: true, type: 'boolean' })
  isAvailable: boolean = true;

  @Property({ nullable: true, type: 'date' })
  availableFrom?: Date;

  @Property({ default: 0, type: 'number' })
  views: number = 0;

  @Property({ default: false, type: 'boolean' })
  isApproved: boolean = false;

  @ManyToOne(() => Host)
  owner!: Host;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;
}
