import { Entity, Property, OneToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { HouseRent } from './house-rent.entity';
import { HostelRent } from './hostel-rent.entity';

@Entity()
export class Host extends BaseEntity {
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

  @Property({ default: false, type: 'boolean' })
  isVerified: boolean = false;

  @Property({ default: 0, type: 'number' })
  bookingCount: number = 0;

  @OneToOne(() => User, (user) => user.host, { owner: true })
  user!: User;

  @OneToMany(() => HouseRent, (houseRent) => houseRent.owner)
  houseRents = new Collection<HouseRent>(this);

  @OneToMany(() => HostelRent, (hostelRent) => hostelRent.owner)
  hostelRents = new Collection<HostelRent>(this);
}
