import { Entity, Property, Enum, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserRole, UserStatus } from '../enums';
import { Admin } from './admin.entity';
import { Host } from './host.entity';
import { Customer } from './customer.entity';
import { Doctor } from './doctor.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true, type: 'string' })
  email!: string;

  @Property({ unique: true, type: 'string' })
  contactNumber!: string;

  @Property({ hidden: true, type: 'string' })
  password!: string;

  @Enum(() => UserRole)
  role!: UserRole;

  @Property({ default: false, type: 'boolean' })
  needPasswordChange: boolean = false;

  @Enum(() => UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true, orphanRemoval: true })
  admin?: Admin;

  @OneToOne(() => Host, (host) => host.user, { nullable: true, orphanRemoval: true })
  host?: Host;

  @OneToOne(() => Customer, (customer) => customer.user, { nullable: true, orphanRemoval: true })
  customer?: Customer;

  @OneToOne(() => Doctor, (doctor) => doctor.user, { nullable: true, orphanRemoval: true })
  doctor?: Doctor;
}
