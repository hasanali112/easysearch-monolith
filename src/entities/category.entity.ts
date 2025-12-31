import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { HouseRent } from './house-rent.entity';
import { HostelRent } from './hostel-rent.entity';

@Entity()
export class Category extends BaseEntity {
  @Property({ unique: true, type: 'string' })
  categoryName!: string;

  @Property({ nullable: true, type: 'string' })
  categoryImage?: string;

  @Property({ nullable: true, type: 'string' })
  description?: string;

  @OneToMany(() => HouseRent, (houseRent) => houseRent.category)
  houseRents = new Collection<HouseRent>(this);

  @OneToMany(() => HostelRent, (hostelRent) => hostelRent.category)
  hostelRents = new Collection<HostelRent>(this);
}
