import { Entity, Property, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Admin extends BaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ nullable: true, type: 'string' })
  profilePhoto?: string;

  @Property({ nullable: true, type: 'string' })
  contactDetails?: string;

  @OneToOne(() => User, (user) => user.admin, { owner: true })
  user!: User;
}
