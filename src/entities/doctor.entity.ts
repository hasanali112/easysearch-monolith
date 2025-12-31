import { Entity, Property, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Doctor extends BaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ nullable: true, type: 'string' })
  profilePhoto?: string;

  @Property({ unique: true, type: 'string' })
  registrationNumber!: string;

  @Property({ type: 'string' })
  qualification!: string;

  @Property({ nullable: true, type: 'string' })
  specialization?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  appointmentFee!: number;

  @Property({ default: 0, type: 'number' })
  experience: number = 0;

  @Property({ default: 0, type: 'number' })
  averageRating: number = 0;

  @Property({ nullable: true, type: 'string' })
  clinicAddress?: string;

  @OneToOne(() => User, (user) => user.doctor, { owner: true })
  user!: User;
}
